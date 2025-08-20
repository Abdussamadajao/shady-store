import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewsApi } from "../service";

// Get user's reviews
export const useReviews = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["reviews", page, limit],
    queryFn: () => reviewsApi.getReviews(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get a specific review
export const useReview = (reviewId: string) => {
  return useQuery({
    queryKey: ["reviews", reviewId],
    queryFn: () => reviewsApi.getReview(reviewId),
    enabled: !!reviewId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get review statistics
export const useReviewStats = () => {
  return useQuery({
    queryKey: ["reviews", "stats"],
    queryFn: reviewsApi.getReviewStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Create review mutation
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewsApi.createReview,
    onSuccess: () => {
      // Invalidate and refetch reviews
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews", "stats"] });
    },
    onError: (error) => {
      console.error("Failed to create review:", error);
    },
  });
};

// Update review mutation
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, data }: { reviewId: string; data: any }) =>
      reviewsApi.updateReview(reviewId, data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch reviews
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews", "stats"] });

      // Update specific review in cache
      queryClient.setQueryData(["reviews", variables.reviewId], {
        review: data?.review || null,
      });
    },
    onError: (error) => {
      console.error("Failed to update review:", error);
    },
  });
};

// Delete review mutation
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewsApi.deleteReview,
    onSuccess: () => {
      // Invalidate and refetch reviews
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews", "stats"] });
    },
    onError: (error) => {
      console.error("Failed to delete review:", error);
    },
  });
};

// Optimistic review operations
export const useReviewMutations = () => {
  const createMutation = useCreateReview();
  const updateMutation = useUpdateReview();
  const deleteMutation = useDeleteReview();

  return {
    createReview: createMutation.mutate,
    updateReview: updateMutation.mutate,
    deleteReview: deleteMutation.mutate,
    isLoading:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
};
