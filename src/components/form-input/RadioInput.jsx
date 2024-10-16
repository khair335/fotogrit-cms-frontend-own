import React from 'react';

const RadioInput = (props) => {
  const { name, id, label, checked, value, onChange, labelStyle, disabled } =
    props;
  return (
    <div className="flex items-center gap-3 ">
      <input
        type="radio"
        name={name}
        id={id}
        className="w-4 h-4 cursor-pointer accent-ftbrown"
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <label htmlFor={id} className={`${labelStyle}`}>
        {label}
      </label>
    </div>
  );
};

export default RadioInput;
