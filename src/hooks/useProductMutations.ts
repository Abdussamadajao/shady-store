import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import type { Product } from "./useProducts";

export interface CreateProductData {
  name: string;
  description?: string;
  shortDescription?: string;
  price: number;
  categoryId: string;
  images?: Array<{
    url: string;
    sortOrder: number;
  }>;
  variants?: Array<{
    name: string;
    price: number;
  }>;
  attributes?: Array<{
    name: string;
    value: string;
  }>;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

export const useProductMutations = () => {
  const queryClient = useQueryClient();

  const createProduct = useMutation({
    mutationFn: async (data: CreateProductData): Promise<Product> => {
      const response = await axiosInstance.post("/products", data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch products queries
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["infiniteProducts"] });
    },
  });

  const updateProduct = useMutation({
    mutationFn: async ({
      id,
      ...data
    }: UpdateProductData): Promise<Product> => {
      const response = await axiosInstance.put(`/products/${id}`, data);
      return response.data;
    },
    onSuccess: (updatedProduct) => {
      // Update the specific product in cache
      queryClient.setQueryData(["product", updatedProduct.id], updatedProduct);

      // Invalidate products lists
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["infiniteProducts"] });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await axiosInstance.delete(`/products/${id}`);
    },
    onSuccess: (_, deletedId) => {
      // Remove the deleted product from cache
      queryClient.removeQueries({ queryKey: ["product", deletedId] });

      // Invalidate products lists
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["infiniteProducts"] });
    },
  });

  const toggleProductStatus = useMutation({
    mutationFn: async ({
      id,
      isActive,
    }: {
      id: string;
      isActive: boolean;
    }): Promise<Product> => {
      const response = await axiosInstance.patch(`/products/${id}/status`, {
        isActive,
      });
      return response.data;
    },
    onSuccess: (updatedProduct) => {
      // Update the specific product in cache
      queryClient.setQueryData(["product", updatedProduct.id], updatedProduct);

      // Invalidate products lists
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["infiniteProducts"] });
    },
  });

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
  };
};
