import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Settings,
  Package,
  User,
  LogOut,
  MapPin,
  Heart,
  MessageSquare,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";

const AccountLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useAuthStore();

  const navigationItems = [
    {
      name: "Profile",
      href: "/account/profile",
      icon: User,
      description: "Personal info & addresses",
    },
    {
      name: "Orders",
      href: "/account/orders",
      icon: Package,
      description: "Order history & tracking",
    },
    {
      name: "Wishlist",
      href: "/account/wishlist",
      icon: Heart,
      description: "Saved products & favorites",
    },
    {
      name: "Reviews",
      href: "/account/reviews",
      icon: MessageSquare,
      description: "Your product reviews",
    },
    {
      name: "Settings",
      href: "/account/settings",
      icon: Settings,
      description: "Account preferences",
    },
  ];

  const isActive = (href: string) => {
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
  };

  const getCurrentPageInfo = () => {
    const currentItem = navigationItems.find((item) => isActive(item.href));
    return (
      currentItem || { name: "Account", description: "Manage your account" }
    );
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const SidebarContent = () => (
    <div className="space-y-4">
      {/* User Info */}
      <div className="text-center pb-4 border-b border-gray-200">
        <div className="w-16 h-16 bg-secondary rounded-full mx-auto mb-3 flex items-center justify-center">
          <User className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">My Account</h2>
        <p className="text-xs text-gray-600">Manage your account</p>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-secondary text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="block font-medium">{item.name}</span>
                <span
                  className={`text-xs ${
                    isActive(item.href) ? "text-white/80" : "text-gray-500"
                  }`}
                >
                  {item.description}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="pt-3 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 text-sm py-3 px-4"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  const currentPage = getCurrentPageInfo();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Header */}
          <div className="lg:hidden mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="p-2.5 h-10 w-10"
                    >
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-[300px] sm:w-[400px] p-0 border-r border-gray-200"
                  >
                    <SheetHeader className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                      <SheetTitle className="text-left text-lg font-semibold">
                        Account Menu
                      </SheetTitle>
                    </SheetHeader>
                    <div className="px-6 py-4 overflow-y-auto h-full">
                      <SidebarContent />
                    </div>
                  </SheetContent>
                </Sheet>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {currentPage.name}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {currentPage.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Link
                to="/account"
                className="hover:text-gray-700 transition-colors"
              >
                Account
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-gray-900 font-medium">
                {currentPage.name}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block lg:col-span-1">
              <Card className="p-4 sticky top-[100px] w-full max-w-[280px]">
                <SidebarContent />
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="lg:pl-0 min-h-[calc(100vh-200px)]">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
