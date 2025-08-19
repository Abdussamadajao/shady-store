type CartItemStatus =
  | "idle"
  | "pending-add"
  | "pending-update"
  | "pending-delete";

export interface CartItem {
  id?: string;
  userId?: string;
  productId?: string;
  variantId?: string;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
  product?: {
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
  _status?: CartItemStatus;
  _tempId?: string;
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
  userId?: string;
  product?: {
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
export interface UpdateCartItemRequest {
  quantity: number;
}

export interface SyncOperationResult {
  type: "add" | "update" | "delete" | "skip";
  tempId?: string;
  newItem?: CartItem;
  id?: string;
}
