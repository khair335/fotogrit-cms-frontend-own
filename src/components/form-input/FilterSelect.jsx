import React from 'react';
import Select from 'react-select';

const FilterSelect = (props) => {
  const {
    placeholder,
    dataOptions,
    filterSelectedValue,
    setFilterSelectedValue,
    infiniteScroll,
    setPage,
    setSearchQuery,
    totalPageOptions,
    background,
    shadow,
    setCurrentPage,
    isReturnObject = false,
  } = props;

  const loadMoreOptions = () => {
    if (dataOptions) {
      setPage((prevPage) =>
        prevPage >= totalPageOptions ? prevPage : prevPage + 1
      );
    }
  };
  const loadPrevOptions = () => {
    if (dataOptions) {
      setPage((prevPage) => (prevPage <= 1 ? prevPage : prevPage - 1));
    }
  };
  const handleSearchChange = (newValue) => {
    setPage(1);
    setSearchQuery(newValue);
  };

  const selectedOption = dataOptions?.find(
    (option) => option.value === filterSelectedValue
  );

  const handleSelectChange = (selectedOption) => {
    if (isReturnObject) {
      setFilterSelectedValue(selectedOption);
    } else {
      setFilterSelectedValue(selectedOption?.value);
    }

    if (setCurrentPage) {
      setCurrentPage(1);
    }
  };

  const customStylesSelect = {
    control: (provided, state) => ({
      ...provided,
      border: 'none',
      outline: 'none',
      borderRadius: '4px',
      backgroundColor:
        background === 'white' ? 'white' : 'rgb(209 213 219 / 0.5)',
      boxShadow: shadow ? '0 4px 3px rgb(0 0 0 / 0.07)' : '',
      padding: '0px 3px 0px 0px',
      '&:hover': {
        border: 'none',
      },
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      backgroundColor: 'black',
      padding: '1px',
      margin: '0px 3px',
      borderRadius: '6px',
    }),
  };

  return (
    <Select
      className="basic-single"
      classNamePrefix="select"
      name="color"
      value={selectedOption}
      options={dataOptions}
      onChange={handleSelectChange}
      placeholder={placeholder}
      styles={customStylesSelect}
      onMenuScrollToBottom={infiniteScroll && loadMoreOptions}
      onMenuScrollToTop={infiniteScroll && loadPrevOptions}
      onInputChange={infiniteScroll && handleSearchChange}
    />
  );
};

export default FilterSelect;
