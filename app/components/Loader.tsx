"use client";

import React from "react";
import Image from "next/image";

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="relative">
        {/* Rotating ring */}
        <div className="w-28 h-28 rounded-full border-4 border-t-blue-500 border-gray-700 animate-spin"></div>

        {/* Center image */}
        <Image
          src="/Gemini_Generated_Image_o0uen0o0uen0o0ue-removebg-preview.png"
          alt="Loading..."
          className="absolute inset-0 m-auto h-16 w-16 object-contain animate-pulse"
          width={64}
          height={64}
        />
      </div>
    </div>
  );
};

export default Loader;
