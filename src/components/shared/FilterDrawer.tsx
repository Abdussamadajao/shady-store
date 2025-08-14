import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  useSelectedCategory,
  useAvailableCategories,
  useProductStore,
} from "@/store/products";
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

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const selectedCategory = useSelectedCategory();
  const { setSelectedCategory, resetFilters } = useProductStore();
  const categories = useAvailableCategories();

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
  const filteredCategories = categories.filter(
    (category) => category !== "All"
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[80vh] lg:hidden">
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold text-gray-800 font-poppins">
            Filter Products
          </SheetTitle>
          <SheetDescription className="text-gray-600 font-inter">
            Choose categories to filter your products
          </SheetDescription>
        </SheetHeader>

        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto px-4">
          {/* Clear Filters Button */}
          {selectedCategory !== "All" && (
            <div className="mb-4">
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
          <div className="grid grid-cols-2 gap-3">
            {filteredCategories.map((category) => {
              const icon = categoryIconMap.get(category) || (
                <div className="h-8 w-8 text-gray-500">🛒</div>
              );

              return (
                <div
                  key={category}
                  onClick={() => handleFilter(category)}
                  className={`px-3 py-4 text-center bg-white border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedCategory === category
                      ? "text-secondary-100 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && handleFilter(category)}
                >
                  <div className="flex items-center justify-center h-16 mb-2">
                    {icon}
                  </div>
                  <p
                    className={`text-sm font-medium ${
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
        </div>

        <SheetFooter>
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-secondary-100 text-white rounded-lg font-medium font-poppins hover:bg-secondary transition-colors"
          >
            Apply Filters
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FilterDrawer;
