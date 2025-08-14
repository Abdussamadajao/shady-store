import React from "react";
import { Outlet } from "react-router-dom";

export const ProtectedRoute: React.FC = () => {
  // Mock authentication check - replace with your actual auth logic
  // const isAuthenticated = false; // Set to true when user is authenticated

  // if (!isAuthenticated) {
  //   return <Navigate to="/auth/login" replace />;
  // }

  return <Outlet />;
};
