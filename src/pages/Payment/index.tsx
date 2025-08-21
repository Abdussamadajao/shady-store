import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, CheckCircle, AlertCircle } from "lucide-react";
import { formatNGN } from "@/utils/currency";
import { PaymentWrapper } from "@/components/payment/PaymentWrapper";
import CashOnDeliveryForm from "@/components/payment/CashOnDeliveryForm";
import { usePaymentStatus } from "@/api/hooks";
import { toast } from "sonner";
import { useDeliveryFee } from "@/store/checkout";

interface PaymentPageState {
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
  paymentIntent?: {
    clientSecret: string;
    paymentIntentId: string;
    paymentId: string;
  };
  clientSecret?: string;
  paymentIntentId?: string;
  paymentId?: string;
  paymentMethod?: "STRIPE" | "CASH_ON_DELIVERY";
  amount?: number;
}

const Payment: React.FC = () => {
  useScrollToTop();
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentState, setPaymentState] = useState<PaymentPageState | null>(
    null
  );
  const deliveryFee = useDeliveryFee();
  const [isLoading, setIsLoading] = useState(true);

  // Get payment status
  const { data: paymentStatusData } = usePaymentStatus(
    paymentState?.paymentId || ""
  );

  useEffect(() => {
    if (location.state) {
      setPaymentState(location.state as PaymentPageState);
      setIsLoading(false);
    } else {
      // If no state, redirect back to cart
      toast.error("No payment information found");
      navigate("/cart");
    }
  }, [location.state, navigate]);

  const handleBackToCart = () => {
    navigate("/cart");
  };

  const handlePaymentSuccess = (paymentId: string) => {
    console.log(paymentId);
    toast.success("Payment completed successfully!");
    // Redirect to payment success page
    navigate("/payment-success", {
      state: {
        order: order,
        paymentId: paymentId,
        amount: total,
      },
    });
  };

  const handlePaymentError = (error: string) => {
    toast.error(`Payment failed: ${error}`);
  };

  const handlePaymentCancel = () => {
    // Redirect to orders page when payment is cancelled
    navigate("/account/orders");
  };

  const handleCODConfirm = () => {
    if (!paymentState) return;

    toast.success("Order confirmed! You'll pay cash on delivery.");
    navigate("/payment-success", {
      state: {
        order: paymentState.order,
        paymentMethod: "CASH_ON_DELIVERY",
        amount: paymentState.amount || total,
      },
    });
  };

  const handleCODCancel = () => {
    navigate("/account/orders");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment information...</p>
        </div>
      </div>
    );
  }

  if (!paymentState) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">No payment information found</p>
          <Button onClick={handleBackToCart} className="mt-4">
            Back to Cart
          </Button>
        </div>
      </div>
    );
  }

  const { order, paymentIntent, paymentMethod } = paymentState;
  const totalAmount = order.orderItems.reduce(
    (total, item) =>
      total + parseFloat(item.product.price.toString()) * item.quantity,
    0
  );

  const tax = totalAmount * 0.075; // 7.5% tax (adjust as needed)
  const shipping = totalAmount > 100 ? 0 : 10; // Free shipping over $100
  const total = totalAmount + tax + shipping + deliveryFee;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleBackToCart}
            className="mb-4 text-secondary hover:text-secondary-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            {paymentMethod === "CASH_ON_DELIVERY"
              ? "Confirm Your Order"
              : "Complete Your Payment"}
          </h1>
          <p className="text-gray-600 mt-2">
            Order #{order.orderNumber || order.id} • {formatNGN(total)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Form */}
          <div className="lg:col-span-2">
            {paymentMethod === "CASH_ON_DELIVERY" ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Order Confirmation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CashOnDeliveryForm
                    amount={paymentState.amount || total}
                    orderId={order.id}
                    orderNumber={order.orderNumber}
                    onConfirm={handleCODConfirm}
                    onCancel={handleCODCancel}
                    isLoading={false}
                  />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {paymentIntent && (
                    <PaymentWrapper
                      amount={total}
                      currency="ngn"
                      clientSecret={paymentIntent.clientSecret}
                      paymentIntentId={paymentIntent.paymentIntentId}
                      paymentId={paymentIntent.paymentId}
                      orderId={order.id}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      onCancel={handlePaymentCancel}
                    />
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-[100px]">
              <CardHeader>
                <CardTitle className="text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
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

                {/* Total */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-base font-medium font-poppins">
                    <span>Subtotal</span>
                    <span>{formatNGN(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-base font-medium font-poppins">
                    <span>Delivery fee</span>
                    <span>{formatNGN(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-base font-medium font-poppins">
                    <span>Tax</span>
                    <span>{formatNGN(tax)}</span>
                  </div>

                  <div className="flex justify-between text-base font-medium font-poppins">
                    <span>Total</span>
                    <span>{formatNGN(total)}</span>
                  </div>
                </div>

                {/* Payment Status */}
                {paymentMethod === "CASH_ON_DELIVERY" ? (
                  <div className="mt-4 p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-secondary" />
                      <span className="text-secondary font-medium">
                        Cash on Delivery Selected
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Payment due on delivery:{" "}
                      {formatNGN(paymentState.amount || total)}
                    </p>
                  </div>
                ) : (
                  paymentStatusData?.payment &&
                  paymentIntent && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-gray-600">
                          Payment Intent Created Successfully
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Payment ID: {paymentIntent.paymentId}
                      </p>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
