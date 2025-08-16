export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  variantId?: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    name: string;
    price: string;
    images: Array<{
      id: string;
      url: string;
      alt?: string;
      sortOrder: number;
      isPrimary: boolean;
    }>;
    variants: Array<{
      id: string;
      name: string;
      sku?: string;
      price?: string;
      quantity: number;
      weight?: string;
      isActive: boolean;
    }>;
  };
}

export interface CartResponse {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export interface CartSummary {
  itemCount: number;
  subtotal: number;
}

export interface AddToCartRequest {
  productId: string;
  variantId?: string;
  quantity?: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}
