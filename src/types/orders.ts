export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string;
  name: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
  product: {
    id: string;
    name: string;
    images: Array<{
      id: string;
      url: string;
      alt?: string;
      sortOrder: number;
      isPrimary: boolean;
    }>;
  };
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  total: number;
  currency: string;
  notes?: string;
  shippingAddressId?: string;
  billingAddressId?: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  shippingAddress?: OrderAddress;
  billingAddress?: OrderAddress;
  payments: Payment[];
}

export interface OrderAddress {
  id: string;
  userId: string;
  type: AddressType;
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  gateway?: string;
  metadata?: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type AddressType = "SHIPPING" | "BILLING" | "BOTH";

export type PaymentMethod =
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "PAYPAL"
  | "BANK_TRANSFER"
  | "CASH_ON_DELIVERY"
  | "CRYPTO";

export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export interface OrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface OrderResponse {
  order: Order;
}

export interface OrderStatsResponse {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalSpent: number;
}

export interface OrderTrackingResponse {
  orderId: string;
  orderNumber: string;
  status: string;
  trackingInfo: {
    currentStep: string;
    steps: Array<{
      step: string;
      completed: boolean;
      date?: string;
      estimatedDate?: string;
    }>;
  };
  shippingAddress?: OrderAddress;
}

export interface CancelOrderRequest {
  reason?: string;
}

export interface CancelOrderResponse {
  message: string;
  order: Order;
}

export interface RefundRequest {
  reason: string;
  items?: any[];
}

export interface RefundResponse {
  message: string;
  order: Order;
  refundRequest: {
    orderId: string;
    reason: string;
    items?: any[];
    requestedAt: string;
    status: string;
  };
}
