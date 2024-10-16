import React from 'react';

const Card = ({ children, className = '', height, ref }) => {
  return (
    <div
      className={`card bg-white w-full  rounded-xl shadow-md overflow-y-auto overflow-x-hidden ${className} ${
        height ? height : 'h-full'
      }`}
      ref={ref}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-white drop-shadow-md border-b border-gray-300 px-3 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between z-30 ${className}`}
    >
      {children}
    </div>
  );
};

const CardBody = ({ children, className = '' }) => {
  return <div className={`w-full ${className}`}>{children}</div>;
};

export { Card, CardHeader, CardBody };
