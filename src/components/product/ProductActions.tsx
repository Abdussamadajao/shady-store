import React from "react";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/hooks/useProducts";

interface ProductActionsProps {
  product: Product;
  cartQuantity: number;
  onAddToCart: (e: React.MouseEvent) => void;
  onIncrement: (e: React.MouseEvent) => void;
  onDecrement: (e: React.MouseEvent) => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  cartQuantity,
  onAddToCart,
  onIncrement,
  onDecrement,
}) => {
  // Get cart actions and state from the store

  return (
    <div className="space-y-4">
      {cartQuantity >= 1 ? (
        <div className="flex w-[200px] items-center justify-between bg-secondary-100 text-white rounded-xl h-12 px-6 shadow-lg">
          <button
            className="flex items-center h-full p-3 text-white border-none cursor-pointer bg-transparent touch-manipulation min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/20 rounded-lg transition-colors"
            onClick={onDecrement}
          >
            <Minus className="h-6 w-6" />
          </button>
          <span className="text-xl font-bold">{cartQuantity}</span>
          <button
            className="flex items-center h-full p-3 text-white border-none outline-none cursor-pointer bg-transparent touch-manipulation min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/20 rounded-lg transition-colors"
            onClick={onIncrement}
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      ) : (
        <Button
          onClick={onAddToCart}
          className="bg-secondary-100 h-12 w-[200px] hover:bg-secondary py-4 text-lg font-semibold rounded-xl shadow-lg touch-manipulation min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-xl"
        >
          <ShoppingCart className="h-6 w-6 mr-3" />
          Add to Cart
        </Button>
      )}

      {/* Quick Info */}
      <div className="text-center text-sm text-gray-500">
        <p>Free shipping on orders over ₦50,000</p>
        <p>30-day return policy</p>
      </div>
    </div>
  );
};

export default ProductActions;
