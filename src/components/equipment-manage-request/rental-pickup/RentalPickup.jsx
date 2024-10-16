import { useState } from 'react';

import { Modal } from '@/components';
import TableList from './TableRentalPickup';
import FormDetailList from './FormDetailRentalPickup';

import useDebounce from '@/hooks/useDebounce';

import { useGetEquipmentsQuery } from '@/services/api/equipmentApiSlice';
import { FilterSearch } from '@/components/form-input';

const RentalPickup = (props) => {
  const { filterEventGroup } = props;

  const [openModal, setOpenModal] = useState(false);
  const [searchValue, setSearchValue] = useState('');
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

  return (
    <>
      <div className="flex mb-2 md:items-center md:justify-end">
        <div className="w-full sm:w-[25%]">
          <FilterSearch
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
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
        title="Detail Rental/Pickup Equipment"
        openModal={openModal}
        setOpenModal={setOpenModal}
      >
        <FormDetailList data={getDetailEquipment} setOpenModal={setOpenModal} />
      </Modal>
      {/* END MODAL */}
    </>
  );
};

export default RentalPickup;
