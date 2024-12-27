import React from "react";
const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Access Denied</h1>
      <p className="text-gray-600">
        You do not have permission to view this page.
      </p>
    </div>
  );
};

export default Unauthorized;
