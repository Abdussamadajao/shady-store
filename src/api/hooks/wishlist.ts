import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { wishlistApi } from "../service";
import type { WishlistItem } from "@/types";

// Get user's wishlist
export const useWishlist = () => {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistApi.getWishlist,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get wishlist count
export const useWishlistCount = () => {
  return useQuery({
    queryKey: ["wishlist", "count"],
    queryFn: wishlistApi.getWishlistCount,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Check if product is in wishlist
export const useWishlistStatus = (productId: string) => {
  return useQuery({
    queryKey: ["wishlist", "check", productId],
    queryFn: () => wishlistApi.checkWishlistStatus(productId),
    enabled: !!productId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Add to wishlist mutation
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: wishlistApi.addToWishlist,
    onSuccess: (data) => {
      // Invalidate and refetch wishlist
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist", "count"] });

      // Update wishlist status for this product
      queryClient.setQueryData(
        ["wishlist", "check", data.wishlistItem.productId],
        { inWishlist: true, itemId: data.wishlistItem.id }
      );
    },
    onError: (error) => {
      console.error("Failed to add to wishlist:", error);
    },
  });
};

// Remove from wishlist mutation
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: wishlistApi.removeFromWishlist,
    onSuccess: (data, variables) => {
      // Invalidate and refetch wishlist
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist", "count"] });

      // Update wishlist status for this product
      queryClient.setQueryData(
        ["wishlist", "check", variables.productId || ""],
        { inWishlist: false, itemId: null }
      );
    },
    onError: (error) => {
      console.error("Failed to remove from wishlist:", error);
    },
  });
};

// Remove from wishlist by item ID mutation
export const useRemoveWishlistItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: wishlistApi.removeWishlistItem,
    onSuccess: () => {
      // Invalidate and refetch wishlist
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist", "count"] });
    },
    onError: (error) => {
      console.error("Failed to remove wishlist item:", error);
    },
  });
};

// Optimistic wishlist operations
export const useWishlistMutations = () => {
  const queryClient = useQueryClient();
  const addMutation = useAddToWishlist();
  const removeMutation = useRemoveFromWishlist();

  const optimisticAddToWishlist = async (productId: string) => {
    // Optimistically update the UI
    queryClient.setQueryData(["wishlist", "check", productId], {
      inWishlist: true,
      itemId: "temp-id",
    });

    try {
      await addMutation.mutateAsync({ productId });
    } catch (error) {
      // Revert optimistic update on error
      queryClient.setQueryData(["wishlist", "check", productId], {
        inWishlist: false,
        itemId: null,
      });
      throw error;
    }
  };

  const optimisticRemoveFromWishlist = async (productId: string) => {
    // Optimistically update the UI
    queryClient.setQueryData(["wishlist", "check", productId], {
      inWishlist: false,
      itemId: null,
    });

    try {
      await removeMutation.mutateAsync({ productId });
    } catch (error) {
      // Revert optimistic update on error
      queryClient.setQueryData(["wishlist", "check", productId], {
        inWishlist: true,
        itemId: "temp-id",
      });
      throw error;
    }
  };

  return {
    addToWishlist: optimisticAddToWishlist,
    removeFromWishlist: optimisticRemoveFromWishlist,
    isLoading: addMutation.isPending || removeMutation.isPending,
  };
};
