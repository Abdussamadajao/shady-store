import { create } from "zustand";
import { persist } from "zustand/middleware";
interface PaymentStore {
  paymentId: string;
  setPaymentId: (paymentId: string) => void;
  orderId: string;
  clientSecret: string;
  paymentIntentId: string;
  setOrderId: (orderId: string) => void;
  setClientSecret: (clientSecret: string) => void;
  setPaymentIntentId: (paymentIntentId: string) => void;
}

export const usePaymentStore = create<PaymentStore>()(
  persist(
    (set) => ({
      paymentId: "",
      setPaymentId: (paymentId: string) => set({ paymentId }),
      orderId: "",
      setOrderId: (orderId: string) => set({ orderId }),
      clientSecret: "",
      setClientSecret: (clientSecret: string) => set({ clientSecret }),
      paymentIntentId: "",
      setPaymentIntentId: (paymentIntentId: string) => set({ paymentIntentId }),
    }),
    {
      name: "payment-store",
    }
  )
);
