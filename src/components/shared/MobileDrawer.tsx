import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Filter, Home, Gift, HelpCircle, LogIn, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { SearchBar, ProductSuggestions } from "./index";
import { useProductsStore } from "@/store/products";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { PATH } from "@/routes/paths";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuthStore } from "@/store/auth";
import type { Product } from "@/hooks/useProducts";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterClick: () => void;
  onAuthClick: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  onFilterClick,
  onAuthClick,
}) => {
  const { searchQuery, setSearchQuery, performSearch } = useProductsStore();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  // Check if we're on the home route
  const isHomeRoute = location.pathname === "/";

  // Function to generate different colors for avatar fallbacks
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-gradient-to-r from-blue-500 to-blue-600",
      "bg-gradient-to-r from-green-500 to-green-600",
      "bg-gradient-to-r from-purple-500 to-purple-600",
      "bg-gradient-to-r from-pink-500 to-pink-600",
      "bg-gradient-to-r from-indigo-500 to-indigo-600",
      "bg-gradient-to-r from-red-500 to-red-600",
      "bg-gradient-to-r from-yellow-500 to-yellow-600",
      "bg-gradient-to-r from-teal-500 to-teal-600",
      "bg-gradient-to-r from-orange-500 to-orange-600",
      "bg-gradient-to-r from-cyan-500 to-cyan-600",
    ];

    // Generate a consistent color based on the name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const handleSearch = (query: string) => {
    performSearch(query);
    setShowSuggestions(false);
  };

  const handleInputChange = (value: string) => {
    setLocalSearchQuery(value);
    setShowSuggestions(value.trim().length > 0);
  };

  const handleClear = () => {
    setLocalSearchQuery("");
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const handleProductSelect = (product: Product) => {
    setLocalSearchQuery(product.name);
    performSearch(product.name);
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    if (localSearchQuery.trim().length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleFilterClick = () => {
    onFilterClick();
    onClose();
  };

  const handleAuthClick = () => {
    onAuthClick();
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[85vw] max-w-sm">
        <SheetHeader className="pb-6">
          <div className="flex flex-col items-start space-y-4">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-secondary">
              Pick Bazar
            </Link>
          </div>
        </SheetHeader>

        <div className="flex flex-col h-full px-4 py-8">
          {/* Search Section */}
          {isHomeRoute && (
            <div className="mb-6 relative">
              <SearchBar
                placeholder="Search products..."
                className="w-full bg-gray-100 border-none"
                value={localSearchQuery}
                onChange={handleInputChange}
                onClear={handleClear}
                onSearch={handleSearch}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              <ProductSuggestions
                searchQuery={localSearchQuery}
                isVisible={showSuggestions}
                onProductSelect={handleProductSelect}
                onClose={() => setShowSuggestions(false)}
                className="w-full"
              />
            </div>
          )}

          {/* Navigation Links */}
          <div className="flex-1 space-y-2">
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Home className="h-5 w-5 mr-3 text-gray-600" />
              <span className="font-medium">Home</span>
            </Link>

            <Link
              to="/offers"
              onClick={onClose}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Gift className="h-5 w-5 mr-3 text-gray-600" />
              <span className="font-medium">Offers</span>
            </Link>

            <Link
              to={PATH.account.settings}
              onClick={onClose}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="h-5 w-5 mr-3 text-gray-600" />
              <span className="font-medium">Settings</span>
            </Link>
            <Link
              to="/help"
              onClick={onClose}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <HelpCircle className="h-5 w-5 mr-3 text-gray-600" />
              <span className="font-medium">Need Help</span>
            </Link>

            <button
              onClick={handleFilterClick}
              className="flex items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Filter className="h-5 w-5 mr-3 text-gray-600" />
              <span className="font-medium">Filter Products</span>
            </button>
          </div>

          {/* User Section */}
          <div className="pt-6 border-t border-gray-200 w-full">
            {isAuthenticated ? (
              <Button
                variant="ghost"
                className="flex items-center gap-2 hover:bg-muted focus:outline-0 focus:ring-0 focus:ring-offset-0"
              >
                <Avatar>
                  <AvatarImage src={user?.image} />
                  <AvatarFallback
                    className={`${getAvatarColor(
                      user?.name || user?.firstName || "User"
                    )} text-white`}
                  >
                    {user?.firstName?.charAt(0) || user?.name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <p className="text-sm font-medium text-foreground">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </Button>
            ) : (
              <Button
                onClick={handleAuthClick}
                className="w-full bg-green-600 hover:bg-green-700 font-medium"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Sign In / Sign Up
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileDrawer;
