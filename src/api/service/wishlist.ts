import { axiosInstance } from "@/lib/axios";
import type { WishlistItem } from "@/types";

export const wishlistApi = {
  getWishlist: async (): Promise<{ wishlist: WishlistItem[] }> => {
    const response = await axiosInstance.get("/wishlist");
    return response.data;
  },

  getWishlistCount: async (): Promise<{ count: number }> => {
    const response = await axiosInstance.get("/wishlist/count");
    return response.data;
  },

  checkWishlistStatus: async (
    productId: string
  ): Promise<{ inWishlist: boolean; itemId: string | null }> => {
    const response = await axiosInstance.get(`/wishlist/check/${productId}`);
    return response.data;
  },

  addToWishlist: async (data: {
    productId: string;
  }): Promise<{ message: string; wishlistItem: WishlistItem }> => {
    const response = await axiosInstance.post("/wishlist", data);
    return response.data;
  },

  removeFromWishlist: async (data: {
    productId: string;
  }): Promise<{ message: string }> => {
    const response = await axiosInstance.delete(
      `/wishlist/product/${data.productId}`
    );
    return response.data;
  },

  removeWishlistItem: async (itemId: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete(`/wishlist/${itemId}`);
    return response.data;
  },
};
