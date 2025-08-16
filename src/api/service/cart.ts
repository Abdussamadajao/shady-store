import { axiosInstance } from "@/lib/axios";
import type {
  AddToCartRequest,
  CartItem,
  CartResponse,
  CartSummary,
  UpdateCartItemRequest,
} from "@/types";

// Types based on the Prisma schema and API responses

// API functions
const fetchCart = async (): Promise<CartResponse> => {
  const response = await axiosInstance.get("/cart");
  return response.data;
};

const fetchCartSummary = async (): Promise<CartSummary> => {
  const response = await axiosInstance.get("/cart/summary");
  return response.data;
};

const addToCart = async (data: AddToCartRequest): Promise<CartItem> => {
  const response = await axiosInstance.post("/cart", data);
  return response.data;
};

const updateCartItem = async (
  id: string,
  data: UpdateCartItemRequest
): Promise<CartItem> => {
  const response = await axiosInstance.put(`/cart/${id}`, data);
  return response.data;
};

const removeFromCart = async (id: string): Promise<{ message: string }> => {
  const response = await axiosInstance.delete(`/cart/${id}`);
  return response.data;
};

const clearCart = async (): Promise<{ message: string }> => {
  const response = await axiosInstance.delete("/cart");
  return response.data;
};

export {
  fetchCart,
  fetchCartSummary,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
