export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    description?: string;
    shortDescription?: string;
    price: number;
    comparePrice?: number;
    isActive: boolean;
    images: Array<{
      id: string;
      url: string;
      alt?: string;
      sortOrder: number;
      isPrimary: boolean;
    }>;
    _count: {
      reviews: number;
    };
  };
}

export interface WishlistResponse {
  wishlist: WishlistItem[];
}

export interface WishlistCountResponse {
  count: number;
}

export interface WishlistStatusResponse {
  inWishlist: boolean;
  itemId: string | null;
}

export interface AddToWishlistRequest {
  productId: string;
}

export interface AddToWishlistResponse {
  message: string;
  wishlistItem: WishlistItem;
}

export interface RemoveFromWishlistResponse {
  message: string;
}
