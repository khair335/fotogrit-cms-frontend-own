import { useState, useRef, useEffect, useMemo } from 'react';
import { FaFilter } from 'react-icons/fa';
import { Checkbox } from '../../form-input';
import { useDispatch, useSelector } from 'react-redux';
import {
  getDropdownState,
  getSelectedFilters,
  setIsOpenDropdownFilter,
  setSelectedFilters,
} from '@/services/state/reportSlice';

const MultiSearchFilter = ({
  id = 'MSF-1',
  title,
  options,
  onFilterChange,
  setSearchValue,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();

  const rawSelectedFilters =
    useSelector((state) => getSelectedFilters(state, id)) || [];
  const dropDownFilter = useSelector((state) => getDropdownState(state, id));

  const selectedFilters = useMemo(() => {
    return rawSelectedFilters;
  }, [rawSelectedFilters]);

  const filterRef = useRef(null);

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

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    const newSelectedFilters = checked
      ? [...selectedFilters, { name, selected: true }]
      : selectedFilters.filter((filter) => filter.name !== name);

    dispatch(setSelectedFilters({ id, filters: newSelectedFilters }));
    // onFilterChange(newSelectedFilters);
  };

  const handleClearAll = () => {
    setSearchTerm('');
    dispatch(setSelectedFilters({ id, filters: [] }));
    dispatch(setIsOpenDropdownFilter({ id, isOpen: false }));
    onFilterChange([]);
  };

  const handleApplyFilter = () => {
    dispatch(setIsOpenDropdownFilter({ id, isOpen: false }));
    onFilterChange(selectedFilters);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // setSearchValue(e.target.value);
  };

  const filteredOptions = useMemo(
    () =>
      options?.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [options, searchTerm]
  );

  return (
    <div className="flex w-full items-center justify-between overflow-visible">
      <span>{title}</span>

      <div
        className={`w-4 h-4 rounded-md grid place-items-center cursor-pointer hover:text-black transition-all duration-300 ${
          dropDownFilter || selectedFilters?.length > 0
            ? 'text-ftgreen-600'
            : 'text-gray-400'
        }`}
        ref={filterRef}
        onClick={handleToggleDropdown}
      >
        <FaFilter />
      </div>

      {dropDownFilter && (
        <div
          className="absolute top-full left-0 w-[98%] min-h-full bg-white rounded-[4px] border border-ftbrown  z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full max-h-56 overflow-y-auto p-2">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="border border-gray-400 rounded px-2 py-1 w-full outline-none focus:ring-0 focus:border-ftbrown font-normal text-sm sticky top-0"
            />

            {selectedFilters?.length > 0 && (
              <div className="">
                <span className="font-light text-gray-400 text-xs">
                  Selected:
                </span>
                <div className="space-y-1">
                  {selectedFilters?.map((filter) => (
                    <div
                      key={filter.name}
                      className="flex items-center justify-between text-xs font-normal capitalize gap-1"
                    >
                      <div className="flex-grow">
                        <p>{filter.name}</p>
                      </div>
                      <div className="w-[10%]">
                        <Checkbox
                          name={filter.name}
                          className="w-4 h-4"
                          checked={true}
                          onChange={handleCheckboxChange}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <hr className="my-2" />
              </div>
            )}

            <div className="space-y-1 mt-2">
              {searchTerm === '' ? (
                <p className="text-xs font-normal text-gray-500">
                  Please enter a search term
                </p>
              ) : filteredOptions?.length > 0 ? (
                filteredOptions?.map((option) => {
                  const isSelected = selectedFilters?.some(
                    (filter) => filter.name === option.name
                  );
                  return !isSelected ? (
                    <div
                      key={option.key}
                      className="flex items-center justify-between text-xs font-normal gap-1 capitalize hover:text-ftbrown"
                    >
                      <div className="flex-grow">
                        <p>{option.label}</p>
                      </div>

                      <div className="w-[10%]">
                        <Checkbox
                          name={option.name}
                          className="w-4 h-4"
                          checked={isSelected}
                          onChange={handleCheckboxChange}
                        />
                      </div>
                    </div>
                  ) : null;
                })
              ) : (
                <p className="text-xs font-normal text-gray-500">
                  No options found
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between m-2">
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

export default MultiSearchFilter;
