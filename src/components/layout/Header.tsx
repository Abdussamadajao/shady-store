import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  User,
  Filter,
  Menu,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  SearchBar,
  FilterDrawer,
  MobileDrawer,
  ProductSuggestions,
} from "../shared";
import { useProductsStore } from "@/store/products";
import { useAuthStore } from "@/store/auth";
import { PATH, PATH_AUTH } from "@/routes/paths";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import type { Product } from "@/hooks/useProducts";

const Header: React.FC = () => {
  const { searchQuery, setSearchQuery, performSearch } = useProductsStore();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { isAuthenticated, logout, user } = useAuthStore();
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  const openAuthPage = () => {
    navigate(PATH_AUTH.login);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
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

  return (
    <>
      <div className="sticky top-0 z-20 bg-white border-b shadow">
        <div className="px-4 lg:px-9 xl:px-[60px] py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="hidden md:block text-2xl font-bold text-secondary"
            >
              Pick Bazar
            </Link>
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMobileDrawer(true)}
              className="md:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Search Bar - Only show on home page */}
            {isHomeRoute && (
              <div className="hidden lg:flex flex-1 max-w-[700px] mx-8 relative">
                <SearchBar
                  value={localSearchQuery}
                  onChange={handleInputChange}
                  onClear={handleClear}
                  onSearch={(query) => handleSearch(query)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="Search your products from here"
                  className="flex-grow w-full ml-4 border-none"
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
            {/* Filter Button - Only show on home page */}

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Auth Button */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 hover:bg-muted focus:outline-0 focus:ring-0 focus:ring-offset-0"
                    >
                      <Avatar>
                        <AvatarImage src={user?.image} />
                        <AvatarFallback
                          className={`${getAvatarColor(
                            user?.firstName || "User"
                          )} text-white`}
                        >
                          {user?.firstName?.charAt(0) ||
                            user?.lastName?.charAt(0) ||
                            "A"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden md:flex flex-col items-start">
                        <p className="text-sm font-medium text-foreground">
                          {user?.firstName} {user?.lastName}
                        </p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-full">
                    <DropdownMenuItem asChild>
                      <Link
                        to={PATH.account.profile}
                        className="flex items-center cursor-pointer"
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Account Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={openAuthPage}
                  className="bg-secondary hover:bg-secondary-100"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>

        {isHomeRoute && (
          <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 block md:hidden">
            <Button
              onClick={() => setShowFilterDrawer(true)}
              className="flex items-center justify-center w-full px-4 py-3 font-medium text-gray-700 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
            >
              <Filter className="h-4 w-4 mr-2" />
              <span className="text-sm">Filter Products</span>
            </Button>
          </div>
        )}
      </div>

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={showFilterDrawer}
        onClose={() => setShowFilterDrawer(false)}
      />

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={showMobileDrawer}
        onClose={() => setShowMobileDrawer(false)}
        onFilterClick={() => setShowFilterDrawer(true)}
        onAuthClick={openAuthPage}
      />
    </>
  );
};

export default Header;
