import { useState } from "react";

interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

export const usePaymentForm = () => {
  const [paymentForm, setPaymentForm] = useState<PaymentFormData>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  const handleCardNumberChange = (value: string) => {
    // Format card number with spaces every 4 digits
    const formatted = value
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();
    setPaymentForm({ ...paymentForm, cardNumber: formatted });
  };

  const handleExpiryDateChange = (value: string) => {
    // Format expiry date as MM/YY
    const formatted = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2");
    setPaymentForm({ ...paymentForm, expiryDate: formatted });
  };

  const handleCVVChange = (value: string) => {
    // Only allow 3-4 digits
    const formatted = value.replace(/\D/g, "").slice(0, 4);
    setPaymentForm({ ...paymentForm, cvv: formatted });
  };

  const setCardholderName = (value: string) => {
    setPaymentForm({ ...paymentForm, cardholderName: value });
  };

  const isPaymentComplete =
    paymentForm.cardNumber &&
    paymentForm.expiryDate &&
    paymentForm.cvv &&
    paymentForm.cardholderName;

  return {
    paymentForm,
    setPaymentForm,
    handleCardNumberChange,
    handleExpiryDateChange,
    handleCVVChange,
    setCardholderName,
    isPaymentComplete,
  };
};
