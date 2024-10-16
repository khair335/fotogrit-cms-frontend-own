import React from 'react';
import {
  TableMyEventList,
  FormDetailMyEventList,
} from '@/components/event-register-other';
import { useState } from 'react';
import { FilterSearch } from '@/components/form-input';
import { Modal } from '@/components';

const MyEventList = (props) => {
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

      <TableMyEventList
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
        title="Event Group Team Manager"
        openModal={openModal}
        setOpenModal={setOpenModal}
        className={`overflow-auto`}
        rounded="rounded-xl"
      >
        <FormDetailMyEventList data={getData} setOpenModal={setOpenModal} />
      </Modal>
      {/* END MODAL */}
    </div>
  );
};

export default MyEventList;
