import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNGN } from "@/utils/currency";
import useCartStore from "@/store/cart";
import {
  useDeliveryFee,
  useSelectedDeliveryOption,
  useSelectedDeliveryTime,
  useTaxRate,
} from "@/store/checkout";
import CartItem from "./CartItem";
import { useAddressStore } from "@/store/address";

interface OrderSummaryProps {
  onPlaceOrder: () => void;
  isFormValid: boolean;
  isLoading?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  onPlaceOrder,
  isFormValid,
  isLoading = false,
}) => {
  const { items: cartItems, totalPrice } = useCartStore();
  const { selectedAddressId } = useAddressStore();
  const deliveryFee = useDeliveryFee();
  const selectedDeliveryOption = useSelectedDeliveryOption();
  const selectedDeliveryTime = useSelectedDeliveryTime();
  const taxRate = useTaxRate();
  const tax = totalPrice * taxRate;
  const total = totalPrice + tax + deliveryFee;

  const taxRatePercentage = (taxRate * 100).toFixed(1);

  return (
    <div className="lg:col-span-1">
      <Card className="sticky top-[100px]">
        <CardHeader>
          <CardTitle className="text-xl">Your Order</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Cart Items */}
          <div className="space-y-3">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Selected Delivery Type */}
          {selectedDeliveryOption && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">
                Selected Delivery:
              </div>
              <div className="font-medium text-gray-900">
                {selectedDeliveryOption.label}
              </div>
              <div className="text-sm text-gray-600">
                {selectedDeliveryOption.description} •{" "}
                {selectedDeliveryOption.time}
              </div>
            </div>
          )}

          {/* Cost Breakdown */}
          <div className="border-t border-gray-200 pt-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Sub Total</span>
              <span className="font-medium">{formatNGN(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-medium text-secondary">
                {formatNGN(deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax ({taxRatePercentage}%)</span>
              <span className="font-medium">{formatNGN(tax)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
              <span>Total</span>
              <span>{formatNGN(total)}</span>
            </div>
          </div>

          {/* Place Order Button */}
          <Button
            onClick={onPlaceOrder}
            className="w-full bg-secondary hover:bg-secondary-100 py-3 text-lg font-medium"
            disabled={!isFormValid || cartItems.length === 0 || isLoading}
          >
            {isLoading ? "Processing..." : "Place Order"}
          </Button>

          {/* Form Validation Status */}
          {!isFormValid && (
            <div className="text-sm text-red-600 space-y-1">
              {!selectedAddressId && <p>• Please select a delivery address</p>}
              {!selectedDeliveryTime && <p>• Please select a delivery type</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSummary;
