import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";

const ProtectedLayout: React.FC = () => {
  const { data, error, isPending } = authClient.useSession();

  // Debug logging
  console.log("ProtectedLayout Session Debug:", {
    data,
    error,
    isPending,
    cookies: document.cookie,
  });

  // const { isAuthenticated, setAuth, logout } = useAuthStore();
  // console.log(data);

  // function onLogOut() {
  //   toast.error("Session expired, please login again");
  //   logout();
  //   // navigate(PATH_AUTH.login);
  // }

  // useEffect(() => {
  //   if (!error) return;

  //   onLogOut();
  // }, [error]);

  // useEffect(() => {
  //   if (!isPending && !data) {
  //     onLogOut();
  //   }
  // }, [isPending, data]);

  // if (isPending) {
  //   return <div>Loading...</div>;
  // }
  // useEffect(() => {
  //   if (!data) return;

  //   setAuth({ user: data.user as unknown as any, session: data.session });
  // }, [data]);

  return (
    <div className="min-h-screen bg-primary-DEFAULT">
      <Header />
      <div className=" ">
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedLayout;
