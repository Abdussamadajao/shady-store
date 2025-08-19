import React from "react";
import { formatNGN } from "@/utils/currency";
import type { Product } from "@/hooks/useProducts";
import ProductActions from "./ProductActions";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface ProductDetailsProps {
  product: Product;
  cartQuantity: number;
  onAddToCart: (e: React.MouseEvent) => void;
  onIncrement: (e: React.MouseEvent) => void;
  onDecrement: (e: React.MouseEvent) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  cartQuantity,
  onAddToCart,
  onIncrement,
  onDecrement,
}) => {
  return (
    <div className="h-full flex flex-col space-y-6 lg:space-y-8">
      {/* Product Name */}
      <div className="flex-shrink-0">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 leading-tight">
          {product.name}
        </h1>
        {product.shortDescription && (
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            {product.shortDescription}
          </p>
        )}
      </div>

      {/* Price */}
      <div className="py-4 flex-shrink-0">
        <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
          {formatNGN(product.price)}
        </span>
      </div>

      {/* Product Status */}
      <div className="flex items-center gap-3 flex-wrap flex-shrink-0">
        <Badge
          variant={product.isActive ? "default" : "secondary"}
          className={`px-4 py-2 text-sm font-semibold ${
            product.isActive
              ? "bg-secondary-100 text-white"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {product.isActive ? "Available" : "Unavailable"}
        </Badge>
        {product._count.reviews > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-full">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">
              {product._count.reviews} reviews
            </span>
          </div>
        )}
      </div>

      {/* Add to Cart Button */}
      <div className="pt-4 flex-shrink-0">
        <ProductActions
          product={product}
          cartQuantity={cartQuantity}
          onAddToCart={onAddToCart}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
        />
      </div>

      {/* Quick Product Summary */}
      <div className="pt-6 border-t border-gray-200 space-y-4 bg-gray-50 rounded-xl p-6 flex-1">
        <h3 className="font-semibold text-gray-900 mb-4 text-lg">
          Quick Summary
        </h3>

        {/* Product Status */}
        <div className="flex items-center gap-3">
          <span className="text-gray-600 font-medium">Status:</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              product.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {product.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Category */}
        <div className="flex items-center gap-3">
          <span className="text-gray-600 font-medium">Category:</span>
          <span className="px-3 py-1 bg-secondary-100 text-white rounded-full text-sm font-semibold">
            {product.category.name}
          </span>
        </div>

        {/* Reviews Count */}
        {product._count.reviews > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-gray-600 font-medium">Reviews:</span>
            <span className="text-gray-800 text-sm font-medium">
              {product._count.reviews} review
              {product._count.reviews !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
