import { create } from "zustand";
import type { CartItem, CartResponse } from "@/types";

// Legacy interface for backward compatibility
export interface LegacyCartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  category: string;
  images: string[];
  quantity: number;
  addedAt: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isLoading: boolean;
  error: string | null;
  lastSynced: Date | null;
}

interface CartActions {
  // Legacy methods for backward compatibility
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  calculateTotals: () => void;

  // New API-based methods
  setCartData: (data: CartResponse) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  refreshCart: () => void;

  // Utility methods
  getCartItemById: (id: string) => CartItem | undefined;
  getCartItemByProductId: (productId: string) => CartItem | undefined;
  hasItem: (productId: string) => boolean;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

type CartStore = CartState & CartActions;

const calculateTotals = (items: CartItem[]) => {
  const total = items.reduce((sum, item) => {
    const price = Number(item.product.price);
    return sum + price * item.quantity;
  }, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
};

export const useCartStoreEnhanced = create<CartStore>()((set, get) => ({
  items: [],
  total: 0,
  itemCount: 0,
  isLoading: false,
  error: null,
  lastSynced: null,

  // Legacy methods - now use API calls
  addToCart: (product, quantity = 1) => {
    // This will be handled by the API hook in components
    // For now, we'll just update the local state optimistically
    const { items } = get();
    const existingItem = items.find((item) => item.productId === product.id);

    if (existingItem) {
      // Update quantity if item already exists
      const updatedItems = items.map((item) =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      set({ items: updatedItems });
    } else {
      // Add new item to cart (simplified for legacy compatibility)
      const newItem: CartItem = {
        id: `${product.id}-${Date.now()}`,
        userId: "temp-user-id", // Will be replaced by API
        productId: product.id,
        variantId: undefined,
        quantity,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        product: {
          id: product.id,
          name: product.name,
          price: product.price.toString(),
          images: product.images.map((img: string, index: number) => ({
            id: `${product.id}-img-${index}`,
            url: img,
            alt: product.name,
            sortOrder: index,
            isPrimary: index === 0,
          })),
          variants: [],
        },
      };
      const updatedItems = [...items, newItem];
      set({ items: updatedItems });
    }

    get().calculateTotals();
  },

  removeFromCart: (productId) => {
    // This will be handled by the API hook in components
    const { items } = get();
    const updatedItems = items.filter((item) => item.productId !== productId);
    set({ items: updatedItems });
    get().calculateTotals();
  },

  updateQuantity: (productId, quantity) => {
    // This will be handled by the API hook in components
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }

    const { items } = get();
    const updatedItems = items.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    set({ items: updatedItems });
    get().calculateTotals();
  },

  clearCart: () => {
    // This will be handled by the API hook in components
    set({ items: [], total: 0, itemCount: 0 });
  },

  getItemQuantity: (productId) => {
    const { items } = get();
    const item = items.find((item) => item.productId === productId);
    return item ? item.quantity : 0;
  },

  calculateTotals: () => {
    const { items } = get();
    const { total, itemCount } = calculateTotals(items);
    set({ total, itemCount });
  },

  // New API-based methods
  setCartData: (data: CartResponse) => {
    set({
      items: data.items,
      total: data.subtotal,
      itemCount: data.itemCount,
      error: null,
      lastSynced: new Date(),
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  refreshCart: () => {
    // This will trigger a refetch in components using the hook
    set({ error: null });
  },

  // Utility methods
  getCartItemById: (id: string) => {
    const { items } = get();
    return items.find((item) => item.id === id);
  },

  getCartItemByProductId: (productId: string) => {
    const { items } = get();
    return items.find((item) => item.productId === productId);
  },

  hasItem: (productId: string) => {
    const { items } = get();
    return items.some((item) => item.productId === productId);
  },

  getTotalItems: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getSubtotal: () => {
    const { items } = get();
    return items.reduce((sum, item) => {
      const price = Number(item.product.price);
      return sum + price * item.quantity;
    }, 0);
  },
}));

// Selector hooks for better performance
export const useCartItemsEnhanced = () =>
  useCartStoreEnhanced((state) => state.items);
export const useCartTotalEnhanced = () =>
  useCartStoreEnhanced((state) => state.total);
export const useCartItemCountEnhanced = () =>
  useCartStoreEnhanced((state) => state.itemCount);
export const useCartLoadingEnhanced = () =>
  useCartStoreEnhanced((state) => state.isLoading);
export const useCartErrorEnhanced = () =>
  useCartStoreEnhanced((state) => state.error);
export const useCartLastSyncedEnhanced = () =>
  useCartStoreEnhanced((state) => state.lastSynced);
