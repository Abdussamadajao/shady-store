import React, { useState, useCallback } from "react";
import { useSearchProducts } from "@/hooks/useProducts";
import type { Product } from "@/hooks/useProducts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchProductsProps {
  onProductSelect?: (productId: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchProducts: React.FC<SearchProductsProps> = ({
  onProductSelect,
  placeholder = "Search products...",
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Debounce search query to avoid too many API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data, isLoading, error } = useSearchProducts(
    debouncedSearchQuery,
    10
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsOpen(true);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsOpen(false);
  };

  const handleProductSelect = useCallback(
    (productId: string) => {
      onProductSelect?.(productId);
      setIsOpen(false);
      setSearchQuery("");
    },
    [onProductSelect]
  );

  const handleInputFocus = () => {
    if (searchQuery.trim()) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Delay closing to allow clicking on results
    setTimeout(() => setIsOpen(false), 200);
  };

  const products: Product[] = data?.products || [];
  const showResults =
    isOpen && searchQuery.trim() && (products.length > 0 || isLoading);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-secondary mx-auto mb-2"></div>
              Searching...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">
              Failed to search products
            </div>
          ) : products.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No products found
            </div>
          ) : (
            <div className="py-2">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductSelect(product.id)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <img
                        src={
                          product.images[0]?.url ||
                          "https://via.placeholder.com/40x40"
                        }
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {product.category.name}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <p className="text-sm font-medium text-secondary">
                        ${product.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchProducts;
