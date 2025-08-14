import React from "react";
import {
  useSelectedCategory,
  useAvailableCategories,
  useProductStore,
} from "@/store/products";
import { data } from "./sideOption";
import { X } from "lucide-react";

const Filter: React.FC = () => {
  const selectedCategory = useSelectedCategory();
  const { setSelectedCategory, resetFilters } = useProductStore();
  const categories = useAvailableCategories();

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

  // Filter out "All" category for the sidebar
  const filteredCategories = categories.filter(
    (category) => category !== "All"
  );

  return (
    <div className="max-h-full grid grid-cols-1 gap-3 overflow-auto p-2 scrollbar lg:grid-cols-2 xl:grid-cols-2">
      {/* Clear Filters Button */}
      {selectedCategory !== "All" && (
        <div className="col-span-full mb-4">
          <button
            onClick={handleClearFilters}
            className="flex items-center justify-center w-full px-4 py-2 text-xs lg:text-xs xl:text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 hover:border-gray-400 transition-colors font-inter"
          >
            <X className="w-4 h-4 mr-2" />
            Clear Filters
          </button>
        </div>
      )}
      {filteredCategories.map((category) => {
        const icon = categoryIconMap.get(category) || (
          <div className="h-8 w-8 text-gray-500">🛒</div>
        );

        return (
          <div
            key={category}
            onClick={() => handleFilter(category)}
            className={`px-2 py-3  text-center bg-white border-2 rounded-lg cursor-pointer transition-colors ${
              selectedCategory === category
                ? "border-secondary-100 bg-blue-50"
                : "border-white hover:border-gray-200"
            }`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleFilter(category)}
          >
            <div className="box-border flex items-center justify-center h-16 lg:h-20 px-3 lg:px-5 py-2 lg:py-3">
              {icon}
            </div>
            <p
              className={`text-xs font-semibold ${
                selectedCategory === category
                  ? "text-secondary-100 font-poppins"
                  : "text-gray-700 font-inter"
              }`}
            >
              {category}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Filter;
