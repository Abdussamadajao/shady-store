import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ===== ADDRESS TYPES & STORE =====
export interface Address {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  createdAt: Date;
}

// ===== CONTACT TYPES & STORE =====
export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  isDefault: boolean;
  createdAt: Date;
}

// ===== PAYMENT TYPES & STORE =====
export interface PaymentInfo {
  id: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  isDefault: boolean;
  createdAt: Date;
}

// ===== DELIVERY TYPES & STORE =====
export interface DeliveryOption {
  id: string;
  label: string;
  description: string;
  time: string;
  price: number;
  isAvailable: boolean;
}

export interface DeliveryPreferences {
  selectedTimeId: string;
  deliveryInstructions: string;
  preferredDate: string | null;
}

// ===== MAIN CHECKOUT STATE =====
interface CheckoutState {
  // Address state
  addresses: Address[];
  selectedAddressId: string | null;

  // Contact state
  contacts: Contact[];
  selectedContactId: string | null;

  // Payment state
  paymentMethods: PaymentInfo[];
  selectedPaymentId: string | null;

  // Delivery state
  deliveryOptions: DeliveryOption[];
  deliveryPreferences: DeliveryPreferences;
}

// ===== MAIN CHECKOUT ACTIONS =====
interface CheckoutActions {
  // Address actions
  addAddress: (
    address: Omit<Address, "id" | "isDefault" | "createdAt">
  ) => void;
  updateAddress: (
    id: string,
    updates: Partial<Omit<Address, "id" | "createdAt">>
  ) => void;
  deleteAddress: (id: string) => void;
  selectAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  clearAddresses: () => void;
  getAddressById: (id: string) => Address | undefined;
  getDefaultAddress: () => Address | undefined;

  // Contact actions
  addContact: (
    contact: Omit<Contact, "id" | "isDefault" | "createdAt">
  ) => void;
  updateContact: (
    id: string,
    updates: Partial<Omit<Contact, "id" | "createdAt">>
  ) => void;
  deleteContact: (id: string) => void;
  selectContact: (id: string) => void;
  setDefaultContact: (id: string) => void;
  clearContacts: () => void;
  getContactById: (id: string) => Contact | undefined;
  getDefaultContact: () => Contact | undefined;

  // Payment actions
  addPaymentMethod: (
    payment: Omit<PaymentInfo, "id" | "isDefault" | "createdAt">
  ) => void;
  updatePaymentMethod: (
    id: string,
    updates: Partial<Omit<PaymentInfo, "id" | "createdAt">>
  ) => void;
  deletePaymentMethod: (id: string) => void;
  selectPaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;
  clearPaymentMethods: () => void;
  getPaymentMethodById: (id: string) => PaymentInfo | undefined;
  getDefaultPaymentMethod: () => PaymentInfo | undefined;
  validatePaymentInfo: (
    payment: Omit<PaymentInfo, "id" | "isDefault" | "createdAt">
  ) => { isValid: boolean; errors: string[] };

  // Delivery actions
  setSelectedTime: (timeId: string) => void;
  setDeliveryInstructions: (instructions: string) => void;
  setPreferredDate: (date: string | null) => void;
  resetDeliveryPreferences: () => void;
  getSelectedDeliveryOption: () => DeliveryOption | undefined;
  isDeliveryTimeSelected: () => boolean;

  // Utility actions
  resetAll: () => void;
  isCheckoutComplete: () => boolean;
}

type CheckoutStore = CheckoutState & CheckoutActions;

// Default delivery options
const defaultDeliveryOptions: DeliveryOption[] = [
  {
    id: "express",
    label: "Express-Delivery",
    description: "90 min express delivery",
    time: "90 min",
    price: 1500, // ₦1,500
    isAvailable: true,
  },
  {
    id: "8am-11am",
    label: "8am-11am",
    description: "8.00 AM - 11.00 AM",
    time: "8.00 AM - 11.00 AM",
    price: 800, // ₦800
    isAvailable: true,
  },
  {
    id: "11am-2pm",
    label: "11am-2pm",
    description: "11.00 AM - 2.00 PM",
    time: "11.00 AM - 2.00 PM",
    price: 800, // ₦800
    isAvailable: true,
  },
  {
    id: "2pm-5pm",
    label: "2pm-5pm",
    description: "2.00 PM - 5.00 PM",
    time: "2.00 PM - 5.00 PM",
    price: 800, // ₦800
    isAvailable: true,
  },
  {
    id: "5pm-8pm",
    label: "5pm-8pm",
    description: "5.00 PM - 8.00 PM",
    time: "5.00 PM - 8.00 PM",
    price: 800, // ₦800
    isAvailable: true,
  },
  {
    id: "next-day",
    label: "Next Day",
    description: "Next Day",
    time: "Next Day",
    price: 500, // ₦500
    isAvailable: true,
  },
];

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set, get) => ({
      // ===== INITIAL STATE =====
      addresses: [],
      selectedAddressId: null,
      contacts: [],
      selectedContactId: null,
      paymentMethods: [],
      selectedPaymentId: null,
      deliveryOptions: defaultDeliveryOptions,
      deliveryPreferences: {
        selectedTimeId: "express",
        deliveryInstructions: "",
        preferredDate: null,
      },

      // ===== ADDRESS ACTIONS =====
      addAddress: (addressData) => {
        const { addresses } = get();
        const newAddress: Address = {
          id: Date.now().toString(),
          ...addressData,
          isDefault: addresses.length === 0,
          createdAt: new Date(),
        };

        set((state) => ({
          addresses: [...state.addresses, newAddress],
          selectedAddressId:
            addresses.length === 0 ? newAddress.id : state.selectedAddressId,
        }));
      },

      updateAddress: (id, updates) => {
        set((state) => ({
          addresses: state.addresses.map((addr) =>
            addr.id === id ? { ...addr, ...updates } : addr
          ),
        }));
      },

      deleteAddress: (id) => {
        const { addresses, selectedAddressId } = get();
        const updatedAddresses = addresses.filter((addr) => addr.id !== id);

        let newSelectedId = selectedAddressId;
        if (selectedAddressId === id) {
          newSelectedId =
            updatedAddresses.length > 0 ? updatedAddresses[0].id : null;
        }

        const deletedAddress = addresses.find((addr) => addr.id === id);
        if (deletedAddress?.isDefault && updatedAddresses.length > 0) {
          updatedAddresses[0].isDefault = true;
        }

        set({
          addresses: updatedAddresses,
          selectedAddressId: newSelectedId,
        });
      },

      selectAddress: (id) => {
        set({ selectedAddressId: id });
      },

      setDefaultAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.map((addr) => ({
            ...addr,
            isDefault: addr.id === id,
          })),
        }));
      },

      clearAddresses: () => {
        set({ addresses: [], selectedAddressId: null });
      },

      getAddressById: (id) => {
        const { addresses } = get();
        return addresses.find((addr) => addr.id === id);
      },

      getDefaultAddress: () => {
        const { addresses } = get();
        return addresses.find((addr) => addr.isDefault);
      },

      // ===== CONTACT ACTIONS =====
      addContact: (contactData) => {
        const { contacts } = get();
        const newContact: Contact = {
          id: Date.now().toString(),
          ...contactData,
          isDefault: contacts.length === 0,
          createdAt: new Date(),
        };

        set((state) => ({
          contacts: [...state.contacts, newContact],
          selectedContactId:
            contacts.length === 0 ? newContact.id : state.selectedContactId,
        }));
      },

      updateContact: (id, updates) => {
        set((state) => ({
          contacts: state.contacts.map((contact) =>
            contact.id === id ? { ...contact, ...updates } : contact
          ),
        }));
      },

      deleteContact: (id) => {
        const { contacts, selectedContactId } = get();
        const updatedContacts = contacts.filter((contact) => contact.id !== id);

        let newSelectedId = selectedContactId;
        if (selectedContactId === id) {
          newSelectedId =
            updatedContacts.length > 0 ? updatedContacts[0].id : null;
        }

        const deletedContact = contacts.find((contact) => contact.id === id);
        if (deletedContact?.isDefault && updatedContacts.length > 0) {
          updatedContacts[0].isDefault = true;
        }

        set({
          contacts: updatedContacts,
          selectedContactId: newSelectedId,
        });
      },

      selectContact: (id) => {
        set({ selectedContactId: id });
      },

      setDefaultContact: (id) => {
        set((state) => ({
          contacts: state.contacts.map((contact) => ({
            ...contact,
            isDefault: contact.id === id,
          })),
        }));
      },

      clearContacts: () => {
        set({ contacts: [], selectedContactId: null });
      },

      getContactById: (id) => {
        const { contacts } = get();
        return contacts.find((contact) => contact.id === id);
      },

      getDefaultContact: () => {
        const { contacts } = get();
        return contacts.find((contact) => contact.isDefault);
      },

      // ===== PAYMENT ACTIONS =====
      addPaymentMethod: (paymentData) => {
        const { paymentMethods } = get();
        const newPayment: PaymentInfo = {
          id: Date.now().toString(),
          ...paymentData,
          isDefault: paymentMethods.length === 0,
          createdAt: new Date(),
        };

        set((state) => ({
          paymentMethods: [...state.paymentMethods, newPayment],
          selectedPaymentId:
            paymentMethods.length === 0
              ? newPayment.id
              : state.selectedPaymentId,
        }));
      },

      updatePaymentMethod: (id, updates) => {
        set((state) => ({
          paymentMethods: state.paymentMethods.map((payment) =>
            payment.id === id ? { ...payment, ...updates } : payment
          ),
        }));
      },

      deletePaymentMethod: (id) => {
        const { paymentMethods, selectedPaymentId } = get();
        const updatedPaymentMethods = paymentMethods.filter(
          (payment) => payment.id !== id
        );

        let newSelectedId = selectedPaymentId;
        if (selectedPaymentId === id) {
          newSelectedId =
            updatedPaymentMethods.length > 0
              ? updatedPaymentMethods[0].id
              : null;
        }

        const deletedPayment = paymentMethods.find(
          (payment) => payment.id === id
        );
        if (deletedPayment?.isDefault && updatedPaymentMethods.length > 0) {
          updatedPaymentMethods[0].isDefault = true;
        }

        set({
          paymentMethods: updatedPaymentMethods,
          selectedPaymentId: newSelectedId,
        });
      },

      selectPaymentMethod: (id) => {
        set({ selectedPaymentId: id });
      },

      setDefaultPaymentMethod: (id) => {
        set((state) => ({
          paymentMethods: state.paymentMethods.map((payment) => ({
            ...payment,
            isDefault: payment.id === id,
          })),
        }));
      },

      clearPaymentMethods: () => {
        set({ paymentMethods: [], selectedPaymentId: null });
      },

      getPaymentMethodById: (id) => {
        const { paymentMethods } = get();
        return paymentMethods.find((payment) => payment.id === id);
      },

      getDefaultPaymentMethod: () => {
        const { paymentMethods } = get();
        return paymentMethods.find((payment) => payment.isDefault);
      },

      validatePaymentInfo: (payment) => {
        const errors: string[] = [];

        if (!payment.cardholderName.trim()) {
          errors.push("Cardholder name is required");
        }

        if (!payment.cardNumber.replace(/\s/g, "").match(/^\d{13,19}$/)) {
          errors.push("Invalid card number");
        }

        if (!payment.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
          errors.push("Invalid expiry date (MM/YY)");
        }

        if (!payment.cvv.match(/^\d{3,4}$/)) {
          errors.push("Invalid CVV");
        }

        return {
          isValid: errors.length === 0,
          errors,
        };
      },

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
          deliveryPreferences: {
            selectedTimeId: "express",
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

      // ===== UTILITY ACTIONS =====
      resetAll: () => {
        set({
          addresses: [],
          selectedAddressId: null,
          contacts: [],
          selectedContactId: null,
          paymentMethods: [],
          selectedPaymentId: null,
          deliveryPreferences: {
            selectedTimeId: "express",
            deliveryInstructions: "",
            preferredDate: null,
          },
        });
      },

      isCheckoutComplete: () => {
        const {
          selectedAddressId,
          selectedContactId,
          selectedPaymentId,
          deliveryPreferences,
        } = get();
        return !!(
          selectedAddressId &&
          selectedContactId &&
          selectedPaymentId &&
          deliveryPreferences.selectedTimeId
        );
      },
    }),
    {
      name: "checkout-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        addresses: state.addresses,
        selectedAddressId: state.selectedAddressId,
        contacts: state.contacts,
        selectedContactId: state.selectedContactId,
        paymentMethods: state.paymentMethods,
        selectedPaymentId: state.selectedPaymentId,
        deliveryPreferences: state.deliveryPreferences,
      }),
    }
  )
);

// ===== SELECTOR HOOKS =====

// Address selectors
export const useAddresses = () => useCheckoutStore((state) => state.addresses);
export const useSelectedAddressId = () =>
  useCheckoutStore((state) => state.selectedAddressId);
export const useSelectedAddress = () =>
  useCheckoutStore((state) =>
    state.addresses.find((addr) => addr.id === state.selectedAddressId)
  );
export const useDefaultAddress = () =>
  useCheckoutStore((state) => state.addresses.find((addr) => addr.isDefault));

// Contact selectors
export const useContacts = () => useCheckoutStore((state) => state.contacts);
export const useSelectedContactId = () =>
  useCheckoutStore((state) => state.selectedContactId);
export const useSelectedContact = () =>
  useCheckoutStore((state) =>
    state.contacts.find((contact) => contact.id === state.selectedContactId)
  );
export const useDefaultContact = () =>
  useCheckoutStore((state) =>
    state.contacts.find((contact) => contact.isDefault)
  );

// Payment selectors
export const usePaymentMethods = () =>
  useCheckoutStore((state) => state.paymentMethods);
export const useSelectedPaymentId = () =>
  useCheckoutStore((state) => state.selectedPaymentId);
export const useSelectedPaymentMethod = () =>
  useCheckoutStore((state) =>
    state.paymentMethods.find(
      (payment) => payment.id === state.selectedPaymentId
    )
  );
export const useDefaultPaymentMethod = () =>
  useCheckoutStore((state) =>
    state.paymentMethods.find((payment) => payment.isDefault)
  );

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

// Action hooks
export const useCheckoutActions = () =>
  useCheckoutStore((state) => ({
    // Address actions
    addAddress: state.addAddress,
    updateAddress: state.updateAddress,
    deleteAddress: state.deleteAddress,
    selectAddress: state.selectAddress,
    setDefaultAddress: state.setDefaultAddress,
    clearAddresses: state.clearAddresses,
    getAddressById: state.getAddressById,
    getDefaultAddress: state.getDefaultAddress,

    // Contact actions
    addContact: state.addContact,
    updateContact: state.updateContact,
    deleteContact: state.deleteContact,
    selectContact: state.selectContact,
    setDefaultContact: state.setDefaultContact,
    clearContacts: state.clearContacts,
    getContactById: state.getContactById,
    getDefaultContact: state.getDefaultContact,

    // Payment actions
    addPaymentMethod: state.addPaymentMethod,
    updatePaymentMethod: state.updatePaymentMethod,
    deletePaymentMethod: state.deletePaymentMethod,
    selectPaymentMethod: state.selectPaymentMethod,
    setDefaultPaymentMethod: state.setDefaultPaymentMethod,
    clearPaymentMethods: state.clearPaymentMethods,
    getPaymentMethodById: state.getPaymentMethodById,
    getDefaultPaymentMethod: state.getDefaultPaymentMethod,
    validatePaymentInfo: state.validatePaymentInfo,

    // Delivery actions
    setSelectedTime: state.setSelectedTime,
    setDeliveryInstructions: state.setDeliveryInstructions,
    setPreferredDate: state.setPreferredDate,
    resetDeliveryPreferences: state.resetDeliveryPreferences,
    getSelectedDeliveryOption: state.getSelectedDeliveryOption,
    isDeliveryTimeSelected: state.isDeliveryTimeSelected,

    // Utility actions
    resetAll: state.resetAll,
    isCheckoutComplete: state.isCheckoutComplete,
  }));
