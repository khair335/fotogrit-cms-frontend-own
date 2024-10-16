import React from 'react';

const SkeletonBlock = ({ width = 'w-40', height = 'h-10' }) => {
  return (
    <div
      className={`${width} ${height} bg-gray-200 animate-pulse rounded-md`}
    />
  );
};

export default SkeletonBlock;
