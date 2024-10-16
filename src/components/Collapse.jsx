import React from 'react';

const Collapse = ({ children, isOpen }) => {
  return (
    <>
      {isOpen && (
        <div className="w-full p-1 py-4 border-b-2 border-gray-300 min-h-min">
          {children}
        </div>
      )}
    </>
  );
};

export default Collapse;
