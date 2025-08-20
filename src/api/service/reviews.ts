import { axiosInstance } from "@/lib/axios";
import type { Review } from "@/types";

export const reviewsApi = {
  getReviews: async (page: number, limit: number): Promise<{
    reviews: Review[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> => {
    const response = await axiosInstance.get(`/reviews?page=${page}&limit=${limit}`);
    return response.data;
  },

  getReview: async (reviewId: string): Promise<{ review: Review }> => {
    const response = await axiosInstance.get(`/reviews/${reviewId}`);
    return response.data;
  },

  getReviewStats: async (): Promise<{
    totalReviews: number;
    approvedReviews: number;
    pendingReviews: number;
    avgRating: number;
  }> => {
    const response = await axiosInstance.get("/reviews/stats");
    return response.data;
  },

  createReview: async (data: {
    productId: string;
    rating: number;
    title?: string;
    comment?: string;
  }): Promise<{ message: string; review: Review }> => {
    const response = await axiosInstance.post("/reviews", data);
    return response.data;
  },

  updateReview: async (
    reviewId: string,
    data: {
      rating?: number;
      title?: string;
      comment?: string;
    }
  ): Promise<{ message: string; review: Review }> => {
    const response = await axiosInstance.put(`/reviews/${reviewId}`, data);
    return response.data;
  },

  deleteReview: async (reviewId: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete(`/reviews/${reviewId}`);
    return response.data;
  },
};
