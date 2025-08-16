import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ProductHeader: React.FC = () => {
  return (
    <div className="mb-4 sm:mb-6">
      <Link
        to="/"
        className="inline-flex items-center text-sm sm:text-base text-gray-600 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Back to Products</span>
        <span className="sm:hidden">Back</span>
      </Link>
    </div>
  );
};

export default ProductHeader;
