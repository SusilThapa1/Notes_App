import React from "react";

const MyUploadCardLoader = () => {
  return (
    <div className="p-4 border rounded-xl shadow-sm bg-white animate-pulse flex flex-col gap-3">
      {/* Header */}
      <div className="h-5 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>

      {/* Tags */}
      <div className="flex gap-2 mt-2">
        <div className="h-5 bg-gray-200 rounded w-24"></div>
        <div className="h-5 bg-gray-200 rounded w-20"></div>
        <div className="h-5 bg-gray-200 rounded w-48"></div>
      </div>

      <hr />

      {/* Footer */}
      <div className="flex justify-between items-center mt-2">
        <div className="h-6 w-16 bg-gray-200 rounded"></div>

        <div className="flex gap-2">
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

const  CardLoader= () => {
  return (
    <div className="p-4 border rounded-xl shadow-sm bg-white  animate-pulse flex flex-col gap-3">
      {/* Header */}
      <div className="h-5 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>

      {/* Tags */}
      <div className="flex gap-2 mt-2">
        <div className="h-5 bg-gray-200 rounded w-28"></div>
        <div className="h-5 bg-gray-200 rounded w-20"></div>
      </div>

      <hr />

      {/* Footer */}
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>

        <div className="flex gap-2">
          <div className="h-6 w-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export { CardLoader, MyUploadCardLoader };
