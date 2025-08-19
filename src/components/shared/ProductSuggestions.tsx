import React from "react";
import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/hooks/useProducts";
import { Search, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductSuggestionsProps {
  searchQuery: string;
  isVisible: boolean;
  onProductSelect: (product: Product) => void;
  onClose: () => void;
  className?: string;
}

export const ProductSuggestions: React.FC<ProductSuggestionsProps> = ({
  searchQuery,
  isVisible,
  onProductSelect,
  onClose,
  className,
}) => {
  const { data, isLoading } = useProducts({
    search: searchQuery.trim() || undefined,
    limit: 8, // Limit suggestions to 8 products
  });

  const products = data?.products || [];

  if (!isVisible || !searchQuery.trim()) {
    return null;
  }

  const handleProductClick = (product: Product) => {
    onProductSelect(product);
    onClose();
  };

  return (
    <div
      className={cn(
        "absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto",
        className
      )}
    >
      {isLoading ? (
        <div className="p-4 text-center text-gray-500">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-secondary mx-auto mb-2"></div>
          Searching products...
        </div>
      ) : products.length > 0 ? (
        <div className="py-2">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex-shrink-0">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                    <Package className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {product.name}
                </h4>
                <p className="text-xs text-gray-500 truncate">
                  {product.description || product.shortDescription}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-semibold text-secondary">
                    ${product.price}
                  </span>
                  {product._count?.reviews > 0 && (
                    <span className="text-xs text-gray-400">
                      📝 {product._count.reviews} reviews
                    </span>
                  )}
                </div>
              </div>
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </div>
          ))}
        </div>
      ) : searchQuery.trim().length > 2 ? (
        <div className="p-4 text-center text-gray-500">
          <Search className="w-6 h-6 mx-auto mb-2 text-gray-400" />
          <p>No products found for "{searchQuery}"</p>
          <p className="text-sm">Try a different search term</p>
        </div>
      ) : null}
    </div>
  );
};
