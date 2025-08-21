import type { RouteObject } from "react-router-dom";

import { ProtectedRoute } from "../guards/ProtectedRoute";
import { AuthLayout, ProtectedLayout } from "../layouts";

// Auth Pages
import Login from "../pages/auth/login";
import SignUp from "../pages/auth/signup";
import ForgotPassword from "../pages/auth/forgot-password";
import ResetPassword from "../pages/auth/reset-password";
import Verification from "../pages/auth/verification";

// Public Pages
import Home from "../pages/Home";
import ProductPage from "../pages/Product";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Payment from "../pages/Payment";
import PaymentSuccess from "../pages/Payment/PaymentSuccess";
import Offers from "../pages/Offers";
import Help from "../pages/Help";

// Protected Pages
import NotFound from "../pages/NotFound";

// Account Pages
import { Profile, Settings, Wishlist, Reviews } from "../pages/Account";
import OrdersPage from "../pages/Account/OrdersPage";

// Layouts
import { PATH, PATH_AUTH } from "./paths";
import CartLayout from "@/layouts/CartLayout";
import AccountLayout from "@/layouts/AccountLayout";
import ProductDemo from "@/pages/Product/ProductDemo";
import AuthRoute from "@/guards/AuthRoute";

export const routes: RouteObject[] = [
  {
    element: <AuthRoute />,
    children: [
      {
        path: PATH_AUTH.root,
        element: <AuthLayout />,
        children: [
          {
            path: PATH_AUTH.login,
            element: <Login />,
          },
          {
            path: PATH_AUTH.signup,
            element: <SignUp />,
          },
          {
            path: PATH_AUTH.forgotPassword,
            element: <ForgotPassword />,
          },
          {
            path: PATH_AUTH.resetPassword,
            element: <ResetPassword />,
          },
          {
            path: PATH_AUTH.verification,
            element: <Verification />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
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
                    element: <ProductDemo />,
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
            path: "/offers",
            element: <Offers />,
          },
          {
            path: "/help",
            element: <Help />,
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
            path: "/payment/:orderId",
            element: <Payment />,
          },
          {
            path: "/payment-success",
            element: <PaymentSuccess />,
          },
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
                element: <OrdersPage />,
              },
              {
                path: PATH.account.profile,
                element: <Profile />,
              },
              {
                path: PATH.account.wishlist,
                element: <Wishlist />,
              },
              {
                path: PATH.account.reviews,
                element: <Reviews />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
