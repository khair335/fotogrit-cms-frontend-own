import React, { useState } from 'react';

import { ButtonCollapse, Collapse, Modal } from '@/components';
import { FilterSearch } from '@/components/form-input';
import TableEquipment from './TableEquipment';
import useDebounce from '@/hooks/useDebounce';
import FormDetailEquipment from './FormDetailEquipment';
import FormAddEquipment from './FormAddEquipment';
import { useGetEquipmentsQuery } from '@/services/api/equipmentApiSlice';

const Equipment = (props) => {
  const { filterEventGroup } = props;

  const [isOpenNewData, setIsOpenNewData] = useState(false);
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
    // city: filterEventGroup,
    searchTerm: debouncedSearchValue,
    page: currentPage,
    limit: limitPerPage,
  });

  return (
    <div>
      <div
        className={`flex flex-col-reverse gap-2 md:flex-row md:items-center mb-4 md:justify-between`}
      >
        <ButtonCollapse
          label="Add New Equipment"
          isOpen={isOpenNewData}
          handleClick={() => setIsOpenNewData(!isOpenNewData)}
        />

        <div className="w-full sm:w-[50%] lg:w-[30%]">
          <FilterSearch
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        </div>
      </div>

      <Collapse isOpen={isOpenNewData}>
        <FormAddEquipment setIsOpenNewData={setIsOpenNewData} />
      </Collapse>

      <TableEquipment
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
        title="Detail Equipment"
        openModal={openModal}
        setOpenModal={setOpenModal}
      >
        <FormDetailEquipment
          data={getDetailEquipment}
          setOpenModal={setOpenModal}
        />
      </Modal>
      {/* END MODAL */}

      {/* Pop Up Delete */}
      {/* {popUpDelete && (
    <PopUpDelete
      handleDelete={handleDelete}
      isLoading={isLoadingDelete}
      isOpenPopUpDelete={popUpDelete}
      setIsOpenPopUpDelete={setPopUpDelete}
    />
  )} */}
      {/* End Pop Up Uploading */}
    </div>
  );
};

export default Equipment;
