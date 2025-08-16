import { Hono } from "hono";
import { PrismaClient } from "../../../generated/prisma/index.js";

const productsRouter = new Hono();
const prisma = new PrismaClient();

// Get all products with pagination and filtering
productsRouter.get("/", async (c) => {
  try {
    const {
      page = "1",
      limit = "10",
      category,
      search,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = c.req.query();

    const skip = (Number(page) - 1) * Number(limit);

    // Build where clause
    const where: any = {
      isActive: true,
    };

    if (category) {
      where.categoryId = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        {
          shortDescription: { contains: search, mode: "insensitive" },
        },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Build orderBy
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: {
            orderBy: { sortOrder: "asc" },
          },
          variants: true,
          attributes: true,
          _count: {
            select: {
              reviews: true,
            },
          },
        },
        skip,
        take: Number(limit),
        orderBy,
      }),
      prisma.product.count({ where }),
    ]);

    return c.json({
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    return c.json({ error: "Failed to fetch products" }, 500);
  }
});
productsRouter.get("/:id", async (c) => {
  try {
    const { id } = c.req.param();

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: "asc" },
        },
        variants: true,
        attributes: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (!product) {
      return c.json({ error: "Product not found" }, 404);
    }

    return c.json(product);
  } catch (error) {
    return c.json({ error: "Failed to fetch product" }, 500);
  }
});

export default productsRouter;
