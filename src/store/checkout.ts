import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ===== PAYMENT TYPES =====
export type PaymentMethod = "STRIPE" | "CASH_ON_DELIVERY";

// ===== DELIVERY TYPES & STORE =====
export interface DeliveryOption {
  id: string;
  label: string;
  description: string;
  time: string;
  price: number;
  taxRate: number; // Tax rate as decimal (e.g., 0.075 for 7.5%)
  isAvailable: boolean;
}

export interface DeliveryPreferences {
  selectedTimeId: string;
  deliveryInstructions: string;
  preferredDate: string | null;
}

// ===== MAIN CHECKOUT STATE =====
interface CheckoutState {
  // Delivery state
  deliveryOptions: DeliveryOption[];
  deliveryPreferences: DeliveryPreferences;
  // Payment state
  selectedPaymentMethod: PaymentMethod;
}

// ===== MAIN CHECKOUT ACTIONS =====
interface CheckoutActions {
  // Delivery actions
  setSelectedTime: (timeId: string) => void;
  setDeliveryInstructions: (instructions: string) => void;
  setPreferredDate: (date: string | null) => void;
  resetDeliveryPreferences: () => void;
  getSelectedDeliveryOption: () => DeliveryOption | undefined;
  isDeliveryTimeSelected: () => boolean;

  // Payment actions
  setPaymentMethod: (method: PaymentMethod) => void;

  // Utility actions
  resetAll: () => void;
  isCheckoutComplete: () => boolean;
}

type CheckoutStore = CheckoutState & CheckoutActions;

// Simplified delivery options with only Express and Standard
const defaultDeliveryOptions: DeliveryOption[] = [
  {
    id: "express",
    label: "Express Delivery",
    description: "90-minute guaranteed delivery",
    time: "90 min",
    price: 1500, // ₦1,500
    taxRate: 0.075, // 7.5% tax for express delivery
    isAvailable: true,
  },
  {
    id: "standard",
    label: "Standard Delivery",
    description: "Next business day delivery",
    time: "Next Day",
    price: 500, // ₦500
    taxRate: 0.05, // 5% tax for standard delivery
    isAvailable: true,
  },
];

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set, get) => ({
      // ===== INITIAL STATE =====
      deliveryOptions: defaultDeliveryOptions,
      deliveryPreferences: {
        selectedTimeId: "standard", // Default to standard delivery
        deliveryInstructions: "",
        preferredDate: null,
      },
      selectedPaymentMethod: "STRIPE" as PaymentMethod,

      // ===== DELIVERY ACTIONS =====
      setSelectedTime: (timeId) => {
        set((state) => ({
          deliveryPreferences: {
            ...state.deliveryPreferences,
            selectedTimeId: timeId,
          },
        }));
      },

      setDeliveryInstructions: (instructions) => {
        set((state) => ({
          deliveryPreferences: {
            ...state.deliveryPreferences,
            deliveryInstructions: instructions,
          },
        }));
      },

      setPreferredDate: (date) => {
        set((state) => ({
          deliveryPreferences: {
            ...state.deliveryPreferences,
            preferredDate: date,
          },
        }));
      },

      resetDeliveryPreferences: () => {
        set((state) => ({
          ...state,
          deliveryPreferences: {
            selectedTimeId: "standard",
            deliveryInstructions: "",
            preferredDate: null,
          },
        }));
      },

      getSelectedDeliveryOption: () => {
        const { deliveryOptions, deliveryPreferences } = get();
        return deliveryOptions.find(
          (option) => option.id === deliveryPreferences.selectedTimeId
        );
      },

      isDeliveryTimeSelected: () => {
        const { deliveryPreferences } = get();
        return !!deliveryPreferences.selectedTimeId;
      },

      // ===== PAYMENT ACTIONS =====
      setPaymentMethod: (method) => {
        set((state) => ({
          ...state,
          selectedPaymentMethod: method,
        }));
      },

      // ===== UTILITY ACTIONS =====
      resetAll: () => {
        set({
          deliveryPreferences: {
            selectedTimeId: "standard",
            deliveryInstructions: "",
            preferredDate: null,
          },
          selectedPaymentMethod: "STRIPE" as PaymentMethod,
        });
      },

      isCheckoutComplete: () => {
        const { deliveryPreferences } = get();
        return !!deliveryPreferences.selectedTimeId;
      },
    }),
    {
      name: "checkout-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        deliveryPreferences: state.deliveryPreferences,
        selectedPaymentMethod: state.selectedPaymentMethod,
      }),
    }
  )
);

// ===== SELECTOR HOOKS =====

// Delivery selectors
export const useDeliveryOptions = () =>
  useCheckoutStore((state) => state.deliveryOptions);
export const useDeliveryPreferences = () =>
  useCheckoutStore((state) => state.deliveryPreferences);
export const useSelectedDeliveryTime = () =>
  useCheckoutStore((state) => state.deliveryPreferences.selectedTimeId);
export const useSelectedDeliveryOption = () =>
  useCheckoutStore((state) =>
    state.deliveryOptions.find(
      (option) => option.id === state.deliveryPreferences.selectedTimeId
    )
  );

// Delivery fee selector
export const useDeliveryFee = () =>
  useCheckoutStore((state) => {
    const selectedOption = state.deliveryOptions.find(
      (option) => option.id === state.deliveryPreferences.selectedTimeId
    );
    return selectedOption?.price || 0;
  });

// Tax rate selector
export const useTaxRate = () =>
  useCheckoutStore((state) => {
    const selectedOption = state.deliveryOptions.find(
      (option) => option.id === state.deliveryPreferences.selectedTimeId
    );
    return selectedOption?.taxRate || 0;
  });

// Calculated tax amount selector (requires subtotal parameter)
export const useTaxAmount = (subtotal: number) =>
  useCheckoutStore((state) => {
    const selectedOption = state.deliveryOptions.find(
      (option) => option.id === state.deliveryPreferences.selectedTimeId
    );
    const taxRate = selectedOption?.taxRate || 0;
    return subtotal * taxRate;
  });

// Delivery instructions selector
export const useDeliveryInstructions = () =>
  useCheckoutStore((state) => state.deliveryPreferences.deliveryInstructions);

// Payment method selectors
export const useSelectedPaymentMethod = () =>
  useCheckoutStore((state) => state.selectedPaymentMethod);
