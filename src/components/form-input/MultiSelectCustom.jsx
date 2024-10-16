import Select from 'react-select';

const MultiSelectCustom = (props) => {
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
    errServer,
    errCodeServer,
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

  const customStylesSelect = {
    control: (provided) => ({
      ...provided,
      border: 'none',
      outline: 'none',
      borderRadius: '12px',
      boxShadow: 'inset 3px 3px 5px rgba(0, 0, 0, 0.15)',
      backgroundColor: disabled
        ? 'rgb(0 0 0 / 0.26);'
        : 'rgb(209 213 219 / 0.5)',
      '&:hover': {
        border: 'none',
      },
      padding: '1px',
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: disabled ? 'rgb(156 163 175 / 0.7);' : 'white',
      padding: '0px',
      borderRadius: '8px',
    }),
  };

  const isCloseMenu = selectedOptions?.length + 1 === options?.length;

  const handleChange = (value) => {
    const valueTransform = value
      ? value?.map((item, i) => ({
          value: item?.value,
          label: `${i + 1}. ${item?.label?.substring(
            item?.label?.indexOf('. ') + 1
          )}`,
          name: item?.label?.substring(item?.label?.indexOf('. ') + 1).trim(),
        }))
      : value;

    setSelectedOptions(valueTransform);
  };

  const valueTransform = selectedOptions
    ? selectedOptions?.map((item, i) => ({
        value: item?.value,
        label: `${i + 1}. ${item?.label.substring(
          item?.label.indexOf('. ') + 1
        )}`,
        name: item?.label.substring(item?.label.indexOf('. ') + 1).trim(),
      }))
    : selectedOptions;

  return (
    <div className="flex flex-col text-sm">
      <label htmlFor="nameList" className="text-gray-500 ">
        {label || 'Change Label'}
      </label>
      <Select
        isMulti
        closeMenuOnSelect={isCloseMenu}
        options={options}
        styles={customStylesSelect}
        value={valueTransform}
        onChange={handleChange}
        placeholder={placeholder}
        isDisabled={disabled}
        onMenuScrollToBottom={infiniteScroll && loadMoreOptions}
        onMenuScrollToTop={infiniteScroll && loadPrevOptions}
        onInputChange={infiniteScroll && handleSearchChange}
      />

      {/* Dispaly Error validation from api server */}
      {errServer?.status === errCodeServer ? (
        <span className="text-[10px] animate-pulse text-red-600">
          {errServer?.message}
        </span>
      ) : null}
    </div>
  );
};

export default MultiSelectCustom;
