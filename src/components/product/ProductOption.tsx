import React from "react";
import { Minus, Plus, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { useOffersStore } from "@/store/offers";
import { formatNGN } from "@/utils/currency";
import { PATH } from "@/routes/paths";
import useCartStore from "@/store/cart";
import { useCartMutations } from "@/api";
import { useAuthStore } from "@/store/auth";

interface ProductOptionProps {
  id: string;
  images: string[];
  price: string;
  name: string;
  viewMode?: "grid" | "list";
}

// Debounce function

const ProductOption: React.FC<ProductOptionProps> = ({
  id,
  images,
  price,
  name,
  viewMode = "grid",
}) => {
  const { items } = useCartStore();
  const cartItem = items.find((item) => item.productId === id);
  const cartQuantity = cartItem?.quantity || 0;
  const { user } = useAuthStore();
  // Cart mutations
  const { addToCart, updateQuantity, removeFromCart } = useCartMutations();

  const { getOffersForProduct, calculateDiscountedPrice } = useOffersStore();
  const productOffers = getOffersForProduct(id);
  const hasOffers = productOffers.length > 0;

  const originalPrice = parseInt(price);
  const discountedPrice = hasOffers
    ? calculateDiscountedPrice(originalPrice, id)
    : originalPrice;
  const discountAmount = originalPrice - discountedPrice;
  const discountPercentage = Math.round((discountAmount / originalPrice) * 100);

  const handleAddItem = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: id,
      userId: user?.id,
      quantity: 1,
      product: {
        id,
        name,
        price,
        images: images.map((image) => ({
          id: image,
          url: image,
          alt: name,
          sortOrder: 0,
          isPrimary: true,
        })),
        variants: [],
      },
    });
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(cartItem?.id || "", cartQuantity + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartQuantity > 1) {
      updateQuantity(cartItem?.id || "", cartQuantity - 1);
    } else {
      removeFromCart(cartItem?.id || "");
    }
  };

  // Loading states

  return (
    <Link
      to={PATH.products.single(id)}
      className={`block transition-all duration-200 transform hover:shadow-md rounded-md hover:-translate-y-1 ${
        viewMode === "list" ? "w-full" : ""
      }`}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          e.preventDefault();
        }
      }}
    >
      {viewMode === "grid" ? (
        <div className="flex flex-col flex-grow pb-4 sm:pb-6 h- bg-white border border-gray-100 rounded-md">
          <div className="flex-1">
            <div className="relative flex items-center justify-center flex-grow overflow-hidden">
              <div className="w-full rounded-t-md flex items-center justify-center">
                <img
                  src={images[0]}
                  alt={name}
                  className="w-full h-[200px] object-cover rounded-t-md"
                  loading="lazy"
                />
              </div>

              {hasOffers && (
                <div className="absolute top-2 left-2">
                  <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {discountPercentage}% OFF
                  </div>
                </div>
              )}
            </div>

            <div className="box-border pt-4 px-3 sm:px-2 pb-3 sm:pb-2">
              <div className="flex items-center gap-2 ">
                {hasOffers ? (
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-semibold text-secondary font-poppins">
                      {formatNGN(discountedPrice)}
                    </span>
                    <span className="text-sm text-gray-400 line-through font-poppins">
                      {formatNGN(originalPrice)}
                    </span>
                  </div>
                ) : (
                  <span className="text-base sm:text-lg font-semibold text-gray-800 font-poppins">
                    {formatNGN(originalPrice)}
                  </span>
                )}
              </div>

              {hasOffers && productOffers[0] && (
                <div className="mb-2">
                  <p className="text-xs text-green-600 font-medium">
                    {productOffers[0].title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {productOffers[0].description}
                  </p>
                </div>
              )}

              <h3 className="mb-4 sm:mb-8 text-xs sm:text-sm font-normal text-gray-500 font-inter">
                {name}
              </h3>
            </div>
          </div>

          <div className="px-3 sm:px-5 pb-3 sm:pb-5">
            {cartQuantity >= 1 ? (
              <div className="flex items-center justify-between flex-shrink-0 w-full text-base font-bold text-white rounded bg-secondary-100 h-9">
                <button
                  className="flex items-center h-full p-3 text-white border-none cursor-pointer bg-transparent disabled:opacity-50 hover:bg-secondary/20 rounded-lg transition-colors"
                  onClick={handleDecrement}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-5" />
                </button>
                <span>{cartQuantity}</span>
                <button
                  className="flex items-center h-full p-3 text-white border-none outline-none cursor-pointer bg-transparent disabled:opacity-50 hover:bg-secondary/20 rounded-lg transition-colors"
                  onClick={handleIncrement}
                  // disabled={isMutating}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-5" />
                </button>
              </div>
            ) : (
              <button
                className="flex items-center w-full overflow-hidden duration-75 ease-in-out bg-gray-100 border-0 border-green-700 rounded cursor-pointer group focus:border-none h-9 hover:bg-secondary-100 hover:text-white transition-all disabled:opacity-50"
                onClick={handleAddItem}
                // disabled={isMutating}
                aria-label="Add to cart"
              >
                <p className="flex-grow text-sm font-roboto">Add to Cart</p>
                <span className="flex items-center px-2 transition-all duration-75 ease-in-out bg-gray-200 h-9 hover:text-white group-hover:bg-secondary">
                  <Plus className="h-5" />
                </span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-4 p-4 bg-white border border-gray-100 rounded-lg hover:shadow-md transition-all duration-200">
          <div className="relative flex-shrink-0">
            <img
              src={images[0]}
              alt={name}
              className="w-24 h-24 object-cover rounded-lg"
              loading="lazy"
            />
            {hasOffers && (
              <div className="absolute -top-1 -right-1">
                <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {discountPercentage}% OFF
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
              {name}
            </h3>

            <div className="flex items-center gap-2 mb-2">
              {hasOffers ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-secondary">
                    {formatNGN(discountedPrice)}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {formatNGN(originalPrice)}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-gray-800">
                  {formatNGN(originalPrice)}
                </span>
              )}
            </div>

            {hasOffers && productOffers[0] && (
              <div className="mb-3">
                <p className="text-sm text-green-600 font-medium">
                  {productOffers[0].title}
                </p>
                <p className="text-sm text-gray-500">
                  {productOffers[0].description}
                </p>
              </div>
            )}
          </div>

          <div className="flex-shrink-0">
            {cartQuantity >= 1 ? (
              <div className="flex items-center justify-between w-32 text-base font-bold text-white rounded bg-secondary-100 h-10 px-3">
                <button
                  className="flex items-center h-full text-white border-none cursor-pointer bg-transparent disabled:opacity-50 hover:bg-secondary/20 rounded-lg transition-colors"
                  onClick={handleDecrement}
                  // disabled={isMutating || cartQuantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4" />
                </button>
                <span>{cartQuantity}</span>
                <button
                  className="flex items-center h-full text-white border-none outline-none cursor-pointer bg-transparent disabled:opacity-50 hover:bg-secondary/20 rounded-lg transition-colors"
                  onClick={handleIncrement}
                  // disabled={isMutating}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4" />
                </button>
              </div>
            ) : (
              <button
                className="px-6 py-2 bg-secondary hover:bg-secondary-100 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                onClick={handleAddItem}
                // disabled={isMutating}
                aria-label="Add to cart"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      )}
    </Link>
  );
};

export default ProductOption;
