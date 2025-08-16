import React from "react";
import { useParams } from "react-router-dom";
import { useProduct, useRelatedProducts } from "@/hooks/useProducts";
import type { Product } from "@/hooks/useProducts";
// import { useCartManager } from "@/lib/use-cart";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import {
  ProductImageGallery,
  ProductDetails,
  ProductHeader,
  RelatedProducts,
  MobileStickyActions,
} from "@/components/product";
import { Info, Tag, Calendar } from "lucide-react";
import { formatNGN } from "@/utils/currency";

const ProductPage: React.FC = () => {
  const { id } = useParams();

  // Auto-scroll to top when navigating to product detail
  useScrollToTop();

  // Get product details from API
  const {
    data: product,
    isLoading: productLoading,
    error: productError,
  } = useProduct(id || "");

  // const {
  //   addToCart,
  //   updateCartItemQuantity,
  //   removeFromCart,
  //   cartItems,
  //   isAddingToCart,
  //   isUpdatingCart,
  // } = useCartManager();

  // Get product images from API data or use placeholder
  const productImages = product?.images?.map((img) => img.url) || [
    "https://via.placeholder.com/400x400?text=Product+Image",
    "https://via.placeholder.com/400x400?text=Product+Image+2",
    "https://via.placeholder.com/400x400?text=Product+Image+3",
    "https://via.placeholder.com/400x400?text=Product+Image+4",
    "https://via.placeholder.com/400x400?text=Product+Image+5",
  ];

  // Get related products using the API hook
  const { data: relatedProductsData, isLoading: relatedLoading } =
    useRelatedProducts(id || "", 4);
  const relatedProducts = relatedProductsData?.products || [];

  // Find cart item for this product
  // const cartItem = cartItems.find(
  //   (item) => item.productId === product?.id || item.id === product?.id
  // );
  // const cartQuantity = cartItem?.quantity || 0;

  const handleAddToCart = async (product: Product) => {
    // await addToCart({
    //   id: product.id,
    //   images: product.images.map((img) => img.url),
    //   price: product.price.toString(),
    //   name: product.name,
    //   count: "1",
    //   category: product.category.name,
    //   detail: product.description || "",
    // });
  };

  const handleUpdateQuantity = async (
    productId: string,
    newQuantity: number
  ) => {
    // if (newQuantity <= 0) {
    //   if (cartItem) {
    //     // await removeFromCart(cartItem.id);
    //   }
    //   return;
    // }
    // if (cartItem) {
    //   // await updateCartItemQuantity(cartItem.id, newQuantity);
    // }
  };

  if (productLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Loading Product...
          </h1>
        </div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist or there was an error
            loading it.
          </p>
          <a href="/" className="inline-block">
            <button className="bg-secondary-100 hover:bg-secondary text-white px-4 py-2 rounded">
              ← Back to Home
            </button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Full-width layout */}
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
        {/* Back Navigation */}
        <div className="mb-8">
          <ProductHeader />
        </div>

        {/* Main Product Section - Full width */}
        <div className="space-y-8">
          {/* Section 1: Image + Details + Add to Cart */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-0">
              {/* Product Image Gallery */}
              <div className="xl:col-span-1 bg-gradient-to-br from-gray-50 to-white p-6 lg:p-8 xl:p-12">
                <ProductImageGallery
                  images={productImages}
                  productName={product.name}
                />
              </div>

              {/* Product Details + Add to Cart */}
              <div className="xl:col-span-1 bg-white p-6 lg:p-8 xl:p-12 border-l border-gray-100">
                <div className="sticky top-8">
                  {/* <ProductDetails
                    product={product}
                    cartQuantity={cartQuantity}
                    onAddToCart={handleAddToCart}
                    onUpdateQuantity={handleUpdateQuantity}
                    isAddingToCart={isAddingToCart}
                    isUpdatingCart={isUpdatingCart}
                  /> */}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Specifications */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-6 lg:p-8 xl:p-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Product Specifications
            </h2>

            <div className="space-y-6">
              {/* Description */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-lg">
                  <Info className="h-5 w-5 text-secondary" />
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed text-base">
                  {product.description ||
                    "No description available for this product."}
                </p>
              </div>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                    <Tag className="h-5 w-5 text-secondary" />
                    Variants
                  </h3>
                  <div className="space-y-3">
                    {product.variants.map((variant) => (
                      <div
                        key={variant.id}
                        className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-secondary-100 transition-colors"
                      >
                        <span className="font-medium text-gray-800">
                          {variant.name}
                        </span>
                        <span className="font-bold text-secondary text-lg">
                          {formatNGN(variant.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attributes */}
              {product.attributes && product.attributes.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                    <Info className="h-5 w-5 text-secondary" />
                    Specifications
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.attributes.map((attribute) => (
                      <div
                        key={attribute.id}
                        className="p-4 bg-white rounded-lg border border-gray-200"
                      >
                        <div className="text-sm text-gray-600 font-medium mb-1">
                          {attribute.name}
                        </div>
                        <div className="text-gray-800 font-semibold">
                          {attribute.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Product Details */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                  <Info className="h-5 w-5 text-secondary" />
                  Additional Details
                </h3>

                <div className="space-y-4">
                  {/* Product Features */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <div className="text-sm text-gray-600 font-medium mb-1">
                        Product Type
                      </div>
                      <div className="text-gray-800 font-semibold">
                        {product.isActive
                          ? "Active Product"
                          : "Inactive Product"}
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <div className="text-sm text-gray-600 font-medium mb-1">
                        Availability
                      </div>
                      <div className="text-gray-800 font-semibold">
                        {product.isActive ? "In Stock" : "Out of Stock"}
                      </div>
                    </div>
                  </div>

                  {/* Product Categories & Tags */}
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-600 font-medium mb-2">
                      Product Categories
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-secondary-100 text-white rounded-full text-sm font-medium">
                        {product.category.name}
                      </span>
                      {product.isActive && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          Featured
                        </span>
                      )}
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        Premium
                      </span>
                    </div>
                  </div>

                  {/* Product Statistics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                      <div className="text-2xl font-bold text-secondary">
                        {product._count.reviews}
                      </div>
                      <div className="text-sm text-gray-600">Reviews</div>
                    </div>

                    <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                      <div className="text-2xl font-bold text-secondary">
                        {product.variants?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Variants</div>
                    </div>

                    <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                      <div className="text-2xl font-bold text-secondary">
                        {product.attributes?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Specs</div>
                    </div>
                  </div>

                  {/* Product Information Footer */}
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="space-y-4">
                      {/* Category */}
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600 font-medium">
                          Category:
                        </span>
                        <span className="px-3 py-1 bg-secondary-100 text-white rounded-full text-sm font-semibold">
                          {product.category.name}
                        </span>
                      </div>

                      {/* Product ID */}

                      {/* Dates */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4 text-secondary" />
                          <span>
                            Added:{" "}
                            {new Date(product.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4 text-secondary" />
                          <span>
                            Updated:{" "}
                            {new Date(product.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Related Products */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-6 lg:p-8 xl:p-12">
            {/* <RelatedProducts
              products={relatedProducts}
              isLoading={relatedLoading}
              getCartItemQuantity={(productId: string) => {
                const item = cartItems.find(
                  (item) =>
                    item.productId === productId || item.id === productId
                );
                return item?.quantity || 0;
              }}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
            /> */}
          </div>

          {/* Mobile Sticky Add to Cart */}
          <div className="mt-8">
            {/* <MobileStickyActions
              product={product}
              cartQuantity={cartQuantity}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
              isAddingToCart={isAddingToCart}
              isUpdatingCart={isUpdatingCart}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
