import React from "react";

const Scene = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      <div className="mb-6 text-center">
        {/* App logo */}
        <div className="w-20 h-20 mb-4 mx-auto">
          {/* Insert your app logo inside the div */}
          <img src="/logo.svg" alt="YathraGo Logo" className="w-full h-full" />
        </div>
        {/* App name */}
        <h1 className="text-3xl font-semibold">YathraGo</h1>
      </div>

      {/* Fire animation */}
      <div className="fire-container mt-8">
        <div className="flame flame-1"></div>
        <div className="flame flame-2"></div>
        <div className="flame flame-3"></div>
        <div className="flame flame-4"></div>
      </div>
    </div>
  );
};

export default Scene;
