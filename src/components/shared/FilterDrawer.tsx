import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { useSelectedCategory, useProductsStore } from "@/store/products";
import {
  Apple,
  Beef,
  Coffee,
  PawPrint,
  SprayCan,
  Milk,
  ChefHat,
  PieChart,
  Wine,
  Heart,
  X,
} from "lucide-react";
import { useCategories } from "@/hooks";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const selectedCategory = useSelectedCategory();
  const { setSelectedCategory, resetFilters } = useProductsStore();

  const { data: categoriesData, isLoading, error } = useCategories();

  // Create a map of category to icon for quick lookup
  // Create a map of category to icon for quick lookup
  const categoryIconMap = React.useMemo(() => {
    const map = new Map<string, React.ReactNode>();
    const data = [
      {
        category: "Fruits & Vegetables",
        icon: <Apple className="h-8 w-8 text-green-600" />,
      },
      {
        category: "Meat & Fish",
        icon: <Beef className="h-8 w-8 text-red-600" />,
      },
      {
        category: "Snack",
        icon: <Coffee className="h-8 w-8 text-yellow-600" />,
      },
      {
        category: "PetCare",
        icon: <PawPrint className="h-8 w-8 text-purple-600" />,
      },
      {
        category: "Home & Cleaning",
        icon: <SprayCan className="h-8 w-8 text-blue-600" />,
      },
      {
        category: "Dairy",
        icon: <Milk className="h-8 w-8 text-blue-500" />,
      },
      {
        category: "Cooking",
        icon: <ChefHat className="h-8 w-8 text-orange-600" />,
      },
      {
        category: "Breakfast",
        icon: <PieChart className="h-8 w-8 text-pink-600" />,
      },
      {
        category: "Beverage",
        icon: <Wine className="h-8 w-8 text-red-500" />,
      },
      {
        category: "Beauty & Health",
        icon: <Heart className="h-8 w-8 text-pink-500" />,
      },
    ];

    data.forEach((item) => {
      map.set(item.category, item.icon);
    });
    return map;
  }, []);

  const handleFilter = (category: string) => {
    setSelectedCategory(category);
    onClose(); // Close drawer after selection
  };

  const handleClearFilters = () => {
    resetFilters();
    onClose(); // Close drawer after clearing
  };

  // Filter out "All" category for the drawer
  const categories = categoriesData || [];

  // Filter out "All" category for the sidebar
  const filteredCategories = categories.filter(
    (category) => category.name !== "All"
  );
  if (isLoading) {
    return (
      <div className="max-h-full lg:hidden grid grid-cols-1 gap-3 overflow-auto p-2 scrollbar lg:grid-cols-2 xl:grid-cols-2">
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
      <div className="max-h-full p-4 block lg:hidden">
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

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[80vh] lg:hidden">
        <SheetHeader className="pb-6">
          <SheetTitle className="text-xl font-semibold text-gray-800 font-poppins">
            Filter Products
          </SheetTitle>
          <SheetDescription className="text-gray-600 font-inter">
            Choose categories to filter your products
          </SheetDescription>
        </SheetHeader>

        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {/* Clear Filters Button */}
          {selectedCategory !== "All" && (
            <div className="mb-6">
              <button
                onClick={handleClearFilters}
                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 hover:border-gray-400 transition-colors font-inter"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </button>
            </div>
          )}

          {/* Category Grid */}
          <div className="grid grid-cols-2 gap-4">
            {filteredCategories.map((category) => {
              const icon = categoryIconMap.get(category.name) || (
                <div className="h-8 w-8 text-gray-500">🛒</div>
              );

              return (
                <div
                  key={category.id}
                  onClick={() => handleFilter(category.id)}
                  className={`px-2 py-3  text-center bg-white border-2 rounded-lg cursor-pointer transition-colors  ${
                    selectedCategory === category.id
                      ? "border-secondary-100 bg-blue-50"
                      : "border-gray-200 hover:border-gray-200"
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleFilter(category.id)
                  }
                >
                  <div className="box-border flex items-center justify-center h-16 lg:h-20 px-3 lg:px-5 py-2 lg:py-3">
                    {icon}
                  </div>
                  <p
                    className={`text-xs font-semibold ${
                      selectedCategory === category.name
                        ? "text-secondary-100 font-poppins"
                        : "text-gray-700 font-inter"
                    }`}
                  >
                    {category.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <SheetFooter className="pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-secondary text-white rounded-lg font-medium font-poppins hover:bg-secondary-100 transition-colors"
          >
            Apply Filters
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FilterDrawer;
