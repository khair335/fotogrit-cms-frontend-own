import { useState } from 'react';

import { ButtonCollapse, Collapse, Modal } from '@/components';
import { FilterSearch } from '@/components/form-input';
import useDebounce from '@/hooks/useDebounce';
import { useGetEventGroupQuery } from '@/services/api/eventGroupApiSlice';
import FormAddEquipmentGroup from './FormAddEquipmentGroup';
import TableEquipmentGroup from './TableEquipmentGroup';
import FormDetailEquipmentGroup from './FormDetailEquipmentGroup';

const EquipmentGroup = (props) => {
  const { filterEventGroup } = props;

  const [isOpenNewData, setIsOpenNewData] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [getDetailEquipment, setGetDetailEquipment] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(10);
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const {
    data: events,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetEventGroupQuery({
    city: filterEventGroup,
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
          label="Add New Equipment Group"
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
        <FormAddEquipmentGroup setIsOpenNewData={setIsOpenNewData} />
      </Collapse>

      <TableEquipmentGroup
        setOpenModal={setOpenModal}
        data={events}
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
        title="Detail Equipment Group"
        openModal={openModal}
        setOpenModal={setOpenModal}
      >
        <FormDetailEquipmentGroup
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

export default EquipmentGroup;
