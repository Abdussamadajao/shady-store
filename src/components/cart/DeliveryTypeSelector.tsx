import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useDeliveryOptions,
  useSelectedDeliveryTime,
  useCheckoutStore,
} from "@/store/checkout";
import { formatNGN } from "@/utils/currency";
import useCartStore from "@/store/cart";

const DeliveryTypeSelector: React.FC = () => {
  const deliveryOptions = useDeliveryOptions();
  const selectedTimeId = useSelectedDeliveryTime();
  const { setSelectedTime, setDeliveryInstructions } = useCheckoutStore();
  const { totalPrice } = useCartStore();

  const selectedDeliveryOption = deliveryOptions.find(
    (option) => option.id === selectedTimeId
  );

  const handleDeliveryTypeChange = (value: string) => {
    setSelectedTime(value);
  };

  const handleInstructionsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDeliveryInstructions(e.target.value);
  };

  // Calculate costs for selected delivery type
  const deliveryFee = selectedDeliveryOption?.price || 0;
  const taxRate = selectedDeliveryOption?.taxRate || 0;
  const tax = totalPrice * taxRate;
  const total = totalPrice + deliveryFee + tax;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Delivery Type</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup
          value={selectedTimeId}
          onValueChange={handleDeliveryTypeChange}
          className="space-y-3"
        >
          {deliveryOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-3">
              <RadioGroupItem
                value={option.id}
                id={option.id}
                className="text-secondary"
              />
              <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-900">
                      {option.label}
                    </div>
                    <div className="text-sm text-gray-600">
                      {option.description}
                    </div>
                    <div className="text-sm text-gray-500">
                      {option.time} • Tax: {(option.taxRate * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-secondary">
                      {formatNGN(option.price)}
                    </div>
                  </div>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>

        {/* Delivery Instructions */}
        <div className="space-y-2">
          <Label
            htmlFor="delivery-instructions"
            className="text-sm font-medium"
          >
            Delivery Instructions (Optional)
          </Label>
          <Textarea
            id="delivery-instructions"
            placeholder="Any special instructions for delivery? (e.g., call before delivery, leave at gate, etc.)"
            className="min-h-[80px] resize-none"
            onChange={handleInstructionsChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryTypeSelector;
