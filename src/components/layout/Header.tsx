import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, User, Filter, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { SearchBar, FilterDrawer, MobileDrawer } from "../shared";
import { useProductStore } from "@/store/products";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

const Header: React.FC = () => {
  const { searchQuery, setSearchQuery } = useProductStore();
  const [show, setShow] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const location = useLocation();

  // Check if we're on the home route
  const isHomeRoute = location.pathname === "/";

  // Mock user state - replace with your actual auth context
  const user = null; // Set to actual user object when authenticated

  const popup = () => {
    setShow(!show);
  };
  const handleSearch = () => {
    setSearchQuery("");
  };
  return (
    <>
      <div className="sticky top-0 z-20 bg-white border-b shadow">
        {/* Mobile Header */}
        <div className="lg:hidden">
          {/* Main Mobile Header */}
          <div className="flex items-center justify-between p-3 px-4">
            {/* Hamburger Menu Button */}
            <button
              onClick={() => setShowMobileDrawer(true)}
              className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
            <div className="w-10"></div> {/* Spacer to balance the layout */}
            <Link to="/" className="inline-flex items-center p-2">
              <div className="w-24 h-10 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-600 font-semibold text-sm">
                  LOGO
                </span>
              </div>
            </Link>
          </div>

          {/* Second Mobile Header - Filter Section */}
          <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
            <button
              onClick={() => setShowFilterDrawer(true)}
              className="flex items-center justify-center w-full px-4 py-3 font-medium text-gray-700 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
            >
              <Filter className="h-4 w-4 mr-2" />
              <span className="text-sm">Filter Products</span>
            </button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between p-3 px-5">
          <Link to="/" className="inline-flex items-center p-2 ml-5">
            <div className="w-30 h-12 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-600 font-semibold">LOGO</span>
            </div>
          </Link>

          <div className="flex-grow max-w-2xl flex items-center justify-center">
            {isHomeRoute && (
              <SearchBar
                placeholder="Search your products from here"
                className="flex-grow w-full ml-4 bg-gray-100 border-none"
                value={searchQuery}
                onChange={(value) => setSearchQuery(value)}
                onClear={handleSearch}
              />
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/offers"
              className="px-3 py-2 font-bold text-gray-700 rounded hover:text-green-700 transition-colors"
            >
              Offer
            </Link>
            <Link
              to="/help"
              className="px-3 py-2 font-bold text-gray-700 rounded hover:text-green-700 transition-colors"
            >
              Need Help
            </Link>
            {!!user ? (
              <div className="ml-3">
                <User className="h-6 w-6 text-gray-600" />
              </div>
            ) : (
              <Button
                onClick={popup}
                className="bg-secondary-100 hover:bg-secondary cursor-pointer"
              >
                Join
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Auth Modal - Shadcn Dialog */}
      <Dialog open={show} onOpenChange={setShow}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-poppins">
              Sign In / Sign Up
            </DialogTitle>
            <DialogDescription className="text-gray-600 font-inter">
              Authentication modal content goes here. You can integrate your
              existing Auth component.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-gray-500 font-inter">
              Choose your authentication method to continue.
            </p>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => setShow(false)}
              className="flex-1 font-inter"
            >
              Cancel
            </Button>
            <Button
              onClick={() => setShow(false)}
              className="flex-1 bg-secondary-100 hover:bg-secondary font-poppins"
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
        onAuthClick={popup}
      />
    </>
  );
};

export default Header;
