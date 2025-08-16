// Test script to add products to the database
// NOTE: This file has been replaced by seed-50-products.ts for comprehensive seeding
// Run with: npx tsx src/server/seed-50-products.ts

import { PrismaClient } from "../../generated/prisma/index.js";

const prisma = new PrismaClient();

// Type definitions for better type safety
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

async function addSampleProducts(): Promise<void> {
  try {
    console.log("🌱 Adding sample products...");

    // First, create a sample category if it doesn't exist
    let category = await prisma.category.findFirst({
      where: { slug: "electronics" },
    });

    if (!category) {
      console.log("📁 Creating Electronics category...");
      category = await prisma.category.create({
        data: {
          name: "Electronics",
          slug: "electronics",
          description: "Electronic devices and gadgets",
          isActive: true,
          sortOrder: 1,
        },
      });
      console.log("✅ Category created:", category.name);
    }

    // Sample product data
    const sampleProducts: SampleProduct[] = [
      {
        name: "iPhone 15 Pro",
        slug: "iphone-15-pro",
        description:
          "The most advanced iPhone ever with A17 Pro chip, titanium design, and pro camera system.",
        shortDescription: "Premium smartphone with advanced features",
        sku: "IP15P-001",
        price: 999.99,
        comparePrice: 1099.99,
        costPrice: 800.0,
        quantity: 50,
        weight: 0.187,
        dimensions: '{"length": 146.7, "width": 71.5, "height": 8.25}',
        categoryId: category.id,
        isActive: true,
        isFeatured: true,
        sortOrder: 1,
        images: [
          {
            url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
            alt: "iPhone 15 Pro Front",
          },
          {
            url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
            alt: "iPhone 15 Pro Back",
          },
        ],
        variants: [
          {
            name: "128GB",
            sku: "IP15P-128",
            price: 999.99,
            quantity: 25,
            weight: 0.187,
          },
          {
            name: "256GB",
            sku: "IP15P-256",
            price: 1099.99,
            quantity: 15,
            weight: 0.187,
          },
          {
            name: "512GB",
            sku: "IP15P-512",
            price: 1299.99,
            quantity: 10,
            weight: 0.187,
          },
        ],
        attributes: [
          { name: "Color", value: "Titanium" },
          { name: "Storage", value: "128GB/256GB/512GB" },
          { name: "Chip", value: "A17 Pro" },
        ],
      },
      {
        name: 'MacBook Pro 14"',
        slug: "macbook-pro-14",
        description:
          "Powerful laptop with M3 Pro chip, perfect for professionals and creatives.",
        shortDescription: "Professional laptop with M3 Pro chip",
        sku: "MBP14-001",
        price: 1999.99,
        comparePrice: 2199.99,
        costPrice: 1600.0,
        quantity: 30,
        weight: 1.55,
        dimensions: '{"length": 312.6, "width": 221.2, "height": 15.5}',
        categoryId: category.id,
        isActive: true,
        isFeatured: true,
        sortOrder: 2,
        images: [
          {
            url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
            alt: "MacBook Pro 14",
          },
        ],
        variants: [
          {
            name: "M3 Pro 512GB",
            sku: "MBP14-M3P-512",
            price: 1999.99,
            quantity: 15,
            weight: 1.55,
          },
          {
            name: "M3 Pro 1TB",
            sku: "MBP14-M3P-1TB",
            price: 2199.99,
            quantity: 15,
            weight: 1.55,
          },
        ],
        attributes: [
          { name: "Chip", value: "M3 Pro" },
          { name: "Storage", value: "512GB/1TB" },
          { name: "Display", value: "14-inch Liquid Retina XDR" },
        ],
      },
      {
        name: "AirPods Pro",
        slug: "airpods-pro",
        description:
          "Active noise cancellation, spatial audio, and sweat and water resistance.",
        shortDescription: "Premium wireless earbuds with noise cancellation",
        sku: "APP-001",
        price: 249.99,
        comparePrice: 279.99,
        costPrice: 180.0,
        quantity: 100,
        weight: 0.005,
        dimensions: '{"length": 30.9, "width": 21.8, "height": 24.0}',
        categoryId: category.id,
        isActive: true,
        isFeatured: false,
        sortOrder: 3,
        images: [
          {
            url: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500",
            alt: "AirPods Pro",
          },
        ],
        variants: [
          {
            name: "Standard",
            sku: "APP-STD",
            price: 249.99,
            quantity: 100,
            weight: 0.005,
          },
        ],
        attributes: [
          { name: "Color", value: "White" },
          { name: "Features", value: "Noise Cancellation, Spatial Audio" },
          { name: "Battery", value: "Up to 6 hours" },
        ],
      },
    ];

    // Add each product
    for (const productData of sampleProducts) {
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
      console.log(`   - Variants: ${product.variants.length}`);
      console.log(`   - Images: ${product.images.length}`);
      console.log("---");
    }

    console.log("🎉 All sample products added successfully!");

    // Show summary
    const totalProducts = await prisma.product.count();
    const totalCategories = await prisma.category.count();

    console.log(`📊 Database Summary:`);
    console.log(`   - Total Products: ${totalProducts}`);
    console.log(`   - Total Categories: ${totalCategories}`);
  } catch (error) {
    console.error("❌ Error adding products:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
addSampleProducts();
