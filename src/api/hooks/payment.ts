import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentApi } from "../service";
import type {
  CreatePaymentIntentRequest,
  ConfirmPaymentRequest,
  RefundRequest,
} from "@/types";

// Create payment intent mutation
export const useCreatePaymentIntent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentIntentRequest) =>
      paymentApi.createPaymentIntent(data),
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({
        queryKey: ["orders", variables.orderId],
      });
    },
    onError: (error) => {
      console.error("Failed to create payment intent:", error);
    },
  });
};

// Update payment and order status mutation after Stripe processing
// This hook is used to update our database with the final payment status from Stripe
export const useConfirmPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ConfirmPaymentRequest) =>
      paymentApi.confirmPayment(data),
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      console.error("Failed to update payment status:", error);
    },
  });
};

// Get payment status query
export const usePaymentStatus = (paymentId: string) => {
  return useQuery({
    queryKey: ["payments", paymentId],
    queryFn: () => paymentApi.getPaymentStatus(paymentId),
    enabled: !!paymentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Process refund mutation
export const useProcessRefund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      paymentId,
      data,
    }: {
      paymentId: string;
      data: RefundRequest;
    }) => paymentApi.processRefund(paymentId, data),
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      // Update specific payment in cache
      queryClient.setQueryData(["payments", variables.paymentId], {
        ...queryClient.getQueryData(["payments", variables.paymentId]),
        status: "REFUNDED",
      });
    },
    onError: (error) => {
      console.error("Failed to process refund:", error);
    },
  });
};

// Optimistic payment operations and status updates
export const usePaymentMutations = () => {
  const createIntentMutation = useCreatePaymentIntent();
  const updatePaymentStatusMutation = useConfirmPayment();
  const refundMutation = useProcessRefund();

  return {
    createPaymentIntent: createIntentMutation.mutate,
    updatePaymentStatus: updatePaymentStatusMutation.mutate,
    processRefund: refundMutation.mutate,
    isLoading:
      createIntentMutation.isPending ||
      updatePaymentStatusMutation.isPending ||
      refundMutation.isPending,
  };
};

// Hook for payment flow (create intent + update status after Stripe processing)
export const usePaymentFlow = () => {
  const createIntentMutation = useCreatePaymentIntent();
  const updatePaymentStatusMutation = useConfirmPayment();

  const createAndUpdatePaymentStatus = async (
    paymentData: CreatePaymentIntentRequest,
    paymentIntentId: string,
    stripeStatus: string
  ) => {
    try {
      // First create the payment intent
      const intentResult = await createIntentMutation.mutateAsync(paymentData);

      // Then update the payment status
      const updateResult = await updatePaymentStatusMutation.mutateAsync({
        paymentIntentId,
        stripeStatus,
      });

      return { intentResult, updateResult };
    } catch (error) {
      console.error("Payment flow failed:", error);
      throw error;
    }
  };

  return {
    createAndUpdatePaymentStatus,
    isLoading:
      createIntentMutation.isPending || updatePaymentStatusMutation.isPending,
    error: createIntentMutation.error || updatePaymentStatusMutation.error,
  };
};
