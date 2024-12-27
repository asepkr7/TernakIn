import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      {/* SVG Animasi (Hewan Lucu) */}
      <div className="flex justify-center mb-4">
        <svg
          className="animate-bounce w-24 h-24 text-green-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.477 2 2 6.486 2 12c0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.514-4.478-10-10-10zm-2 15-3-3 1.414-1.414L10 13.172l3.586-3.586L15 11l-5 6z" />
        </svg>
      </div>
      {/* Teks Loading dengan Animasi */}
      <div className="relative text-4xl font-bold font-sans text-gray-800 uppercase tracking-widest">
        {/* Animasi Hijau Terisi */}
        <span className="absolute inset-0 bg-green-500 text-white overflow-hidden animate-fill">
          Loading
        </span>
        {/* Teks Statis */}
        <span className="relative z-10 text-transparent">Loading</span>
      </div>
    </div>
  );
};

export default Loader;
