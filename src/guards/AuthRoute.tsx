import React from "react";
import { useAuthStore } from "@/store/auth";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PATH } from "@/routes/paths";

const AuthRoute: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to={PATH.root} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default AuthRoute;
