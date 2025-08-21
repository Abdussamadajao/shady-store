import { axiosInstance } from "@/lib/axios";
import type {
  CreatePaymentIntentRequest,
  CreatePaymentIntentResponse,
  ConfirmPaymentRequest,
  ConfirmPaymentResponse,
  PaymentStatusResponse,
  RefundRequest,
  RefundResponse,
} from "@/types";

export const paymentApi = {
  // Create a payment intent for an order
  createPaymentIntent: async (
    data: CreatePaymentIntentRequest
  ): Promise<CreatePaymentIntentResponse> => {
    const response = await axiosInstance.post("/payments/create-intent", data);
    return response.data;
  },

  // Update payment and order status after Stripe processing
  // This endpoint updates our database with the final payment status from Stripe
  confirmPayment: async (
    data: ConfirmPaymentRequest
  ): Promise<ConfirmPaymentResponse> => {
    const response = await axiosInstance.post("/payments/confirm", data);
    return response.data;
  },

  // Get payment status
  getPaymentStatus: async (paymentId: string): Promise<PaymentStatusResponse> => {
    const response = await axiosInstance.get(`/payments/${paymentId}`);
    return response.data;
  },

  // Process refund
  processRefund: async (
    paymentId: string,
    data: RefundRequest
  ): Promise<RefundResponse> => {
    const response = await axiosInstance.post(`/payments/${paymentId}/refund`, data);
    return response.data;
  },
};
