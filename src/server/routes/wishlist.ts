import { Hono } from "hono";
import { PrismaClient } from "../../../generated/prisma/index.js";
import { requireAuth, type AuthenticatedUser } from "../middleware/auth.js";

type WishlistContext = {
  Variables: {
    user: AuthenticatedUser;
  };
};

const wishlistRouter = new Hono<WishlistContext>();
const prisma = new PrismaClient();

// Get user's wishlist
wishlistRouter.get("/", requireAuth, async (c) => {
  try {
    const user = c.get("user");

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: {
            images: {
              orderBy: { sortOrder: "asc" },
              take: 1,
            },
            _count: {
              select: {
                reviews: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return c.json({ wishlist: wishlistItems });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Add item to wishlist
wishlistRouter.post("/", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const body = await c.req.json();

    const { productId } = body;

    if (!productId) {
      return c.json({ error: "Product ID is required" }, 400);
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

    // Check if item already exists in wishlist
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId,
        },
      },
    });

    if (existingItem) {
      return c.json({ error: "Product already in wishlist" }, 400);
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: user.id,
        productId: productId,
      },
      include: {
        product: {
          include: {
            images: {
              orderBy: { sortOrder: "asc" },
              take: 1,
            },
            _count: {
              select: {
                reviews: true,
              },
            },
          },
        },
      },
    });

    return c.json(
      {
        message: "Product added to wishlist successfully",
        wishlistItem,
      },
      201
    );
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Remove item from wishlist
wishlistRouter.delete("/:itemId", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const itemId = c.req.param("itemId");

    if (!itemId) {
      return c.json({ error: "Item ID is required" }, 400);
    }

    // Check if item exists and belongs to user
    const wishlistItem = await prisma.wishlistItem.findFirst({
      where: {
        id: itemId,
        userId: user.id,
      },
    });

    if (!wishlistItem) {
      return c.json({ error: "Wishlist item not found" }, 404);
    }

    // Remove from wishlist
    await prisma.wishlistItem.delete({
      where: { id: itemId },
    });

    return c.json({ message: "Item removed from wishlist successfully" });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Remove item from wishlist by product ID
wishlistRouter.delete("/product/:productId", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const productId = c.req.param("productId");

    if (!productId) {
      return c.json({ error: "Product ID is required" }, 400);
    }

    // Check if item exists and belongs to user
    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId,
        },
      },
    });

    if (!wishlistItem) {
      return c.json({ error: "Product not in wishlist" }, 404);
    }

    // Remove from wishlist
    await prisma.wishlistItem.delete({
      where: { id: wishlistItem.id },
    });

    return c.json({ message: "Product removed from wishlist successfully" });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Check if product is in user's wishlist
wishlistRouter.get("/check/:productId", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const productId = c.req.param("productId");

    if (!productId) {
      return c.json({ error: "Product ID is required" }, 400);
    }

    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId,
        },
      },
    });

    return c.json({
      inWishlist: !!wishlistItem,
      itemId: wishlistItem?.id || null,
    });
  } catch (error) {
    console.error("Error checking wishlist status:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get wishlist count
wishlistRouter.get("/count", requireAuth, async (c) => {
  try {
    const user = c.get("user");

    const count = await prisma.wishlistItem.count({
      where: { userId: user.id },
    });

    return c.json({ count });
  } catch (error) {
    console.error("Error getting wishlist count:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default wishlistRouter;
