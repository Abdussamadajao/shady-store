import Cart from "@/components/cart";
import React from "react";
import { Outlet } from "react-router-dom";

const CartLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-primary-DEFAULT">
      <Outlet />
      <Cart />
    </div>
  );
};

export default CartLayout;
