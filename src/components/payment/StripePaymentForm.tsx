import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CreditCard, XCircle } from "lucide-react";
import { useCreatePaymentIntent, useConfirmPayment } from "@/api/hooks";

// Props for the Stripe payment form component
// All payment data is passed directly as props instead of using the payment store
interface StripePaymentFormProps {
  amount: number;
  currency?: string;
  clientSecret: string;
  paymentIntentId: string;
  paymentId: string;
  orderId: string;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

// Stripe card element styling options
const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
};

// Main Stripe payment form component
// Handles payment processing through Stripe and updates our database
export const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  amount,
  currency = "ngn",
  clientSecret,
  paymentIntentId,
  paymentId,
  orderId,
  onSuccess,
  onError,
  onCancel,
}) => {
  // Get Stripe instance and elements for payment processing
  const stripe = useStripe();
  const elements = useElements();

  // Use payment hooks
  // Note: useConfirmPayment is now used to update payment/order status after Stripe processing
  // The actual payment processing happens on Stripe's side, we just update our database
  const createPaymentIntentMutation = useCreatePaymentIntent();
  const updatePaymentStatusMutation = useConfirmPayment();

  // Local state for form management and payment processing
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Handle form submission - process payment through Stripe and update our database
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validate that we have all required components and aren't already processing
    if (!stripe || !elements || !paymentIntentId || isProcessingPayment) {
      return;
    }

    // Clear any previous errors and set processing state
    setError(null);
    setIsProcessingPayment(true);

    try {
      // Get the card element from Stripe
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      // Process the payment with Stripe (this handles the actual payment processing)
      // Stripe will confirm the payment and return the final status
      const { error: stripeError, paymentIntent: confirmedIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              email,
            },
          },
        });

      // Check for Stripe errors first
      if (stripeError) {
        throw new Error(stripeError.message || "Payment failed");
      }

      // Update payment and order status on our server based on Stripe's response
      // We pass the Stripe status to our server so it can update our database accordingly
      const updateResult = await updatePaymentStatusMutation.mutateAsync({
        paymentIntentId: confirmedIntent.id,
        stripeStatus: confirmedIntent.status,
      });

      if (updateResult.success) {
        if (confirmedIntent.status === "succeeded") {
          // Payment successful - redirect to success page via the success handler
          onSuccess(paymentId);
        } else {
          // Handle other statuses (processing, requires_payment_method, etc.)
          // These are valid Stripe statuses that indicate the payment needs attention
          const errorMessage = `Payment ${confirmedIntent.status}. Please check your payment method.`;
          setError(errorMessage);
          onError(errorMessage);
        }
      } else {
        throw new Error("Failed to update payment status on server");
      }
    } catch (err) {
      // Handle any errors from Stripe or our server
      const errorMessage =
        err instanceof Error ? err.message : "Payment failed";
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      // Always reset the processing state, regardless of success or failure
      setIsProcessingPayment(false);
    }
  };

  if (createPaymentIntentMutation.isPending && !paymentIntentId) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Setting up payment intent...</p>
        </CardContent>
      </Card>
    );
  }

  // Main payment form - shown when not loading
  return (
    <Card className="w-full max-w-md mx-auto">
      {/* Payment form header with title and icon */}
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Payment form - Collects card details and processes payment through Stripe */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Order Summary - Shows what the user is paying for */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Order Total:</span>
              <span className="font-semibold text-lg">
                ₦{amount.toLocaleString()}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Order ID: {orderId}
            </div>
          </div>

          {/* Email Input - Required for payment processing and receipts */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          {/* Card Element - Stripe's secure card input component */}
          <div className="space-y-2">
            <Label>Card Information</Label>
            <div className="border border-gray-300 rounded-md p-3">
              <CardElement options={cardElementOptions} />
            </div>
          </div>

          {/* Error Display - Shows any payment or server errors */}
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons - Cancel or process the payment */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
              disabled={
                createPaymentIntentMutation.isPending ||
                updatePaymentStatusMutation.isPending ||
                isProcessingPayment
              }
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-secondary hover:bg-secondary-100"
              disabled={
                !stripe ||
                createPaymentIntentMutation.isPending ||
                updatePaymentStatusMutation.isPending ||
                isProcessingPayment ||
                !email
              }
            >
              {createPaymentIntentMutation.isPending ||
              updatePaymentStatusMutation.isPending ||
              isProcessingPayment ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Process Payment ₦${amount.toLocaleString()}`
              )}
            </Button>
          </div>

          {/* Security Notice - Reassures users about data security */}
          <div className="text-xs text-gray-500 text-center">
            Your payment information is secure and encrypted by Stripe.
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
