import type { CartItem } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartStore {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  calculateTotals: () => void;
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  syncCart: (serverItems: CartItem[]) => void;
  clearCart: () => void;
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      // Calculate totals
      calculateTotals: () => {
        const { items } = get();
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = items.reduce(
          (sum, item) =>
            sum + parseFloat(item?.product?.price || "0") * item.quantity,
          0
        );
        set({ totalItems, totalPrice });
      },

      // Optimistic add to cart
      addToCart: (item) => {
        set((state) => {
          const existingItem = state.items?.find(
            (i) => i.productId === item.productId
          );
          let newItems;

          if (existingItem) {
            newItems = state.items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                : i
            );
          } else {
            newItems = [
              ...state.items,
              { ...item, quantity: item.quantity || 1 },
            ];
          }

          return { items: newItems };
        });
        get().calculateTotals();
      },

      // Optimistic update quantity
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
        get().calculateTotals();
      },

      // Optimistic remove from cart
      removeFromCart: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
        get().calculateTotals();
      },

      // Sync with server state (for error recovery)
      syncCart: (serverItems) => {
        set((state: any) => {
          const localItems = state.items;
          // Ensure serverItems is an array
          const serverItemsArray = Array.isArray(serverItems)
            ? serverItems
            : [];

          const mergedItems = localItems.map((localItem: CartItem) => {
            const serverItem = serverItemsArray.find(
              (si: CartItem) => si.productId === localItem.productId
            );
            return serverItem ? { ...localItem, ...serverItem } : localItem;
          });

          // Add any server items not in local cart
          serverItemsArray.forEach((serverItem: CartItem) => {
            if (
              !mergedItems.find((item: CartItem) => item.id === serverItem.id)
            ) {
              mergedItems.push(serverItem);
            }
          });

          return { items: mergedItems };
        });
        get().calculateTotals();
      },

      // Clear cart
      clearCart: () => {
        set({ items: [], totalItems: 0, totalPrice: 0 });
      },
    }),
    {
      name: "cart-storage", // unique name for localStorage key
      partialize: (state) => ({ items: state.items }), // only persist items
    }
  )
);

export default useCartStore;
