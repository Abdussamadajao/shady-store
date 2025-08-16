// Seed 50 diverse products across multiple categories
import { PrismaClient } from "../../generated/prisma/index.js";

const prisma = new PrismaClient();

async function seedProducts() {
  try {
    console.log("🌱 Starting product seeding...");

    // Create categories
    const categories = [
      {
        name: "Electronics",
        slug: "electronics",
        image:
          "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500",
      },
      {
        name: "Fashion",
        slug: "fashion",
        image:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500",
      },
      {
        name: "Home & Garden",
        slug: "home-garden",
        image:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
      },
      {
        name: "Sports & Outdoors",
        slug: "sports-outdoors",
        image:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
      },
      {
        name: "Books & Media",
        slug: "books-media",
        image:
          "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500",
      },
      {
        name: "Health & Beauty",
        slug: "health-beauty",
        image:
          "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500",
      },
      {
        name: "Toys & Games",
        slug: "toys-games",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
      },
      {
        name: "Automotive",
        slug: "automotive",
        image:
          "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500",
      },
    ];

    const categoryMap = new Map();

    for (const cat of categories) {
      let category = await prisma.category.findFirst({
        where: { slug: cat.slug },
      });
      if (!category) {
        category = await prisma.category.create({
          data: {
            name: cat.name,
            slug: cat.slug,
            description: `${cat.name} products`,
            isActive: true,
          },
        });
      }
      categoryMap.set(cat.slug, category.id);
    }

    // Product data
    const products = [
      // Electronics (10 products)
      {
        name: "iPhone 15 Pro",
        price: 999.99,
        category: "electronics",
        image:
          "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
        description: "Advanced smartphone with A17 Pro chip",
      },
      {
        name: 'MacBook Pro 14"',
        price: 1999.99,
        category: "electronics",
        image:
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
        description: "Professional laptop with M3 Pro chip",
      },
      {
        name: "AirPods Pro",
        price: 249.99,
        category: "electronics",
        image:
          "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500",
        description: "Wireless earbuds with noise cancellation",
      },
      {
        name: "Samsung 4K TV",
        price: 1299.99,
        category: "electronics",
        image:
          "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500",
        description: "65-inch 4K Ultra HD Smart TV",
      },
      {
        name: "PlayStation 5",
        price: 499.99,
        category: "electronics",
        image:
          "https://images.unsplash.com/photo-1606813907291-d86efa9b7db4?w=500",
        description: "Next-generation gaming console",
      },
      {
        name: "Nintendo Switch OLED",
        price: 349.99,
        category: "electronics",
        image:
          "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500",
        description: "Handheld gaming with OLED screen",
      },
      {
        name: "DJI Mini 3 Pro",
        price: 759.99,
        category: "electronics",
        image:
          "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=500",
        description: "Ultra-lightweight 4K drone",
      },
      {
        name: "GoPro Hero 11",
        price: 399.99,
        category: "electronics",
        image:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
        description: "5.3K action camera",
      },
      {
        name: "Apple Watch Series 9",
        price: 399.99,
        category: "electronics",
        image:
          "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500",
        description: "Advanced health monitoring smartwatch",
      },
      {
        name: "iPad Air",
        price: 599.99,
        category: "electronics",
        image:
          "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
        description: "Powerful tablet with M1 chip",
      },

      // Fashion (10 products)
      {
        name: "Nike Air Max 270",
        price: 150.0,
        category: "fashion",
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
        description: "Comfortable running shoes",
      },
      {
        name: "Levi's 501 Jeans",
        price: 89.99,
        category: "fashion",
        image:
          "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
        description: "Classic straight-leg jeans",
      },
      {
        name: "Ray-Ban Aviator",
        price: 169.99,
        category: "fashion",
        image:
          "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
        description: "Classic aviator sunglasses",
      },
      {
        name: "Adidas Ultraboost",
        price: 180.0,
        category: "fashion",
        image:
          "https://images.unsplash.com/photo-1608231387042-66d1773050e5?w=500",
        description: "Premium running shoes",
      },
      {
        name: "Calvin Klein T-Shirt",
        price: 29.99,
        category: "fashion",
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
        description: "Premium cotton t-shirt",
      },
      {
        name: "Michael Kors Handbag",
        price: 299.99,
        category: "fashion",
        image:
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
        description: "Luxury leather handbag",
      },
      {
        name: "Rolex Submariner",
        price: 8999.99,
        category: "fashion",
        image:
          "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500",
        description: "Luxury diving watch",
      },
      {
        name: "Hermès Scarf",
        price: 399.99,
        category: "fashion",
        image:
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500",
        description: "Silk designer scarf",
      },
      {
        name: "Converse Chuck Taylor",
        price: 65.0,
        category: "fashion",
        image:
          "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=500",
        description: "Classic canvas sneakers",
      },
      {
        name: "Tommy Hilfiger Jacket",
        price: 129.99,
        category: "fashion",
        image:
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
        description: "Classic bomber jacket",
      },

      // Home & Garden (10 products)
      {
        name: "IKEA MALM Bed Frame",
        price: 299.99,
        category: "home-garden",
        image:
          "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=500",
        description: "Modern bed frame with storage",
      },
      {
        name: "Philips Hue Bulbs",
        price: 49.99,
        category: "home-garden",
        image:
          "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500",
        description: "Smart LED light bulbs",
      },
      {
        name: "Dyson V15 Vacuum",
        price: 699.99,
        category: "home-garden",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        description: "Cordless stick vacuum cleaner",
      },
      {
        name: "KitchenAid Mixer",
        price: 399.99,
        category: "home-garden",
        image:
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500",
        description: "Professional stand mixer",
      },
      {
        name: "Nest Thermostat",
        price: 249.99,
        category: "home-garden",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        description: "Smart home thermostat",
      },
      {
        name: "Weber Grill",
        price: 199.99,
        category: "home-garden",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        description: "Charcoal barbecue grill",
      },
      {
        name: "Roomba i7+",
        price: 799.99,
        category: "home-garden",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        description: "Robot vacuum with self-emptying",
      },
      {
        name: "Samsung Refrigerator",
        price: 1299.99,
        category: "home-garden",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        description: "French door refrigerator",
      },
      {
        name: "Bosch Dishwasher",
        price: 899.99,
        category: "home-garden",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        description: "Quiet dishwasher",
      },
      {
        name: "Garden Tool Set",
        price: 89.99,
        category: "home-garden",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        description: "Complete garden tool collection",
      },

      // Sports & Outdoors (10 products)
      {
        name: "Yeti Rambler Tumbler",
        price: 39.99,
        category: "sports-outdoors",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        description: "Vacuum-insulated tumbler",
      },
      {
        name: "Nike Basketball",
        price: 69.99,
        category: "sports-outdoors",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        description: "Official size basketball",
      },
      {
        name: "Adidas Soccer Cleats",
        price: 89.99,
        category: "sports-outdoors",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        description: "Professional soccer shoes",
      },
      {
        name: "Wilson Tennis Racket",
        price: 199.99,
        category: "sports-outdoors",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        description: "Professional tennis racket",
      },
      {
        name: "Columbia Hiking Boots",
        price: 149.99,
        category: "sports-outdoors",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        description: "Waterproof hiking boots",
      },
      {
        name: "North Face Jacket",
        price: 299.99,
        category: "sports-outdoors",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        description: "Insulated winter jacket",
      },
      {
        name: "Patagonia Backpack",
        price: 89.99,
        category: "sports-outdoors",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        description: "Durable hiking backpack",
      },
      {
        name: "Garmin GPS Watch",
        price: 399.99,
        category: "sports-outdoors",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        description: "Fitness tracking GPS watch",
      },
      {
        name: "CamelBak Water Bottle",
        price: 24.99,
        category: "sports-outdoors",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        description: "Hydration water bottle",
      },
      {
        name: "Yoga Mat",
        price: 49.99,
        category: "sports-outdoors",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        description: "Premium yoga mat",
      },

      // Books & Media (5 products)
      {
        name: "The Great Gatsby",
        price: 12.99,
        category: "books-media",
        image:
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
        description: "Classic novel by F. Scott Fitzgerald",
      },
      {
        name: "Harry Potter Set",
        price: 89.99,
        category: "books-media",
        image:
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
        description: "Complete 7-book collection",
      },
      {
        name: "Bluetooth Speaker",
        price: 79.99,
        category: "books-media",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        description: "Portable wireless speaker",
      },
      {
        name: "Kindle Paperwhite",
        price: 139.99,
        category: "books-media",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        description: "E-reader with backlight",
      },
      {
        name: "Vinyl Record Player",
        price: 199.99,
        category: "books-media",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        description: "Classic turntable",
      },

      // Health & Beauty (5 products)
      {
        name: "CeraVe Moisturizer",
        price: 19.99,
        category: "health-beauty",
        image:
          "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500",
        description: "Daily face moisturizer",
      },
      {
        name: "Oral-B Toothbrush",
        price: 39.99,
        category: "health-beauty",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        description: "Electric toothbrush",
      },
      {
        name: "L'Oreal Foundation",
        price: 24.99,
        category: "health-beauty",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        description: "Long-lasting foundation",
      },
      {
        name: "Nike Fitness Tracker",
        price: 149.99,
        category: "health-beauty",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        description: "Activity tracking band",
      },
      {
        name: "Yoga Block Set",
        price: 19.99,
        category: "health-beauty",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        description: "Foam yoga blocks",
      },

      // Toys & Games (5 products)
      {
        name: "LEGO Star Wars Set",
        price: 159.99,
        category: "toys-games",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        description: "Millennium Falcon LEGO set",
      },
      {
        name: "Monopoly Board Game",
        price: 29.99,
        category: "toys-games",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        description: "Classic board game",
      },
      {
        name: "Nerf Blaster",
        price: 24.99,
        category: "toys-games",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        description: "Foam dart blaster",
      },
      {
        name: "Puzzle 1000 Pieces",
        price: 19.99,
        category: "toys-games",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        description: "Landscape puzzle",
      },
      {
        name: "Remote Control Car",
        price: 49.99,
        category: "toys-games",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        description: "High-speed RC car",
      },

      // Automotive (5 products)
      {
        name: "WeatherTech Floor Mats",
        price: 199.99,
        category: "automotive",
        image:
          "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500",
        description: "Custom-fit floor protection",
      },
      {
        name: "Dash Camera",
        price: 89.99,
        category: "automotive",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        description: "1080p dashboard camera",
      },
      {
        name: "Car Phone Mount",
        price: 19.99,
        category: "automotive",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        description: "Universal phone holder",
      },
      {
        name: "LED Light Strips",
        price: 39.99,
        category: "automotive",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        description: "Car interior lighting",
      },
      {
        name: "Car Wash Kit",
        price: 49.99,
        category: "automotive",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        description: "Complete cleaning set",
      },
    ];

    // Add products
    let productCount = 0;
    for (const product of products) {
      const slug = product.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Check if product already exists
      const existingProduct = await prisma.product.findFirst({
        where: { slug: slug },
      });

      if (existingProduct) {
        console.log(`⏭️  ${product.name} already exists, skipping...`);
        continue;
      }

      console.log(`📱 Adding ${product.name}...`);

      await prisma.product.create({
        data: {
          name: product.name,
          slug: slug,
          description: product.description,
          shortDescription: product.description,
          sku: `SKU-${productCount + 1}`,
          price: product.price,
          comparePrice: product.price * 1.2,
          costPrice: product.price * 0.6,
          quantity: Math.floor(Math.random() * 100) + 20,
          weight: Math.random() * 2 + 0.1,
          dimensions: '{"length": 10, "width": 5, "height": 2}',
          categoryId: categoryMap.get(product.category),
          isActive: true,
          isFeatured: productCount < 10,
          sortOrder: productCount + 1,
          images: {
            create: [
              {
                url: product.image,
                alt: product.name,
                sortOrder: 0,
                isPrimary: true,
              },
            ],
          },
          variants: {
            create: [
              {
                name: "Standard",
                sku: `VAR-${productCount + 1}`,
                price: product.price,
                quantity: Math.floor(Math.random() * 100) + 20,
                weight: Math.random() * 2 + 0.1,
              },
            ],
          },
          attributes: {
            create: [
              { name: "Category", value: product.category },
              { name: "Brand", value: "Premium Brand" },
            ],
          },
        },
      });

      console.log(`✅ ${product.name} added!`);
      productCount++;
    }

    console.log("🎉 All products added successfully!");

    const totalProducts = await prisma.product.count();
    console.log(`📊 Total Products: ${totalProducts}`);
    console.log(`📈 Products per Category:`);
    console.log(`   - Electronics: 10 products`);
    console.log(`   - Fashion: 10 products`);
    console.log(`   - Home & Garden: 10 products`);
    console.log(`   - Sports & Outdoors: 10 products`);
    console.log(`   - Books & Media: 5 products`);
    console.log(`   - Health & Beauty: 5 products`);
    console.log(`   - Toys & Games: 5 products`);
    console.log(`   - Automotive: 5 products`);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedProducts();
