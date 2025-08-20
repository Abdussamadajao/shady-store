import { useState } from "react";
import {
  Star,
  Edit,
  Trash2,
  MessageSquare,
  Calendar,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Review {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    images: Array<{ url: string; alt?: string }>;
  };
  rating: number;
  title?: string;
  comment?: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ReviewsProps {
  reviews?: Review[];
  onEditReview?: (
    reviewId: string,
    data: { title?: string; comment?: string; rating: number }
  ) => void;
  onDeleteReview?: (reviewId: string) => void;
  onViewProduct?: (productId: string) => void;
}

const Reviews: React.FC<ReviewsProps> = ({
  reviews = [],
  onEditReview,
  onDeleteReview,
  onViewProduct,
}) => {
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    title: string;
    comment: string;
    rating: number;
  }>({
    title: "",
    comment: "",
    rating: 5,
  });
  const [deletingReviews, setDeletingReviews] = useState<Set<string>>(
    new Set()
  );

  const handleEditClick = (review: Review) => {
    setEditingReview(review.id);
    setEditForm({
      title: review.title || "",
      comment: review.comment || "",
      rating: review.rating,
    });
  };

  const handleEditSubmit = async () => {
    if (editingReview) {
      await onEditReview?.(editingReview, editForm);
      setEditingReview(null);
      setEditForm({ title: "", comment: "", rating: 5 });
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    setDeletingReviews((prev) => new Set(prev).add(reviewId));
    try {
      await onDeleteReview?.(reviewId);
    } finally {
      setDeletingReviews((prev) => {
        const newSet = new Set(prev);
        newSet.delete(reviewId);
        return newSet;
      });
    }
  };

  const handleViewProduct = (productId: string) => {
    onViewProduct?.(productId);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-200 text-gray-200"
        }`}
      />
    ));
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          You haven't written any reviews yet
        </h3>
        <p className="text-gray-600 mb-6">
          Share your thoughts on products you've purchased
        </p>
        <Button className="bg-secondary hover:bg-secondary-100">
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
        <p className="text-gray-600 mt-2">
          Manage your product reviews and ratings
        </p>
      </div>

      {/* Review Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.length}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {reviews.filter((r) => r.isApproved).length}
                </p>
              </div>
              <ThumbsUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {reviews.filter((r) => !r.isApproved).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(
                    reviews.reduce((sum, r) => sum + r.rating, 0) /
                    reviews.length
                  ).toFixed(1)}
                </p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Star className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {review.product.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Reviewed on{" "}
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={review.isApproved ? "default" : "secondary"}
                    className={
                      review.isApproved
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {review.isApproved ? "Approved" : "Pending"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <div className="aspect-square overflow-hidden rounded-lg">
                    {review.product.images &&
                    review.product.images.length > 0 ? (
                      <img
                        src={review.product.images[0].url}
                        alt={
                          review.product.images[0].alt || review.product.name
                        }
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <div className="text-gray-400 text-center">
                          <div className="text-2xl mb-1">📦</div>
                          <div className="text-xs">No Image</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Review Content */}
                <div className="md:col-span-2 space-y-4">
                  {review.title && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Review Title
                      </h4>
                      <p className="text-gray-700">{review.title}</p>
                    </div>
                  )}

                  {review.comment && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Review Comment
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  )}

                  {/* Review Metadata */}
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Rating: {review.rating}/5</p>
                    {review.updatedAt !== review.createdAt && (
                      <p>
                        Last updated:{" "}
                        {new Date(review.updatedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewProduct(review.product.id)}
                    >
                      View Product
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(review)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteReview(review.id)}
                      disabled={deletingReviews.has(review.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Review Dialog */}
      <Dialog
        open={!!editingReview}
        onOpenChange={() => setEditingReview(null)}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rating">Rating</Label>
              <div className="flex items-center gap-1 mt-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() =>
                      setEditForm((prev) => ({ ...prev, rating: i + 1 }))
                    }
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        i < editForm.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="title">Title (Optional)</Label>
              <Input
                id="title"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Review title..."
              />
            </div>
            <div>
              <Label htmlFor="comment">Comment (Optional)</Label>
              <Textarea
                id="comment"
                value={editForm.comment}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, comment: e.target.value }))
                }
                placeholder="Share your thoughts..."
                rows={4}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setEditingReview(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditSubmit}
                className="flex-1 bg-secondary hover:bg-secondary-100"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reviews;
