import Select from 'react-select';

const MultiSelect = (props) => {
  const {
    label,
    placeholder,
    options,
    selectedOptions,
    setSelectedOptions,
    disabled,
    infiniteScroll,
    setPageOption,
    setSearchQueryOption,
    totalPageOptions,
  } = props;

  const loadMoreOptions = () => {
    if (options) {
      setPageOption((prevPage) =>
        prevPage >= totalPageOptions ? prevPage : prevPage + 1
      );
    }
  };
  const loadPrevOptions = () => {
    if (options) {
      setPageOption((prevPage) => (prevPage <= 1 ? prevPage : prevPage - 1));
    }
  };
  const handleSearchChange = (newValue) => {
    setPageOption(1);
    setSearchQueryOption(newValue);
  };

  const isCloseMenu = selectedOptions?.length + 1 === options?.length;

  const customStylesSelect = {
    control: (provided) => ({
      ...provided,
      border: '1px solid #ccc',
      borderRadius: '12px',
      boxShadow: 'inset 3px 3px 5px rgba(0, 0, 0, 0.15)',
      backgroundColor: disabled
        ? 'rgb(156 163 175 / 0.7);'
        : 'rgb(209 213 219 / 0.5)',
      padding: '6px 3px',
      '&:hover': {
        border: '1px solid #aaa',
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: disabled ? 'rgb(156 163 175 / 0.7);' : 'white',
      padding: '1px 5px',
    }),
  };

  return (
    <div className="flex flex-col">
      <label htmlFor="nameList" className="text-gray-500 text-sm">
        {label || 'Change Label'}
      </label>
      <Select
        isMulti
        closeMenuOnSelect={isCloseMenu}
        name="nameList"
        options={options}
        styles={customStylesSelect}
        value={selectedOptions}
        onChange={setSelectedOptions}
        placeholder={placeholder}
        isDisabled={disabled}
        onMenuScrollToBottom={infiniteScroll && loadMoreOptions}
        onMenuScrollToTop={infiniteScroll && loadPrevOptions}
        onInputChange={infiniteScroll && handleSearchChange}
      />
    </div>
  );
};

export default MultiSelect;
