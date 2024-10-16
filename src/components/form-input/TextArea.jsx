import React from 'react';

const TextArea = (props) => {
  const {
    label,
    name,
    className,
    value,
    onChange,
    rows,
    disabled,
    errValidation,
    register,
    errServer,
    errCodeServer,
    placeholder,
  } = props;

  return (
    <div className="flex flex-col text-sm">
      {label && (
        <label htmlFor={name} className="text-gray-500 break-words">
          {label || 'label'}
        </label>
      )}
      <textarea
        name={name}
        id={name}
        cols="30"
        rows={rows || 2}
        {...(register && register(name))}
        placeholder={placeholder || label || 'Enter something'}
        className={`py-2 px-3 rounded-xl bg-gray-300/50 shadow__gear-2 outline-none focus:bg-gray-300/90 disabled:opacity-80 disabled:bg-black/30 disabled:text-black disabled:font-medium disabled:placeholder:text-black ${className}`}
        disabled={disabled}
        value={value}
        onChange={onChange}
      ></textarea>

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

export default TextArea;
