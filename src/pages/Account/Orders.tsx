import React, { useState } from "react";
import { Package, Truck, CheckCircle, Clock, Eye, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatNGN } from "@/utils/currency";

const Orders = () => {
  const [orders] = useState([
    {
      id: "ORD-001",
      date: "2024-01-15",
      status: "delivered",
      total: 4500,
      items: [
        { name: "Fresh Tomatoes", quantity: 2, price: 800 },
        { name: "Organic Spinach", quantity: 1, price: 1200 },
        { name: "Local Rice", quantity: 1, price: 1700 },
      ],
      deliveryAddress: "123 Main Street, Lagos, Lagos 100001",
      trackingNumber: "TRK-123456789",
      estimatedDelivery: "2024-01-16",
    },
    {
      id: "ORD-002",
      date: "2024-01-12",
      status: "in-transit",
      total: 3200,
      items: [
        { name: "Fresh Bananas", quantity: 3, price: 600 },
        { name: "Local Honey", quantity: 1, price: 1400 },
      ],
      deliveryAddress: "123 Main Street, Lagos, Lagos 100001",
      trackingNumber: "TRK-987654321",
      estimatedDelivery: "2024-01-14",
    },
    {
      id: "ORD-003",
      date: "2024-01-10",
      status: "processing",
      total: 2800,
      items: [
        { name: "Fresh Milk", quantity: 2, price: 800 },
        { name: "Bread", quantity: 1, price: 1200 },
      ],
      deliveryAddress: "123 Main Street, Lagos, Lagos 100001",
      trackingNumber: "TRK-456789123",
      estimatedDelivery: "2024-01-13",
    },
    {
      id: "ORD-004",
      date: "2024-01-08",
      status: "delivered",
      total: 5600,
      items: [
        { name: "Fresh Fish", quantity: 1, price: 2500 },
        { name: "Vegetables Mix", quantity: 1, price: 1800 },
        { name: "Local Spices", quantity: 1, price: 1300 },
      ],
      deliveryAddress: "123 Main Street, Lagos, Lagos 100001",
      trackingNumber: "TRK-789123456",
      estimatedDelivery: "2024-01-09",
    },
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "in-transit":
        return <Truck className="h-5 w-5 text-blue-600" />;
      case "processing":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "in-transit":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return "Delivered";
      case "in-transit":
        return "In Transit";
      case "processing":
        return "Processing";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-2">
          Track your orders and view order history
        </p>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.length}
                </p>
              </div>
              <Package className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-green-600">
                  {orders.filter((o) => o.status === "delivered").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-blue-600">
                  {orders.filter((o) => o.status === "in-transit").length}
                </p>
              </div>
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {orders.filter((o) => o.status === "processing").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order: any) => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(order.status)}
                  <div>
                    <CardTitle className="text-lg">{order.id}</CardTitle>
                    <p className="text-sm text-gray-600">
                      Ordered on {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {formatNGN(order.total)}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Order Items */}
              <div className="space-y-3 mb-4">
                <h4 className="font-medium text-gray-900">Order Items</h4>
                {order.items.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium text-gray-900">
                      {formatNGN(item.price)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Delivery Address
                  </h4>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mt-0.5 text-secondary" />
                    <p>{order.deliveryAddress}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Tracking Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-600">Tracking #:</span>{" "}
                      {order.trackingNumber}
                    </p>
                    <p>
                      <span className="text-gray-600">Estimated Delivery:</span>{" "}
                      {new Date(order.estimatedDelivery).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-6 pt-4 border-t border-gray-200">
                <Button variant="outline" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline" className="flex-1">
                  <Truck className="h-4 w-4 mr-2" />
                  Track Order
                </Button>
                {order.status === "delivered" && (
                  <Button className="flex-1 bg-secondary hover:bg-secondary-100">
                    Write Review
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Orders;
