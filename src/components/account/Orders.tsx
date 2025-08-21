import { useState } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Eye,
  MapPin,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatNGN } from "@/utils/currency";
import type { Order } from "@/types";
import { useDeliveryFee } from "@/store/checkout";
import CancelOrderModal from "./CancelOrderModal";

interface OrdersProps {
  orders: Order[];
  onCancelOrder?: (orderId: string, reason?: string) => void;
  onRequestRefund?: (orderId: string, reason: string, items?: any[]) => void;
  onViewOrder?: (orderId: string) => void;
  onTrackOrder?: (orderId: string) => void;
  isLoading?: boolean;
}

const Orders: React.FC<OrdersProps> = ({
  orders,
  onCancelOrder,
  onRequestRefund,
  onViewOrder,
  onTrackOrder,
  isLoading = false,
}) => {
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedOrderForCancel, setSelectedOrderForCancel] =
    useState<Order | null>(null);

  const handleCancelClick = (order: Order) => {
    setSelectedOrderForCancel(order);
    setCancelModalOpen(true);
  };

  const handleCancelConfirm = (reason: string) => {
    if (selectedOrderForCancel && onCancelOrder) {
      onCancelOrder(selectedOrderForCancel.id, reason);
      setCancelModalOpen(false);
      setSelectedOrderForCancel(null);
    }
  };

  const handleCancelClose = () => {
    setCancelModalOpen(false);
    setSelectedOrderForCancel(null);
  };
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-blue-600" />;
      case "processing":
      case "confirmed":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
      case "confirmed":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "Delivered";
      case "shipped":
        return "Shipped";
      case "processing":
        return "Processing";
      case "confirmed":
        return "Confirmed";
      case "cancelled":
        return "Cancelled";
      case "refunded":
        return "Refunded";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const canCancelOrder = (status: string) => {
    return ["pending", "confirmed"].includes(status.toLowerCase());
  };

  const canRequestRefund = (status: string) => {
    return status.toLowerCase() === "delivered";
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No orders found
        </h3>
        <p className="text-gray-600 mb-6">You haven't placed any orders yet</p>
        <Button className="bg-secondary hover:bg-secondary-100">
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-2">
          Track your orders and view order history
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(order.status)}
                  <div>
                    <CardTitle className="text-lg">
                      {order.orderNumber}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Ordered on{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
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
                {order.orderItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      {item.product.images &&
                        item.product.images.length > 0 && (
                          <img
                            src={item.product.images[0].url}
                            alt={
                              item.product.images[0].alt || item.product.name
                            }
                            className="w-12 h-12 object-cover rounded-md"
                          />
                        )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium text-gray-900">
                      {formatNGN(item.totalPrice)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {order.shippingAddress && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Delivery Address
                    </h4>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mt-0.5 text-secondary" />
                      <div>
                        <p>
                          {order.shippingAddress.firstName}{" "}
                          {order.shippingAddress.lastName}
                        </p>
                        <p>{order.shippingAddress.addressLine1}</p>
                        {order.shippingAddress.addressLine2 && (
                          <p>{order.shippingAddress.addressLine2}</p>
                        )}
                        <p>
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state}{" "}
                          {order.shippingAddress.postalCode}
                        </p>
                        <p>{order.shippingAddress.country}</p>
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Order Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span>{formatNGN(order.subtotal)}</span>
                    </div>
                    {order.taxAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax:</span>
                        <span>{formatNGN(order.taxAmount)}</span>
                      </div>
                    )}
                    {order.shippingAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping:</span>
                        <span>{formatNGN(order.shippingAmount)}</span>
                      </div>
                    )}
                    {order.discountAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount:</span>
                        <span className="text-green-600">
                          -{formatNGN(order.discountAmount)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>Total:</span>
                      <span>{formatNGN(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-6 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => onViewOrder?.(order.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => onTrackOrder?.(order.id)}
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Track Order
                </Button>
                {canCancelOrder(order.status) && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleCancelClick(order)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Order
                  </Button>
                )}
                {canRequestRefund(order.status) && (
                  <Button
                    className="flex-1 bg-secondary hover:bg-secondary-100"
                    onClick={() => onRequestRefund?.(order.id, "Quality issue")}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Request Refund
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cancel Order Modal */}
      {selectedOrderForCancel && (
        <CancelOrderModal
          isOpen={cancelModalOpen}
          onClose={handleCancelClose}
          onConfirm={handleCancelConfirm}
          orderNumber={selectedOrderForCancel.orderNumber}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default Orders;
