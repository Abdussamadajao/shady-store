import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

export interface Product {
  id: string;
  name: string;
  description?: string;
  shortDescription?: string;
  price: number;
  images: Array<{
    id: string;
    url: string;
    sortOrder: number;
  }>;
  category: {
    id: string;
    name: string;
  };
  variants?: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  attributes?: Array<{
    id: string;
    name: string;
    value: string;
  }>;
  _count: {
    reviews: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

const fetchProducts = async (
  params: ProductsQueryParams = {}
): Promise<ProductsResponse> => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.append("page", params.page.toString());
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

const fetchProductById = async (id: string): Promise<Product> => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
};

export const useProducts = (params: ProductsQueryParams = {}) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => fetchProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useProductsByCategory = (category: string, limit: number = 10) => {
  return useQuery({
    queryKey: ["products", "category", category, limit],
    queryFn: () => fetchProducts({ category, limit }),
    enabled: !!category,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSearchProducts = (searchQuery: string, limit: number = 10) => {
  return useQuery({
    queryKey: ["products", "search", searchQuery, limit],
    queryFn: () => fetchProducts({ search: searchQuery, limit }),
    enabled: !!searchQuery.trim(),
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRelatedProducts = (productId: string, limit: number = 4) => {
  const { data: productData, isLoading: productLoading } =
    useProduct(productId);

  return useQuery({
    queryKey: ["products", "related", productId, limit],
    queryFn: async () => {
      if (!productData?.category?.id) {
        console.log("No category ID found for product:", productId);
        return {
          products: [],
          pagination: { page: 1, limit, total: 0, pages: 0 },
        };
      }

      console.log(
        "Fetching related products for category:",
        productData.category.id
      );
      const result = await fetchProducts({
        category: productData.category.id,
        limit: limit + 1, // +1 to account for excluding current product
      });
      console.log("Related products result:", result);
      return result;
    },
    enabled: !!productId && !!productData?.category?.id && !productLoading,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    select: (data: ProductsResponse) => {
      const filtered = data.products
        .filter((product: Product) => product.id !== productId)
        .slice(0, limit);
      console.log("Filtered related products:", filtered);
      return {
        ...data,
        products: filtered,
      };
    },
  });
};
