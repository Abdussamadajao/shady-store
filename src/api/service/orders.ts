import { axiosInstance } from "@/lib/axios";
import type { Order } from "@/types";

export const ordersApi = {
  createOrder: async (orderData: {
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>;
    shippingAddressId: string;
    billingAddressId?: string;
    deliveryTime?: string;
    shippingAmount?: number;
    notes?: string;
    paymentMethod?: "STRIPE" | "CASH_ON_DELIVERY";
  }): Promise<{ order: Order }> => {
    const response = await axiosInstance.post("/orders", orderData);
    return response.data;
  },

  getOrders: async (
    page: number,
    limit: number,
    status?: string
  ): Promise<{
    orders: Order[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (status && status !== "all") {
      params.append("status", status);
    }

    const response = await axiosInstance.get(`/orders?${params.toString()}`);
    return response.data;
  },

  getOrder: async (orderId: string): Promise<{ order: Order }> => {
    const response = await axiosInstance.get(`/orders/${orderId}`);
    return response.data;
  },

  getOrderStats: async (): Promise<{
    totalOrders: number;
    pendingOrders: number;
    confirmedOrders: number;
    processingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    totalSpent: number;
  }> => {
    const response = await axiosInstance.get("/orders/stats");
    return response.data;
  },

  getOrderTracking: async (
    orderId: string
  ): Promise<{
    orderId: string;
    orderNumber: string;
    status: string;
    trackingInfo: {
      currentStep: string;
      steps: Array<{
        step: string;
        completed: boolean;
        date?: Date;
        estimatedDate?: Date;
      }>;
    };
    shippingAddress: any;
  }> => {
    const response = await axiosInstance.get(`/orders/${orderId}/tracking`);
    return response.data;
  },

  cancelOrder: async (
    orderId: string,
    reason?: string
  ): Promise<{ message: string; order: Order }> => {
    const response = await axiosInstance.post(`/orders/${orderId}/cancel`, {
      reason,
    });
    return response.data;
  },

  requestRefund: async (
    orderId: string,
    reason: string,
    items?: any[]
  ): Promise<{
    message: string;
    order: Order;
    refundRequest: {
      orderId: string;
      reason: string;
      items?: any[];
      requestedAt: Date;
      status: string;
    };
  }> => {
    const response = await axiosInstance.post(`/orders/${orderId}/refund`, {
      reason,
      items,
    });
    return response.data;
  },
};
