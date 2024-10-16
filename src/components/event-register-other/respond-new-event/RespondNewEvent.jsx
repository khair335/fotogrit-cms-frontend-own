import React from 'react';
import {
  TableRespondNewEvent,
  FormDetailRespondNewEvent,
  TableListInvitation,
  FormDetailListInvitation,
} from '@/components/event-register-other';
import { Modal } from '@/components';
import { FilterSelect, Input } from '@/components/form-input';
import { useState } from 'react';

const RespondNewEvent = (props) => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    // currentPage,
    // setCurrentPage,
    // metaPagination,
    // limitPerPage,
  } = props;

  // Respond New Invitation Table
  const [currentPageRespondInvitation, setCurrentPageRespondInvitation] =
    useState(1);
  const [limitPerPageRespondInvitation] = useState(10);
  const metaPaginationRespondInvitation = 5;

  // List of All Invitation Table
  const [currentPageListInvation, setCurrentPageListInvitation] = useState(1);
  const [limitPerPageListInvitation] = useState(10);
  const metaPaginationListInvitation = 5;

  const [openModalRespondInvitation, setOpenModalRespondInvitation] =
    useState(false);
  const [getDataRespondInvitation, setGetDataRespondInvitation] = useState('');

  const [openModalListInvitation, setOpenModalListInvitation] = useState(false);
  const [getDataListInvitation, setGetDataListInvitation] = useState('');

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col items-end gap-2 mt-2 lg:flex-row">
        <div className="flex flex-col items-center w-full gap-2 sm:flex-row">
          <div className="z-60 flex-grow w-full relative">
            <FilterSelect placeholder="Select Event Group ID" />
          </div>

          <div className="z-50 flex-grow w-full relative">
            <FilterSelect placeholder="Select Age group" />
          </div>
        </div>

        <div className="flex flex-col w-full gap-2 sm:flex-row">
          <div className="flex-grow w-full relative">
            <Input
              label="Club ID"
              placeholder="Select Club ID"
              value="12345"
              name="clubId"
              disabled
              className="!rounded-[4px]"
            />
          </div>

          <div className="flex-grow w-full relative">
            <Input
              label="Participation Status"
              placeholder="Participation Status"
              value="Approved"
              name="participationStatus"
              disabled
              className="!rounded-[4px]"
            />
          </div>
        </div>
      </div>

      <div>
        <TableRespondNewEvent
          openModal={openModalRespondInvitation}
          setOpenModal={setOpenModalRespondInvitation}
          setGetData={setGetDataRespondInvitation}
          data={data}
          currentPage={currentPageRespondInvitation}
          setCurrentPage={setCurrentPageRespondInvitation}
          metaPagination={metaPaginationRespondInvitation}
          limitPerPage={limitPerPageRespondInvitation}
        />

        {/* MODAL */}
        <Modal
          title="Event Group Team Manager"
          openModal={openModalRespondInvitation}
          setOpenModal={setOpenModalRespondInvitation}
          className={`overflow-auto`}
          rounded="rounded-xl"
        >
          <FormDetailRespondNewEvent
            data={getDataRespondInvitation}
            setOpenModal={setOpenModalRespondInvitation}
          />
        </Modal>
        {/* END MODAL */}
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="text-xl font-bold">List of All Invitation</h1>
        <TableListInvitation
          openModal={openModalListInvitation}
          setOpenModal={setOpenModalListInvitation}
          setGetData={setGetDataListInvitation}
          data={data}
          currentPage={currentPageListInvation}
          setCurrentPage={setCurrentPageListInvitation}
          metaPagination={metaPaginationListInvitation}
          limitPerPage={limitPerPageListInvitation}
        />

        {/* MODAL */}
        <Modal
          title="Detail List of All Invitation"
          openModal={openModalListInvitation}
          setOpenModal={setOpenModalListInvitation}
          className={`overflow-auto`}
          rounded="rounded-xl"
        >
          <FormDetailListInvitation
            data={getDataListInvitation}
            setOpenModal={setOpenModalListInvitation}
          />
        </Modal>
        {/* END MODAL */}
      </div>
    </div>
  );
};

export default RespondNewEvent;
