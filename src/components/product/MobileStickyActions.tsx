import React from "react";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/hooks/useProducts";

interface MobileStickyActionsProps {
  product: Product;
}

const MobileStickyActions: React.FC<MobileStickyActionsProps> = ({
  product,
}) => {
  // Get cart actions and state from the store
  const {
    addToCart,
    removeFromCart,
    updateQuantity,
    items: cartItems,
    isLoading: cartLoading,
  } = useCartStore();

  // Find cart item for this product
  const cartItem = cartItems.find((item) => item.productId === product.id);
  const cartQuantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    // Create a product object for the cart
    const cartProduct = {
      id: product.id,
      name: product.name,
      price:
        typeof product.price === "string"
          ? parseFloat(product.price)
          : product.price,
      images: product.images.map((img, index) => ({
        id: `${product.id}-img-${index}`,
        url: img.url,
        alt: product.name,
        sortOrder: index,
        isPrimary: index === 0,
      })),
      category: product.category?.name || "",
      description: product.description || "",
    };

    // Add to cart immediately - this updates UI and localStorage instantly
    addToCart(cartProduct, 1);
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or negative
      removeFromCart(product.id);
    } else {
      // Update quantity immediately
      updateQuantity(product.id, newQuantity);
    }
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
      <div className="max-w-7xl mx-auto">
        {cartQuantity >= 1 ? (
          <div className="flex items-center justify-between w-full text-base font-bold text-white rounded bg-secondary-100 h-12 px-4">
            <button
              className="flex items-center h-full text-white border-none cursor-pointer bg-transparent touch-manipulation min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/20 rounded-lg transition-colors"
              onClick={() => handleUpdateQuantity(cartQuantity - 1)}
              disabled={cartLoading}
            >
              <Minus className="h-5" />
            </button>
            <span className="text-lg">{cartQuantity}</span>
            <button
              className="flex items-center h-full text-white border-none outline-none cursor-pointer bg-transparent touch-manipulation min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/20 rounded-lg transition-colors"
              onClick={() => handleUpdateQuantity(cartQuantity + 1)}
              disabled={cartLoading}
            >
              <Plus className="h-5" />
            </button>
          </div>
        ) : (
          <Button
            onClick={handleAddToCart}
            disabled={cartLoading}
            className="w-full bg-secondary-100 hover:bg-secondary py-4 text-base font-medium h-12 rounded touch-manipulation min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-5 w-5 mr-2" />
            {cartLoading ? "Adding..." : "Add to Cart"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default MobileStickyActions;
