export interface CreatePaymentIntentRequest {
  orderId: string;
  amount: number;
  currency?: string;
}

export interface CreatePaymentIntentResponse {
  success: boolean;
  clientSecret: string;
  paymentIntentId: string;
  paymentId: string;
}

export interface ConfirmPaymentRequest {
  paymentIntentId: string;
  stripeStatus: string; // The final status from Stripe (succeeded, processing, failed, etc.)
}

export interface ConfirmPaymentResponse {
  success: boolean;
  status: string; // Updated payment status in our system
  orderStatus: string; // Updated order status in our system
}

export interface PaymentStatusResponse {
  payment: {
    id: string;
    orderId: string;
    amount: number;
    currency: string;
    method: string;
    status: string;
    gateway: string;
    metadata: any;
    createdAt: string;
    updatedAt: string;
    stripeStatus?: string;
    order: {
      id: string;
      orderNumber: string;
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
  };
}

export interface RefundRequest {
  amount?: number;
  reason?: string;
}

export interface RefundResponse {
  success: boolean;
  refund: {
    id: string;
    paymentId: string;
    amount: number;
    currency: string;
    reason: string;
    status: string;
    stripeRefundId: string | null;
    metadata: any;
    createdAt: string;
  };
}
