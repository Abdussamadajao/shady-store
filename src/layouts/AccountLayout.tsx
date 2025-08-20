import { Link, useLocation, Outlet } from "react-router-dom";
import {
  Settings,
  Package,
  User,
  LogOut,
  MapPin,
  Heart,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const AccountLayout = () => {
  const location = useLocation();

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-4 sticky top-[100px] w-full max-w-[280px]">
                <div className="space-y-4">
                  {/* User Info */}
                  <div className="text-center pb-4 border-b border-gray-200">
                    <div className="w-16 h-16 bg-secondary rounded-full mx-auto mb-3 flex items-center justify-center">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      My Account
                    </h2>
                    <p className="text-xs text-gray-600">Manage your account</p>
                  </div>

                  {/* Navigation */}
                  <nav className="space-y-1">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive(item.href)
                              ? "bg-secondary text-white"
                              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <div className="flex-1">
                            <span className="block">{item.name}</span>
                            <span
                              className={`text-xs ${
                                isActive(item.href)
                                  ? "text-white/80"
                                  : "text-gray-500"
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
                      className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 text-sm"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
