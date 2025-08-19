import React from "react";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

import type { Product } from "@/hooks/useProducts";

interface MobileStickyActionsProps {
  product: Product;
  cartQuantity: any;
  onAddToCart: (e: React.MouseEvent) => void;
  onIncrement: (e: React.MouseEvent) => void;
  onDecrement: (e: React.MouseEvent) => void;
}

const MobileStickyActions: React.FC<MobileStickyActionsProps> = ({
  cartQuantity,
  onAddToCart,
  onIncrement,
  onDecrement,
}) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
      <div className="max-w-7xl mx-auto">
        {cartQuantity >= 1 ? (
          <div className="flex items-center justify-between w-full text-base font-bold text-white rounded bg-secondary-100 h-12 px-4">
            <button
              className="flex items-center h-full text-white border-none cursor-pointer bg-transparent touch-manipulation min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/20 rounded-lg transition-colors"
              onClick={onDecrement}
            >
              <Minus className="h-5" />
            </button>
            <span className="text-lg">{cartQuantity}</span>
            <button
              className="flex items-center h-full text-white border-none outline-none cursor-pointer bg-transparent touch-manipulation min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/20 rounded-lg transition-colors"
              onClick={onIncrement}
            >
              <Plus className="h-5" />
            </button>
          </div>
        ) : (
          <Button
            onClick={onAddToCart}
            className="w-full bg-secondary-100 hover:bg-secondary py-4 text-base font-medium h-12 rounded touch-manipulation min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add to Cart
          </Button>
        )}
      </div>
    </div>
  );
};

export default MobileStickyActions;
