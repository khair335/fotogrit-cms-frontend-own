import React from 'react';
import {
  Breadcrumb,
  ButtonCollapse,
  Collapse,
  Layout,
  Modal,
  PopUpDelete,
} from '@/components';

import {
  TableEventRoster,
  FormAddEventRoster,
  FormDetailEventRoster,
} from '@/components/event-manage-other';

import { Input, FilterSelect, FilterSearch } from '@/components/form-input';
import { useState } from 'react';

const EventRoster = () => {
  const [isOpenNewData, setIsOpenNewData] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [popUpDelete, setPopUpDelete] = useState(false);
  const [getDetailData, setGetDetailData] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(3);

  // Dummy Data
  const eventRoster = [
    {
      id: 1,
      rosterId: 'RO001',
      userId: 'Bambang - C0979',
      email: 'bambang@gmail.com',
      role: 'Captain',
      positionOfPlayers: 'Back',
      jerseyNumber: '00000',
      status: 'unknown',
    },
  ];

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col-reverse gap-3">
        <div className="flex flex-col sm:w-fit">
          <ButtonCollapse
            label="Add New Roster"
            isOpen={isOpenNewData}
            handleClick={() => setIsOpenNewData(!isOpenNewData)}
          />
        </div>

        <div className="flex flex-col items-end gap-2 mt-2 lg:flex-row">
          <div className="flex flex-col w-full gap-2 sm:flex-row sm:gap-2 lg:basis-[45%]">
            <div className="z-60 flex-grow w-full relative">
              <FilterSelect placeholder="Select Event Group" />
            </div>

            <div className="z-50 flex-grow w-full relative">
              <FilterSelect placeholder="Select Age group" />
            </div>
          </div>

          <div className="flex flex-col w-full sm:flex-row sm:gap-2 lg:w-[40%]">
            <div className="flex-grow w-full relative md:w-1/3">
              <Input
                label="Club ID"
                name="clubIdRoster"
                placeholder="Select Club ID"
                value="12345"
                disabled
                className="!rounded-[4px]"
              />
            </div>

            <div className="flex-grow w-full relative md:w-1/3">
              <Input
                label="Participation Status"
                name="participationStatusRoster"
                placeholder="Participation Status"
                value="Approved"
                disabled
                className="!rounded-[4px]"
              />
            </div>
          </div>

          <div className="z-50 flex-grow w-full relative lg:w-[15%]">
            <FilterSelect placeholder="Select ID" />
          </div>
        </div>
      </div>

      <Collapse isOpen={isOpenNewData}>
        <FormAddEventRoster setOpenColapse={setIsOpenNewData} />
      </Collapse>

      <section className="mt-3">
        <TableEventRoster
          openModal={openModal}
          setOpenModal={setOpenModal}
          setGetData={setGetDetailData}
          data={eventRoster}
          limitPerPage={limitPerPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />

        {/* MODAL */}
        <Modal
          title="Detail Roster"
          openModal={openModal}
          setOpenModal={setOpenModal}
          className="overflow-y-scroll"
          rounded="rounded-xl"
        >
          <FormDetailEventRoster
            data={getDetailData}
            setOpenModal={setOpenModal}
            setIsOpenPopUpDelete={setPopUpDelete}
          />
        </Modal>
        {/* END MODAL */}

        {/* Pop Up Delete */}
        <PopUpDelete
          // handleDelete={handleDelete}
          // isLoading={isLoadingDelete}
          isOpenPopUpDelete={popUpDelete}
          setIsOpenPopUpDelete={setPopUpDelete}
        />
        {/* End Pop Up Delete */}
      </section>
    </div>
  );
};

export default EventRoster;
