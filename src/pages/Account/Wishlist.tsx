import { useNavigate } from "react-router-dom";
import { Wishlist } from "@/components/account";
import { useCartMutations } from "@/api";
import { useWishlist, useRemoveWishlistItem } from "@/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { PATH } from "@/routes/paths";

const WishlistPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCartMutations();

  // Use real wishlist hooks
  const { data: wishlistData, isLoading, error } = useWishlist();
  const removeWishlistItemMutation = useRemoveWishlistItem();

  const wishlistItems = wishlistData?.wishlist || [];

  const handleAddToCart = async (productId: string) => {
    try {
      // Find the wishlist item to get product information
      const wishlistItem = wishlistItems.find(
        (item) => item.productId === productId
      );
      if (!wishlistItem) {
        toast.error("Product not found in wishlist");
        return;
      }

      // Prepare the cart request with product information
      const cartRequest = {
        productId: wishlistItem.productId,
        quantity: 1,
        product: {
          id: wishlistItem.product.id,
          name: wishlistItem.product.name,
          price: wishlistItem.product.price.toString(),
          images: wishlistItem.product.images,
          variants: [], // No variants for now
        },
      };

      await addToCart(cartRequest);
      toast.success("Product added to cart successfully!");
    } catch (error) {
      toast.error("Failed to add product to cart");
      console.error("Error adding to cart:", error);
    }
  };

  const handleRemoveFromWishlist = async (itemId: string) => {
    try {
      await removeWishlistItemMutation.mutateAsync(itemId);
      toast.success("Product removed from wishlist");
    } catch (error) {
      toast.error("Failed to remove product from wishlist");
      console.error("Error removing from wishlist:", error);
    }
  };

  const handleViewProduct = (productId: string) => {
    navigate(PATH.products.single(productId));
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <Loader2 className="h-16 w-16 text-secondary mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Loading your wishlist...
            </h3>
            <p className="text-gray-600">
              Please wait while we fetch your saved products
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="h-8 w-8 bg-red-600 rounded-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Failed to load wishlist
            </h3>
            <p className="text-gray-600 mb-6">
              {error.message ||
                "Something went wrong while loading your wishlist"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-secondary hover:bg-secondary-100 text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Wishlist
          items={wishlistItems}
          onRemoveFromWishlist={handleRemoveFromWishlist}
          onViewProduct={handleViewProduct}
        />
      </div>
    </div>
  );
};

export default WishlistPage;
