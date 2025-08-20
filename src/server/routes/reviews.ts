import { Hono } from "hono";
import { PrismaClient } from "../../../generated/prisma/index.js";
import { requireAuth, type AuthenticatedUser } from "../middleware/auth.js";

type ReviewsContext = {
  Variables: {
    user: AuthenticatedUser;
  };
};

const reviewsRouter = new Hono<ReviewsContext>();
const prisma = new PrismaClient();

// Get user's reviews
reviewsRouter.get("/", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const { page = "1", limit = "10" } = c.req.query();

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { userId: user.id },
        include: {
          product: {
            include: {
              images: {
                orderBy: { sortOrder: "asc" },
                take: 1,
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.review.count({
        where: { userId: user.id },
      }),
    ]);

    return c.json({
      reviews,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get a specific review
reviewsRouter.get("/:reviewId", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const reviewId = c.req.param("reviewId");

    if (!reviewId) {
      return c.json({ error: "Review ID is required" }, 400);
    }

    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        userId: user.id,
      },
      include: {
        product: {
          include: {
            images: {
              orderBy: { sortOrder: "asc" },
              take: 1,
            },
          },
        },
      },
    });

    if (!review) {
      return c.json({ error: "Review not found" }, 404);
    }

    return c.json({ review });
  } catch (error) {
    console.error("Error fetching review:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Create a new review
reviewsRouter.post("/", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const body = await c.req.json();

    const { productId, rating, title, comment } = body;

    if (!productId || !rating) {
      return c.json({ error: "Product ID and rating are required" }, 400);
    }

    if (rating < 1 || rating > 5) {
      return c.json({ error: "Rating must be between 1 and 5" }, 400);
    }

    // Check if product exists and is active
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, isActive: true },
    });

    if (!product) {
      return c.json({ error: "Product not found" }, 404);
    }

    if (!product.isActive) {
      return c.json({ error: "Product is not available" }, 400);
    }

    // Check if user has already reviewed this product
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId,
        },
      },
    });

    if (existingReview) {
      return c.json({ error: "You have already reviewed this product" }, 400);
    }

    // Check if user has purchased this product (optional validation)
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId: productId,
        order: {
          userId: user.id,
          status: {
            in: [
              "DELIVERED",
              "CONFIRMED",
              "PROCESSING",
              "SHIPPED",
              "DELIVERED",
              "CANCELLED",
              "REFUNDED",
            ],
          },
        },
      },
    });

    if (!hasPurchased) {
      return c.json(
        {
          error: "You can only review products you have purchased",
          code: "PURCHASE_REQUIRED",
        },
        400
      );
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        userId: user.id,
        productId: productId,
        rating,
        title: title || null,
        comment: comment || null,
        isApproved: false, // Default to pending approval
      },
      include: {
        product: {
          include: {
            images: {
              orderBy: { sortOrder: "asc" },
              take: 1,
            },
          },
        },
      },
    });

    return c.json(
      {
        message: "Review submitted successfully and pending approval",
        review,
      },
      201
    );
  } catch (error) {
    console.error("Error creating review:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Update a review
reviewsRouter.put("/:reviewId", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const reviewId = c.req.param("reviewId");
    const body = await c.req.json();

    const { rating, title, comment } = body;

    if (!reviewId) {
      return c.json({ error: "Review ID is required" }, 400);
    }

    if (rating && (rating < 1 || rating > 5)) {
      return c.json({ error: "Rating must be between 1 and 5" }, 400);
    }

    // Check if review exists and belongs to user
    const existingReview = await prisma.review.findFirst({
      where: {
        id: reviewId,
        userId: user.id,
      },
    });

    if (!existingReview) {
      return c.json({ error: "Review not found" }, 404);
    }

    // Only allow updates if review is not approved yet
    if (existingReview.isApproved) {
      return c.json({ error: "Cannot edit approved reviews" }, 400);
    }

    // Update review
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: rating || undefined,
        title: title !== undefined ? title : undefined,
        comment: comment !== undefined ? comment : undefined,
        updatedAt: new Date(),
        isApproved: false, // Reset approval status after edit
      },
      include: {
        product: {
          include: {
            images: {
              orderBy: { sortOrder: "asc" },
              take: 1,
            },
          },
        },
      },
    });

    return c.json({
      message: "Review updated successfully and pending approval",
      review: updatedReview,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Delete a review
reviewsRouter.delete("/:reviewId", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const reviewId = c.req.param("reviewId");

    if (!reviewId) {
      return c.json({ error: "Review ID is required" }, 400);
    }

    // Check if review exists and belongs to user
    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        userId: user.id,
      },
    });

    if (!review) {
      return c.json({ error: "Review not found" }, 404);
    }

    // Delete review
    await prisma.review.delete({
      where: { id: reviewId },
    });

    return c.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get review statistics for user
reviewsRouter.get("/stats", requireAuth, async (c) => {
  try {
    const user = c.get("user");

    const [totalReviews, approvedReviews, pendingReviews, avgRating] =
      await Promise.all([
        prisma.review.count({
          where: { userId: user.id },
        }),
        prisma.review.count({
          where: {
            userId: user.id,
            isApproved: true,
          },
        }),
        prisma.review.count({
          where: {
            userId: user.id,
            isApproved: false,
          },
        }),
        prisma.review.aggregate({
          where: { userId: user.id },
          _avg: { rating: true },
        }),
      ]);

    return c.json({
      totalReviews,
      approvedReviews,
      pendingReviews,
      avgRating: avgRating._avg.rating || 0,
    });
  } catch (error) {
    console.error("Error fetching review stats:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default reviewsRouter;
