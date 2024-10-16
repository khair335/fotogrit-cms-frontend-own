import React, { useRef } from 'react';
import { FiCalendar } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const FilterRangeDatePicker = (props) => {
  const { selected, onChange, startDate, endDate, placeholder } = props;

  const datePickerRef = useRef(null);

  const openDatePicker = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };

  return (
    <div className="relative w-full">
      <DatePicker
        ref={datePickerRef}
        selected={selected}
        startDate={startDate}
        endDate={endDate}
        onChange={onChange}
        className="w-full px-3 py-2 pl-8 text-sm bg-gray-200 border border-transparent rounded-md outline-none appearance-none focus:border-blue-500 focus:border"
        placeholderText={placeholder || 'Select Date'}
        isClearable
        selectsRange
      />
      <FiCalendar
        className="absolute cursor-pointer bottom-3 left-2"
        onClick={openDatePicker}
      />
    </div>
  );
};

export default FilterRangeDatePicker;
