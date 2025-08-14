import React, { useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Plus, Minus } from "lucide-react";
import { useProductById, useRelatedProducts } from "@/store/products";
import type { Product } from "@/lib/product";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { formatNGN } from "@/utils/currency";
import useEmblaCarousel from "embla-carousel-react";
import { PATH } from "@/routes/paths";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const ProductPage: React.FC = () => {
  const { id } = useParams();
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Auto-scroll to top when navigating to product detail
  useScrollToTop();

  // Get product details from store
  const product = id ? useProductById(id) : null;
  const {
    addToCart,
    getCartItemQuantity,
    updateCartItemQuantity,
    removeFromCart,
  } = useCartStore();

  // Mock images for the product (replace with actual product images)
  const productImages = [
    "🛒", // Main product image
    "🛒", // Product image 2
    "🛒", // Product image 3
    "🛒", // Product image 4
    "🛒", // Product image 5
  ];

  // Get related products using the store function
  const relatedProducts = id ? useRelatedProducts(id, 4) : [];

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      images: product.images,
      price: product.price,
      name: product.name,
      count: product.count,
      category: product.category,
      detail: product.detail || "",
    });
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    updateCartItemQuantity(productId, newQuantity);
  };

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    dragFree: true,
    containScroll: "trimSnaps",
    breakpoints: {
      "(min-width: 768px)": { dragFree: false },
    },
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!product) {
    return (
      <div className="min-h-screen  bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist.
          </p>
          <Link to="/">
            <Button className="bg-secondary-100 hover:bg-secondary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-first responsive layout */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        {/* Back Navigation - Mobile optimized */}
        <div className="mb-4 sm:mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm sm:text-base text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Back to Products</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>

        {/* Main Product Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Mobile: Stacked layout, Desktop: Side-by-side */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:p-8">
            {/* Product Image Gallery - Mobile optimized */}
            <div className="p-4 sm:p-6 lg:p-0">
              {/* Main Product Image Slider */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
                <div className="overflow-hidden rounded-lg" ref={emblaRef}>
                  <div className="flex">
                    {productImages.map((image, index) => (
                      <div key={index} className="flex-[0_0_100%] min-w-0">
                        <div className="aspect-square sm:aspect-[7/3] flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-6xl sm:text-8xl mb-2 sm:mb-4">
                              {image}
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500">
                              Product Image {index + 1}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dots Navigation - Mobile optimized */}
              <div className="flex justify-center gap-2 sm:gap-3">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => scrollTo(index)}
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden transition-all border-2 touch-manipulation ${
                      index === selectedIndex
                        ? "border-secondary-100 ring-2 ring-secondary-100 ring-opacity-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                      <div className="text-lg sm:text-2xl">{image}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details - Mobile optimized */}
            <div className="p-4 sm:p-6 lg:p-0 lg:pl-0 space-y-4 sm:space-y-6">
              {/* Product Name */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                  {product.name}
                </h1>
              </div>

              {/* Price */}
              <div>
                <span className="text-2xl sm:text-3xl font-bold text-gray-800">
                  {formatNGN(product.price)}
                </span>
              </div>

              {/* Description */}
              <div>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  {product.detail ||
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
                </p>
              </div>

              {/* Add to Cart Button - Mobile optimized */}
              <div className="pt-4">
                {(() => {
                  const cartQuantity = getCartItemQuantity(product.id);
                  return cartQuantity >= 1 ? (
                    <div className="flex items-center justify-between flex-shrink-0 w-full sm:w-[300px] text-base font-bold text-white rounded bg-secondary-100 h-12">
                      <button
                        className="flex items-center h-full p-3 text-white border-none cursor-pointer bg-transparent touch-manipulation min-h-[44px]"
                        onClick={() =>
                          handleUpdateQuantity(product.id, cartQuantity - 1)
                        }
                      >
                        <Minus className="h-5" />
                      </button>
                      <span className="text-lg">{cartQuantity}</span>
                      <button
                        className="flex items-center h-full p-3 text-white border-none outline-none cursor-pointer bg-transparent touch-manipulation min-h-[44px]"
                        onClick={() =>
                          handleUpdateQuantity(product.id, cartQuantity + 1)
                        }
                      >
                        <Plus className="h-5" />
                      </button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="w-full sm:w-[300px] bg-secondary-100 hover:bg-secondary py-4 text-base sm:text-lg font-medium h-12 rounded touch-manipulation min-h-[44px]"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2 sm:mr-3" />
                      Add to Cart
                    </Button>
                  );
                })()}
              </div>

              {/* Category */}
              <div className="pt-4 sm:pt-6 border-t border-gray-200">
                <div className="text-sm">
                  <span className="text-gray-600">Category: </span>
                  <span className="font-medium text-gray-800">
                    {product.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Add to Cart - Only visible on mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
          <div className="max-w-7xl mx-auto">
            {(() => {
              const cartQuantity = getCartItemQuantity(product.id);
              return cartQuantity >= 1 ? (
                <div className="flex items-center justify-between w-full text-base font-bold text-white rounded bg-secondary-100 h-12 px-4">
                  <button
                    className="flex items-center h-full text-white border-none cursor-pointer bg-transparent touch-manipulation min-h-[44px]"
                    onClick={() =>
                      handleUpdateQuantity(product.id, cartQuantity - 1)
                    }
                  >
                    <Minus className="h-5" />
                  </button>
                  <span className="text-lg">{cartQuantity}</span>
                  <button
                    className="flex items-center h-full text-white border-none outline-none cursor-pointer bg-transparent touch-manipulation min-h-[44px]"
                    onClick={() =>
                      handleUpdateQuantity(product.id, cartQuantity + 1)
                    }
                  >
                    <Plus className="h-5" />
                  </button>
                </div>
              ) : (
                <Button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-secondary-100 hover:bg-secondary py-4 text-base font-medium h-12 rounded touch-manipulation min-h-[44px]"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
              );
            })()}
          </div>
        </div>

        {/* Related Items Section - Mobile optimized */}
        {relatedProducts.length > 0 && (
          <div className="mt-8 sm:mt-12 lg:mt-16 pt-8 sm:pt-12 border-t border-gray-200 pb-24 lg:pb-0">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Related Items
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                You might also like these products
              </p>
            </div>

            {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 4 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relatedProduct: Product) => (
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
                      <div className="text-center">
                        <div className="text-3xl sm:text-4xl mb-2">🛒</div>
                        <p className="text-xs text-gray-500">Product Image</p>
                      </div>
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-3 sm:p-4">
                    <Link to={PATH.products.single(relatedProduct.id)}>
                      <h3 className="font-medium text-gray-800 truncate mb-2 transition-colors text-sm sm:text-base">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mb-2">
                        {relatedProduct.category}
                      </p>
                    </Link>
                    <p className="text-base sm:text-lg font-semibold text-secondary-100 mb-3">
                      {formatNGN(relatedProduct.price)}
                    </p>

                    {/* Cart Controls - Mobile optimized */}
                    {(() => {
                      const cartQuantity = getCartItemQuantity(
                        relatedProduct.id
                      );
                      return cartQuantity >= 1 ? (
                        <div className="flex items-center justify-between flex-shrink-0 w-full text-sm sm:text-base font-bold text-white rounded bg-secondary-100 h-8 sm:h-9">
                          <button
                            className="flex items-center h-full p-2 sm:p-3 text-white border-none cursor-pointer bg-transparent"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleUpdateQuantity(
                                relatedProduct.id,
                                cartQuantity - 1
                              );
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
                              handleUpdateQuantity(
                                relatedProduct.id,
                                cartQuantity + 1
                              );
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
                            handleAddToCart(relatedProduct);
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
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
