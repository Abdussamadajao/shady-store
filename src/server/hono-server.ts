import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { auth } from "./auth/better-auth.js";
import productsRouter from "./routes/products.js";
import categoriesRouter from "./routes/categories.js";
import cartRouter from "./routes/cart.js";
import { Buffer } from "buffer";

const app = new Hono();
const PORT = process.env["PORT"] || 3001;

// Middleware
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: ["http://localhost:4050", "http://localhost:3001"],
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposeHeaders: ["Set-Cookie"],
  })
);

// Auth routes - handle all auth endpoints
app.on(["GET", "POST", "PUT", "DELETE", "PATCH"], "/api/auth/*", async (c) => {
  try {
    // Directly pass the raw request to auth handler
    const response = await auth.handler(c.req.raw);
    // Return the response directly
    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return c.json(
      { error: "Authentication error", details: errorMessage },
      500
    );
  }
});

// Mount route modules
app.route("/api/products", productsRouter);
app.route("/api/categories", categoriesRouter);
app.route("/api/cart", cartRouter);

// Health check
app.get("/health", (c) => {
  return c.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Debug endpoint
app.get("/debug-cookie", (c) => {
  const cookieHeader = c.req.header("cookie") || "";

  // Parse session cookie
  const sessionCookie = cookieHeader
    .split(";")
    .find((cookie) => cookie.trim().startsWith("pick-bazar.session_data="));

  if (sessionCookie) {
    const sessionData = sessionCookie.split("=")[1];
    try {
      const decoded = Buffer.from(sessionData || "", "base64").toString(
        "utf-8"
      );
      const parsed = JSON.parse(decoded);
      return c.json({
        cookieHeader,
        parsedSession: parsed,
      });
    } catch (decodeError) {
      console.error("Failed to decode session:", decodeError);
      return c.json({ error: "Failed to decode session" });
    }
  }

  return c.json({
    cookieHeader,
    parsedSession: null,
  });
});

// Start server
export default {
  port: PORT,
  fetch: app.fetch,
};

// Start server in development mode
const startDevServer = async () => {
  if (process.env["NODE_ENV"] !== "production") {
    try {
      // @ts-ignore: Type declaration issue
      const { serve } = await import("@hono/node-server");
      serve({
        fetch: app.fetch,
        port: Number(PORT),
      });
      console.log(`🚀 Hono server running on http://localhost:${PORT}`);
    } catch (err) {
      console.error("Failed to start development server:", err);
    }
  }
};

startDevServer();
