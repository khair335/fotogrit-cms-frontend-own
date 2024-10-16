import { Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useRef } from 'react';

const Dropdown = ({ isOpen, setIsOpen, children }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {isOpen && (
        <div
          className="absolute right-0 mt-6 transition-all duration-300 origin-top-right bg-white rounded-md shadow__great ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          {children}
        </div>
      )}
    </div>
  );
};

const DropdownHover = ({ children, isOpen, setIsOpen }) => {
  return (
    <Transition
      as={Fragment}
      show={isOpen}
      enter="transition-all duration-300 transform"
      enterFrom="opacity-0 translate-y-[-10%]"
      enterTo="opacity-100 translate-y-0"
      leave="transition-all duration-200 transform"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-[-10%]"
    >
      <div
        className={`dropdown absolute top-full right-0 bg-transparent z-50`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="bg-white p-4 shadow__great mt-[10px] rounded-lg overflow-hidden">
          {children}
        </div>
      </div>
    </Transition>
  );
};

export { Dropdown, DropdownHover };
