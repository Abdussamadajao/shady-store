import useCartStore from "@/store/cart";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "../service";
import type { AddToCartRequest, CartItem } from "@/types";
import { useEffect } from "react";

export const useCartMutations = () => {
  const queryClient = useQueryClient();
  const { addToCart, updateQuantity, removeFromCart, clearCart, syncCart } =
    useCartStore();

  const addMutation = useMutation({
    mutationFn: cartApi.addItem,
    onError: (error) => {
      console.error("Failed to add item to cart:", error);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onSuccess: (data) => {
      console.log("Item added successfully");
      queryClient.setQueryData(["cart"], (oldData: any) => {
        console.log(oldData, "oldData");
        const updatedCart = oldData ? [...oldData, data] : [data];
        syncCart(updatedCart);
        return updatedCart;
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      cartApi.updateItem(id, data),
    onError: (error) => {
      console.error("Failed to update cart item:", error);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onSuccess: (data) => {
      console.log("Item updated successfully");
      queryClient.setQueryData(["cart"], data);
      queryClient.setQueryData(["cart"], (oldData: any) => {
        // Ensure oldData is an array
        const currentItems = Array.isArray(oldData)
          ? oldData
          : oldData?.items
          ? oldData.items
          : [];

        const updatedCart = currentItems.map((item: CartItem) =>
          item.id === data.id ? data : item
        );
        syncCart(updatedCart);
        return updatedCart;
      });
    },
  });
  const removeMutation = useMutation({
    mutationFn: cartApi.removeItem,
    onError: (error) => {
      console.error("Failed to remove cart item:", error);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onSuccess: (data) => {
      console.log("Item removed successfully");
      queryClient.setQueryData(["cart"], data);
    },
  });

  const clearMutation = useMutation({
    mutationFn: cartApi.clearCart,
    onError: (error) => {
      console.error("Failed to clear cart:", error);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onSuccess: () => {
      console.log("Cart cleared successfully");
      queryClient.setQueryData(["cart"], { items: [] });
      syncCart([]);
    },
  });
  const optimisticAddToCart = async (item: AddToCartRequest) => {
    const cartItem = {
      productId: item.productId,
      userId: item.userId, // Will be set by the store
      quantity: item.quantity,
      product: item.product,
    };
    addToCart(cartItem as any);
    await addMutation.mutateAsync(cartItem);
  };

  const optimisticUpdateQuantity = async (id: string, quantity: number) => {
    updateQuantity(id, quantity);
    await updateMutation.mutateAsync({ id, data: { quantity } });
  };

  const optimisticRemoveFromCart = async (id: string) => {
    removeFromCart(id);
    await removeMutation.mutateAsync(id);
  };

  const optimisticClearCart = async () => {
    clearCart();
    await clearMutation.mutateAsync();
  };

  return {
    addToCart: optimisticAddToCart,
    updateQuantity: optimisticUpdateQuantity,
    removeFromCart: optimisticRemoveFromCart,
    clearCart: optimisticClearCart,
    isLoading:
      addMutation.isPending ||
      updateMutation.isPending ||
      removeMutation.isPending ||
      clearMutation.isPending,
    errors: {
      add: addMutation.error,
      update: updateMutation.error,
      remove: removeMutation.error,
      clear: clearMutation.error,
    },
  };
};

export const useCartQuery = () => {
  const { syncCart } = useCartStore();
  const queryResult = useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.getCart,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (queryResult.isSuccess) {
      syncCart(queryResult.data.items || queryResult.data);
    }
  }, [queryResult.isSuccess, queryResult.data, syncCart]);

  return queryResult;
};
