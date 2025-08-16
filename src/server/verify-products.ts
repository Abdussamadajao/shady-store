// Verify products and show statistics
import { PrismaClient } from "../../generated/prisma/index.js";

const prisma = new PrismaClient();

async function verifyProducts() {
  try {
    console.log("🔍 Verifying products in database...\n");

    // Get total counts
    const totalProducts = await prisma.product.count();
    const totalCategories = await prisma.category.count();
    const totalImages = await prisma.productImage.count();
    const totalVariants = await prisma.productVariant.count();

    console.log("📊 Database Statistics:");
    console.log(`   - Total Products: ${totalProducts}`);
    console.log(`   - Total Categories: ${totalCategories}`);
    console.log(`   - Total Product Images: ${totalImages}`);
    console.log(`   - Total Product Variants: ${totalVariants}\n`);

    // Get category breakdown
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    });

    console.log("📈 Products per Category:");
    for (const category of categories) {
      console.log(
        `   - ${category.name}: ${category._count.products} products`
      );
    }

    // Get featured products
    const featuredProducts = await prisma.product.findMany({
      where: { isFeatured: true },
      select: { name: true, price: true, category: { select: { name: true } } },
      orderBy: { sortOrder: "asc" },
    });

    console.log(`\n⭐ Featured Products (${featuredProducts.length}):`);
    for (const product of featuredProducts) {
      console.log(
        `   - ${product.name} (${product.category.name}) - $${product.price}`
      );
    }

    // Get price range
    const priceStats = await prisma.product.aggregate({
      _min: { price: true },
      _max: { price: true },
      _avg: { price: true },
    });

    console.log(`\n💰 Price Statistics:`);
    console.log(`   - Lowest Price: $${priceStats._min.price}`);
    console.log(`   - Highest Price: $${priceStats._max.price}`);
    console.log(
      `   - Average Price: $${Math.round(priceStats._avg.price * 100) / 100}`
    );

    // Get products with images
    const productsWithImages = await prisma.product.findMany({
      where: {
        images: {
          some: {},
        },
      },
      include: {
        images: true,
        category: true,
      },
      take: 5,
    });

    console.log(`\n🖼️  Sample Products with Images:`);
    for (const product of productsWithImages) {
      console.log(`   - ${product.name} (${product.category.name})`);
      console.log(
        `     Images: ${product.images.length} | Price: $${product.price}`
      );
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyProducts();
