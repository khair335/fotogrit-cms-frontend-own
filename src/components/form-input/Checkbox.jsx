import React from 'react';

const Checkbox = (props) => {
  const { name, checked, onChange, disabled, className } = props;

  return (
    <input
      name={name || 'checkbox'}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className={`border-gray-400 rounded-sm cursor-pointer accent-ftbrown ${className}`}
      disabled={disabled}
    />
  );
};

export default Checkbox;
