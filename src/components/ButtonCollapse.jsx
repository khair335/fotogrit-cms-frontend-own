import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';

const ButtonCollapse = ({ label, isOpen, handleClick, disabled }) => {
  return (
    <button
      className={`flex items-center gap-2 px-3 pr-4 py-2 sm:max-w-max ${
        isOpen ? ' ' : 'text-white bg-[#111111] rounded-lg'
      }   group hover:bg-opacity-80 hover:text-opacity-80 transition-all duration-300`}
      onClick={handleClick}
      disabled={disabled}
    >
      <div
        className={`p-1 text-white transition-all duration-300 ${
          isOpen ? 'bg-[#111111] rounded-md group-hover:bg-opacity-80' : ''
        } `}
      >
        {isOpen ? (
          <IoIosArrowDown className="duration-300 group-hover:transform group-hover:-rotate-180" />
        ) : (
          <FaPlus />
        )}
      </div>

      <span className="text-sm font-medium group-hover:text-opacity-60">
        {label}
      </span>
    </button>
  );
};

export default ButtonCollapse;
