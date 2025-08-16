import React from "react";
import ProductOption from "./ProductOption";
import { useInfiniteProducts } from "@/hooks/useInfiniteProducts";
import { useProductsStore } from "@/store/products";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ProductProps {
  viewMode?: "grid" | "list";
}

const Product: React.FC<ProductProps> = ({ viewMode = "grid" }) => {
  const { selectedCategory, searchQuery } = useProductsStore();

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProducts({
    category: selectedCategory === "All" ? undefined : selectedCategory,
    search: searchQuery.trim() || undefined,
    limit: 12, // Increased limit for better pagination
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Responsive loading skeleton */}
        <div
          className={`grid gap-4 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
              : "grid-cols-1"
          }`}
        >
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              {viewMode === "grid" ? (
                <>
                  <div className="bg-gray-200 rounded-lg h-48 mb-3"></div>
                  <div className="bg-gray-200 rounded h-4 mb-2"></div>
                  <div className="bg-gray-200 rounded h-4 w-2/3"></div>
                </>
              ) : (
                <div className="flex space-x-4">
                  <div className="bg-gray-200 rounded-lg h-24 w-24 flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="bg-gray-200 rounded h-4"></div>
                    <div className="bg-gray-200 rounded h-4 w-3/4"></div>
                    <div className="bg-gray-200 rounded h-4 w-1/2"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load products</p>
          <Button
            onClick={() => window.location.reload()}
            variant="secondary"
            className="hover:bg-secondary-100"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const allProducts = data?.pages.flatMap((page) => page.products) || [];

  if (allProducts.length === 0) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <p className="text-gray-500 mb-2">No products found</p>
          <p className="text-sm text-gray-400">
            Try adjusting your search or filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Products Display - Grid or List View */}
      <div
        className={`grid gap-4 ${
          viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 "
            : "grid-cols-1"
        }`}
      >
        {allProducts.map((product) => (
          <ProductOption
            key={product.id}
            id={product.id}
            images={product.images.map((img) => img.url)}
            name={product.name}
            price={product.price.toString()}
            count="1"
            viewMode={viewMode}
          />
        ))}
      </div>

      {/* Load More Button - Responsive */}
      {hasNextPage && (
        <div className="flex justify-center pt-6">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="bg-secondary hover:bg-secondary-100 cursor-pointer px-8 py-3 text-base"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Products"
            )}
          </Button>
        </div>
      )}

      {/* End of results message */}
      {!hasNextPage && allProducts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            You've reached the end of the results
          </p>
        </div>
      )}
    </div>
  );
};

export default Product;
