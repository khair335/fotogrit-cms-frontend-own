import React, { useEffect } from 'react';
import {
  Breadcrumb,
  ButtonCollapse,
  Collapse,
  Layout,
  Modal,
  PopUpDelete,
  PopUpUploading,
  Progress,
} from '@/components';
import {
  TableAdminRequirement,
  FormDetailRequirement,
} from '@/components/event-manage-other';

import { Input, FilterSelect, FilterSearch } from '@/components/form-input';
import { useState } from 'react';

const AdminRequirement = () => {
  const [isOpenNewData, setIsOpenNewData] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [popUpDelete, setPopUpDelete] = useState(false);
  const [getDetailData, setGetDetailData] = useState('');
  const [popUpUploading, setPopUpUploading] = useState(false);
  const [isUploadCompleted, setIsUploadCompleted] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(3);

  // Dummy Data
  const eventRoster = [
    {
      id: 1,
      rosterId: 'RO001',
      userId: 'Ben Utama',
      email: 'bambang@gmail.com',
      role: 'Captain',
      positionOfPlayers: 'Point Guard',
      jerseyNumber: '10',
      status: 'Accepted Invitation',
      statusAdministrative: {
        overallProgress: 10,
        ktpId: 'Done',
        photos: 'Not yet',
        kk: 'Done',
      },
    },
    {
      id: 2,
      rosterId: 'RO001',
      userId: 'Ben Utama',
      email: 'bambang@gmail.com',
      role: 'Captain',
      positionOfPlayers: 'Point Guard',
      jerseyNumber: '10',
      status: 'Accepted Invitation',
      statusAdministrative: {
        overallProgress: 40,
        ktpId: 'Not yet',
        photos: 'Not yet',
        kk: 'Done',
      },
    },
    {
      id: 3,
      rosterId: 'RO001',
      userId: 'Ben Utama',
      email: 'bambang@gmail.com',
      role: 'Captain',
      positionOfPlayers: 'Point Guard',
      jerseyNumber: '10',
      status: 'Accepted Invitation',
      statusAdministrative: {
        overallProgress: 30,
        ktpId: 'Done',
        photos: 'Not yet',
        kk: 'Done',
      },
    },
  ];

  return (
    <div className="flex flex-col w-full gap-3">
      <div className="flex flex-col gap-1">
        <div className="flex sm:justify-end">
          <div className="w-full sm:w-1/2">
            <Progress
              value="80"
              size="medium"
              label="Progress of Admin"
              hideValue
            />
          </div>
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
                name="clubIdAdmin"
                placeholder="Select Club ID"
                value="12345"
                disabled
                className="!rounded-[4px]"
              />
            </div>

            <div className="flex-grow w-full relative md:w-1/3">
              <Input
                label="Participation Status"
                name="participationStatusAdmin"
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

      <section className="mt-4">
        <h5 className="mb-2 text-xl font-bold">
          Complete Administrative Requirements
        </h5>

        <div className="flex pb-3 md:justify-end">
          <div className="flex w-full sm:w-[40%] lg:w-[30%]">
            <FilterSearch />
          </div>
        </div>

        <TableAdminRequirement
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
          title="Detail Requirement"
          openModal={openModal}
          setOpenModal={setOpenModal}
          className="overflow-y-auto"
          rounded="rounded-xl"
        >
          <FormDetailRequirement
            data={getDetailData}
            setOpenModal={setOpenModal}
            setIsOpenPopUpDelete={setPopUpDelete}
            setIsOpenPopUpUploading={setPopUpUploading}
            setIsUploadCompleted={setIsUploadCompleted}
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

      {/* Pop Up Delete */}
      {popUpUploading && (
        <PopUpUploading
          isOpenPopUpUploading={popUpUploading}
          setIsOpenPopUpUploading={setPopUpUploading}
          // setCurrentActiveTab={setCurrentActiveTab}
          // selectedEventId={selectedEventId}
          isUploadCompleted={isUploadCompleted}
          setIsUploadCompleted={setIsUploadCompleted}
          disableBtnMedia
        />
      )}
      {/* End Pop Up Uploading */}
    </div>
  );
};

export default AdminRequirement;
