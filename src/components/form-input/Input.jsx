import React from 'react';

const Input = (props) => {
  const {
    type,
    label,
    name,
    className,
    value,
    onChange,
    min,
    disabled,
    errValidation,
    register,
    errServer,
    errCodeServer,
    placeholder,
    defaultValue,
    inputMode,
  } = props;

  return (
    <div className="flex flex-col text-sm">
      <label htmlFor={name} className="text-gray-500">
        {label}
      </label>
      <input
        type={type || 'text'}
        id={name}
        name={name}
        {...(register && register(name))}
        className={`py-[9px] px-3 rounded-xl bg-gray-300/50 shadow__gear-2 outline-none focus:bg-gray-300/90 disabled:opacity-80 disabled:bg-black/30 disabled:text-black/50 disabled:font-medium disabled:placeholder:text-black/70 ${className}`}
        placeholder={placeholder || label}
        value={value}
        defaultValue={value ? undefined : defaultValue} // Set defaultValue conditionally
        onChange={onChange}
        min={min}
        disabled={disabled}
        autoComplete="off"
        inputMode={inputMode || 'text'}
      />

      {/* Dispaly Error validation using react-hook-form */}
      {errValidation && (
        <p className="text-[10px] text-red-600 animate-pulse">
          {errValidation?.[name]?.message}
        </p>
      )}

      {/* Dispaly Error validation from api server */}
      {errServer?.status === errCodeServer ? (
        <span className="text-[10px] animate-pulse text-red-600">
          {errServer?.message}
        </span>
      ) : null}
    </div>
  );
};

export default Input;
