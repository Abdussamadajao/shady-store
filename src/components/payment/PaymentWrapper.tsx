import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe-client";
import { StripePaymentForm } from "./StripePaymentForm";

// Props for the payment wrapper component
// This component wraps the Stripe payment form with the necessary payment data
interface PaymentWrapperProps {
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

export const PaymentWrapper: React.FC<PaymentWrapperProps> = ({
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
  try {
    const stripePromise = getStripe();

    return (
      <Elements stripe={stripePromise}>
        <StripePaymentForm
          amount={amount}
          currency={currency}
          clientSecret={clientSecret}
          paymentIntentId={paymentIntentId}
          paymentId={paymentId}
          orderId={orderId}
          onSuccess={onSuccess}
          onError={onError}
          onCancel={onCancel}
        />
      </Elements>
    );
  } catch (error) {
    // Handle missing Stripe configuration
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">
            Stripe Configuration Error
          </div>
          <p className="text-red-600 text-sm mb-4">
            Stripe publishable key is not configured. Please add{" "}
            <code className="bg-red-100 px-2 py-1 rounded text-xs">
              VITE_STRIPE_PUBLISHABLE_KEY
            </code>{" "}
            to your environment variables.
          </p>
          <div className="text-xs text-red-500 text-left bg-red-100 p-3 rounded">
            <p className="font-semibold mb-2">To fix this:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Create a .env file in your project root</li>
              <li>Add: VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here</li>
              <li>
                Get your key from Stripe Dashboard → Developers → API Keys
              </li>
              <li>Restart your development server</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }
};
