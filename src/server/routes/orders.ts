import { Hono } from "hono";
import { PrismaClient } from "../../../generated/prisma/index.js";
import { requireAuth, type AuthenticatedUser } from "../middleware/auth.js";

type OrdersContext = {
  Variables: {
    user: AuthenticatedUser;
  };
};

const ordersRouter = new Hono<OrdersContext>();
const prisma = new PrismaClient();

// Get user's orders with pagination
ordersRouter.get("/", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const { page = "1", limit = "10", status } = c.req.query();

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const whereClause: any = { userId: user.id };
    if (status && status !== "all") {
      whereClause.status = status.toUpperCase();
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: whereClause,
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
          shippingAddress: true,
          billingAddress: true,
          payments: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.order.count({
        where: whereClause,
      }),
    ]);

    return c.json({
      orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get a specific order
ordersRouter.get("/:orderId", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const orderId = c.req.param("orderId");

    if (!orderId) {
      return c.json({ error: "Order ID is required" }, 400);
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: user.id,
      },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: { sortOrder: "asc" },
                },
              },
            },
          },
        },
        shippingAddress: true,
        billingAddress: true,
        payments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!order) {
      return c.json({ error: "Order not found" }, 404);
    }

    return c.json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get order statistics
ordersRouter.get("/stats", requireAuth, async (c) => {
  try {
    const user = c.get("user");

    const [
      totalOrders,
      pendingOrders,
      confirmedOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalSpent,
    ] = await Promise.all([
      prisma.order.count({
        where: { userId: user.id },
      }),
      prisma.order.count({
        where: {
          userId: user.id,
          status: "PENDING",
        },
      }),
      prisma.order.count({
        where: {
          userId: user.id,
          status: "CONFIRMED",
        },
      }),
      prisma.order.count({
        where: {
          userId: user.id,
          status: "PROCESSING",
        },
      }),
      prisma.order.count({
        where: {
          userId: user.id,
          status: "SHIPPED",
        },
      }),
      prisma.order.count({
        where: {
          userId: user.id,
          status: "DELIVERED",
        },
      }),
      prisma.order.count({
        where: {
          userId: user.id,
          status: "CANCELLED",
        },
      }),
      prisma.order.aggregate({
        where: {
          userId: user.id,
          status: {
            in: [
              "DELIVERED",
              "CONFIRMED",
              "PROCESSING",
              "SHIPPED",
              "DELIVERED",
              "CANCELLED",
              "REFUNDED",
            ],
          },
        },
        _sum: { total: true },
      }),
    ]);

    return c.json({
      totalOrders,
      pendingOrders,
      confirmedOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalSpent: totalSpent._sum.total || 0,
    });
  } catch (error) {
    console.error("Error fetching order stats:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Cancel an order
ordersRouter.post("/:orderId/cancel", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const orderId = c.req.param("orderId");
    const body = await c.req.json();

    const { reason } = body;

    if (!orderId) {
      return c.json({ error: "Order ID is required" }, 400);
    }

    // Check if order exists and belongs to user
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: user.id,
      },
    });

    if (!order) {
      return c.json({ error: "Order not found" }, 404);
    }

    // Check if order can be cancelled
    if (!["PENDING", "CONFIRMED"].includes(order.status)) {
      return c.json(
        {
          error: "Order cannot be cancelled at this stage",
          currentStatus: order.status,
        },
        400
      );
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "CANCELLED",
        notes: reason ? `Cancelled: ${reason}` : "Cancelled by user",
        updatedAt: new Date(),
      },
    });

    return c.json({
      message: "Order cancelled successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Request order refund
ordersRouter.post("/:orderId/refund", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const orderId = c.req.param("orderId");
    const body = await c.req.json();

    const { reason, items } = body;

    if (!orderId) {
      return c.json({ error: "Order ID is required" }, 400);
    }

    if (!reason) {
      return c.json({ error: "Refund reason is required" }, 400);
    }

    // Check if order exists and belongs to user
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: user.id,
      },
    });

    if (!order) {
      return c.json({ error: "Order not found" }, 404);
    }

    // Check if order is eligible for refund
    if (order.status !== "DELIVERED") {
      return c.json(
        {
          error: "Order must be delivered to request a refund",
          currentStatus: order.status,
        },
        400
      );
    }

    // Check if refund was requested within time limit (e.g., 30 days)
    const deliveryDate = new Date(order.updatedAt);
    const now = new Date();
    const daysSinceDelivery = Math.floor(
      (now.getTime() - deliveryDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceDelivery > 30) {
      return c.json(
        {
          error: "Refund request must be made within 30 days of delivery",
          daysSinceDelivery,
        },
        400
      );
    }

    // Create refund request (you might want to create a separate refund table)
    // For now, we'll just update the order notes
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        notes: `Refund requested: ${reason}`,
        updatedAt: new Date(),
      },
    });

    return c.json({
      message: "Refund request submitted successfully",
      order: updatedOrder,
      refundRequest: {
        orderId,
        reason,
        items,
        requestedAt: new Date(),
        status: "PENDING",
      },
    });
  } catch (error) {
    console.error("Error requesting refund:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Track order
ordersRouter.get("/:orderId/tracking", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const orderId = c.req.param("orderId");

    if (!orderId) {
      return c.json({ error: "Order ID is required" }, 400);
    }

    // Check if order exists and belongs to user
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: user.id,
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        shippingAddress: true,
      },
    });

    if (!order) {
      return c.json({ error: "Order not found" }, 404);
    }

    // Generate tracking information based on order status
    const trackingInfo = generateTrackingInfo(
      order.status,
      order.createdAt,
      order.updatedAt
    );

    return c.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      trackingInfo,
      shippingAddress: order.shippingAddress,
    });
  } catch (error) {
    console.error("Error tracking order:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Helper function to generate tracking information
function generateTrackingInfo(
  status: string,
  createdAt: Date,
  updatedAt: Date
) {
  const baseDate = new Date(createdAt);

  switch (status) {
    case "PENDING":
      return {
        currentStep: "Order Placed",
        steps: [
          { step: "Order Placed", completed: true, date: baseDate },
          {
            step: "Order Confirmed",
            completed: false,
            estimatedDate: new Date(baseDate.getTime() + 2 * 60 * 60 * 1000),
          },
          {
            step: "Processing",
            completed: false,
            estimatedDate: new Date(baseDate.getTime() + 4 * 60 * 60 * 1000),
          },
          {
            step: "Shipped",
            completed: false,
            estimatedDate: new Date(baseDate.getTime() + 6 * 60 * 60 * 1000),
          },
          {
            step: "Delivered",
            completed: false,
            estimatedDate: new Date(baseDate.getTime() + 8 * 60 * 60 * 1000),
          },
        ],
      };
    case "CONFIRMED":
      return {
        currentStep: "Order Confirmed",
        steps: [
          { step: "Order Placed", completed: true, date: baseDate },
          { step: "Order Confirmed", completed: true, date: updatedAt },
          {
            step: "Processing",
            completed: false,
            estimatedDate: new Date(updatedAt.getTime() + 2 * 60 * 60 * 1000),
          },
          {
            step: "Shipped",
            completed: false,
            estimatedDate: new Date(updatedAt.getTime() + 4 * 60 * 60 * 1000),
          },
          {
            step: "Delivered",
            completed: false,
            estimatedDate: new Date(updatedAt.getTime() + 6 * 60 * 60 * 1000),
          },
        ],
      };
    case "PROCESSING":
      return {
        currentStep: "Processing",
        steps: [
          { step: "Order Placed", completed: true, date: baseDate },
          {
            step: "Order Confirmed",
            completed: true,
            date: new Date(baseDate.getTime() + 2 * 60 * 60 * 1000),
          },
          { step: "Processing", completed: true, date: updatedAt },
          {
            step: "Shipped",
            completed: false,
            estimatedDate: new Date(updatedAt.getTime() + 2 * 60 * 60 * 1000),
          },
          {
            step: "Delivered",
            completed: false,
            estimatedDate: new Date(updatedAt.getTime() + 4 * 60 * 60 * 1000),
          },
        ],
      };
    case "SHIPPED":
      return {
        currentStep: "Shipped",
        steps: [
          { step: "Order Placed", completed: true, date: baseDate },
          {
            step: "Order Confirmed",
            completed: true,
            date: new Date(baseDate.getTime() + 2 * 60 * 60 * 1000),
          },
          {
            step: "Processing",
            completed: true,
            date: new Date(baseDate.getTime() + 4 * 60 * 60 * 1000),
          },
          { step: "Shipped", completed: true, date: updatedAt },
          {
            step: "Delivered",
            completed: false,
            estimatedDate: new Date(updatedAt.getTime() + 2 * 60 * 60 * 1000),
          },
        ],
      };
    case "DELIVERED":
      return {
        currentStep: "Delivered",
        steps: [
          { step: "Order Placed", completed: true, date: baseDate },
          {
            step: "Order Confirmed",
            completed: true,
            date: new Date(baseDate.getTime() + 2 * 60 * 60 * 1000),
          },
          {
            step: "Processing",
            completed: true,
            date: new Date(baseDate.getTime() + 4 * 60 * 60 * 1000),
          },
          {
            step: "Shipped",
            completed: true,
            date: new Date(baseDate.getTime() + 6 * 60 * 60 * 1000),
          },
          { step: "Delivered", completed: true, date: updatedAt },
        ],
      };
    case "CANCELLED":
      return {
        currentStep: "Cancelled",
        steps: [
          { step: "Order Placed", completed: true, date: baseDate },
          { step: "Cancelled", completed: true, date: updatedAt },
        ],
      };
    default:
      return {
        currentStep: "Unknown Status",
        steps: [],
      };
  }
}

export default ordersRouter;
