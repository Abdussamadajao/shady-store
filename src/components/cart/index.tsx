import React, { useState } from "react";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import {
  useCartTotal,
  useCartItemCount,
  useCartItems,
  useCartStore,
} from "@/store/cart";
import { Button } from "../ui/button";
import { formatNGN } from "@/utils/currency";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { PATH } from "@/routes/paths";

// Subtotal Component
const Subtotal: React.FC = () => {
  const cartTotal = useCartTotal();
  const cartItemCount = useCartItemCount();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-center text-sm text-white gap-2">
        <span>
          <ShoppingCart className="h-5 w-5" />
        </span>
        {cartItemCount} items
      </div>
      <span className="inline-flex items-center justify-center w-full h-8 overflow-hidden text-secondary-100 bg-white rounded text-sm font-medium px-2">
        {formatNGN(cartTotal)}
      </span>
    </div>
  );
};

// Cart Drawer Component
const CartDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const cartItems = useCartItems();
  const { removeFromCart, updateCartItemQuantity } = useCartStore();
  const cartTotal = useCartTotal();
  const navigate = useNavigate();
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[90vw] max-w-md">
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold text-gray-800">
            Shopping Cart
          </SheetTitle>
          <SheetDescription className="text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
            your cart
          </SheetDescription>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto py-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-8">
              <ShoppingCart className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-600">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg"
                >
                  {/* Item Image */}
                  <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🛒</span>
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <p className="text-lg font-semibold text-secondary-100">
                      {formatNGN(
                        typeof item.price === "string"
                          ? parseFloat(item.price)
                          : item.price
                      )}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        updateCartItemQuantity(item.id, item.quantity - 1)
                      }
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="h-4 w-4 text-gray-600" />
                    </button>
                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateCartItemQuantity(item.id, item.quantity + 1)
                      }
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <SheetFooter className="border-t border-gray-200 pt-4">
            <div className="w-full space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-xl font-bold text-secondary-100">
                  {formatNGN(cartTotal)}
                </span>
              </div>
              <Button
                onClick={() => navigate(PATH.cart)}
                className="w-full bg-secondary-100 hover:bg-secondary py-3"
              >
                Checkout
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

// Mobile Cart Component
const MobileCart: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const cartItems = useCartItems();
  const { removeFromCart, updateCartItemQuantity } = useCartStore();
  const cartTotal = useCartTotal();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* Header */}
        <SheetHeader className="px-4 pb-4 border-b border-gray-200">
          <SheetTitle className="text-xl font-bold text-gray-800">
            Cart
          </SheetTitle>
          <SheetDescription className="text-sm text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
          </SheetDescription>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl"
                >
                  {/* Item Image */}
                  <div className="flex-shrink-0 w-14 h-14 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                    <span className="text-xl">🛒</span>
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 truncate text-sm">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500">{item.category}</p>
                    <p className="text-base font-semibold text-secondary-100">
                      {formatNGN(
                        typeof item.price === "string"
                          ? parseFloat(item.price)
                          : item.price
                      )}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        updateCartItemQuantity(item.id, item.quantity - 1)
                      }
                      className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="h-3 w-3 text-gray-600" />
                    </button>
                    <span className="w-8 text-center font-medium text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateCartItemQuantity(item.id, item.quantity + 1)
                      }
                      className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="h-3 w-3 text-gray-600" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <SheetFooter className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="w-full space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">
                  Total:
                </span>
                <span className="text-xl font-bold text-secondary-100">
                  {formatNGN(cartTotal)}
                </span>
              </div>
              <Button className="w-full bg-secondary hover:bg-secondary-100 py-4 text-lg font-medium rounded-xl">
                Checkout
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

const Cart = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  const handleCartClick = () => {
    // Check if mobile or desktop
    if (window.innerWidth < 1024) {
      setIsMobileCartOpen(true);
    } else {
      setIsDrawerOpen(true);
    }
    console.log("clicked");
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const closeMobileCart = () => {
    setIsMobileCartOpen(false);
  };

  return (
    <>
      {/* Desktop Floating Cart Button */}
      <div
        onClick={handleCartClick}
        className="z-30 cursor-pointer fixed right-0 top-[60%] transform py-4  -translate-y-1/2 flex-col  md:flex rounded-tl-md rounded-bl-md items-center hidden w-[100px] h-auto p-0 bg-secondary-100 border-0 shadow-md  justify-center"
      >
        <Subtotal />
      </div>

      {/* Mobile Floating Cart Button - Bottom */}
      <div
        onClick={handleCartClick}
        className="z-30 cursor-pointer fixed left-4 right-4 bottom-4 md:hidden flex items-center justify-center pl-4 pr-1 py-1 rounded-full bg-secondary-100 border-0 shadow-lg"
      >
        <div className="flex items-center justify-between w-full">
          {/* Left Side - Cart Icon and Item Count */}
          <div className="flex items-center gap-2 text-white">
            <ShoppingCart className="h-5 w-5" />
            <span className="text-sm font-medium">
              {useCartItemCount()} items
            </span>
          </div>

          {/* Right Side - Total Price */}
          <div className="bg-white rounded-full flex items-center justify-center px-3 py-1 w-16 h-10">
            <span className="text-sm font-semibold text-secondary-100">
              {formatNGN(useCartTotal())}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Cart Drawer */}
      <CartDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />

      {/* Mobile Cart */}
      <MobileCart isOpen={isMobileCartOpen} onClose={closeMobileCart} />
    </>
  );
};

export default Cart;
