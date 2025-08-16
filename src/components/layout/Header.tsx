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
import { SearchBar, FilterDrawer, MobileDrawer } from "../shared";
import { useProductsStore } from "@/store/products";
import { useAuthStore } from "@/store/auth";
import { PATH_AUTH } from "@/routes/paths";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Header: React.FC = () => {
  const { searchQuery, setSearchQuery } = useProductsStore();
  const { isAuthenticated, logout, user } = useAuthStore();
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we're on the home route
  const isHomeRoute = location.pathname === "/";

  const openAuthPage = () => {
    navigate(PATH_AUTH.login);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearch = () => {
    setSearchQuery("");
  };

  return (
    <>
      <div className="sticky top-0 z-20 bg-white border-b shadow">
        <div className="px-4 md:px-[60px] py-4">
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
              <div className="hidden md:flex flex-1 max-w-2xl mx-8">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSearch={handleSearch}
                  placeholder="Search your products from here"
                  className="flex-grow w-full ml-4 bg-gray-100 border-none"
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
                        <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white">
                          {user?.firstName?.charAt(0) ||
                            user?.name?.charAt(0) ||
                            "A"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden md:flex flex-col items-start">
                        <p className="text-sm font-medium text-foreground">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link
                        to="/account"
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
