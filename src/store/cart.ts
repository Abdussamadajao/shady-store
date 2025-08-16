import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, CartResponse } from "@/types";
import { useAuthStore } from "@/store/auth";
import { addToCart as addToCartAPI } from "@/api/service/cart";

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
  lastSynced: string | null;
  pendingSync: boolean;
  isSyncing: boolean;
}

interface CartActions {
  // Core cart operations
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  calculateTotals: () => void;

  // API data management
  setCartData: (data: CartResponse) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  refreshCart: () => void;

  // Internal sync management
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
  markPendingSync: () => void;
  markSynced: () => void;
  isSyncInProgress: () => boolean;
  startSync: () => void;

  // Background sync (internal)
  syncToDatabase: () => Promise<void>;
  triggerBackgroundSync: () => void;
  testAPI: () => Promise<void>;
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

// Local storage key
const CART_STORAGE_KEY = "pick-bazar-cart";

// Global sync lock to prevent multiple simultaneous syncs
let globalSyncInProgress = false;

// Background sync function that runs independently
let backgroundSyncTimeout: NodeJS.Timeout | null = null;

const performBackgroundSync = async () => {
  if (globalSyncInProgress) {
    console.log("Background sync already in progress, skipping...");
    return;
  }

  console.log("Checking authentication status...");

  // DEBUG MODE: Temporarily bypass authentication for testing
  const DEBUG_MODE = true;
  let isAuthenticated = false;

  if (DEBUG_MODE) {
    console.log("DEBUG MODE: Bypassing authentication check");
    isAuthenticated = true;
  } else {
    // Get auth state directly from the store
    try {
      const authState = useAuthStore.getState();
      isAuthenticated = authState.isAuthenticated;
      console.log("Auth state:", authState);
    } catch (error) {
      console.error("Failed to get auth state:", error);
    }
  }

  if (!isAuthenticated) {
    console.log("User not authenticated, skipping background sync");
    return;
  }

  console.log("User is authenticated, proceeding with sync...");

  // Get the current store state directly
  const currentState = useCartStore.getState();
  if (!currentState.pendingSync || !currentState.items.length) {
    console.log("No pending sync or no items to sync");
    return;
  }

  try {
    globalSyncInProgress = true;
    currentState.startSync();
    console.log("Starting background sync...");

    // Get items that need to be synced (items with temp IDs)
    const tempItems = currentState.items.filter((item: CartItem) =>
      item.id.startsWith("temp-")
    );

    console.log("Items to sync:", tempItems);

    if (tempItems.length === 0) {
      console.log("No temporary items to sync");
      currentState.markSynced();
      return;
    }

    console.log("Calling API for each item...");

    for (const item of tempItems) {
      try {
        console.log(`Syncing item: ${item.productId} (${item.quantity})`);
        console.log("API function available:", typeof addToCartAPI);

        const result = await addToCartAPI({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        });

        console.log(`Successfully synced item: ${item.productId}`, result);
      } catch (error) {
        console.error(
          `Failed to sync item ${item.productId} to database:`,
          error
        );
        // Log more details about the error
        if (error instanceof Error) {
          console.error("Error details:", {
            message: error.message,
            stack: error.stack,
            name: error.name,
          });
        }
      }
    }

    // Mark as synced
    currentState.markSynced();
    console.log("Background sync completed");
  } catch (error) {
    console.error("Background sync failed:", error);
  } finally {
    globalSyncInProgress = false;
  }
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,
      isLoading: false,
      error: null,
      lastSynced: null,
      pendingSync: false,
      isSyncing: false,

      // Core cart operations with immediate updates
      addToCart: (product, quantity = 1) => {
        console.log("Adding to cart:", { product, quantity });
        const { items } = get();
        const existingItem = items.find(
          (item) => item.productId === product.id
        );

        if (existingItem) {
          console.log("Item already exists, updating quantity");
          // Update quantity if item already exists
          const updatedItems = items.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
          set({ items: updatedItems });
        } else {
          console.log("Adding new item to cart");
          // Add new item to cart
          const newItem: CartItem = {
            id: `temp-${product.id}-${Date.now()}`, // Temporary ID for immediate feedback
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
              images: product.images.map((img: any, index: number) => ({
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
        get().saveToLocalStorage();
        get().markPendingSync();
        console.log("About to trigger background sync...");
        get().triggerBackgroundSync();
        console.log("Cart updated, pendingSync set to true");
      },

      removeFromCart: (productId) => {
        const { items } = get();
        const updatedItems = items.filter(
          (item) => item.productId !== productId
        );
        set({ items: updatedItems });
        get().calculateTotals();
        get().saveToLocalStorage();
        get().markPendingSync();
        get().triggerBackgroundSync();
      },

      updateQuantity: (productId, quantity) => {
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
        get().saveToLocalStorage();
        get().markPendingSync();
        get().triggerBackgroundSync();
      },

      clearCart: () => {
        set({ items: [], total: 0, itemCount: 0 });
        get().saveToLocalStorage();
        get().markPendingSync();
        get().triggerBackgroundSync();
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

      // API data management
      setCartData: (data: CartResponse) => {
        set({
          items: data.items,
          total: data.subtotal,
          itemCount: data.itemCount,
          error: null,
          lastSynced: new Date().toISOString(),
          pendingSync: false,
        });
        get().saveToLocalStorage();
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      refreshCart: () => {
        set({ error: null });
      },

      // Internal sync management
      saveToLocalStorage: () => {
        const { items, total, itemCount } = get();
        try {
          const cartData = {
            items,
            total,
            itemCount,
            timestamp: new Date().toISOString(),
          };
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
        } catch (error) {
          console.error("Failed to save cart to localStorage:", error);
        }
      },

      loadFromLocalStorage: () => {
        try {
          const stored = localStorage.getItem(CART_STORAGE_KEY);
          if (stored) {
            const cartData = JSON.parse(stored);
            if (cartData.items && Array.isArray(cartData.items)) {
              set({
                items: cartData.items,
                total: cartData.total || 0,
                itemCount: cartData.itemCount || 0,
              });
              get().calculateTotals();
            }
          }
        } catch (error) {
          console.error("Failed to load cart from localStorage:", error);
        }
      },

      markPendingSync: () => {
        console.log("Marking pending sync");
        if (!globalSyncInProgress) {
          set({ pendingSync: true });
        } else {
          console.log("Sync already in progress, skipping pending sync mark");
        }
      },

      markSynced: () => {
        console.log("Marking as synced");
        globalSyncInProgress = false;
        set({
          pendingSync: false,
          lastSynced: new Date().toISOString(),
        });
      },

      isSyncInProgress: () => {
        return globalSyncInProgress;
      },

      startSync: () => {
        globalSyncInProgress = true;
        console.log("Starting sync process...");
      },

      // Internal background sync trigger
      triggerBackgroundSync: () => {
        console.log("Triggering background sync...");

        // Clear any existing timeout
        if (backgroundSyncTimeout) {
          clearTimeout(backgroundSyncTimeout);
          console.log("Cleared existing sync timeout");
        }

        // Schedule background sync with delay to batch rapid changes
        backgroundSyncTimeout = setTimeout(() => {
          console.log(
            "Background sync timeout fired, calling performBackgroundSync"
          );
          performBackgroundSync();
        }, 1000);

        console.log("Background sync scheduled for 1 second from now");
      },

      // Manual sync trigger (for testing/debugging)
      syncToDatabase: async () => {
        console.log("Manual sync triggered");
        await performBackgroundSync();
      },

      // Test method to check if API is working
      testAPI: async () => {
        console.log("Testing API connection...");
        try {
          const result = await addToCartAPI({
            productId: "test-product",
            quantity: 1,
          });
          console.log("API test successful:", result);
        } catch (error) {
          console.error("API test failed:", error);
        }
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        total: state.total,
        itemCount: state.itemCount,
        lastSynced: state.lastSynced,
        pendingSync: state.pendingSync,
      }),
    }
  )
);

// Selector hooks for better performance
export const useCartItems = () => useCartStore((state) => state.items);
export const useCartTotal = () => useCartStore((state) => state.total);
export const useCartItemCount = () => useCartStore((state) => state.itemCount);
export const useCartLoading = () => useCartStore((state) => state.isLoading);
export const useCartError = () => useCartStore((state) => state.error);
export const useCartPendingSync = () =>
  useCartStore((state) => state.pendingSync);
export const useCartLastSynced = () =>
  useCartStore((state) => state.lastSynced);
export const useCartIsSyncing = () => useCartStore((state) => state.isSyncing);
