import React from "react";
import { Link } from "react-router-dom";
import errorImg from "@/assets/error.png";
const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">Error</h1>

      {/* Animasi Icon (Bouncing SVG) */}
      <div className="flex justify-center mb-6">
        <img
          src={errorImg}
          className="animate-bounce w-32 h-32 text-green-500"
        />
      </div>
      {/* Error Text */}
      <p className="text-2xl text-gray-600 mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>
      {/* Back to Home Button */}
      <Link
        to="/home"
        className="px-6 py-3 text-white bg-green-500 rounded-lg hover:bg-green-400 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
