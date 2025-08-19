import { PrismaClient } from "../../../generated/prisma/index.js";
import { Buffer } from "buffer";

const prisma = new PrismaClient();

export type AuthenticatedUser = {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
};

// Helper function to get current user from session
export async function getCurrentUser(c: any): Promise<AuthenticatedUser | null> {
  try {
    // Get the session cookie
    const cookieHeader = c.req.header("cookie") || "";
    console.log("Cookie header:", cookieHeader);

    // Check for both possible session cookie names
    let sessionCookie = cookieHeader
      .split(";")
      .find((cookie: string) =>
        cookie.trim().startsWith("pick-bazar.session_data=")
      );

    // If session_data not found, try session_token
    if (!sessionCookie) {
      sessionCookie = cookieHeader
        .split(";")
        .find((cookie: string) =>
          cookie.trim().startsWith("pick-bazar.session_token=")
        );
    }

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
export async function requireAuth(c: any, next: any) {
  const user = await getCurrentUser(c);
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  c.set("user", user);
  await next();
}

// Role-based access control middleware
export function requireRole(roles: string[]) {
  return async (c: any, next: any) => {
    const user = await getCurrentUser(c);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    if (!roles.includes(user.role)) {
      return c.json({ error: "Insufficient permissions" }, 403);
    }
    
    c.set("user", user);
    await next();
  };
}

// Admin-only middleware
export const requireAdmin = requireRole(["ADMIN"]);

// Staff or Admin middleware
export const requireStaff = requireRole(["ADMIN", "STAFF"]);
