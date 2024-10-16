import { useState } from 'react';

import { Button, Modal, Tooltip } from '@/components';
import TableList from './TableList';
import FormDetailList from './FormDetailList';

import useDebounce from '@/hooks/useDebounce';

import { useGetEquipmentsQuery } from '@/services/api/equipmentApiSlice';
import { FilterSearch, FilterSelect } from '@/components/form-input';
import { BiReset } from 'react-icons/bi';

const optionsCategories = [
  {
    value: 1,
    label: 'Category 1',
  },
  {
    value: 2,
    label: 'Category 2',
  },
  {
    value: 3,
    label: 'Category 3',
  },
];

const List = (props) => {
  const { filterEventGroup } = props;

  const [openModal, setOpenModal] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filterSelected, setFilterSelected] = useState('');
  const [getDetailEquipment, setGetDetailEquipment] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(10);
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const {
    data: equipments,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetEquipmentsQuery({
    searchTerm: debouncedSearchValue,
    page: currentPage,
    limit: limitPerPage,
  });

  const handleResetFilter = () => {
    setFilterSelected('');
    setSearchValue('');
  };

  return (
    <>
      <div className="flex flex-col-reverse gap-2 mb-2 md:flex-row md:items-center md:justify-end">
        <div className="flex gap-2 flex-col sm:flex-row sm:items-center sm:justify-between w-full sm:w-[60%] lg:w-[50%]">
          <div className="w-full sm:w-[45%] z-20">
            <FilterSelect
              dataOptions={optionsCategories}
              placeholder="Select Event"
              filterSelectedValue={filterSelected}
              setFilterSelectedValue={setFilterSelected}
            />
          </div>

          <div className="w-full sm:w-[45%]">
            <FilterSearch
              searchValue={searchValue}
              setSearchValue={setSearchValue}
            />
          </div>

          <Tooltip text="Reset Filter" position="top">
            <Button
              background="black"
              onClick={handleResetFilter}
              className="block w-full "
            >
              <BiReset className="mx-auto" />
            </Button>
          </Tooltip>
        </div>
      </div>

      <TableList
        setOpenModal={setOpenModal}
        data={equipments}
        setGetData={setGetDetailEquipment}
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        error={error}
        limitPerPage={limitPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />

      {/* MODAL */}
      <Modal
        title="Detail Equipment List"
        openModal={openModal}
        setOpenModal={setOpenModal}
      >
        <FormDetailList data={getDetailEquipment} setOpenModal={setOpenModal} />
      </Modal>
      {/* END MODAL */}
    </>
  );
};

export default List;
