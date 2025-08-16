import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import type { Product, ProductsQueryParams } from "./useProducts";

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const fetchProductsPage = async ({
  pageParam = 1,
  queryKey,
}: any): Promise<ProductsResponse> => {
  const [, params] = queryKey;
  const searchParams = new URLSearchParams();

  searchParams.append("page", pageParam.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  if (params.category) searchParams.append("category", params.category);
  if (params.search) searchParams.append("search", params.search);
  if (params.minPrice)
    searchParams.append("minPrice", params.minPrice.toString());
  if (params.maxPrice)
    searchParams.append("maxPrice", params.maxPrice.toString());
  if (params.sortBy) searchParams.append("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);

  const response = await axiosInstance.get(
    `/products?${searchParams.toString()}`
  );
  return response.data;
};

export const useInfiniteProducts = (
  params: Omit<ProductsQueryParams, "page"> = {}
) => {
  return useInfiniteQuery({
    queryKey: ["infiniteProducts", params],
    queryFn: fetchProductsPage,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.pages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
