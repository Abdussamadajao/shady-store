import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Truck, Shield } from "lucide-react";

export type PaymentMethod = "STRIPE" | "CASH_ON_DELIVERY";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange,
}) => {
  const paymentMethods = [
    {
      id: "STRIPE" as PaymentMethod,
      title: "Pay Online",
      description: "Credit/Debit Card, Bank Transfer",
      icon: CreditCard,
      badge: "Secure",
      badgeColor: "bg-green-100 text-green-800",
    },
    {
      id: "CASH_ON_DELIVERY" as PaymentMethod,
      title: "Cash on Delivery",
      description: "Pay when your order arrives",
      icon: Truck,
      badge: "Popular",
      badgeColor: "bg-secondary-100 text-secondary",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Payment Method
        </CardTitle>
        <p className="text-sm text-gray-600">
          Choose how you'd like to pay for your order
        </p>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedMethod}
          onValueChange={(value) => onMethodChange(value as PaymentMethod)}
          className="space-y-3"
        >
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <div
                key={method.id}
                className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all ${
                  selectedMethod === method.id
                    ? "border-secondary bg-secondary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <RadioGroupItem
                  value={method.id}
                  id={method.id}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label
                    htmlFor={method.id}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <Icon className="h-5 w-5 text-gray-600" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {method.title}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${method.badgeColor}`}
                        >
                          {method.badge}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {method.description}
                      </p>
                    </div>
                  </Label>
                </div>
              </div>
            );
          })}
        </RadioGroup>

        {selectedMethod === "CASH_ON_DELIVERY" && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">
                  Cash on Delivery Information
                </p>
                <ul className="text-blue-800 space-y-1">
                  <li>• Have exact change ready for your order</li>
                  <li>• Payment is due upon delivery</li>
                  <li>• Delivery agent will provide receipt</li>
                  <li>• Orders may take 1-2 business days longer</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentMethodSelector;
