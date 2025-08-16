import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../../../generated/prisma/index.js";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        isActive: boolean;
      };
    }
  }
}

// JWT token verification middleware
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    const decoded = jwt.verify(
      token,
      process.env["JWT_SECRET"] ||
        "your-super-secret-jwt-key-change-in-production"
    ) as any;

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Invalid or inactive user" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

// Role-based access control middleware
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Required roles: ${roles.join(", ")}`,
      });
    }

    next();
  };
};

// Admin access middleware
export const requireAdmin = requireRole(["ADMIN"]);

// Staff access middleware (Admin + Staff)
export const requireStaff = requireRole(["ADMIN", "STAFF"]);

// Customer access middleware (any authenticated user)
export const requireAuth = requireRole(["ADMIN", "STAFF", "CUSTOMER"]);

// Optional authentication middleware (sets user if token is valid, but doesn't require it)
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      const decoded = jwt.verify(
        token,
        process.env["JWT_SECRET"] ||
          "your-super-secret-jwt-key-change-in-production"
      ) as any;

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, role: true, isActive: true },
      });

      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Continue without setting user if token is invalid
    next();
  }
};

// Rate limiting middleware for authentication endpoints
export const rateLimit = (maxRequests: number, windowMs: number) => {
  const requests = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.connection.remoteAddress || "unknown";
    const now = Date.now();

    const userRequests = requests.get(ip);

    if (!userRequests || now > userRequests.resetTime) {
      requests.set(ip, { count: 1, resetTime: now + windowMs });
    } else {
      userRequests.count++;

      if (userRequests.count > maxRequests) {
        return res.status(429).json({
          error: "Too many requests. Please try again later.",
        });
      }
    }

    next();
  };
};

// Apply rate limiting to auth endpoints
export const authRateLimit = rateLimit(5, 15 * 60 * 1000); // 5 requests per 15 minutes
