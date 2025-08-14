import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "../lib/product";
interface CartItem extends Omit<Product, "detail"> {
  quantity: number;
  detail?: string;
}

interface CartState {
  cart: CartItem[];
  cartTotal: number;
  cartItemCount: number;
}

interface CartActions {
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartItemQuantity: (productId: string) => number;
  recalculateTotals: () => void;
  syncWithStorage: () => void;
}

type CartStore = CartState & CartActions;

const calculateTotals = (cart: CartItem[]) => {
  const cartTotal = cart.reduce((sum, item) => {
    const price =
      typeof item.price === "string" ? parseFloat(item.price) : item.price;
    return sum + price * item.quantity;
  }, 0);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return { cartTotal, cartItemCount };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      cartTotal: 0,
      cartItemCount: 0,

      addToCart: (product) => {
        const { cart } = get();
        const existingItem = cart.find((item) => item.id === product.id);

        if (existingItem) {
          const updatedCart = cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
          set({
            cart: updatedCart,
            ...calculateTotals(updatedCart),
          });
        } else {
          const newCartItem: CartItem = {
            ...product,
            quantity: 1,
          };
          const updatedCart = [...cart, newCartItem];
          set({
            cart: updatedCart,
            ...calculateTotals(updatedCart),
          });
        }
      },

      removeFromCart: (productId) => {
        const { cart } = get();
        const updatedCart = cart.filter((item) => item.id !== productId);
        set({
          cart: updatedCart,
          ...calculateTotals(updatedCart),
        });
      },

      updateCartItemQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        const { cart } = get();
        const updatedCart = cart.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        );

        set({
          cart: updatedCart,
          ...calculateTotals(updatedCart),
        });
      },

      clearCart: () => {
        set({ cart: [], cartTotal: 0, cartItemCount: 0 });
      },

      getCartItemQuantity: (productId) => {
        const { cart } = get();
        const item = cart.find((item) => item.id === productId);
        return item ? item.quantity : 0;
      },

      recalculateTotals: () => {
        const { cart } = get();
        const { cartTotal, cartItemCount } = calculateTotals(cart);
        set({ cartTotal, cartItemCount });
      },

      syncWithStorage: () => {
        const { cart } = get();
        const { cartTotal, cartItemCount } = calculateTotals(cart);
        set({ cartTotal, cartItemCount });
        // Force a re-save to localStorage
        const store = get();
        localStorage.setItem(
          "cart-storage",
          JSON.stringify({
            state: { cart, cartTotal, cartItemCount },
            version: 0,
          })
        );
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      // @ts-ignore (for cSpell issue)
      partialize: (state: CartStore) => ({
        cart: state.cart,
        cartTotal: state.cartTotal,
        cartItemCount: state.cartItemCount,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Recalculate totals when rehydrating from storage
          const { cartTotal, cartItemCount } = calculateTotals(state.cart);
          state.cartTotal = cartTotal;
          state.cartItemCount = cartItemCount;
        }
      },
    }
  )
);

// Selector hooks
export const useCartItems = () => useCartStore((state) => state.cart);
export const useCartTotal = () => useCartStore((state) => state.cartTotal);
export const useCartItemCount = () =>
  useCartStore((state) => state.cartItemCount);
