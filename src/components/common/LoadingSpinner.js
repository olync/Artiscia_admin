import React from 'react';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-teal-200 rounded-full animate-spin"></div>
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
      </div>
      <p className="text-gray-600 font-medium mt-4">{message}</p>
      <p className="text-gray-400 text-sm mt-1">Please wait a moment...</p>
    </div>
  );
};

export default LoadingSpinner;
