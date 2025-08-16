import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/store/auth";
import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute: React.FC = () => {
  // Mock authentication check - replace with your actual auth logic
  const { data, error, isPending } = authClient.useSession();
  const { isAuthenticated, setAuth, logout } = useAuthStore();
  console.log(data);

  useEffect(() => {
    if (!data) return;

    setAuth({ user: data.user as unknown as any, session: data.session });
  }, [data]);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};
