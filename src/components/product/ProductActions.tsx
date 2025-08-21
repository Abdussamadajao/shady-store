import React from "react";
import { ShoppingCart, Plus, Minus, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/hooks/useProducts";

interface ProductActionsProps {
  product: Product;
  cartQuantity: number;
  onAddToCart: (e: React.MouseEvent) => void;
  onIncrement: (e: React.MouseEvent) => void;
  onDecrement: (e: React.MouseEvent) => void;
  onToggleWishlist: (e: React.MouseEvent) => void;
  isInWishlist: boolean;
  isWishlistLoading?: boolean;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  product,
  cartQuantity,
  onAddToCart,
  onIncrement,
  onDecrement,
  onToggleWishlist,
  isInWishlist,
  isWishlistLoading = false,
}) => {
  // Get cart actions and state from the store

  return (
    <div className="space-y-4">
      {/* Cart and Wishlist Actions Row */}
      <div className="flex gap-3">
        {/* Cart Actions */}
        <div className="flex-1">
          {cartQuantity >= 1 ? (
            <div className="flex w-full items-center justify-between bg-secondary-100 text-white rounded-xl h-12 px-6 shadow-lg">
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
              className="bg-secondary-100 h-12 w-full hover:bg-secondary py-4 text-lg font-semibold rounded-xl shadow-lg touch-manipulation min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-xl"
            >
              <ShoppingCart className="h-6 w-6 mr-3" />
              Add to Cart
            </Button>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          onClick={onToggleWishlist}
          disabled={isWishlistLoading}
          variant="outline"
          title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className={`h-12 w-12 p-0 border-2 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-secondary-100 focus:ring-offset-2 ${
            isInWishlist
              ? "border-secondary-100 bg-secondary-100 text-white hover:bg-secondary hover:border-secondary"
              : "border-gray-300 hover:border-secondary-100 hover:bg-secondary-50"
          }`}
        >
          {isWishlistLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <Heart
              className={`h-6 w-6 transition-all duration-200 ${
                isInWishlist ? "fill-current" : ""
              }`}
            />
          )}
        </Button>
      </div>

      {/* Quick Info */}
      <div className="text-center text-sm text-gray-500">
        <p>Free shipping on orders over ₦50,000</p>
        <p>30-day return policy</p>
      </div>
    </div>
  );
};

export default ProductActions;
