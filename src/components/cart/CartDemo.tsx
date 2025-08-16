import React from "react";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";

// Mock product data for demonstration
const mockProduct = {
  id: "demo-product-1",
  name: "Demo Product",
  price: 29.99,
  images: ["https://via.placeholder.com/150"],
  description: "This is a demo product to test the cart functionality",
};

const CartDemo: React.FC = () => {
  const {
    items,
    total,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    pendingSync,
    lastSynced,
    syncToDatabase,
  } = useCartStore();

  const handleAddToCart = () => {
    // This will immediately update the UI and save to localStorage
    addToCart(mockProduct, 1);
  };

  const handleRemoveFromCart = (productId: string) => {
    removeFromCart(productId);
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleClearCart = () => {
    clearCart();
  };

  const handleManualSync = () => {
    syncToDatabase();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Cart Demo - Immediate Updates
        </h1>
        <p className="text-gray-600">
          Add items to see instant updates with local storage and background
          database sync
        </p>
      </div>

      {/* Add to Cart Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Add to Cart</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h3 className="font-medium">{mockProduct.name}</h3>
            <p className="text-gray-600">${mockProduct.price}</p>
          </div>
          <Button
            onClick={handleAddToCart}
            className="bg-secondary-100 hover:bg-secondary text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Cart Status */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium">Items in Cart:</span>
            <span className="ml-2 text-blue-600">{itemCount}</span>
          </div>
          <div>
            <span className="font-medium">Total:</span>
            <span className="ml-2 text-blue-600">${total.toFixed(2)}</span>
          </div>
          <div>
            <span className="font-medium">Sync Status:</span>
            <span
              className={`ml-2 ${
                pendingSync ? "text-orange-600" : "text-green-600"
              }`}
            >
              {pendingSync ? "Pending" : "Synced"}
            </span>
          </div>
          <div>
            <span className="font-medium">Last Synced:</span>
            <span className="ml-2 text-blue-600">
              {lastSynced ? new Date(lastSynced).toLocaleTimeString() : "Never"}
            </span>
          </div>
        </div>
      </div>

      {/* Manual Sync Button */}
      <div className="mt-4">
        <button
          onClick={handleManualSync}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Force Manual Sync
        </button>

        {/* Test API Button */}
        <button
          onClick={() => useCartStore.getState().testAPI()}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2"
        >
          Test API
        </button>
      </div>

      {/* Cart Items */}
      {items.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Cart Items</h2>
              <Button
                onClick={handleClearCart}
                variant="outline"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>
          </div>

          <div className="divide-y">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-6 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      item.product.images[0]?.url ||
                      "https://via.placeholder.com/60"
                    }
                    alt={item.product.name}
                    className="w-15 h-15 rounded object-cover"
                  />
                  <div>
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-gray-600">${item.product.price}</p>
                    {item.id.startsWith("temp-") && (
                      <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                        Pending Sync
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleUpdateQuantity(item.productId, item.quantity - 1)
                      }
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-3 py-1 min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleUpdateQuantity(item.productId, item.quantity + 1)
                      }
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFromCart(item.productId)}
                    className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-gray-50 border-t">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">
                Total: ${total.toFixed(2)}
              </div>
              <Button
                onClick={handleManualSync}
                disabled={!pendingSync}
                className="bg-secondary-100 hover:bg-secondary text-white"
              >
                {pendingSync ? "Sync Now" : "All Synced"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Your cart is empty
          </h3>
          <p className="text-gray-600">Add some items to get started!</p>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">How it works:</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>
            • <strong>Immediate Updates:</strong> Cart updates instantly when
            you add/remove items
          </li>
          <li>
            • <strong>Local Storage:</strong> Cart data is saved to browser
            storage immediately
          </li>
          <li>
            • <strong>Background Sync:</strong> Database is updated
            automatically in the background
          </li>
          <li>
            • <strong>Offline Support:</strong> Works even when offline, syncs
            when connection returns
          </li>
          <li>
            • <strong>Pending Items:</strong> Items with "Pending Sync" badge
            are being synced to database
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CartDemo;
