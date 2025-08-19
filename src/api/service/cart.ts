import { axiosInstance } from "@/lib/axios";
import type {
  AddToCartRequest,
  CartItem,
  CartResponse,
  CartSummary,
  UpdateCartItemRequest,
} from "@/types";

export const cartApi = {
  getCart: async (): Promise<CartResponse> => {
    const response = await axiosInstance.get("/cart");
    return response.data;
  },
  getCartSummary: async (): Promise<CartSummary> => {
    const response = await axiosInstance.get("/cart/summary");
    return response.data;
  },
  addItem: async (data: AddToCartRequest): Promise<CartItem> => {
    const response = await axiosInstance.post("/cart", data);
    return response.data;
  },
  updateItem: async (
    id: string,
    data: UpdateCartItemRequest
  ): Promise<CartItem> => {
    const response = await axiosInstance.put(`/cart/${id}`, data);
    return response.data;
  },
  removeItem: async (id: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete(`/cart/${id}`);
    return response.data;
  },
  clearCart: async (): Promise<{ message: string }> => {
    const response = await axiosInstance.delete("/cart");
    return response.data;
  },
};
