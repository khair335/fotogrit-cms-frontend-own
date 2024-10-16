import React from 'react';

const Button = ({
  type = 'button',
  children,
  className = '',
  background = 'gray',
  onClick,
  disabled,
}) => {
  return (
    <button
      type={type}
      className={`py-2 inline-block px-3 outline-none text-white font-bold rounded-xl bg__btn-${background} transition-all duration-300 text-sm disabled:bg-opacity-60 ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
