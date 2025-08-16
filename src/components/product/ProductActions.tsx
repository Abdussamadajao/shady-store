import React from "react";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/hooks/useProducts";

interface ProductActionsProps {
  product: Product;
}

const ProductActions: React.FC<ProductActionsProps> = ({ product }) => {
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
    <div className="space-y-4">
      {cartQuantity >= 1 ? (
        <div className="flex w-[200px] items-center justify-between bg-secondary-100 text-white rounded-xl h-12 px-6 shadow-lg">
          <button
            className="flex items-center h-full p-3 text-white border-none cursor-pointer bg-transparent touch-manipulation min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/20 rounded-lg transition-colors"
            onClick={() => handleUpdateQuantity(cartQuantity - 1)}
            disabled={cartLoading}
          >
            <Minus className="h-6 w-6" />
          </button>
          <span className="text-xl font-bold">{cartQuantity}</span>
          <button
            className="flex items-center h-full p-3 text-white border-none outline-none cursor-pointer bg-transparent touch-manipulation min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/20 rounded-lg transition-colors"
            onClick={() => handleUpdateQuantity(cartQuantity + 1)}
            disabled={cartLoading}
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      ) : (
        <Button
          onClick={handleAddToCart}
          disabled={cartLoading}
          className="bg-secondary-100 h-12 w-[200px] hover:bg-secondary py-4 text-lg font-semibold rounded-xl shadow-lg touch-manipulation min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-xl"
        >
          <ShoppingCart className="h-6 w-6 mr-3" />
          {cartLoading ? "Adding to Cart..." : "Add to Cart"}
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
