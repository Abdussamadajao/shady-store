import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "../service";

// Get user's orders
export const useOrders = (page = 1, limit = 10, status?: string) => {
  return useQuery({
    queryKey: ["orders", page, limit, status],
    queryFn: () => ordersApi.getOrders(page, limit, status),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get a specific order
export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => ordersApi.getOrder(orderId),
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get order statistics
export const useOrderStats = () => {
  return useQuery({
    queryKey: ["orders", "stats"],
    queryFn: ordersApi.getOrderStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get order tracking information
export const useOrderTracking = (orderId: string) => {
  return useQuery({
    queryKey: ["orders", orderId, "tracking"],
    queryFn: () => ordersApi.getOrderTracking(orderId),
    enabled: !!orderId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Cancel order mutation
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason?: string }) =>
      ordersApi.cancelOrder(orderId, reason),
    onSuccess: (data, variables) => {
      // Invalidate and refetch orders
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", "stats"] });

      // Update specific order in cache
      queryClient.setQueryData(["orders", variables.orderId], {
        order: data.order,
      });
    },
    onError: (error) => {
      console.error("Failed to cancel order:", error);
    },
  });
};

// Request refund mutation
export const useRequestRefund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      reason,
      items,
    }: {
      orderId: string;
      reason: string;
      items?: any[];
    }) => ordersApi.requestRefund(orderId, reason, items),
    onSuccess: (data, variables) => {
      // Invalidate and refetch orders
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", "stats"] });

      // Update specific order in cache
      queryClient.setQueryData(["orders", variables.orderId], {
        order: data.order,
      });
    },
    onError: (error) => {
      console.error("Failed to request refund:", error);
    },
  });
};

// Optimistic order operations
export const useOrderMutations = () => {
  const cancelMutation = useCancelOrder();
  const refundMutation = useRequestRefund();

  return {
    cancelOrder: cancelMutation.mutate,
    requestRefund: refundMutation.mutate,
    isLoading: cancelMutation.isPending || refundMutation.isPending,
  };
};
