"use client";

import { BsStars } from "react-icons/bs";

const Loader = () => {
  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center animate-pulse">
          <BsStars className="text-white text-2xl" />
        </div>
        <div className="absolute inset-0 w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full animate-ping opacity-20"></div>
      </div>
      
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Loading...
        </h3>
        <p className="text-gray-600">
          Please wait while we prepare your experience
        </p>
      </div>
      
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
};

export default Loader;
