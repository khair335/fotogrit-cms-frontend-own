import React, { useEffect } from 'react';
import { BiSearchAlt } from 'react-icons/bi';

const FilterSearch = ({
  placeholder,
  searchValue,
  setSearchValue,
  setCurrentPage,
  noPagination = false, // if true, it does not use pagination from the server's API
}) => {
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);

    if (!noPagination) {
      setCurrentPage(1);
    }
  };

  return (
    <div className="w-full">
      <label className="relative w-full">
        <div className="mr-2 absolute left-2 top-[3px] text-lg">
          <BiSearchAlt />
        </div>
        <input
          type="search"
          className="w-full py-2 px-3 pl-8 bg-gray-200 rounded-md outline-none appearance-none text-sm border border-transparent focus:border-blue-500 focus:border"
          placeholder={placeholder || 'Search...'}
          value={searchValue}
          onChange={handleSearchChange}
        />
      </label>
    </div>
  );
};

export default FilterSearch;
