import { Hono } from "hono";
import { PrismaClient } from "../../../generated/prisma/index.js";

const categoriesRouter = new Hono();
const prisma = new PrismaClient();

// Get all categories
categoriesRouter.get("/", async (c) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return c.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return c.json({ error: "Failed to fetch categories" }, 500);
  }
});

// Get category by ID with products
categoriesRouter.get("/:id", async (c) => {
  try {
    const { id } = c.req.param();

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          where: { isActive: true },
          include: {
            images: {
              orderBy: { sortOrder: "asc" },
              take: 1,
            },
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      return c.json({ error: "Category not found" }, 404);
    }

    return c.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return c.json({ error: "Failed to fetch category" }, 500);
  }
});

export default categoriesRouter;
