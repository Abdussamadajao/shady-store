import type { CartItem as CartItemType } from "@/types";
import { formatNGN } from "@/utils/currency";

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-lg">🛒</span>
        </div>
        <div>
          <h4 className="font-medium text-gray-800">{item?.product?.name}</h4>
          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium text-gray-800">
          <span className="text-sm text-gray-600">{item.quantity} x </span>{" "}
          {formatNGN(item?.product?.price || 0)}
        </p>
      </div>
    </div>
  );
};

export default CartItem;
