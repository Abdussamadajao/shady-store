import { useState } from "react";
import { Tag, Clock, ShoppingCart, Heart, Share2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOffersStore } from "@/store/offers";

const Offers = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { activeOffers } = useOffersStore();

  const categories = [
    { value: "all", label: "All Offers" },
    { value: "Fruits & Vegetables", label: "Fruits & Vegetables" },
    { value: "Meat & Fish", label: "Meat & Fish" },
    { value: "Dairy", label: "Dairy" },
    { value: "Bulk Purchase", label: "Bulk Purchase" },
    { value: "General", label: "General" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "discount", label: "Highest Discount" },
    { value: "expiry", label: "Expiring Soon" },
  ];

  const filteredOffers = activeOffers
    .filter(
      (offer) =>
        selectedCategory === "all" || offer.category === selectedCategory
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );
        case "oldest":
          return (
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          );
        case "discount":
          return b.discountValue - a.discountValue;
        case "expiry":
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        default:
          return 0;
      }
    });

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryColor = (days: number) => {
    if (days <= 1) return "text-red-600 bg-red-100";
    if (days <= 3) return "text-orange-600 bg-orange-100";
    return "text-green-600 bg-green-100";
  };

  const getDiscountDisplay = (offer: any) => {
    if (offer.discountType === "percentage") {
      return `${offer.discountValue}% OFF`;
    } else if (offer.discountType === "fixed") {
      return `₦${offer.discountValue} OFF`;
    } else if (offer.discountType === "bogo") {
      return "BOGO";
    }
    return "Special Offer";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Special Offers & Deals
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing deals, flash sales, and exclusive offers on fresh
            groceries and household items
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-secondary">
                {activeOffers.length}
              </div>
              <div className="text-sm text-gray-600">Active Offers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.max(...activeOffers.map((o) => o.discountValue))}%
              </div>
              <div className="text-sm text-gray-600">Max Discount</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {activeOffers.filter((o) => o.isHot).length}
              </div>
              <div className="text-sm text-gray-600">Hot Deals</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {activeOffers.filter((o) => o.isNew).length}
              </div>
              <div className="text-sm text-gray-600">New Offers</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="flex-1">
                <Input placeholder="Search offers..." className="max-w-md" />
              </div>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer) => {
            const daysUntilExpiry = getDaysUntilExpiry(offer.endDate);
            const expiryText =
              daysUntilExpiry <= 0 ? "Expired" : `${daysUntilExpiry} days left`;

            return (
              <Card
                key={offer.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {offer.isNew && (
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          New
                        </Badge>
                      )}
                      {offer.isHot && (
                        <Badge className="bg-red-100 text-red-800 text-xs">
                          Hot
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎯</div>
                    <CardTitle className="text-lg">{offer.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 text-center">
                    {offer.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 justify-center">
                    {offer.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Discount Display */}
                  <div className="text-center">
                    <Badge className="bg-green-100 text-green-800 text-sm">
                      {getDiscountDisplay(offer)}
                    </Badge>
                  </div>

                  {/* Category */}
                  <div className="text-center">
                    <Badge variant="outline" className="text-xs">
                      {offer.category}
                    </Badge>
                  </div>

                  {/* Expiry */}
                  <div className="text-center">
                    <Badge className={getExpiryColor(daysUntilExpiry)}>
                      <Clock className="h-3 w-3 mr-1" />
                      {expiryText}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-secondary hover:bg-secondary-100">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Shop Now
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Tag className="h-4 w-4 mr-2" />
                      View Products
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* No Offers Message */}
        {filteredOffers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No offers found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or check back later for new deals
            </p>
            <Button
              onClick={() => setSelectedCategory("all")}
              className="bg-secondary hover:bg-secondary-100"
            >
              View All Offers
            </Button>
          </div>
        )}

        {/* Newsletter Signup */}
        <Card className="mt-12 bg-gradient-to-r from-secondary to-secondary-100 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Never Miss a Deal!</h3>
            <p className="mb-6 opacity-90">
              Subscribe to our newsletter and be the first to know about
              exclusive offers and flash sales
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                placeholder="Enter your email"
                className="flex-1 bg-white text-gray-900 placeholder-gray-500"
              />
              <Button className="bg-white text-secondary hover:bg-gray-100">
                Subscribe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Offers;
