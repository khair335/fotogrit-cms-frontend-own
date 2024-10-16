import React, { useState } from 'react';
import { FiCopy } from 'react-icons/fi';

const CopyableText = (props) => {
  const { label, name, className, value, disabled } = props;

  const [isCopied, setCopied] = useState(false);

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1000);
    } catch (err) {
      console.error('Oops, unable to copy', err);
    }
  };

  return (
    <div className="flex flex-col text-sm md:gap-2 md:flex-row md:items-center">
      <label
        htmlFor={name}
        className="text-xs font-medium text-gray-500 md:w-[30%]"
      >
        {label}
      </label>
      <div className="relative flex-grow">
        <input
          type="text"
          id={name}
          value={value}
          readOnly
          className={`py-2 px-3 rounded-xl bg-white/50 shadow__gear-2 outline-none focus:bg-gray-300/90 disabled:opacity-80 disabled:bg-black/30 disabled:text-black disabled:font-medium disabled:placeholder:text-black w-full selection:normal-case selection:text-ftbrown ${className}`}
          disabled={disabled}
        />
        <button
          onClick={copyText}
          className="absolute p-1 top-2 right-3 hover:text-ftbrown"
        >
          <FiCopy />
        </button>

        {isCopied && (
          <span className="absolute right-0 px-1 text-white rounded-sm -top-3 bg-ftbrown/50">
            Copied!
          </span>
        )}
      </div>
    </div>
  );
};

export default CopyableText;
