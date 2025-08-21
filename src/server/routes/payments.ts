import { Hono } from "hono";
import {
  OrderStatus,
  PaymentStatus,
  PrismaClient,
  RefundStatus,
} from "../../../generated/prisma/index.js";
import { requireAuth, type AuthenticatedUser } from "../middleware/auth.js";
import {
  createPaymentIntent,
  createCustomer,
  retrievePaymentIntent,
  confirmPaymentIntent,
  refundPayment,
} from "../lib/stripe.js";

type PaymentsContext = {
  Variables: {
    user: AuthenticatedUser;
  };
};

const paymentsRouter = new Hono<PaymentsContext>();
const prisma = new PrismaClient();

// Create a payment intent for an order
paymentsRouter.post("/create-intent", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const { orderId, amount, currency = "ngn" } = await c.req.json();

    if (!orderId || !amount) {
      return c.json(
        {
          error: "Order ID and amount are required",
        },
        400
      );
    }

    // Verify the order exists and belongs to the user
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: user.id,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return c.json(
        {
          error: "Order not found",
        },
        404
      );
    }

    if (order.status !== "PENDING") {
      return c.json(
        {
          error: "Order is not in pending status",
        },
        400
      );
    }

    // Convert amount to kobo (smallest currency unit)
    const amountInKobo = Math.round(amount * 100);

    console.log("Payment intent amount details:", {
      originalAmount: amount,
      amountInKobo,
      currency,
      orderId,
    });

    // Validate minimum amount (Stripe requires at least 50 kobo for NGN)
    if (currency === "ngn" && amountInKobo < 50) {
      return c.json(
        {
          error: `Amount too small. Minimum amount for NGN is ₦0.50. Received: ₦${amount} (${amountInKobo} kobo)`,
        },
        400
      );
    }

    // Additional validation: ensure amount is reasonable for NGN
    // Stripe has a minimum of 50 kobo, but let's set a higher practical minimum
    if (currency === "ngn" && amountInKobo < 100) {
      return c.json(
        {
          error: `Amount too small for practical payment processing. Minimum recommended amount for NGN is ₦1.00. Received: ₦${amount} (${amountInKobo} kobo)`,
        },
        400
      );
    }

    // Create or get Stripe customer
    let customerId: string | null = null;

    // Try to get existing customer ID from user preferences
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { preferences: true },
    });

    if (
      existingUser?.preferences &&
      typeof existingUser.preferences === "object"
    ) {
      customerId = (existingUser.preferences as any).stripeCustomerId || null;
    }

    if (!customerId) {
      const customerResult = await createCustomer({
        email: user.email,
        metadata: {
          userId: user.id,
        },
      });
      if (customerResult.success) {
        customerId = customerResult.customerId ?? null;

        // Store customer ID in user preferences
        await prisma.user.update({
          where: { id: user.id },
          data: {
            preferences: {
              ...((existingUser?.preferences as any) || {}),
              stripeCustomerId: customerId,
            },
          },
        });
      } else {
        return c.json(
          {
            error: "Failed to create customer",
          },
          500
        );
      }
    }

    // Create payment intent
    const paymentIntentResult = await createPaymentIntent({
      amount: amountInKobo,
      currency,
      metadata: {
        orderId,
        userId: user.id,
        orderTotal: amount.toString(),
      },
      description: `Payment for order ${orderId}`,
      ...(customerId && { customerId }),
    });

    if (!paymentIntentResult.success) {
      return c.json(
        {
          error: "Failed to create payment intent",
        },
        500
      );
    }

    // Create payment record in database
    const payment = await prisma.payment.create({
      data: {
        orderId,
        amount: amountInKobo,
        currency,
        status: "PENDING",
        method: "CREDIT_CARD",
        gateway: "STRIPE",
        metadata: JSON.stringify({
          clientSecret: paymentIntentResult.clientSecret || "",
          stripePaymentIntentId: paymentIntentResult.paymentIntentId,
        }),
      },
    });

    return c.json({
      success: true,
      clientSecret: paymentIntentResult.clientSecret,
      paymentIntentId: paymentIntentResult.paymentIntentId,
      paymentId: payment.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return c.json(
      {
        error: "Internal server error",
      },
      500
    );
  }
});

// Update payment and order status after Stripe payment processing
// This endpoint receives the final status from Stripe and updates our database
paymentsRouter.post("/confirm", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const { paymentIntentId, stripeStatus } = await c.req.json();

    if (!paymentIntentId) {
      return c.json(
        {
          error: "Payment intent ID is required",
        },
        400
      );
    }

    if (!stripeStatus) {
      return c.json(
        {
          error: "Stripe status is required",
        },
        400
      );
    }

    // Find the payment record
    const payments = await prisma.payment.findMany({
      where: {
        order: {
          userId: user.id,
        },
      },
      include: {
        order: true,
      },
    });

    // Find payment with matching stripePaymentIntentId
    const payment = payments.find((p) => {
      if (!p.metadata) return false;
      try {
        const metadata = JSON.parse(p.metadata as string);
        return metadata.stripePaymentIntentId === paymentIntentId;
      } catch {
        return false;
      }
    });

    if (!payment) {
      return c.json(
        {
          error: "Payment not found",
        },
        404
      );
    }

    // Get the Stripe status from the request body
    // The payment has already been processed by Stripe on the frontend,
    // so we just need to update our database with the final status
    // No need to call Stripe again - we trust the status from the frontend

    // Update payment status based on Stripe status from request body
    // Map Stripe statuses to our internal statuses
    let paymentStatus = "PENDING";
    let orderStatus = "PENDING";

    switch (stripeStatus) {
      case "succeeded":
        paymentStatus = "COMPLETED";
        orderStatus = "CONFIRMED";
        break;
      case "processing":
        paymentStatus = "PROCESSING";
        orderStatus = "PROCESSING";
        break;
      case "requires_payment_method":
        paymentStatus = "FAILED";
        orderStatus = "PENDING";
        break;
      case "canceled":
        paymentStatus = "CANCELLED";
        orderStatus = "CANCELLED";
        break;
      default:
        paymentStatus = "PENDING";
        orderStatus = "PENDING";
    }

    // Update payment record with the final status from Stripe
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: paymentStatus as PaymentStatus,
        metadata: {
          ...(payment.metadata ? JSON.parse(payment.metadata as string) : {}),
          stripeStatus,
          confirmedAt: new Date().toISOString(),
        },
      },
    });

    // Update order status based on the final payment status
    await prisma.order.update({
      where: { id: payment.orderId },
      data: {
        status: orderStatus as OrderStatus,
        updatedAt: new Date().toISOString(),
      },
    });

    // Return the updated statuses to confirm the database update was successful
    return c.json({
      success: true,
      status: paymentStatus,
      orderStatus,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    return c.json(
      {
        error: "Internal server error",
      },
      500
    );
  }
});

// Get payment status
paymentsRouter.get("/:paymentId", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const paymentId = c.req.param("paymentId");

    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        order: {
          userId: user.id,
        },
      },
      include: {
        order: {
          include: {
            orderItems: {
              include: {
                product: {
                  include: {
                    images: {
                      orderBy: { sortOrder: "asc" },
                      take: 1,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!payment) {
      return c.json(
        {
          error: "Payment not found",
        },
        404
      );
    }

    // Get latest status from Stripe if available
    let stripeStatus = null;
    if (payment.metadata) {
      const metadata = JSON.parse(payment.metadata as string);
      const stripePaymentIntentId = metadata.stripePaymentIntentId;
      if (stripePaymentIntentId) {
        const stripeResult = await retrievePaymentIntent(stripePaymentIntentId);
        if (stripeResult.success) {
          stripeStatus = stripeResult.paymentIntent?.status;
        }
      }
    }

    return c.json({
      payment: {
        ...payment,
        stripeStatus,
      },
    });
  } catch (error) {
    console.error("Error fetching payment:", error);
    return c.json(
      {
        error: "Internal server error",
      },
      500
    );
  }
});

// Process refund
paymentsRouter.post("/:paymentId/refund", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const paymentId = c.req.param("paymentId");
    const { amount, reason } = await c.req.json();

    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        order: {
          userId: user.id,
        },
        status: "COMPLETED",
      },
    });

    if (!payment) {
      return c.json(
        {
          error: "Payment not found or not completed",
        },
        404
      );
    }

    if (!payment.metadata) {
      return c.json(
        {
          error: "Payment not processed through Stripe",
        },
        400
      );
    }

    // Process refund through Stripe
    const metadata = JSON.parse(payment.metadata as string);
    const stripePaymentIntentId = metadata.stripePaymentIntentId;

    if (!stripePaymentIntentId) {
      return c.json(
        {
          error: "Payment not processed through Stripe",
        },
        400
      );
    }

    const refundResult = await refundPayment(
      stripePaymentIntentId,
      amount ? Math.round(amount * 100) : undefined
    );

    if (!refundResult.success) {
      return c.json(
        {
          error: "Failed to process refund",
        },
        500
      );
    }

    // Create refund record
    const refund = await prisma.refund.create({
      data: {
        paymentId,
        amount: amount ? Math.round(amount * 100) : payment.amount,
        currency: payment.currency,
        reason: reason || "Customer request",
        status: "COMPLETED",
        stripeRefundId: refundResult.refund?.id || null,
        metadata: {
          stripeStatus: refundResult.refund?.status,
        },
      },
    });

    // Update payment status if full refund
    if (!amount || amount >= Number(payment.amount) / 100) {
      await prisma.payment.update({
        where: { id: paymentId },
        data: { status: "REFUNDED" },
      });

      await prisma.order.update({
        where: { id: payment.orderId },
        data: { status: "REFUNDED" },
      });
    }

    return c.json({
      success: true,
      refund,
    });
  } catch (error) {
    console.error("Error processing refund:", error);
    return c.json(
      {
        error: "Internal server error",
      },
      500
    );
  }
});

export default paymentsRouter;
