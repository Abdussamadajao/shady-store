import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Filter, Home, Gift, HelpCircle, LogIn, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { SearchBar } from "./index";
import { useProductsStore } from "@/store/products";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { PATH } from "@/routes/paths";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuthStore } from "@/store/auth";

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
  const { searchQuery, setSearchQuery } = useProductsStore();
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  // Check if we're on the home route
  const isHomeRoute = location.pathname === "/";

  const handleSearch = () => {
    setSearchQuery("");
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
            <div className="mb-6">
              <SearchBar
                placeholder="Search products..."
                className="w-full bg-gray-100 border-none"
                value={searchQuery}
                onChange={(value) => setSearchQuery(value)}
                onClear={handleSearch}
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
                  <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white">
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
