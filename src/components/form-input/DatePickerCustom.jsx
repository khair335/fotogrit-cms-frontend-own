import React, { useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiCalendar } from 'react-icons/fi';

const DatePickerCustom = (props) => {
  const {
    label,
    name,
    className,
    value,
    onChange,
    disabled,
    errValidation,
    register,
    errServer,
    errCodeServer,
    placeholder,
    min,
    withPortal,
    showMonthDropdown,
    showYearDropdown,
  } = props;

  const datePickerRef = useRef(null);

  const openDatePicker = () => {
    if (!disabled && datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="relative flex flex-col w-full text-sm">
        {label && (
          <label htmlFor={name} className="text-gray-500 ">
            {label || 'Label'}
          </label>
        )}

        {/* <div className="flex w-full "> */}
        <DatePicker
          {...(register && register(name))}
          ref={datePickerRef}
          name={name}
          selected={value}
          onChange={onChange}
          dateFormat="dd/MM/yyyy"
          className={`!py-[9px] !px-3 rounded-xl bg-gray-300/50 shadow__gear-2 outline-none focus:bg-gray-300/90 disabled:opacity-80 disabled:bg-black/30 disabled:text-black disabled:font-medium disabled:placeholder:text-black/70 inline-flex w-full ${className}`}
          placeholderText={placeholder || 'Select Date'}
          disabled={disabled}
          minDate={min}
          autoComplete="off"
          withPortal={withPortal}
          portalId={withPortal && 'root-portal'}
          showMonthDropdown={showMonthDropdown}
          showYearDropdown={showYearDropdown}
          dropdownMode="select"
        />
        <FiCalendar
          className="absolute bottom-3 right-3"
          onClick={openDatePicker}
        />
        {/* </div> */}
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

export default DatePickerCustom;
