import { Link, useLocation, Outlet } from "react-router-dom";
import { Settings, Package, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const AccountLayout = () => {
  const location = useLocation();

  const navigationItems = [
    {
      name: "Profile",
      href: "/account/profile",
      icon: User,
      description: "Manage your personal information",
    },
    {
      name: "Orders",
      href: "/account/orders",
      icon: Package,
      description: "View your order history",
    },
    {
      name: "Settings",
      href: "/account/settings",
      icon: Settings,
      description: "Account and app preferences",
    },
  ];

  const isActive = (href: string) => {
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-[100px]">
              <div className="space-y-6">
                {/* User Info */}
                <div className="text-center pb-6 border-b border-gray-200">
                  <div className="w-20 h-20 bg-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    My Account
                  </h2>
                  <p className="text-sm text-gray-600">Manage your account</p>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          isActive(item.href)
                            ? "bg-secondary text-white"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>

                {/* Logout Button */}
                <div className="pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
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
  );
};

export default AccountLayout;
