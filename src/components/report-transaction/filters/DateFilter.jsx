import { useState, useRef, useEffect } from 'react';
import { FaFilter } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import { formatDateYearToDay } from '@/helpers/FormatDateYearToDay';
import { useDispatch, useSelector } from 'react-redux';
import {
  getDropdownState,
  getSelectedFilters,
  setIsOpenDropdownFilter,
  setSelectedFilters,
} from '@/services/state/reportSlice';

const DateFilter = ({ id = 'DF-1', title, onDateChange }) => {
  const dispatch = useDispatch();
  const filterRef = useRef(null);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const getSelectedDate =
    useSelector((state) => getSelectedFilters(state, id)) || [];

  const dropDownFilter = useSelector((state) => getDropdownState(state, id));

  const handleClickOutside = (e) => {
    if (filterRef.current && !filterRef.current.contains(e.target)) {
      dispatch(setIsOpenDropdownFilter({ id, isOpen: false }));
    }
  };

  const handleToggleDropdown = (e) => {
    e.stopPropagation();
    dispatch(setIsOpenDropdownFilter({ id, isOpen: !dropDownFilter }));
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setEndDate(null);
    const data = {
      startDate: formatDateYearToDay(date),
      endDate: null,
    };
    dispatch(setSelectedFilters({ id, filters: data }));
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    const data = {
      startDate: startDate ? formatDateYearToDay(startDate) : null,
      endDate: formatDateYearToDay(date),
    };
    dispatch(setSelectedFilters({ id, filters: data }));
  };

  const handleClearAll = () => {
    dispatch(setIsOpenDropdownFilter({ id, isOpen: false }));
    dispatch(setSelectedFilters({ id, filters: [] }));
    onDateChange([]);
    setStartDate(null);
    setEndDate(null);
  };

  const handleApplyFilter = () => {
    dispatch(setIsOpenDropdownFilter({ id, isOpen: false }));
    onDateChange({
      startDate: formatDateYearToDay(startDate),
      endDate: formatDateYearToDay(endDate),
    });
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (getSelectedDate?.startDate) {
      setStartDate(new Date(getSelectedDate?.startDate));
    } else {
      setStartDate(null);
    }
    if (getSelectedDate?.endDate) {
      setEndDate(new Date(getSelectedDate?.endDate));
    } else {
      setEndDate(null);
    }
  }, [getSelectedDate]);

  const isDateSet = startDate || endDate;

  return (
    <div className="flex w-full items-center justify-between overflow-visible">
      <span>{title}</span>

      <div
        className={`w-4 h-4 rounded-md grid place-items-center cursor-pointer hover:text-black ${
          dropDownFilter || isDateSet ? 'text-ftgreen-600' : 'text-gray-400'
        }`}
        ref={filterRef}
        onClick={handleToggleDropdown}
      >
        <FaFilter />
      </div>

      {dropDownFilter && (
        <div
          className="absolute top-full left-0 w-[98%] min-h-full bg-white rounded-[4px] p-2 border border-ftbrown space-y-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col space-y-2">
            <div className="text-xs font-normal">
              <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                dateFormat="dd/MM/yyyy"
                className="border rounded text-xs px-2 py-1 w-full border-gray-400 outline-none focus:ring-0 focus:border-ftbrown"
                placeholderText="Start Date"
                maxDate={endDate}
              />
            </div>
            <div className="text-xs font-normal">
              <DatePicker
                selected={endDate}
                onChange={handleEndDateChange}
                dateFormat="dd/MM/yyyy"
                className="border rounded text-xs px-2 py-1 w-full border-gray-400 outline-none focus:ring-0 focus:border-ftbrown"
                placeholderText="End Date"
                minDate={startDate}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleClearAll}
              className="text-[10px] bg-ftred text-white rounded-full px-3 py-1 hover:opacity-70 transition-all duration-300 shadow-sm hover:shadow-lg"
            >
              Reset
            </button>
            <button
              onClick={handleApplyFilter}
              className="text-[10px] bg-ftgreen-200 text-white rounded-full px-3 py-1 hover:opacity-70 transition-all duration-300 shadow-sm hover:shadow-lg"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateFilter;
