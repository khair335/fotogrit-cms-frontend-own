import React from 'react';

const SkeletonTableTwoRow = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="w-full h-16 bg-gray-200 rounded-lg animate-pulse" />
      <div className="grid grid-cols-4 gap-4">
        <div className="w-full bg-gray-200 rounded-lg h-9 animate-pulse" />
        <div className="w-full bg-gray-200 rounded-lg h-9 animate-pulse" />
        <div className="w-full bg-gray-200 rounded-lg h-9 animate-pulse" />
        <div className="w-full bg-gray-200 rounded-lg h-9 animate-pulse" />
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="w-full bg-gray-200 rounded-lg h-9 animate-pulse" />
        <div className="w-full bg-gray-200 rounded-lg h-9 animate-pulse" />
        <div className="w-full bg-gray-200 rounded-lg h-9 animate-pulse" />
        <div className="w-full bg-gray-200 rounded-lg h-9 animate-pulse" />
      </div>
    </div>
  );
};

export default SkeletonTableTwoRow;
