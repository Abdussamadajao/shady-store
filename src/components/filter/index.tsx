import React from "react";
import { useSelectedCategory, useProductsStore } from "@/store/products";
import { useCategories } from "@/hooks/useCategories";
import { data } from "./sideOption";
import { X } from "lucide-react";

const Filter: React.FC = () => {
  const selectedCategory = useSelectedCategory();
  const { setSelectedCategory, resetFilters } = useProductsStore();

  // Use React Query to fetch categories
  const { data: categoriesData, isLoading, error } = useCategories();

  // Create a map of category to icon for quick lookup
  const categoryIconMap = React.useMemo(() => {
    const map = new Map<string, React.ReactNode>();
    data.forEach((item) => {
      map.set(item.category, item.icon);
    });
    return map;
  }, []);

  const handleFilter = (category: string) => {
    setSelectedCategory(category);
  };

  const handleClearFilters = () => {
    resetFilters();
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-h-full grid grid-cols-1 gap-3 overflow-auto p-2 scrollbar lg:grid-cols-2 xl:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-16 lg:h-20 bg-gray-200 rounded-lg mb-2"></div>
            <div className="bg-gray-200 rounded h-3"></div>
          </div>
        ))}
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="max-h-full p-4">
        <div className="text-center">
          <p className="text-red-500 text-sm mb-2">Failed to load categories</p>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1 text-xs bg-secondary text-white rounded hover:bg-secondary-100 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Get categories from API response, fallback to empty array
  const categories = categoriesData || [];

  // Filter out "All" category for the sidebar
  const filteredCategories = categories.filter(
    (category) => category.name !== "All"
  );

  return (
    <div className="space-y-4">
      {/* Clear Filters Button */}
      {selectedCategory !== "All" && (
        <div className="w-full">
          <button
            onClick={handleClearFilters}
            className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 hover:border-gray-400 transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            Clear Filters
          </button>
        </div>
      )}

      {/* Categories Grid - Responsive */}
      <div className="grid grid-cols-1 gap-3">
        {filteredCategories.map((category) => {
          const icon = categoryIconMap.get(category.name) || (
            <div className="h-8 w-8 text-gray-500">🛒</div>
          );

          return (
            <div
              key={category.id}
              onClick={() => handleFilter(category.id)}
              className={`px-4 py-4 text-left bg-white border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm ${
                selectedCategory === category.id
                  ? "border-secondary bg-blue-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleFilter(category.id)}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">{icon}</div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${
                      selectedCategory === category.id
                        ? "text-secondary"
                        : "text-gray-700"
                    }`}
                  >
                    {category.name}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Filter;
