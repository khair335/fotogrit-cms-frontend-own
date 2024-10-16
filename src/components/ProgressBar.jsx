import React from 'react';

const ProgressBar = ({ percentage }) => {
  return (
    <div className=" relative  px-4 py-2 bg-black/90 overflow-hidden text-center rounded-md">
      <span className="z-20 relative text-white font-medium">
        Uploading {`${percentage}%`}
      </span>
      <div
        className=" bg-green-500 h-full absolute left-0 top-0 z-10 animate-pulse"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
