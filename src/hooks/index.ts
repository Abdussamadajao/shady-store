// React Query hooks
export {
  useProducts,
  useProduct,
  useProductsByCategory,
  useSearchProducts,
  useRelatedProducts,
} from "./useProducts";
export { useCategories } from "./useCategories";
export { useInfiniteProducts } from "./useInfiniteProducts";
export { useProductMutations } from "./useProductMutations";

// Utility hooks
export { useDebounce } from "./useDebounce";

// Existing hooks
export { useScrollToTop } from "./useScrollToTop";
export { useIsMobile } from "./use-mobile";

// Re-export types
export type {
  Product,
  ProductsResponse,
  ProductsQueryParams,
} from "./useProducts";
export type { Category } from "./useCategories";
export type {
  CreateProductData,
  UpdateProductData,
} from "./useProductMutations";
