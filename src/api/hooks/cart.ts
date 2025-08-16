import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addToCart,
  clearCart,
  fetchCart,
  fetchCartSummary,
  removeFromCart,
  updateCartItem,
} from "../service/cart";
import type { CartItem, UpdateCartItemRequest } from "@/types";
import React from "react";
import { useCartStore } from "@/store/cart";

export const useCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCartSummary = () => {
  return useQuery({
    queryKey: ["cart", "summary"],
    queryFn: fetchCartSummary,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCart,
    onMutate: async (data) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      // Snapshot the previous value
      const previousCart = queryClient.getQueryData(["cart"]);

      return { previousCart };
    },
    onSuccess: () => {
      // Invalidate and refetch cart data
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart", "summary"] });
    },
    onError: (error, variables, context) => {
      console.error("Failed to add item to cart:", error);

      // Optionally revert optimistic updates on error
      // This would require storing the previous state
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCartItemRequest }) =>
      updateCartItem(id, data),
    onSuccess: () => {
      // Invalidate and refetch cart data
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart", "summary"] });
    },
    onError: (error) => {
      console.error("Failed to update cart item:", error);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFromCart,
    onSuccess: () => {
      // Invalidate and refetch cart data
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart", "summary"] });
    },
    onError: (error) => {
      console.error("Failed to remove item from cart:", error);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      // Invalidate and refetch cart data
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart", "summary"] });
    },
    onError: (error) => {
      console.error("Failed to clear cart:", error);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

// Enhanced hook that combines local store with API sync
export const useCartManager = () => {
  const { data: apiCart, isLoading: apiLoading, error: apiError } = useCart();
  const {
    items: localItems,
    total: localTotal,
    itemCount: localItemCount,
    pendingSync,
    lastSynced,
    // syncWithAPI,
    setLoading,
    setError,
  } = useCartStore();

  // Sync API data with local store when it changes
  // React.useEffect(() => {
  //   if (apiCart && apiCart.items) {
  //     syncWithAPI(apiCart.items);
  //   }
  // }, [apiCart, syncWithAPI]);

  // Sync loading and error states
  React.useEffect(() => {
    setLoading(apiLoading);
  }, [apiLoading, setLoading]);

  React.useEffect(() => {
    setError(apiError?.message || null);
  }, [apiError, setError]);

  return {
    // Use local store for immediate updates
    items: localItems,
    total: localTotal,
    itemCount: localItemCount,
    isLoading: apiLoading,
    error: apiError?.message || null,
    pendingSync,
    lastSynced,

    // API data for reference
    apiCart,
    apiError,
  };
};

// Utility functions
export const getCartItemPrice = (item: CartItem): number => {
  if (item.variantId && item.product.variants.length > 0) {
    const variant = item.product.variants.find((v) => v.id === item.variantId);
    if (variant?.price) {
      return Number(variant.price);
    }
  }
  return Number(item.product.price);
};

export const getCartItemTotalPrice = (item: CartItem): number => {
  return getCartItemPrice(item) * item.quantity;
};

export const getCartItemImage = (item: CartItem): string | undefined => {
  const primaryImage = item.product.images.find((img) => img.isPrimary);
  if (primaryImage) {
    return primaryImage.url;
  }
  // Fallback to first image if no primary image
  return item.product.images[0]?.url;
};

export const getCartItemVariant = (item: CartItem) => {
  if (!item.variantId) return null;
  return item.product.variants.find((v) => v.id === item.variantId) || null;
};
