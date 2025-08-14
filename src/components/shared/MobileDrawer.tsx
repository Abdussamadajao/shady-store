import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Search,
  User,
  Filter,
  Menu,
  X,
  Home,
  Gift,
  HelpCircle,
  LogIn,
  Settings,
} from "lucide-react";
import { Button } from "../ui/button";
import { SearchBar } from "./index";
import { useProductStore } from "@/store/products";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PATH } from "@/routes/paths";

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
  const { searchQuery, setSearchQuery } = useProductStore();
  const location = useLocation();

  // Check if we're on the home route
  const isHomeRoute = location.pathname === "/";

  // Mock user state - replace with your actual auth context
  const user = null;

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
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-semibold text-gray-800 font-poppins">
              Menu
            </SheetTitle>
            {/* <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button> */}
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
          <div className="pt-6 border-t border-gray-200">
            {user ? (
              <div className="flex items-center px-4 py-3">
                <User className="h-6 w-6 mr-3 text-gray-600" />
                <span className="font-medium text-gray-700">My Account</span>
              </div>
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
