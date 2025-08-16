import { Hono } from "hono";
import { PrismaClient } from "../../../generated/prisma/index.js";

// Define the context type for cart routes
type CartContext = {
  Variables: {
    user: {
      id: string;
      email: string;
      role: string;
      isActive: boolean;
    };
  };
};

const cartRouter = new Hono<CartContext>();
const prisma = new PrismaClient();

// Helper function to get current user from session
async function getCurrentUser(c: any) {
  try {
    // Get the session cookie
    const cookieHeader = c.req.header("cookie") || "";
    console.log("Cookie header:", cookieHeader);

    const sessionCookie = cookieHeader
      .split(";")
      .find((cookie: string) =>
        cookie.trim().startsWith("pick-bazar.session_data=")
      );

    if (!sessionCookie) {
      console.log("No session cookie found");
      return null;
    }

    // Parse the session data
    const sessionData = sessionCookie.split("=")[1];
    console.log("Session data:", sessionData);

    const decoded = Buffer.from(sessionData, "base64").toString("utf-8");
    console.log("Decoded session:", decoded);

    const parsed = JSON.parse(decoded);
    console.log("Parsed session:", parsed);

    // Check for user ID in the nested session structure
    const userId = parsed.session?.session?.userId || parsed.user?.id;

    if (!userId) {
      console.log("No user ID in session");
      return null;
    }

    // Verify user exists and is active
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, isActive: true },
    });

    console.log("Found user:", user);
    return user && user.isActive ? user : null;
  } catch (error) {
    console.error("Error parsing session:", error);
    return null;
  }
}

// Authentication middleware
async function requireAuth(c: any, next: any) {
  const user = await getCurrentUser(c);
  if (!user) {
    return c.json({ error: "Authentication required" }, 401);
  }
  c.set("user", user);
  await next();
}

// Get user's cart
cartRouter.get("/", requireAuth, async (c) => {
  try {
    const user = c.get("user");

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
            variants: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => {
      const price =
        item.product.variants.length > 0 && item.variantId
          ? item.product.variants.find((v) => v.id === item.variantId)?.price ||
            item.product.price
          : item.product.price;
      return sum + Number(price) * item.quantity;
    }, 0);

    return c.json({
      items: cartItems,
      subtotal: Number(subtotal.toFixed(2)),
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return c.json({ error: "Failed to fetch cart" }, 500);
  }
});

// Add item to cart
cartRouter.post("/", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const { productId, variantId, quantity = 1 } = await c.req.json();

    if (!productId) {
      return c.json({ error: "Product ID is required" }, 400);
    }

    // Verify product exists and is active
    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true },
    });

    if (!product) {
      return c.json({ error: "Product not found or inactive" }, 404);
    }

    // Check if variant exists if provided
    if (variantId) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: variantId, productId, isActive: true },
      });
      if (!variant) {
        return c.json({ error: "Product variant not found" }, 404);
      }
    }

    // Check if item already exists in cart
    let existingItem = null;

    if (variantId) {
      // If variantId is provided, use the composite unique constraint
      existingItem = await prisma.cartItem.findUnique({
        where: {
          userId_productId_variantId: {
            userId: user.id,
            productId,
            variantId,
          },
        },
      });
    } else {
      // If no variantId, find by userId and productId only
      existingItem = await prisma.cartItem.findFirst({
        where: {
          userId: user.id,
          productId,
          variantId: null,
        },
      });
    }

    let cartItem;
    if (existingItem) {
      // Update quantity
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
          updatedAt: new Date(),
        },
        include: {
          product: {
            include: {
              images: {
                where: { isPrimary: true },
                take: 1,
              },
              variants: true,
            },
          },
        },
      });
    } else {
      // Create new item
      cartItem = await prisma.cartItem.create({
        data: {
          userId: user.id,
          productId,
          variantId: variantId || null,
          quantity,
        },
        include: {
          product: {
            include: {
              images: {
                where: { isPrimary: true },
                take: 1,
              },
              variants: true,
            },
          },
        },
      });
    }

    return c.json(cartItem, 201);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return c.json({ error: "Failed to add item to cart" }, 500);
  }
});

// Update cart item quantity
cartRouter.put("/:id", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const { id } = c.req.param();
    const { quantity } = await c.req.json();

    if (!quantity || quantity < 1) {
      return c.json({ error: "Valid quantity is required" }, 400);
    }

    // Verify the cart item belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: { id, userId: user.id },
    });

    if (!cartItem) {
      return c.json({ error: "Cart item not found" }, 404);
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id },
      data: {
        quantity,
        updatedAt: new Date(),
      },
      include: {
        product: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
            variants: true,
          },
        },
      },
    });

    return c.json(updatedItem);
  } catch (error) {
    console.error("Error updating cart item:", error);
    return c.json({ error: "Failed to update cart item" }, 500);
  }
});

// Remove item from cart
cartRouter.delete("/:id", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const { id } = c.req.param();

    // Verify the cart item belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: { id, userId: user.id },
    });

    if (!cartItem) {
      return c.json({ error: "Cart item not found" }, 404);
    }

    await prisma.cartItem.delete({
      where: { id },
    });

    return c.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing cart item:", error);
    return c.json({ error: "Failed to remove cart item" }, 500);
  }
});

// Clear entire cart
cartRouter.delete("/", requireAuth, async (c) => {
  try {
    const user = c.get("user");

    await prisma.cartItem.deleteMany({
      where: { userId: user.id },
    });

    return c.json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return c.json({ error: "Failed to clear cart" }, 500);
  }
});

// Get cart summary (count and subtotal only)
cartRouter.get("/summary", requireAuth, async (c) => {
  try {
    const user = c.get("user");

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          select: {
            price: true,
            variants: {
              select: { id: true, price: true },
            },
          },
        },
      },
    });

    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce((sum, item) => {
      const price =
        item.product.variants.length > 0 && item.variantId
          ? item.product.variants.find((v) => v.id === item.variantId)?.price ||
            item.product.price
          : item.product.price;
      return sum + Number(price) * item.quantity;
    }, 0);

    return c.json({
      itemCount,
      subtotal: Number(subtotal.toFixed(2)),
    });
  } catch (error) {
    console.error("Error fetching cart summary:", error);
    return c.json({ error: "Failed to fetch cart summary" }, 500);
  }
});

// Debug endpoint to check authentication
cartRouter.get("/debug", async (c) => {
  const cookieHeader = c.req.header("cookie") || "";
  const allHeaders = Object.fromEntries(c.req.raw.headers.entries());

  return c.json({
    cookieHeader,
    allHeaders,
    message: "Debug endpoint - check server logs for session parsing details",
  });
});

export default cartRouter;
