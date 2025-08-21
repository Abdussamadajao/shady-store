import { loadStripe } from "@stripe/stripe-js";
import type { Stripe } from "@stripe/stripe-js";
import { paymentApi } from "@/api/service";

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (
      !publishableKey ||
      publishableKey === "pk_test_your_publishable_key_here"
    ) {
      throw new Error(
        "Stripe publishable key not configured. Please add VITE_STRIPE_PUBLISHABLE_KEY to your .env file. Get your key from Stripe Dashboard → Developers → API Keys"
      );
    }
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

export interface PaymentIntentData {
  orderId: string;
  amount: number;
  currency?: string;
}

export interface CreatePaymentIntentResponse {
  success: boolean;
  clientSecret: string;
  paymentIntentId: string;
  paymentId: string;
}

export const createPaymentIntent = async (
  data: PaymentIntentData
): Promise<CreatePaymentIntentResponse> => {
  try {
    return await paymentApi.createPaymentIntent(data);
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
};

export const confirmPayment = async (
  paymentIntentId: string
): Promise<{ success: boolean; status: string; orderStatus: string }> => {
  try {
    return await paymentApi.confirmPayment({ paymentIntentId });
  } catch (error) {
    console.error("Error confirming payment:", error);
    throw error;
  }
};

export const getPaymentStatus = async (paymentId: string): Promise<any> => {
  try {
    return await paymentApi.getPaymentStatus(paymentId);
  } catch (error) {
    console.error("Error getting payment status:", error);
    throw error;
  }
};

export const processRefund = async (
  paymentId: string,
  amount?: number,
  reason?: string
): Promise<any> => {
  try {
    const response = await fetch(`/api/payments/${paymentId}/refund`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ amount, reason }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to process refund");
    }

    return await response.json();
  } catch (error) {
    console.error("Error processing refund:", error);
    throw error;
  }
};

export const formatAmountForStripe = (amount: number): number => {
  // Convert to smallest currency unit (kobo for NGN)
  return Math.round(amount * 100);
};

export const formatAmountFromStripe = (amount: number): number => {
  // Convert from smallest currency unit (kobo for NGN)
  return amount / 100;
};
