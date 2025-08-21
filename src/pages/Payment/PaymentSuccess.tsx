import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, ArrowRight, Home } from "lucide-react";
import { formatNGN } from "@/utils/currency";

// State structure for the payment success page
// Contains order details, payment ID, and total amount
interface PaymentSuccessState {
  order: {
    id: string;
    orderNumber?: string;
    status: string;
    orderItems: Array<{
      id: string;
      quantity: number;
      product: {
        id: string;
        name: string;
        price: number;
        images: Array<{
          id: string;
          url: string;
          alt: string;
        }>;
      };
    }>;
  };
  paymentId?: string;
  amount: number;
  paymentMethod?: "STRIPE" | "CASH_ON_DELIVERY";
}

// Payment success page - shown after successful payment completion
// Displays order details and provides navigation options
const PaymentSuccess: React.FC = () => {
  useScrollToTop();
  const navigate = useNavigate();
  const location = useLocation();
  const [successState, setSuccessState] =
    React.useState<PaymentSuccessState | null>(null);

  React.useEffect(() => {
    if (location.state) {
      const state = location.state as PaymentSuccessState;
      // Set default payment method to STRIPE if not specified (for backward compatibility)
      if (!state.paymentMethod) {
        state.paymentMethod = "STRIPE";
      }
      setSuccessState(state);
    } else {
      // If no state, redirect to home
      navigate("/");
    }
  }, [location.state, navigate]);

  // Navigation handlers for the action buttons
  const handleViewOrders = () => {
    navigate("/account/orders");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  // Show loading state while waiting for navigation state
  if (!successState) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment confirmation...</p>
        </div>
      </div>
    );
  }

  const { order, paymentId, amount, paymentMethod } = successState;

  // Main success page content with order details and action buttons
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {successState.paymentMethod === "CASH_ON_DELIVERY"
                ? "Order Confirmed!"
                : "Payment Successful!"}
            </h1>
            <p className="text-xl text-gray-600">
              {successState.paymentMethod === "CASH_ON_DELIVERY"
                ? "Thank you for your order. Your order has been confirmed and will be delivered to you. Payment will be collected upon delivery."
                : "Thank you for your order. Your payment has been processed successfully."}
            </p>
          </div>

          {/* Order Details Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Order Number:</span>
                  <span className="font-medium text-gray-900">
                    {order.orderNumber || order.id}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Order Status:</span>
                  <span className="font-medium text-gray-900">
                    {order.status === "CONFIRMED" ? "Confirmed" : order.status}
                  </span>
                </div>
                {successState.paymentMethod === "STRIPE" && paymentId && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Payment ID:</span>
                    <span className="font-medium text-gray-900">
                      {paymentId}
                    </span>
                  </div>
                )}
                {successState.paymentMethod === "CASH_ON_DELIVERY" && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">
                      Payment Method:
                    </span>
                    <span className="font-medium text-gray-900">
                      Cash on Delivery
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Amount:</span>
                  <span className="font-semibold text-lg text-gray-900">
                    {formatNGN(amount)}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Items Ordered:
                </h4>
                <div className="space-y-3">
                  {order.orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0">
                        {item.product.images?.[0] && (
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.images[0].alt}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity} × {formatNGN(item.product.price)}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatNGN(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">What's Next?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• You'll receive an email confirmation shortly</li>
                  <li>• We'll start processing your order immediately</li>
                  <li>• You can track your order status in your account</li>
                  {successState.paymentMethod === "CASH_ON_DELIVERY" && (
                    <>
                      <li>
                        • Payment will be collected when your order is delivered
                      </li>
                      <li>
                        • Please have the exact amount ready for the delivery
                        person
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleViewOrders}
              className="flex-1 bg-secondary hover:bg-secondary-100"
            >
              <Package className="h-4 w-4 mr-2" />
              View My Orders
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button onClick={handleGoHome} variant="outline" className="flex-1">
              <Home className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Need help? Contact our support team at{" "}
              <a
                href="mailto:support@pickbazar.com"
                className="text-secondary hover:underline"
              >
                support@pickbazar.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
