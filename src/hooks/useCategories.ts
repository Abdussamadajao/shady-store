import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const fetchCategories = async (): Promise<Category[]> => {
  const response = await axiosInstance.get("/categories");
  return response.data;
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};
