import React, { useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiCalendar } from 'react-icons/fi';

const DatePickerInput = (props) => {
  const {
    label,
    name,
    className,
    onChange,
    disabled,
    errValidation,
    errServer,
    errCodeServer,
    placeholder,
    min,
    max,
    withPortal,
    field,
  } = props;

  const datePickerRef = useRef(null);

  const openDatePicker = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };

  return (
    <div className="flex flex-col text-sm">
      <div className="relative flex flex-col w-full text-sm">
        <label htmlFor={name} className="text-gray-500 ">
          {label || 'Label'}
        </label>

        <DatePicker
          ref={datePickerRef}
          name={name}
          selected={field.value}
          onChange={onChange}
          dateFormat="dd/MM/yyyy"
          className={`!py-[9px] !px-3 rounded-xl bg-gray-300/50 shadow__gear-2 outline-none focus:bg-gray-300/90 disabled:opacity-80 disabled:bg-black/30 disabled:text-black disabled:font-medium disabled:placeholder:text-black/70 inline-flex w-full ${className}`}
          placeholderText={placeholder || 'Select Date'}
          disabled={disabled}
          minDate={min}
          maxDate={max}
          autoComplete="off"
          withPortal={withPortal}
          portalId={withPortal && 'root-portal'}
        />
        <FiCalendar
          className="absolute bottom-3 right-3"
          onClick={openDatePicker}
        />
      </div>

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

export default DatePickerInput;
