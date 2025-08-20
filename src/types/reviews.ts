export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
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

export interface ReviewsResponse {
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ReviewResponse {
  review: Review;
}

export interface ReviewStatsResponse {
  totalReviews: number;
  approvedReviews: number;
  pendingReviews: number;
  avgRating: number;
}

export interface CreateReviewRequest {
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
}

export interface CreateReviewResponse {
  message: string;
  review: Review;
}

export interface UpdateReviewRequest {
  rating?: number;
  title?: string;
  comment?: string;
}

export interface UpdateReviewResponse {
  message: string;
  review: Review;
}

export interface DeleteReviewResponse {
  message: string;
}
