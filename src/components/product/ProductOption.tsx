import React from "react";
import { Minus, Plus, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/store/cart";
import { useOffersStore } from "@/store/offers";
import { formatNGN } from "@/utils/currency";
import { PATH } from "@/routes/paths";

interface ProductOptionProps {
  id: string;
  images: string[];
  price: string;
  name: string;
  count: string;
}

const ProductOption: React.FC<ProductOptionProps> = ({
  id,
  images,
  price,
  name,
  count,
}) => {
  const { addToCart, getCartItemQuantity, updateCartItemQuantity } =
    useCartStore();

  const { getOffersForProduct, calculateDiscountedPrice } = useOffersStore();

  const cartQuantity = getCartItemQuantity(id);
  const productOffers = getOffersForProduct(id);
  const hasOffers = productOffers.length > 0;

  // Convert price string to number for calculations
  const originalPrice = parseInt(price);
  const discountedPrice = hasOffers
    ? calculateDiscountedPrice(originalPrice, id)
    : originalPrice;
  const discountAmount = originalPrice - discountedPrice;
  const discountPercentage = Math.round((discountAmount / originalPrice) * 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id, images, price, name, count, category: "", detail: "" });
  };

  const handleUpdateQuantity = (e: React.MouseEvent, newQuantity: number) => {
    e.preventDefault();
    e.stopPropagation();
    updateCartItemQuantity(id, newQuantity);
  };

  return (
    <Link
      to={PATH.products.single(id)}
      className="block transition-all duration-200 transform hover:shadow-md hover:-translate-y-1"
    >
      <div className="flex flex-col flex-grow py-4 sm:py-6 bg-white border border-gray-100 rounded-md">
        {/* Product Image and Info - Clickable Area */}
        <div className="flex-1">
          <div className="relative flex items-center justify-center flex-grow overflow-hidden">
            <div className="w-full h-32 sm:h-40 md:h-48 rounded-md flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🛒</div>
                <p className="text-xs text-gray-500">Product Image</p>
              </div>
            </div>

            {/* Offer Badge */}
            {hasOffers && (
              <div className="absolute top-2 left-2">
                <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {discountPercentage}% OFF
                </div>
              </div>
            )}
          </div>

          <div className="box-border px-3 sm:px-5 pb-3 sm:pb-5">
            {/* Pricing Section */}
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
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

            {/* Offer Description */}
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

        {/* Cart Controls - Non-clickable, separate from navigation */}
        <div className="px-3 sm:px-5 pb-3 sm:pb-5">
          {cartQuantity >= 1 ? (
            <div className="flex items-center justify-between flex-shrink-0 w-full text-base font-bold text-white rounded bg-secondary-100 h-9">
              <button
                className="flex items-center h-full p-3 text-white border-none cursor-pointer bg-transparent"
                onClick={(e) => handleUpdateQuantity(e, cartQuantity - 1)}
              >
                <Minus className="h-5" />
              </button>
              <span>{cartQuantity}</span>
              <button
                className="flex items-center h-full p-3 text-white border-none outline-none cursor-pointer bg-transparent"
                onClick={(e) => handleUpdateQuantity(e, cartQuantity + 1)}
              >
                <Plus className="h-5" />
              </button>
            </div>
          ) : (
            <button
              className="flex items-center w-full overflow-hidden duration-75 ease-in-out bg-gray-100 border-0 border-green-700 rounded cursor-pointer group focus:border-none h-9 hover:bg-secondary-100 hover:text-white transition-all"
              onClick={handleAddToCart}
            >
              <p className="flex-grow text-sm font-roboto">Add to Cart</p>
              <span className="flex items-center px-2 transition-all duration-75 ease-in-out bg-gray-200 h-9 hover:text-white group-hover:bg-secondary">
                <Plus className="h-5" />
              </span>
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductOption;
