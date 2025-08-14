import type { RouteObject } from "react-router-dom";

import { ProtectedRoute } from "../guards/ProtectedRoute";
import { AuthLayout, ProtectedLayout } from "../layouts";

// Auth Pages
import Login from "../pages/auth/login";
import SignUp from "../pages/auth/signup";

// Public Pages
import Home from "../pages/Home";
import ProductPage from "../pages/Product";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Offers from "../pages/Offers";
import Help from "../pages/Help";

// Protected Pages
import NotFound from "../pages/NotFound";

// Account Pages
import { Profile, Orders, Settings } from "../pages/Account";

// Layouts
import { PATH } from "./paths";
import CartLayout from "@/layouts/CartLayout";
import AccountLayout from "@/layouts/AccountLayout";

export const routes: RouteObject[] = [
  {
    element: <ProtectedLayout />,
    children: [
      {
        element: <CartLayout />,
        children: [
          {
            path: PATH.root,
            element: <Home />,
          },
          {
            path: PATH.products.root,
            children: [
              {
                index: true,
                element: <ProductPage />,
              },
              {
                path: PATH.products.single(":id"),
                element: <ProductPage />,
              },
            ],
          },
        ],
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/checkout",
        element: <Checkout />,
      },
      {
        path: "/offers",
        element: <Offers />,
      },
      {
        path: "/help",
        element: <Help />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: PATH.account.root,
            element: <AccountLayout />,
            children: [
              {
                index: true,
                element: <Profile />,
              },
              {
                path: PATH.account.settings,
                element: <Settings />,
              },
              {
                path: PATH.account.orders,
                element: <Orders />,
              },
              {
                path: PATH.account.profile,
                element: <Profile />,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
];
