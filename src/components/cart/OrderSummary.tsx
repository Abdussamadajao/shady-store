import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNGN } from "@/utils/currency";
import useCartStore from "@/store/cart";
import {
  useSelectedAddressId,
  useSelectedContactId,
  useDeliveryFee,
} from "@/store/checkout";
import CartItem from "./CartItem";

interface OrderSummaryProps {
  onPlaceOrder: () => void;
  isFormValid: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  onPlaceOrder,
  isFormValid,
}) => {
  const { items: cartItems, totalPrice } = useCartStore();
  const selectedAddressId = useSelectedAddressId();
  const selectedContactId = useSelectedContactId();
  const deliveryFee = useDeliveryFee();

  const tax = totalPrice * 0.075; // 7.5% tax (adjust as needed)
  const shipping = totalPrice > 100 ? 0 : 10; // Free shipping over $100
  const total = totalPrice + tax + shipping;

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

          {/* Cost Breakdown */}
          <div className="border-t border-gray-200 pt-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Sub Total</span>
              <span className="font-medium">{formatNGN(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-medium">{formatNGN(deliveryFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
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
            disabled={!isFormValid || cartItems.length === 0}
          >
            Place Order
          </Button>

          {/* Form Validation Status */}
          {!isFormValid && (
            <div className="text-sm text-red-600 space-y-1">
              {!selectedAddressId && <p>• Please select a delivery address</p>}
              {!selectedContactId && <p>• Please select a contact number</p>}
              <p>• Please complete payment information</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSummary;
