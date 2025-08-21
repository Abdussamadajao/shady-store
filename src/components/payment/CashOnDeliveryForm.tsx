import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Truck,
  CheckCircle,
  AlertCircle,
  Banknote,
  Clock,
  Shield,
} from "lucide-react";
import { formatNGN } from "@/utils/currency";

interface CashOnDeliveryFormProps {
  amount: number;
  orderId: string;
  orderNumber?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const CashOnDeliveryForm: React.FC<CashOnDeliveryFormProps> = ({
  amount,
  orderId,
  orderNumber,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  return (
    <div className="space-y-6">
      {/* COD Information Card */}
      <Card className="border-2 border-secondary/20 bg-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-secondary">
            <Truck className="h-5 w-5" />
            Cash on Delivery Selected
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                <Banknote className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Payment Amount</p>
                <p className="text-sm text-gray-600">Due on delivery</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-secondary">
                {formatNGN(amount)}
              </p>
              <p className="text-sm text-gray-600">Cash payment</p>
            </div>
          </div>

          {/* Important Information */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">
                  Order Confirmed
                </p>
                <p className="text-blue-800">
                  Your order has been confirmed. You'll pay {formatNGN(amount)}{" "}
                  when your order is delivered.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-amber-900 mb-2">
                  Important Reminders:
                </p>
                <ul className="text-amber-800 space-y-1">
                  <li>• Have exact change ready: {formatNGN(amount)}</li>
                  <li>• Payment is due upon delivery</li>
                  <li>• Our delivery agent will provide a receipt</li>
                  <li>• Please verify your order before payment</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <Clock className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-green-900 mb-1">
                  Delivery Timeline
                </p>
                <p className="text-green-800">
                  COD orders may take 1-2 additional business days for
                  processing and verification.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <Shield className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-gray-900 mb-1">
                  Secure & Trusted
                </p>
                <p className="text-gray-700">
                  All COD orders are verified and processed securely. You can
                  track your order status in your account.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-medium text-gray-900">
                {orderNumber || orderId}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium text-gray-900">
                Cash on Delivery
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel Order
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1 bg-secondary hover:bg-secondary-100"
        >
          {isLoading ? "Processing..." : "Confirm Order"}
        </Button>
      </div>

      {/* Additional Info */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          By confirming this order, you agree to pay {formatNGN(amount)} in cash
          upon delivery.
        </p>
      </div>
    </div>
  );
};

export default CashOnDeliveryForm;
