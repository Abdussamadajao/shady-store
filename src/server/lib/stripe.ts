import Stripe from "stripe";

if (!process.env["STRIPE_SECRET_KEY"]) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}

export const stripe = new Stripe(process.env["STRIPE_SECRET_KEY"], {
  apiVersion: "2025-07-30.basil",
  typescript: true,
});

export const STRIPE_CONFIG = {
  publishableKey: process.env["STRIPE_PUBLISHABLE_KEY"],
  currency: "ngn", // Nigerian Naira
  paymentMethods: ["card", "bank_transfer"] as const,
};

export interface CreatePaymentIntentParams {
  amount: number; // Amount in kobo (smallest currency unit)
  currency: string;
  metadata: {
    orderId: string;
    userId: string;
    [key: string]: string;
  };
  description?: string;
  customerId?: string;
}

export interface CreateCustomerParams {
  email: string;
  name?: string;
  phone?: string;
  metadata?: Record<string, string>;
}

export const createPaymentIntent = async (
  params: CreatePaymentIntentParams
) => {
  try {
    const paymentIntentData: any = {
      amount: params.amount,
      currency: params.currency,
      metadata: params.metadata,
      automatic_payment_methods: {
        enabled: true,
      },
      setup_future_usage: "off_session",
    };

    if (params.description) {
      paymentIntentData.description = params.description;
    }
    if (params.customerId) {
      paymentIntentData.customer = params.customerId;
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const createCustomer = async (params: CreateCustomerParams) => {
  try {
    const customerData: any = {
      email: params.email,
    };

    if (params.name) {
      customerData.name = params.name;
    }
    if (params.phone) {
      customerData.phone = params.phone;
    }
    if (params.metadata) {
      customerData.metadata = params.metadata;
    }

    const customer = await stripe.customers.create(customerData);

    return {
      success: true,
      customerId: customer.id,
      customer,
    };
  } catch (error) {
    console.error("Error creating customer:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const retrievePaymentIntent = async (paymentIntentId: string) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return {
      success: true,
      paymentIntent,
    };
  } catch (error) {
    console.error("Error retrieving payment intent:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const confirmPaymentIntent = async (paymentIntentId: string) => {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
    return {
      success: true,
      paymentIntent,
    };
  } catch (error) {
    console.error("Error confirming payment intent:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const refundPayment = async (
  paymentIntentId: string,
  amount?: number
) => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      ...(amount && { amount }),
    });

    return {
      success: true,
      refund,
    };
  } catch (error) {
    console.error("Error creating refund:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
