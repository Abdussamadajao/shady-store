import { create } from "zustand";
import { products } from "../lib/product";
import type { Product } from "../lib/product";

interface CartItem {
  id: string;
  images: string[];
  price: string | number;
  name: string;
  count: string | number;
  category: string;
  detail: string;
  quantity: number;
}

interface StoreState {
  // Products and filtering
  products: Product[];
  selectedCategory: string;
  searchQuery: string;

  // Cart
  cart: CartItem[];
  cartTotal: number;
  cartItemCount: number;

  // Actions
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  addToCart: (product: Product | Omit<Product, "detail">) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartItemQuantity: (productId: string) => number;
  updateCartTotals: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  // Initial state
  products,
  selectedCategory: "All",
  searchQuery: "",
  cart: [],
  cartTotal: 0,
  cartItemCount: 0,

  // Product filtering actions
  setSelectedCategory: (category: string) => {
    set({ selectedCategory: category });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  // Cart actions
  addToCart: (product: Product | Omit<Product, "detail">) => {
    const { cart } = get();
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      // Update quantity if item already exists
      const updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      set({ cart: updatedCart });
    } else {
      // Add new item to cart
      const newCartItem: CartItem = {
        ...product,
        detail: "detail" in product ? product.detail : "",
        quantity: 1,
      };
      set({ cart: [...cart, newCartItem] });
    }

    // Update cart totals
    get().updateCartTotals();
  },

  removeFromCart: (productId: string) => {
    const { cart } = get();
    const updatedCart = cart.filter((item) => item.id !== productId);
    set({ cart: updatedCart });
    get().updateCartTotals();
  },

  updateCartItemQuantity: (productId: string, quantity: number) => {
    const { cart } = get();

    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }

    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );

    set({ cart: updatedCart });
    get().updateCartTotals();
  },

  clearCart: () => {
    set({ cart: [], cartTotal: 0, cartItemCount: 0 });
  },

  getCartItemQuantity: (productId: string) => {
    const { cart } = get();
    const item = cart.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  },

  // Helper function to update cart totals
  updateCartTotals: () => {
    const { cart } = get();
    const total = cart.reduce((sum, item) => {
      const price =
        typeof item.price === "string" ? parseFloat(item.price) : item.price;
      return sum + price * item.quantity;
    }, 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    set({ cartTotal: total, cartItemCount: itemCount });
  },
}));

// Selector hooks for better performance
export const useProducts = () =>
  useStore((state) => ({
    products: state.products,
    selectedCategory: state.selectedCategory,
    searchQuery: state.searchQuery,
    setSelectedCategory: state.setSelectedCategory,
    setSearchQuery: state.setSearchQuery,
  }));

export const useCart = () =>
  useStore((state) => ({
    cart: state.cart,
    cartTotal: state.cartTotal,
    cartItemCount: state.cartItemCount,
    addToCart: state.addToCart,
    removeFromCart: state.removeFromCart,
    updateCartItemQuantity: state.updateCartItemQuantity,
    clearCart: state.clearCart,
    getCartItemQuantity: state.getCartItemQuantity,
  }));

// Get filtered products - this is now a computed value, not stored state
export const useFilteredProducts = () => {
  const { products, selectedCategory, searchQuery } = useStore();

  let filtered = products;

  // Filter by category
  if (selectedCategory !== "All") {
    filtered = filtered.filter(
      (product) => product.category === selectedCategory
    );
  }

  // Filter by search query
  if (searchQuery.trim()) {
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return filtered;
};

// Get unique categories for filtering
export const getCategories = () => {
  const categories = [
    "All",
    ...Array.from(new Set(products.map((product) => product.category))),
  ];
  return categories;
};
