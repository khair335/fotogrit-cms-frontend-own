import React from 'react';

const SkeletonTable = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="w-full h-16 bg-gray-200 animate-pulse rounded-lg" />
      <div className="grid grid-cols-4 gap-4">
        <div className="w-full h-9 bg-gray-200 animate-pulse rounded-lg" />
        <div className="w-full h-9 bg-gray-200 animate-pulse rounded-lg" />
        <div className="w-full h-9 bg-gray-200 animate-pulse rounded-lg" />
        <div className="w-full h-9 bg-gray-200 animate-pulse rounded-lg" />
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="w-full h-9 bg-gray-200 animate-pulse rounded-lg" />
        <div className="w-full h-9 bg-gray-200 animate-pulse rounded-lg" />
        <div className="w-full h-9 bg-gray-200 animate-pulse rounded-lg" />
        <div className="w-full h-9 bg-gray-200 animate-pulse rounded-lg" />
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="w-full h-9 bg-gray-200 animate-pulse rounded-lg" />
        <div className="w-full h-9 bg-gray-200 animate-pulse rounded-lg" />
        <div className="w-full h-9 bg-gray-200 animate-pulse rounded-lg" />
        <div className="w-full h-9 bg-gray-200 animate-pulse rounded-lg" />
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="w-full h-9 bg-gray-200 animate-pulse rounded-lg" />
        <div className="w-full h-9 bg-gray-200 animate-pulse rounded-lg" />
        <div className="w-full h-9 bg-gray-200 animate-pulse rounded-lg" />
        <div className="w-full h-9 bg-gray-200 animate-pulse rounded-lg" />
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="w-full h-9 bg-gray-200 animate-pulse rounded-lg" />
        <div className="w-full h-9 bg-gray-200 animate-pulse rounded-lg" />
        <div className="w-full h-9 bg-gray-200 animate-pulse rounded-lg" />
        <div className="w-full h-9 bg-gray-200 animate-pulse rounded-lg" />
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="w-full h-9 bg-gray-200 animate-pulse rounded-lg" />
        <div className="w-full h-9 bg-gray-200 animate-pulse rounded-lg" />
        <div className="w-full h-9 bg-gray-200 animate-pulse rounded-lg" />
        <div className="w-full h-9 bg-gray-200 animate-pulse rounded-lg" />
      </div>
      <div className="w-full h-12 bg-gray-200 animate-pulse rounded-lg" />
    </div>
  );
};

export default SkeletonTable;
