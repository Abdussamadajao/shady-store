import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AddressStore {
  selectedAddressId: string | null;
  setSelectedAddressId: (addressId: string) => void;
}

export const useAddressStore = create<AddressStore>()(
  persist(
    (set) => ({
      selectedAddressId: null,
      setSelectedAddressId: (addressId) =>
        set({ selectedAddressId: addressId }),
    }),
    {
      name: "address-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
