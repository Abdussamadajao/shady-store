import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { usePaymentForm } from "./usePaymentForm";

const PaymentForm: React.FC = () => {
  const {
    paymentForm,
    handleCardNumberChange,
    handleExpiryDateChange,
    handleCVVChange,
    setCardholderName,
    isPaymentComplete,
  } = usePaymentForm();

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
              isPaymentComplete ? "bg-secondary" : "bg-gray-400"
            }`}
          >
            {isPaymentComplete ? <Check className="h-5 w-5" /> : "4"}
          </div>
          <CardTitle className="text-lg">Payment</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="cardholderName">Cardholder Name</Label>
            <Input
              id="cardholderName"
              value={paymentForm.cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              placeholder="Enter cardholder name"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              value={paymentForm.cardNumber}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />
          </div>
          <div>
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              value={paymentForm.expiryDate}
              onChange={(e) => handleExpiryDateChange(e.target.value)}
              placeholder="MM/YY"
              maxLength={5}
            />
          </div>
          <div>
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              value={paymentForm.cvv}
              onChange={(e) => handleCVVChange(e.target.value)}
              placeholder="123"
              maxLength={4}
            />
          </div>
        </div>
        <p className="text-sm text-gray-600">
          By making this purchase you agree to our{" "}
          <span className="text-red-600 font-medium">terms and conditions</span>
          .
        </p>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
