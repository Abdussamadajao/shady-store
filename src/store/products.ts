import { create } from "zustand";
import { products } from "../lib/product";
import type { Product } from "../lib/product";

interface ProductState {
  products: Product[];
  selectedCategory: string;
  searchQuery: string;
}

interface ProductActions {
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

type ProductStore = ProductState & ProductActions;

export const useProductStore = create<ProductStore>((set) => ({
  products,
  selectedCategory: "All",
  searchQuery: "",

  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  resetFilters: () => set({ selectedCategory: "All", searchQuery: "" }),
}));

// Basic selector hooks
export const useProducts = () => useProductStore((state) => state.products);
export const useSelectedCategory = () =>
  useProductStore((state) => state.selectedCategory);
export const useSearchQuery = () =>
  useProductStore((state) => state.searchQuery);

// Filtered products getter
export const useFilteredProducts = () => {
  const products = useProducts();
  const selectedCategory = useSelectedCategory();
  const searchQuery = useSearchQuery();

  let filtered = [...products];

  if (selectedCategory !== "All") {
    filtered = filtered.filter(
      (product) => product.category === selectedCategory
    );
  }

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
  }

  return filtered;
};

// Categories getter (cached)
let cachedCategories: string[] | null = null;

export const getCategories = () => {
  if (!cachedCategories) {
    const uniqueCategories = new Set(
      products.map((product) => product.category)
    );
    cachedCategories = ["All", ...Array.from(uniqueCategories)];
  }
  return cachedCategories;
};

// Additional selectors
export const useAvailableCategories = () => getCategories();

export const useProductById = (id: string) => {
  const products = useProducts();
  return products.find((product) => product.id === id);
};

// Related products selector
export const useRelatedProducts = (productId: string, limit: number = 4) => {
  const products = useProducts();
  const currentProduct = products.find((product) => product.id === productId);
  
  if (!currentProduct) return [];
  
  return products
    .filter((product) => 
      product.category === currentProduct.category && 
      product.id !== productId
    )
    .slice(0, limit);
};

// Alternative: Get related products by category directly
export const useRelatedProductsByCategory = (category: string, excludeProductId?: string, limit: number = 4) => {
  const products = useProducts();
  
  return products
    .filter((product) => 
      product.category === category && 
      (!excludeProductId || product.id !== excludeProductId)
    )
    .slice(0, limit);
};
