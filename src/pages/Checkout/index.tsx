import React from "react";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const Checkout: React.FC = () => {
  // Auto-scroll to top when navigating to checkout
  useScrollToTop();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <p className="text-gray-600 text-center">
            Checkout form will be displayed here
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
