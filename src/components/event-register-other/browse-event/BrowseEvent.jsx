import React, { useState } from 'react';
import {
  TableBrowseEvent,
  FormDetailBrowseEvent,
} from '@/components/event-register-other';
import { Modal } from '@/components';
import { FilterSearch } from '@/components/form-input';

const BrowseEvent = (props) => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    currentPage,
    setCurrentPage,
    metaPagination,
    limitPerPage,
  } = props;

  const [openModal, setOpenModal] = useState(false);
  const [getData, setGetData] = useState('');

  return (
    <div className="flex flex-col">
      <div className="flex pb-3 sm:justify-end">
        <div className="flex w-full sm:w-[40%] lg:w-[30%]">
          <FilterSearch />
        </div>
      </div>

      <TableBrowseEvent
        setOpenModal={setOpenModal}
        setGetData={setGetData}
        data={data}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        metaPagination={metaPagination}
        limitPerPage={limitPerPage}
      />

      {/* MODAL */}
      <Modal
        title="Detail Browse Available Events"
        openModal={openModal}
        setOpenModal={setOpenModal}
        className={`overflow-auto`}
        rounded="rounded-xl"
      >
        <FormDetailBrowseEvent data={getData} setOpenModal={setOpenModal} />
      </Modal>
      {/* END MODAL */}
    </div>
  );
};

export default BrowseEvent;
