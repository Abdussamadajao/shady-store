import React, { useState } from "react";
import { useProducts, useProduct, useProductMutations } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Edit, Trash2, Eye } from "lucide-react";
import SearchProducts from "@/components/search/SearchProducts";

const ProductDemo: React.FC = () => {
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    categoryId: "",
  });

  // React Query hooks
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useProducts({
    search: searchQuery.trim() || undefined,
    limit: 20,
  });

  const { data: selectedProduct, isLoading: productLoading } =
    useProduct(selectedProductId);

  const { createProduct, updateProduct, deleteProduct } = useProductMutations();

  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.categoryId) return;

    try {
      await createProduct.mutateAsync({
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        categoryId: newProduct.categoryId,
      });

      // Reset form
      setNewProduct({ name: "", price: "", categoryId: "" });
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct.mutateAsync(id);
        if (selectedProductId === id) {
          setSelectedProductId("");
        }
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
  };

  const products = productsData?.products || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          React Query Product Demo
        </h1>
        <p className="text-gray-600">
          Showcasing React Query for product management
        </p>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">All Products</h2>
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
          </div>

          {productsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-secondary" />
            </div>
          ) : productsError ? (
            <div className="text-center py-8 text-red-500">
              Failed to load products
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="aspect-square mb-3 bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={
                          product.images[0]?.url ||
                          "https://via.placeholder.com/300x300"
                        }
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 truncate">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {product.category.name}
                      </Badge>
                      <span className="font-bold text-secondary">
                        ${product.price}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedProductId(product.id)}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex-1"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Search Tab */}
        <TabsContent value="search" className="space-y-4">
          <h2 className="text-2xl font-semibold">Search Products</h2>
          <div className="max-w-md">
            <SearchProducts
              onProductSelect={handleProductSelect}
              placeholder="Type to search products..."
            />
          </div>
          <p className="text-sm text-gray-600">
            This search component uses React Query with debouncing to avoid
            excessive API calls.
          </p>
        </TabsContent>

        {/* Create Tab */}
        <TabsContent value="create" className="space-y-4">
          <h2 className="text-2xl font-semibold">Create New Product</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product Name
                  </label>
                  <Input
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    placeholder="Enter price"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category ID
                  </label>
                  <Input
                    value={newProduct.categoryId}
                    onChange={(e) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        categoryId: e.target.value,
                      }))
                    }
                    placeholder="Enter category ID"
                  />
                </div>
                <Button
                  onClick={handleCreateProduct}
                  disabled={createProduct.isPending}
                  className="w-full"
                >
                  {createProduct.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Product
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <h2 className="text-2xl font-semibold">Product Details</h2>

          {!selectedProductId ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                Select a product to view details
              </CardContent>
            </Card>
          ) : productLoading ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-secondary mx-auto mb-2" />
                Loading product details...
              </CardContent>
            </Card>
          ) : selectedProduct ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {selectedProduct.name}
                  <Badge variant="secondary">
                    {selectedProduct.category.name}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Product Information</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Price:</span> $
                        {selectedProduct.price}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span>
                        <Badge
                          variant={
                            selectedProduct.isActive ? "default" : "destructive"
                          }
                          className="ml-2"
                        >
                          {selectedProduct.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </p>
                      <p>
                        <span className="font-medium">Reviews:</span>{" "}
                        {selectedProduct._count.reviews}
                      </p>
                      <p>
                        <span className="font-medium">Created:</span>{" "}
                        {new Date(
                          selectedProduct.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {selectedProduct.description && (
                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-sm text-gray-600">
                        {selectedProduct.description}
                      </p>
                    </div>
                  )}
                </div>

                {selectedProduct.images &&
                  selectedProduct.images.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-3">Images</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {selectedProduct.images.map((image, index) => (
                          <div
                            key={image.id}
                            className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
                          >
                            <img
                              src={image.url}
                              alt={`${selectedProduct.name} - Image ${
                                index + 1
                              }`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-red-500">
                Product not found
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDemo;
