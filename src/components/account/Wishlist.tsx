import { useState } from "react";
import {
  Heart,
  ShoppingCart,
  Trash2,
  Eye,
  Star,
  Minus,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatNGN } from "@/utils/currency";
import useCartStore from "@/store/cart";
import { useCartMutations } from "@/api";
import { useAuthStore } from "@/store/auth";
import { Link } from "react-router-dom";
import { PATH } from "@/routes/paths";

interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    description?: string;
    shortDescription?: string;
    price: number;
    comparePrice?: number;
    images: Array<{ id: string; url: string; alt?: string }>;
    _count: { reviews: number };
    isActive: boolean;
  };
  createdAt: string;
}

interface WishlistProps {
  items?: WishlistItem[];
  onRemoveFromWishlist?: (itemId: string) => void;
  onViewProduct?: (productId: string) => void;
}

const Wishlist: React.FC<WishlistProps> = ({
  items = [],
  onRemoveFromWishlist,
  onViewProduct,
}) => {
  const { items: cartItems } = useCartStore();
  const { addToCart, updateQuantity } = useCartMutations();
  const { user } = useAuthStore();

  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());

  const handleRemoveFromWishlist = async (itemId: string) => {
    setRemovingItems((prev) => new Set(prev).add(itemId));
    try {
      await onRemoveFromWishlist?.(itemId);
    } finally {
      setRemovingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleViewProduct = (productId: string) => {
    onViewProduct?.(productId);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Your wishlist is empty
        </h3>
        <p className="text-gray-600 mb-6">
          Start adding products you love to your wishlist
        </p>
        <Link to={PATH.root}>
          <Button className="bg-secondary hover:bg-secondary-100">
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
        <p className="text-gray-600 mt-2">Save products you love for later</p>
      </div>

      {/* Wishlist Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">
                  {items.length}
                </p>
              </div>
              <Heart className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold text-green-600">
                  {items.filter((item) => item.product.isActive).length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-green-600 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNGN(
                    items.reduce((sum, item) => sum + item.product.price, 0)
                  )}
                </p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-blue-600 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wishlist Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <Card
            key={item.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col md:flex-row">
              {/* Product Image Section */}
              <div className="relative md:w-48 lg:w-56 flex-shrink-0">
                <div className="aspect-square overflow-hidden">
                  {item.product.images && item.product.images.length > 0 ? (
                    <img
                      src={item.product.images[0].url}
                      alt={item.product.images[0].alt || item.product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <div className="text-gray-400 text-center">
                        <div className="text-4xl mb-2">📦</div>
                        <div className="text-sm">No Image</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Badge */}
                {!item.product.isActive && (
                  <Badge className="absolute top-2 left-2 bg-red-100 text-red-800">
                    Out of Stock
                  </Badge>
                )}

                {/* Remove Button */}
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
                  onClick={() => handleRemoveFromWishlist(item.id)}
                  disabled={removingItems.has(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Product Content Section */}
              <div className="flex-1 p-4 md:p-6">
                <div className="flex flex-col h-full">
                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.product.shortDescription ||
                        item.product.description}
                    </p>

                    {/* Price and Reviews Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                      {/* Price */}
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-gray-900">
                          {formatNGN(item.product.price)}
                        </span>
                        {item.product.comparePrice &&
                          item.product.comparePrice > item.product.price && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatNGN(item.product.comparePrice)}
                            </span>
                          )}
                      </div>

                      {/* Reviews */}
                      {item.product._count.reviews > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-600">
                            {item.product._count.reviews} reviews
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Added Date */}
                    <p className="text-xs text-gray-500 mb-4">
                      Added {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleViewProduct(item.product.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Product
                    </Button>
                    {(() => {
                      const cartQuantity =
                        cartItems.find(
                          (item) => item.productId === item?.product?.id
                        )?.quantity || 0;
                      return cartQuantity >= 1 ? (
                        <div className="flex items-center justify-between flex-shrink-0 w-32 text-sm font-bold text-white rounded bg-secondary-100 h-9">
                          <button
                            className="flex items-center h-full p-2 text-white border-none cursor-pointer bg-transparent"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              updateQuantity(item.product.id, cartQuantity - 1);
                            }}
                          >
                            <Minus className="h-4" />
                          </button>
                          <span className="text-sm">{cartQuantity}</span>
                          <button
                            className="flex items-center h-full p-2 text-white border-none outline-none cursor-pointer bg-transparent"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              updateQuantity(item.product.id, cartQuantity + 1);
                            }}
                          >
                            <Plus className="h-4" />
                          </button>
                        </div>
                      ) : (
                        <Button
                          className="flex-1 bg-secondary hover:bg-secondary-100"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToCart({
                              productId: item.product.id,
                              userId: user?.id,
                              quantity: 1,
                              product: {
                                id: item.product.id,
                                name: item.product.name,
                                price: item.product.price.toString(),
                                images: item.product.images.map((image) => ({
                                  id: image.id,
                                  url: image.url,
                                  alt: item.product.name,
                                  sortOrder: 0,
                                  isPrimary: true,
                                })),
                                variants: [],
                              },
                            });
                          }}
                          disabled={!item.product.isActive}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
