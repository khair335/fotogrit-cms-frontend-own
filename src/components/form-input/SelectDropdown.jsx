import React from 'react';
import { FaCirclePlus } from 'react-icons/fa6';
import Select, { components } from 'react-select';

const SelectDropdown = (props) => {
  const {
    name,
    label,
    placeholder,
    data,
    selectedValue,
    setSelectedValue,
    errServer,
    errCodeServer,
    disabled,
    infiniteScroll,
    setPageOption,
    setSearchQueryOption,
    totalPageOptions,
    isCreateNewData,
    setOpenCreateNewData,
    errValidation,
    field,
  } = props;

  const loadMoreOptions = () => {
    if (data) {
      setPageOption((prevPage) =>
        prevPage >= totalPageOptions ? prevPage : prevPage + 1
      );
    }
  };
  const loadPrevOptions = () => {
    if (data) {
      setPageOption((prevPage) => (prevPage <= 1 ? prevPage : prevPage - 1));
    }
  };
  const handleSearchChange = (newValue) => {
    setPageOption(1);
    setSearchQueryOption(newValue);
  };

  const handleSelectChange = (selectedOption) => {
    if (field) {
      field.onChange(selectedOption);
    }
    setSelectedValue(selectedOption);
  };

  const handleOpenNewData = () => {
    setSelectedValue('');
    setOpenCreateNewData(true);
  };

  const MenuList = (props) => {
    return (
      <components.MenuList {...props}>
        <button
          type="button"
          className="flex items-center justify-between w-full p-2 px-3 font-medium text-left transition-all duration-100 hover:bg-ftbrown hover:text-white text-ftbrown"
          onClick={handleOpenNewData}
        >
          Create New Data <FaCirclePlus />
        </button>
        {props.children}
      </components.MenuList>
    );
  };

  const customStylesSelect = {
    control: (provided, state) => ({
      ...provided,
      border: 'none',
      outline: 'none',
      borderRadius: '12px',
      textTransform: 'capitalize',
      backgroundColor: disabled
        ? 'rgb(0 0 0 / 0.26);'
        : 'rgb(209 213 219 / 0.5)',
      boxShadow: 'inset 3px 3px 5px rgba(0, 0, 0, 0.15)',
      padding: '0px 3px 0px 0px',
      '&:hover': {
        border: 'none',
      },
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      backgroundColor: 'transparent',
      padding: '1px',
      margin: '0px 3px',
      borderRadius: '6px',
      cursor: 'pointer',
    }),
  };

  return (
    <div className="flex flex-col text-sm ">
      {label && <label className="text-gray-500 ">{label || 'Label'}</label>}
      <Select
        {...field}
        className="basic-single"
        classNamePrefix="select"
        // value={selectedValue?.value}
        options={data}
        onChange={handleSelectChange}
        placeholder={placeholder}
        styles={customStylesSelect}
        isDisabled={disabled}
        onMenuScrollToBottom={infiniteScroll && loadMoreOptions}
        onMenuScrollToTop={infiniteScroll && loadPrevOptions}
        onInputChange={infiniteScroll && handleSearchChange}
        components={isCreateNewData && { MenuList }}
        isSearchable
      />
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

export default SelectDropdown;
