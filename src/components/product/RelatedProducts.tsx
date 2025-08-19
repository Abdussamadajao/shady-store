import React from "react";
import { Link } from "react-router-dom";
import { Plus, Minus } from "lucide-react";
import { formatNGN } from "@/utils/currency";
import { PATH } from "@/routes/paths";
import type { Product } from "@/hooks/useProducts";
import useCartStore from "@/store/cart";
import { useCartMutations } from "@/api";
import { useAuthStore } from "@/store/auth";

interface RelatedProductsProps {
  products: Product[];
  isLoading: boolean;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  products,
  isLoading,
}) => {
  const { items: cartItems } = useCartStore();
  const { addToCart, updateQuantity } = useCartMutations();
  const { user } = useAuthStore();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={`skeleton-${index}`} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-48 mb-2"></div>
            <div className="bg-gray-200 rounded h-4 mb-2"></div>
            <div className="bg-gray-200 rounded h-4 w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 sm:mt-12 lg:mt-16 pt-8 sm:pt-12 border-t border-gray-200 pb-24 lg:pb-0">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          Related Items
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          You might also like these products
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {products.map((relatedProduct: Product) => {
          return (
            <div
              key={relatedProduct.id}
              className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              {/* Product Image */}
              <Link
                to={PATH.products.single(relatedProduct.id)}
                className="block"
              >
                <div className="aspect-square bg-gray-50 flex items-center justify-center p-3 sm:p-4">
                  {relatedProduct.images?.[0]?.url ? (
                    <img
                      src={relatedProduct.images[0].url}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No Image</span>
                    </div>
                  )}
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-3 sm:p-4">
                <Link to={PATH.products.single(relatedProduct.id)}>
                  <h3 className="font-medium text-gray-800 truncate mb-2 transition-colors text-sm sm:text-base">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2">
                    {relatedProduct.category.name}
                  </p>
                </Link>
                <p className="text-base sm:text-lg font-semibold text-secondary-100 mb-3">
                  {formatNGN(relatedProduct.price)}
                </p>

                {/* Cart Controls - Mobile optimized */}
                {(() => {
                  const cartQuantity =
                    cartItems.find(
                      (item) => item.productId === relatedProduct.id
                    )?.quantity || 0;
                  return cartQuantity >= 1 ? (
                    <div className="flex items-center justify-between flex-shrink-0 w-full text-sm sm:text-base font-bold text-white rounded bg-secondary-100 h-8 sm:h-9">
                      <button
                        className="flex items-center h-full p-2 sm:p-3 text-white border-none cursor-pointer bg-transparent"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          updateQuantity(relatedProduct.id, cartQuantity - 1);
                        }}
                      >
                        <Minus className="h-4 sm:h-5" />
                      </button>
                      <span className="text-sm sm:text-base">
                        {cartQuantity}
                      </span>
                      <button
                        className="flex items-center h-full p-2 sm:p-3 text-white border-none outline-none cursor-pointer bg-transparent"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          updateQuantity(relatedProduct.id, cartQuantity + 1);
                        }}
                      >
                        <Plus className="h-4 sm:h-5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="flex items-center w-full overflow-hidden duration-75 ease-in-out bg-gray-100 border-0 border-green-700 rounded cursor-pointer group focus:border-none h-8 sm:h-9 hover:bg-secondary-100 hover:text-white transition-all"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart({
                          productId: relatedProduct.id,
                          userId: user?.id,
                          quantity: 1,
                          product: {
                            id: relatedProduct.id,
                            name: relatedProduct.name,
                            price: relatedProduct.price.toString(),
                            images: relatedProduct.images.map((image) => ({
                              id: image.id,
                              url: image.url,
                              alt: relatedProduct.name,
                              sortOrder: 0,
                              isPrimary: true,
                            })),
                            variants: [],
                          },
                        });
                      }}
                    >
                      <p className="flex-grow text-xs sm:text-sm font-roboto">
                        Add to Cart
                      </p>
                      <span className="flex items-center px-2 transition-all duration-75 ease-in-out bg-gray-200 h-8 sm:h-9 hover:text-white group-hover:bg-secondary">
                        <Plus className="h-4 sm:h-5" />
                      </span>
                    </button>
                  );
                })()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;
