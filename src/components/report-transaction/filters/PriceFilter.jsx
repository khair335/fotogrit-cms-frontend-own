import {
  getDropdownState,
  getSelectedFilters,
  setIsOpenDropdownFilter,
  setSelectedFilters,
} from '@/services/state/reportSlice';
import { useState, useRef, useEffect } from 'react';
import { FaFilter } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

const PriceFilter = ({ id = 'PF-1', title, onFilterChange }) => {
  const dispatch = useDispatch();
  const filterRef = useRef(null);

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [error, setError] = useState('');

  const getSelectedPrice =
    useSelector((state) => getSelectedFilters(state, id)) || [];

  const dropDownFilter = useSelector((state) => getDropdownState(state, id));

  const handleClickOutside = (e) => {
    if (filterRef.current && !filterRef.current.contains(e.target)) {
      dispatch(setIsOpenDropdownFilter({ id, isOpen: false }));
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleToggleDropdown = (e) => {
    e.stopPropagation();
    dispatch(setIsOpenDropdownFilter({ id, isOpen: !dropDownFilter }));
  };

  const formatPrice = (value) => {
    // Format value as number and add thousand separators
    if (!value) return '';
    return new Intl.NumberFormat('id-ID').format(value);
  };

  const parsePrice = (value) => {
    // Parse the value to remove any non-numeric characters
    return value.replace(/\./g, '').replace(/[^0-9]/g, '');
  };

  const handleMinPriceChange = (e) => {
    const value = e.target.value;
    const parsedValue = parsePrice(value);

    // Validasi: Min Price tidak boleh lebih besar dari Max Price
    if (maxPrice && parseInt(parsedValue) > parseInt(maxPrice)) {
      setError('Min price cannot be greater than max price.');
    } else {
      setError(''); // Reset error jika validasi terpenuhi
    }

    setMinPrice(parsedValue);
    const data = {
      min: parsedValue,
      max: maxPrice || '',
    };
    dispatch(setSelectedFilters({ id, filters: data }));
  };

  const handleMaxPriceChange = (e) => {
    const value = e.target.value;
    const parsedValue = parsePrice(value);

    // Validasi: Max Price tidak boleh lebih kecil dari Min Price
    if (minPrice && parseInt(parsedValue) < parseInt(minPrice)) {
      setError('Max price cannot be less than min price.');
    } else {
      setError(''); // Reset error jika validasi terpenuhi
    }

    setMaxPrice(parsedValue);
    const data = {
      min: minPrice || '',
      max: parsedValue,
    };
    dispatch(setSelectedFilters({ id, filters: data }));
  };

  const handleClearAll = () => {
    dispatch(setIsOpenDropdownFilter({ id, isOpen: false }));
    dispatch(setSelectedFilters({ id, filters: [] }));
    onFilterChange([]);
    setMinPrice('');
    setMaxPrice('');
    setError('');
  };

  const handleApplyFilter = () => {
    dispatch(setIsOpenDropdownFilter({ id, isOpen: false }));
    onFilterChange({ min: minPrice, max: maxPrice });
  };

  const isPriceSet = minPrice || maxPrice;

  useEffect(() => {
    if (getSelectedPrice?.min) {
      setMinPrice(getSelectedPrice?.min);
    } else {
      setMinPrice('');
    }
    if (getSelectedPrice?.max) {
      setMaxPrice(getSelectedPrice?.max);
    } else {
      setMaxPrice('');
    }
  }, [getSelectedPrice]);

  return (
    <div className="flex w-full items-center justify-between overflow-visible">
      <span>{title}</span>

      <div
        className={`w-4 h-4 rounded-md grid place-items-center cursor-pointer hover:text-black ${
          dropDownFilter || isPriceSet ? 'text-ftgreen-600' : 'text-gray-400'
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
              <input
                id="minPrice"
                type="text"
                value={formatPrice(minPrice)}
                onChange={handleMinPriceChange}
                placeholder="Min Price"
                className="border border-gray-400 rounded p-2 w-full outline-none focus:ring-0 focus:border-ftbrown"
              />
            </div>
            <div className="text-xs font-normal">
              <input
                id="maxPrice"
                type="text"
                value={formatPrice(maxPrice)}
                onChange={handleMaxPriceChange}
                placeholder="Max Price"
                className="border border-gray-400 rounded p-2 w-full outline-none focus:ring-0 focus:border-ftbrown"
              />
            </div>
          </div>

          {error && (
            <span className="text-[10px] font-light text-red-600 animate-pulse">
              {error}
            </span>
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={handleClearAll}
              className="text-[10px] bg-ftred text-white rounded-full px-3 py-1 hover:opacity-70 transition-all duration-300 shadow-sm hover:shadow-lg"
            >
              Reset
            </button>
            <button
              onClick={handleApplyFilter}
              className="text-[10px] bg-ftgreen-200 text-white rounded-full px-3 py-1 hover:opacity-70 transition-all duration-300 shadow-sm hover:shadow-lg disabled:opacity-50 disabled:bg-green-950 disabled:text-gray-400"
              disabled={!!error}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceFilter;
