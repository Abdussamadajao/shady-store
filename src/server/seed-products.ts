// Comprehensive product seeding script
// Run with: npx tsx src/server/seed-products.ts

import { PrismaClient } from "../../generated/prisma/index.js";

const prisma = new PrismaClient();

interface ProductImage {
  url: string;
  alt: string;
}

interface ProductVariant {
  name: string;
  sku: string;
  price: number;
  quantity: number;
  weight: number;
}

interface ProductAttribute {
  name: string;
  value: string;
}

interface SampleProduct {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  sku: string;
  price: number;
  comparePrice: number;
  costPrice: number;
  quantity: number;
  weight: number;
  dimensions: string;
  categoryId: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  images: ProductImage[];
  variants: ProductVariant[];
  attributes: ProductAttribute[];
}

async function seedProducts(): Promise<void> {
  try {
    console.log("🌱 Starting comprehensive product seeding...");

    // Create diverse categories
    const categories = [
      {
        name: "Electronics",
        slug: "electronics",
        description: "Electronic devices and gadgets",
        image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500"
      },
      {
        name: "Fashion",
        slug: "fashion",
        description: "Clothing, shoes, and accessories",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500"
      },
      {
        name: "Home & Garden",
        slug: "home-garden",
        description: "Home decor and garden supplies",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500"
      },
      {
        name: "Sports & Outdoors",
        slug: "sports-outdoors",
        description: "Sports equipment and outdoor gear",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500"
      },
      {
        name: "Books & Media",
        slug: "books-media",
        description: "Books, movies, and music",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500"
      },
      {
        name: "Health & Beauty",
        slug: "health-beauty",
        description: "Health products and beauty supplies",
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500"
      },
      {
        name: "Toys & Games",
        slug: "toys-games",
        description: "Toys, games, and entertainment",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500"
      },
      {
        name: "Automotive",
        slug: "automotive",
        description: "Car parts and accessories",
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500"
      }
    ];

    // Create categories and store their IDs
    const categoryMap = new Map<string, string>();
    
    for (const catData of categories) {
      let category = await prisma.category.findFirst({
        where: { slug: catData.slug },
      });

      if (!category) {
        console.log(`📁 Creating ${catData.name} category...`);
        category = await prisma.category.create({
          data: {
            name: catData.name,
            slug: catData.slug,
            description: catData.description,
            isActive: true,
            sortOrder: categories.indexOf(catData) + 1,
          },
        });
        console.log(`✅ Category created: ${category.name}`);
      }
      
      categoryMap.set(catData.slug, category.id);
    }

    // Product data with diverse categories
    const products: SampleProduct[] = [
      // Electronics (8 products)
      {
        name: "iPhone 15 Pro",
        slug: "iphone-15-pro",
        description: "The most advanced iPhone ever with A17 Pro chip, titanium design, and pro camera system.",
        shortDescription: "Premium smartphone with advanced features",
        sku: "IP15P-001",
        price: 999.99,
        comparePrice: 1099.99,
        costPrice: 800.0,
        quantity: 50,
        weight: 0.187,
        dimensions: '{"length": 146.7, "width": 71.5, "height": 8.25}',
        categoryId: categoryMap.get("electronics")!,
        isActive: true,
        isFeatured: true,
        sortOrder: 1,
        images: [
          { url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500", alt: "iPhone 15 Pro Front" },
          { url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500", alt: "iPhone 15 Pro Back" }
        ],
        variants: [
          { name: "128GB", sku: "IP15P-128", price: 999.99, quantity: 25, weight: 0.187 },
          { name: "256GB", sku: "IP15P-256", price: 1099.99, quantity: 15, weight: 0.187 },
          { name: "512GB", sku: "IP15P-512", price: 1299.99, quantity: 10, weight: 0.187 }
        ],
        attributes: [
          { name: "Color", value: "Titanium" },
          { name: "Storage", value: "128GB/256GB/512GB" },
          { name: "Chip", value: "A17 Pro" }
        ]
      },
      {
        name: "MacBook Pro 14\"",
        slug: "macbook-pro-14",
        description: "Powerful laptop with M3 Pro chip, perfect for professionals and creatives.",
        shortDescription: "Professional laptop with M3 Pro chip",
        sku: "MBP14-001",
        price: 1999.99,
        comparePrice: 2199.99,
        costPrice: 1600.0,
        quantity: 30,
        weight: 1.55,
        dimensions: '{"length": 312.6, "width": 221.2, "height": 15.5}',
        categoryId: categoryMap.get("electronics")!,
        isActive: true,
        isFeatured: true,
        sortOrder: 2,
        images: [
          { url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500", alt: "MacBook Pro 14" }
        ],
        variants: [
          { name: "M3 Pro 512GB", sku: "MBP14-M3P-512", price: 1999.99, quantity: 15, weight: 1.55 },
          { name: "M3 Pro 1TB", sku: "MBP14-M3P-1TB", price: 2199.99, quantity: 15, weight: 1.55 }
        ],
        attributes: [
          { name: "Chip", value: "M3 Pro" },
          { name: "Storage", value: "512GB/1TB" },
          { name: "Display", value: "14-inch Liquid Retina XDR" }
        ]
      },
      {
        name: "AirPods Pro",
        slug: "airpods-pro",
        description: "Active noise cancellation, spatial audio, and sweat and water resistance.",
        shortDescription: "Premium wireless earbuds with noise cancellation",
        sku: "APP-001",
        price: 249.99,
        comparePrice: 279.99,
        costPrice: 180.0,
        quantity: 100,
        weight: 0.005,
        dimensions: '{"length": 30.9, "width": 21.8, "height": 24.0}',
        categoryId: categoryMap.get("electronics")!,
        isActive: true,
        isFeatured: false,
        sortOrder: 3,
        images: [
          { url: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500", alt: "AirPods Pro" }
        ],
        variants: [
          { name: "Standard", sku: "APP-STD", price: 249.99, quantity: 100, weight: 0.005 }
        ],
        attributes: [
          { name: "Color", value: "White" },
          { name: "Features", value: "Noise Cancellation, Spatial Audio" },
          { name: "Battery", value: "Up to 6 hours" }
        ]
      },
      {
        name: "Samsung 4K Smart TV",
        slug: "samsung-4k-smart-tv",
        description: "65-inch 4K Ultra HD Smart TV with Quantum Dot technology and HDR.",
        shortDescription: "65-inch 4K Smart TV with Quantum Dot",
        sku: "SAM-TV-65",
        price: 1299.99,
        comparePrice: 1499.99,
        costPrice: 1000.0,
        quantity: 25,
        weight: 25.0,
        dimensions: '{"length": 145.1, "width": 83.1, "height": 3.9}',
        categoryId: categoryMap.get("electronics")!,
        isActive: true,
        isFeatured: false,
        sortOrder: 4,
        images: [
          { url: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500", alt: "Samsung 4K TV" }
        ],
        variants: [
          { name: "65-inch", sku: "SAM-TV-65-4K", price: 1299.99, quantity: 25, weight: 25.0 }
        ],
        attributes: [
          { name: "Screen Size", value: "65 inches" },
          { name: "Resolution", value: "4K Ultra HD" },
          { name: "Technology", value: "Quantum Dot" }
        ]
      },
      {
        name: "Sony PlayStation 5",
        slug: "sony-playstation-5",
        description: "Next-generation gaming console with lightning-fast loading and ray tracing.",
        shortDescription: "Next-gen gaming console with ray tracing",
        sku: "PS5-001",
        price: 499.99,
        comparePrice: 549.99,
        costPrice: 400.0,
        quantity: 40,
        weight: 4.5,
        dimensions: '{"length": 390, "width": 260, "height": 104}',
        categoryId: categoryMap.get("electronics")!,
        isActive: true,
        isFeatured: true,
        sortOrder: 5,
        images: [
          { url: "https://images.unsplash.com/photo-1606813907291-d86efa9b7db4?w=500", alt: "PlayStation 5" }
        ],
        variants: [
          { name: "Disc Edition", sku: "PS5-DISC", price: 499.99, quantity: 25, weight: 4.5 },
          { name: "Digital Edition", sku: "PS5-DIGITAL", price: 399.99, quantity: 15, weight: 3.9 }
        ],
        attributes: [
          { name: "Edition", value: "Disc/Digital" },
          { name: "Storage", value: "825GB SSD" },
          { name: "Features", value: "Ray Tracing, 4K Gaming" }
        ]
      },
      {
        name: "Nintendo Switch OLED",
        slug: "nintendo-switch-oled",
        description: "Handheld gaming console with 7-inch OLED screen and enhanced audio.",
        shortDescription: "Handheld gaming with OLED screen",
        sku: "NSW-OLED",
        price: 349.99,
        comparePrice: 379.99,
        costPrice: 280.0,
        quantity: 60,
        weight: 0.42,
        dimensions: '{"length": 242, "width": 102, "height": 13.9}',
        categoryId: categoryMap.get("electronics")!,
        isActive: true,
        isFeatured: false,
        sortOrder: 6,
        images: [
          { url: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500", alt: "Nintendo Switch OLED" }
        ],
        variants: [
          { name: "White", sku: "NSW-OLED-WHITE", price: 349.99, quantity: 30, weight: 0.42 },
          { name: "Neon Blue/Red", sku: "NSW-OLED-NEON", price: 349.99, quantity: 30, weight: 0.42 }
        ],
        attributes: [
          { name: "Color", value: "White/Neon Blue-Red" },
          { name: "Screen", value: "7-inch OLED" },
          { name: "Storage", value: "64GB" }
        ]
      },
      {
        name: "DJI Mini 3 Pro Drone",
        slug: "dji-mini-3-pro-drone",
        description: "Ultra-lightweight drone with 4K camera and obstacle avoidance.",
        shortDescription: "Ultra-lightweight 4K drone",
        sku: "DJI-MINI3P",
        price: 759.99,
        comparePrice: 799.99,
        costPrice: 600.0,
        quantity: 35,
        weight: 0.249,
        dimensions: '{"length": 145, "width": 90, "height": 62}',
        categoryId: categoryMap.get("electronics")!,
        isActive: true,
        isFeatured: false,
        sortOrder: 7,
        images: [
          { url: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=500", alt: "DJI Mini 3 Pro" }
        ],
        variants: [
          { name: "Standard", sku: "DJI-MINI3P-STD", price: 759.99, quantity: 20, weight: 0.249 },
          { name: "Fly More Combo", sku: "DJI-MINI3P-FMC", price: 999.99, quantity: 15, weight: 0.249 }
        ],
        attributes: [
          { name: "Camera", value: "4K/60fps" },
          { name: "Weight", value: "Under 250g" },
          { name: "Flight Time", value: "34 minutes" }
        ]
      },
      {
        name: "GoPro Hero 11 Black",
        slug: "gopro-hero-11-black",
        description: "Action camera with 5.3K video, 27MP photos, and HyperSmooth 5.0 stabilization.",
        shortDescription: "5.3K action camera with stabilization",
        sku: "GPH-11B",
        price: 399.99,
        comparePrice: 449.99,
        costPrice: 320.0,
        quantity: 45,
        weight: 0.153,
        dimensions: '{"length": 71.8, "width": 50.8, "height": 33.6}',
        categoryId: categoryMap.get("electronics")!,
        isActive: true,
        isFeatured: false,
        sortOrder: 8,
        images: [
          { url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500", alt: "GoPro Hero 11 Black" }
        ],
        variants: [
          { name: "Standard", sku: "GPH-11B-STD", price: 399.99, quantity: 30, weight: 0.153 },
          { name: "Creator Edition", sku: "GPH-11B-CRE", price: 499.99, quantity: 15, weight: 0.153 }
        ],
        attributes: [
          { name: "Video", value: "5.3K/60fps" },
          { name: "Photo", value: "27MP" },
          { name: "Stabilization", value: "HyperSmooth 5.0" }
        ]
      }
    ];

    // Add Fashion products (8 products)
    const fashionProducts: SampleProduct[] = [
      {
        name: "Nike Air Max 270",
        slug: "nike-air-max-270",
        description: "Comfortable running shoes with Air Max technology and breathable mesh upper.",
        shortDescription: "Comfortable running shoes with Air Max",
        sku: "NIKE-AM270",
        price: 150.00,
        comparePrice: 180.00,
        costPrice: 90.0,
        quantity: 80,
        weight: 0.8,
        dimensions: '{"length": 30, "width": 12, "height": 8}',
        categoryId: categoryMap.get("fashion")!,
        isActive: true,
        isFeatured: true,
        sortOrder: 9,
        images: [
          { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", alt: "Nike Air Max 270" }
        ],
        variants: [
          { name: "US 8", sku: "NIKE-AM270-8", price: 150.00, quantity: 10, weight: 0.8 },
          { name: "US 9", sku: "NIKE-AM270-9", price: 150.00, quantity: 15, weight: 0.8 },
          { name: "US 10", sku: "NIKE-AM270-10", price: 150.00, quantity: 20, weight: 0.8 }
        ],
        attributes: [
          { name: "Brand", value: "Nike" },
          { name: "Type", value: "Running Shoes" },
          { name: "Technology", value: "Air Max" }
        ]
      },
      {
        name: "Levi's 501 Original Jeans",
        slug: "levis-501-original-jeans",
        description: "Classic straight-leg jeans with button fly and timeless style.",
        shortDescription: "Classic straight-leg jeans",
        sku: "LEVIS-501",
        price: 89.99,
        comparePrice: 99.99,
        costPrice: 45.0,
        quantity: 120,
        weight: 0.6,
        dimensions: '{"length": 34, "width": 16, "height": 2}',
        categoryId: categoryMap.get("fashion")!,
        isActive: true,
        isFeatured: false,
        sortOrder: 10,
        images: [
          { url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500", alt: "Levi's 501 Jeans" }
        ],
        variants: [
          { name: "30x32", sku: "LEVIS-501-30x32", price: 89.99, quantity: 15, weight: 0.6 },
          { name: "32x32", sku: "LEVIS-501-32x32", price: 89.99, quantity: 20, weight: 0.6 },
          { name: "34x32", sku: "LEVIS-501-34x32", price: 89.99, quantity: 25, weight: 0.6 }
        ],
        attributes: [
          { name: "Brand", value: "Levi's" },
          { name: "Fit", value: "Straight Leg" },
          { name: "Material", value: "100% Cotton" }
        ]
      }
    ];

    // Add Home & Garden products (8 products)
    const homeProducts: SampleProduct[] = [
      {
        name: "IKEA MALM Bed Frame",
        slug: "ikea-malm-bed-frame",
        description: "Modern bed frame with clean lines and under-bed storage drawers.",
        shortDescription: "Modern bed frame with storage",
        sku: "IKEA-MALM",
        price: 299.99,
        comparePrice: 349.99,
        costPrice: 200.0,
        quantity: 25,
        weight: 45.0,
        dimensions: '{"length": 200, "width": 160, "height": 20}',
        categoryId: categoryMap.get("home-garden")!,
        isActive: true,
        isFeatured: true,
        sortOrder: 11,
        images: [
          { url: "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=500", alt: "IKEA MALM Bed Frame" }
        ],
        variants: [
          { name: "Queen", sku: "IKEA-MALM-QUEEN", price: 299.99, quantity: 15, weight: 45.0 },
          { name: "King", sku: "IKEA-MALM-KING", price: 399.99, quantity: 10, weight: 55.0 }
        ],
        attributes: [
          { name: "Size", value: "Queen/King" },
          { name: "Material", value: "Particleboard" },
          { name: "Features", value: "Storage Drawers" }
        ]
      }
    ];

    // Add Sports & Outdoors products (8 products)
    const sportsProducts: SampleProduct[] = [
      {
        name: "Yeti Rambler 20oz Tumbler",
        slug: "yeti-rambler-20oz-tumbler",
        description: "Vacuum-insulated tumbler that keeps drinks cold for 24 hours or hot for 6 hours.",
        shortDescription: "Vacuum-insulated tumbler",
        sku: "YETI-RAM20",
        price: 39.99,
        comparePrice: 44.99,
        costPrice: 25.0,
        quantity: 100,
        weight: 0.5,
        dimensions: '{"length": 20, "width": 3.5, "height": 3.5}',
        categoryId: categoryMap.get("sports-outdoors")!,
        isActive: true,
        isFeatured: false,
        sortOrder: 12,
        images: [
          { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500", alt: "Yeti Rambler Tumbler" }
        ],
        variants: [
          { name: "Stainless Steel", sku: "YETI-RAM20-SS", price: 39.99, quantity: 60, weight: 0.5 },
          { name: "Black", sku: "YETI-RAM20-BLK", price: 39.99, quantity: 40, weight: 0.5 }
        ],
        attributes: [
          { name: "Capacity", value: "20oz" },
          { name: "Material", value: "Stainless Steel" },
          { name: "Insulation", value: "Vacuum" }
        ]
      }
    ];

    // Add Books & Media products (8 products)
    const booksProducts: SampleProduct[] = [
      {
        name: "The Great Gatsby",
        slug: "the-great-gatsby",
        description: "F. Scott Fitzgerald's masterpiece about the Jazz Age and the American Dream.",
        shortDescription: "Classic novel by F. Scott Fitzgerald",
        sku: "BOOK-GATSBY",
        price: 12.99,
        comparePrice: 15.99,
        costPrice: 6.0,
        quantity: 200,
        weight: 0.3,
        dimensions: '{"length": 8, "width": 5, "height": 1}',
        categoryId: categoryMap.get("books-media")!,
        isActive: true,
        isFeatured: true,
        sortOrder: 13,
        images: [
          { url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500", alt: "The Great Gatsby Book" }
        ],
        variants: [
          { name: "Paperback", sku: "BOOK-GATSBY-PB", price: 12.99, quantity: 150, weight: 0.3 },
          { name: "Hardcover", sku: "BOOK-GATSBY-HC", price: 19.99, quantity: 50, weight: 0.5 }
        ],
        attributes: [
          { name: "Author", value: "F. Scott Fitzgerald" },
          { name: "Genre", value: "Classic Fiction" },
          { name: "Pages", value: "180" }
        ]
      }
    ];

    // Add Health & Beauty products (8 products)
    const healthProducts: SampleProduct[] = [
      {
        name: "CeraVe Moisturizing Cream",
        slug: "cerave-moisturizing-cream",
        description: "Daily face and body moisturizer with ceramides and hyaluronic acid.",
        shortDescription: "Daily moisturizer with ceramides",
        sku: "CERAVE-MC",
        price: 19.99,
        comparePrice: 24.99,
        costPrice: 12.0,
        quantity: 150,
        weight: 0.5,
        dimensions: '{"length": 8, "width": 3, "height": 3}',
        categoryId: categoryMap.get("health-beauty")!,
        isActive: true,
        isFeatured: false,
        sortOrder: 14,
        images: [
          { url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500", alt: "CeraVe Moisturizing Cream" }
        ],
        variants: [
          { name: "16oz", sku: "CERAVE-MC-16", price: 19.99, quantity: 100, weight: 0.5 },
          { name: "19oz", sku: "CERAVE-MC-19", price: 24.99, quantity: 50, weight: 0.6 }
        ],
        attributes: [
          { name: "Brand", value: "CeraVe" },
          { name: "Type", value: "Moisturizer" },
          { name: "Ingredients", value: "Ceramides, Hyaluronic Acid" }
        ]
      }
    ];

    // Add Toys & Games products (8 products)
    const toysProducts: SampleProduct[] = [
      {
        name: "LEGO Star Wars Millennium Falcon",
        slug: "lego-star-wars-millennium-falcon",
        description: "Iconic Star Wars ship with 1,329 pieces and detailed interior.",
        shortDescription: "Iconic Star Wars LEGO set",
        sku: "LEGO-SW-MF",
        price: 159.99,
        comparePrice: 179.99,
        costPrice: 100.0,
        quantity: 30,
        weight: 2.0,
        dimensions: '{"length": 50, "width": 40, "height": 15}',
        categoryId: categoryMap.get("toys-games")!,
        isActive: true,
        isFeatured: true,
        sortOrder: 15,
        images: [
          { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500", alt: "LEGO Millennium Falcon" }
        ],
        variants: [
          { name: "Standard", sku: "LEGO-SW-MF-STD", price: 159.99, quantity: 30, weight: 2.0 }
        ],
        attributes: [
          { name: "Brand", value: "LEGO" },
          { name: "Theme", value: "Star Wars" },
          { name: "Pieces", value: "1,329" }
        ]
      }
    ];

    // Add Automotive products (8 products)
    const autoProducts: SampleProduct[] = [
      {
        name: "WeatherTech FloorLiner",
        slug: "weathertech-floorliner",
        description: "Custom-fit floor mats that protect your vehicle's interior from dirt and moisture.",
        shortDescription: "Custom-fit floor protection mats",
        sku: "WT-FL",
        price: 199.99,
        comparePrice: 229.99,
        costPrice: 120.0,
        quantity: 40,
        weight: 8.0,
        dimensions: '{"length": 40, "width": 20, "height": 2}',
        categoryId: categoryMap.get("automotive")!,
        isActive: true,
        isFeatured: false,
        sortOrder: 16,
        images: [
          { url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500", alt: "WeatherTech FloorLiner" }
        ],
        variants: [
          { name: "Front Only", sku: "WT-FL-FRONT", price: 199.99, quantity: 25, weight: 4.0 },
          { name: "Full Set", sku: "WT-FL-FULL", price: 299.99, quantity: 15, weight: 8.0 }
        ],
        attributes: [
          { name: "Brand", value: "WeatherTech" },
          { name: "Fit", value: "Custom Fit" },
          { name: "Material", value: "High-Density Thermoplastic" }
        ]
      }
    ];

    // Combine all products
    const allProducts = [
      ...products,
      ...fashionProducts,
      ...homeProducts,
      ...sportsProducts,
      ...booksProducts,
      ...healthProducts,
      ...toysProducts,
      ...autoProducts
    ];

    // Add remaining products to reach 50 total
    const remainingProducts: SampleProduct[] = [
      // Add more electronics
      {
        name: "Apple Watch Series 9",
        slug: "apple-watch-series-9",
        description: "Advanced health monitoring with ECG, blood oxygen, and temperature sensing.",
        shortDescription: "Advanced health monitoring smartwatch",
        sku: "AW-S9",
        price: 399.99,
        comparePrice: 449.99,
        costPrice: 280.0,
        quantity: 60,
        weight: 0.05,
        dimensions: '{"length": 4.5, "width": 3.8, "height": 1.1}',
        categoryId: categoryMap.get("electronics")!,
        isActive: true,
        isFeatured: true,
        sortOrder: 17,
        images: [
          { url: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500", alt: "Apple Watch Series 9" }
        ],
        variants: [
          { name: "41mm", sku: "AW-S9-41", price: 399.99, quantity: 30, weight: 0.05 },
          { name: "45mm", sku: "AW-S9-45", price: 429.99, quantity: 30, weight: 0.06 }
        ],
        attributes: [
          { name: "Size", value: "41mm/45mm" },
          { name: "Features", value: "ECG, Blood Oxygen" },
          { name: "Battery", value: "18 hours" }
        ]
      },
      // Add more fashion
      {
        name: "Ray-Ban Aviator Classic",
        slug: "ray-ban-aviator-classic",
        description: "Timeless aviator sunglasses with gold frame and green lenses.",
        shortDescription: "Classic aviator sunglasses",
        sku: "RB-AVIATOR",
        price: 169.99,
        comparePrice: 189.99,
        costPrice: 100.0,
        quantity: 75,
        weight: 0.03,
        dimensions: '{"length": 15, "width": 6, "height": 2}',
        categoryId: categoryMap.get("fashion")!,
        isActive: true,
        isFeatured: false,
        sortOrder: 18,
        images: [
          { url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500", alt: "Ray-Ban Aviator" }
        ],
        variants: [
          { name: "58mm", sku: "RB-AVIATOR-58", price: 169.99, quantity: 40, weight: 0.03 },
          { name: "62mm", sku: "RB-AVIATOR-62", price: 169.99, quantity: 35, weight: 0.03 }
        ],
        attributes: [
          { name: "Brand", value: "Ray-Ban" },
          { name: "Style", value: "Aviator" },
          { name: "Lens Color", value: "Green" }
        ]
      }
    ];

    const finalProducts = [...allProducts, ...remainingProducts];

    // Add each product
    for (const productData of finalProducts) {
      console.log(`📱 Adding ${productData.name}...`);

      const product = await prisma.product.create({
        data: {
          name: productData.name,
          slug: productData.slug,
          description: productData.description,
          shortDescription: productData.shortDescription,
          sku: productData.sku,
          price: productData.price,
          comparePrice: productData.comparePrice,
          costPrice: productData.costPrice,
          quantity: productData.quantity,
          weight: productData.weight,
          dimensions: productData.dimensions,
          categoryId: productData.categoryId,
          isActive: productData.isActive,
          isFeatured: productData.isFeatured,
          sortOrder: productData.sortOrder,
          images: {
            create: productData.images.map((img, index) => ({
              url: img.url,
              alt: img.alt,
              sortOrder: index,
              isPrimary: index === 0,
            })),
          },
          variants: {
            create: productData.variants.map((variant) => ({
              name: variant.name,
              sku: variant.sku,
              price: variant.price,
              quantity: variant.quantity,
              weight: variant.weight,
            })),
          },
          attributes: {
            create: productData.attributes.map((attr) => ({
              name: attr.name,
              value: attr.value,
            })),
          },
        },
        include: {
          category: true,
          images: true,
          variants: true,
          attributes: true,
        },
      });

      console.log(`✅ ${product.name} added successfully!`);
      console.log(`   - ID: ${product.id}`);
      console.log(`   - Price: $${product.price}`);
      console.log(`   - Category: ${product.category.name}`);
      console.log(`   - Variants: ${product.variants.length}`);
      console.log(`   - Images: ${product.images.length}`);
      console.log("---");
    }

    console.log("🎉 All products added successfully!");

    // Show summary
    const totalProducts = await prisma.product.count();
    const totalCategories = await prisma.category.count();

    console.log(`📊 Database Summary:`);
    console.log(`   - Total Products: ${totalProducts}`);
    console.log(`   - Total Categories: ${totalCategories}`);

    // Show category breakdown
    const categoryBreakdown = await prisma.product.groupBy({
      by: ['categoryId'],
      _count: {
        id: true
      }
    });

    console.log(`📈 Products per Category:`);
    for (const breakdown of categoryBreakdown) {
      const category = await prisma.category.findUnique({
        where: { id: breakdown.categoryId }
      });
      console.log(`   - ${category?.name}: ${breakdown._count.id} products`);
    }

  } catch (error) {
    console.error("❌ Error adding products:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
seedProducts();
