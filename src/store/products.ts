import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  images: string[];
  inStock: boolean;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface ProductsState {
  products: Product[];
  filteredProducts: Product[];
  selectedCategory: string;
  searchQuery: string;
  sortBy: "name" | "price" | "rating" | "newest";
  sortOrder: "asc" | "desc";
  isLoading: boolean;
  error: string | null;
}

interface ProductsActions {
  // Product management
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  removeProduct: (id: string) => void;

  // Filtering and search
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  performSearch: (query: string) => void;
  setSortBy: (sortBy: ProductsState["sortBy"]) => void;
  setSortOrder: (order: "asc" | "desc") => void;
  resetFilters: () => void;

  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Computed actions
  filterProducts: () => void;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  getProductsBySearch: (query: string) => Product[];
}

type ProductsStore = ProductsState & ProductsActions;

export const useProductsStore = create<ProductsStore>()(
  persist(
    (set, get) => ({
      // Initial state
      products: [],
      filteredProducts: [],
      selectedCategory: "All",
      searchQuery: "",
      sortBy: "newest",
      sortOrder: "desc",
      isLoading: false,
      error: null,

      // Product management
      setProducts: (products) => {
        set({ products });
        get().filterProducts();
      },

      addProduct: (product) => {
        const { products } = get();
        set({ products: [...products, product] });
        get().filterProducts();
      },

      updateProduct: (id, updates) => {
        const { products } = get();
        const updatedProducts = products.map((product) =>
          product.id === id ? { ...product, ...updates } : product
        );
        set({ products: updatedProducts });
        get().filterProducts();
      },

      removeProduct: (id) => {
        const { products } = get();
        const filteredProducts = products.filter(
          (product) => product.id !== id
        );
        set({ products: filteredProducts });
        get().filterProducts();
      },

      // Filtering and search
      setSelectedCategory: (category) => {
        set({ selectedCategory: category });
        get().filterProducts();
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });
        // Don't automatically filter - only filter when search is explicitly requested
      },

      performSearch: (query) => {
        set({ searchQuery: query });
        get().filterProducts();
      },

      setSortBy: (sortBy) => {
        set({ sortBy });
        get().filterProducts();
      },

      setSortOrder: (order) => {
        set({ sortOrder: order });
        get().filterProducts();
      },

      resetFilters: () => {
        set({
          selectedCategory: "All",
          searchQuery: "",
          sortBy: "newest",
          sortOrder: "desc",
        });
        get().filterProducts();
      },

      // State management
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      // Computed actions
      filterProducts: () => {
        const { products, selectedCategory, searchQuery, sortBy, sortOrder } =
          get();

        let filtered = [...products];

        // Filter by category
        if (selectedCategory !== "All") {
          filtered = filtered.filter(
            (product) => product.category === selectedCategory
          );
        }

        // Filter by search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (product) =>
              product.name.toLowerCase().includes(query) ||
              product.description?.toLowerCase().includes(query) ||
              product.tags?.some((tag) => tag.toLowerCase().includes(query))
          );
        }

        // Sort products
        filtered.sort((a, b) => {
          let aValue: any, bValue: any;

          switch (sortBy) {
            case "name":
              aValue = a.name.toLowerCase();
              bValue = b.name.toLowerCase();
              break;
            case "price":
              aValue = a.price;
              bValue = b.price;
              break;
            case "rating":
              aValue = a.rating || 0;
              bValue = b.rating || 0;
              break;
            case "newest":
              aValue = new Date(a.createdAt || "").getTime();
              bValue = new Date(b.createdAt || "").getTime();
              break;
            default:
              return 0;
          }

          if (sortOrder === "asc") {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });

        set({ filteredProducts: filtered });
      },

      getProductById: (id) => {
        const { products } = get();
        return products.find((product) => product.id === id);
      },

      getProductsByCategory: (category) => {
        const { products } = get();
        return products.filter((product) => product.category === category);
      },

      getProductsBySearch: (query) => {
        const { products } = get();
        const searchQuery = query.toLowerCase();
        return products.filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery) ||
            product.description?.toLowerCase().includes(searchQuery)
        );
      },
    }),
    {
      name: "products-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        products: state.products,
        selectedCategory: state.selectedCategory,
        searchQuery: state.searchQuery,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      }),
    }
  )
);

// Selector hooks for better performance
export const useProducts = () => useProductsStore((state) => state.products);
export const useFilteredProducts = () =>
  useProductsStore((state) => state.filteredProducts);
export const useSelectedCategory = () =>
  useProductsStore((state) => state.selectedCategory);
export const useSearchQuery = () =>
  useProductsStore((state) => state.searchQuery);
export const useProductsLoading = () =>
  useProductsStore((state) => state.isLoading);
export const useProductsError = () => useProductsStore((state) => state.error);
