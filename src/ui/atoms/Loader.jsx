// Loader.js
import React from "react";

const Loader = () => {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center">
      {/* Loading animation */}
      <div className="flex space-x-2">
        <div className="w-5 h-5 bg-white rounded-full animate-bounce" />
        <div className="w-5 h-5 bg-white rounded-full animate-bounce animation-delay-200" />
        <div className="w-5 h-5 bg-white rounded-full animate-bounce animation-delay-400" />
      </div>
    </div>
  );
};

export default Loader;
