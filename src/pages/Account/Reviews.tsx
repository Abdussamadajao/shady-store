import { useNavigate } from "react-router-dom";
import { Reviews } from "@/components/account";
import { useReviews, useReviewMutations } from "@/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const ReviewsPage = () => {
  const navigate = useNavigate();
  
  // Use real reviews hooks
  const { data: reviewsData, isLoading, error } = useReviews(1, 50); // Get first 50 reviews
  const { createReview, updateReview, deleteReview, isLoading: mutationsLoading } = useReviewMutations();

  const reviews = reviewsData?.reviews || [];

  const handleEditReview = async (reviewId: string, data: { title?: string; comment?: string; rating: number }) => {
    try {
      await updateReview({ reviewId, data });
      toast.success("Review updated successfully!");
    } catch (error) {
      toast.error("Failed to update review");
      console.error("Error updating review:", error);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReview(reviewId);
      toast.success("Review deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete review");
      console.error("Error deleting review:", error);
    }
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <Loader2 className="h-16 w-16 text-secondary mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Loading your reviews...
            </h3>
            <p className="text-gray-600">
              Please wait while we fetch your product reviews
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="h-8 w-8 bg-red-600 rounded-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Failed to load reviews
            </h3>
            <p className="text-gray-600 mb-6">
              {error.message || "Something went wrong while loading your reviews"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-secondary hover:bg-secondary-100 text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reviews
          reviews={reviews}
          onEditReview={handleEditReview}
          onDeleteReview={handleDeleteReview}
          onViewProduct={handleViewProduct}
        />
      </div>
    </div>
  );
};

export default ReviewsPage;
