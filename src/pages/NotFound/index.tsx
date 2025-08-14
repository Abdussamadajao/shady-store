import React from "react";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const NotFound: React.FC = () => {
  // Auto-scroll to top when navigating to 404 page
  useScrollToTop();
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Page Not Found</p>
        <p className="text-gray-500">
          The page you're looking for doesn't exist.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
