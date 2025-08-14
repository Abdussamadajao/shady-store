import React from "react";

const Account: React.FC = () => {
  // Auto-scroll to top when navigating to account

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Account</h1>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <p className="text-gray-600 text-center">
            Account settings and profile will be displayed here
          </p>
        </div>
      </div>
    </div>
  );
};

export default Account;
