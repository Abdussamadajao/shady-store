import { Hono } from "hono";
import { PrismaClient } from "../../../generated/prisma/index.js";
import { requireAuth, type AuthenticatedUser } from "../middleware/auth.js";

type UserContext = {
  Variables: {
    user: AuthenticatedUser;
  };
};

const usersRouter = new Hono<UserContext>();
const prisma = new PrismaClient();

// Get current user profile
usersRouter.get("/profile", requireAuth, async (c) => {
  try {
    const user = c.get("user");

    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        isActive: true,
        emailVerified: true,
        phoneVerified: true,
        twoFactorEnabled: true,
        createdAt: true,
        updatedAt: true,
        preferences: true,
        settings: true,
      },
    });

    if (!profile) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({ profile });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Update current user profile
usersRouter.put("/profile", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const body = await c.req.json();

    // Validate input
    const { firstName, lastName, phone, avatar, preferences, settings } = body;

    // Update user profile
    const updatedProfile = await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        phone: phone || undefined,
        avatar: avatar || undefined,
        preferences: preferences || undefined,
        settings: settings || undefined,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        isActive: true,
        emailVerified: true,
        phoneVerified: true,
        twoFactorEnabled: true,
        createdAt: true,
        updatedAt: true,
        preferences: true,
        settings: true,
      },
    });

    return c.json({ profile: updatedProfile });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get user preferences
usersRouter.get("/preferences", requireAuth, async (c) => {
  try {
    const user = c.get("user");

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { preferences: true, settings: true },
    });

    if (!userData) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({
      preferences: userData.preferences || {},
      settings: userData.settings || {},
    });
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Update user preferences
usersRouter.put("/preferences", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const body = await c.req.json();

    const { preferences, settings } = body;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        preferences: preferences || undefined,
        settings: settings || undefined,
        updatedAt: new Date(),
      },
      select: { preferences: true, settings: true },
    });

    return c.json({
      preferences: updatedUser.preferences || {},
      settings: updatedUser.settings || {},
    });
  } catch (error) {
    console.error("Error updating user preferences:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get user account status
usersRouter.get("/status", requireAuth, async (c) => {
  try {
    const user = c.get("user");

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        emailVerified: true,
        phoneVerified: true,
        twoFactorEnabled: true,
        isActive: true,
        accountLocked: true,
        lockReason: true,
        lastLoginAt: true,
        lastPasswordChange: true,
      },
    });

    if (!userData) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({ status: userData });
  } catch (error) {
    console.error("Error fetching user status:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default usersRouter;
