import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";

const ProtectedLayout: React.FC = () => {
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
