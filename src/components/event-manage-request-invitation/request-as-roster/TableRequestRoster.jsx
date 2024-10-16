import { useState } from 'react';
import DataTable from 'react-data-table-component';

import { Button, ButtonAction, Pagination, PopUp } from '@/components';

import { customTableStyles } from '@/constants/tableStyle';
import { ErrorFetchingData } from '@/components/Errors';
import { SkeletonTable } from '@/components/Skeleton';

const TableRequestRoster = (props) => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    setOpenModal,
    setGetData,
    limitPerPage,
    setCurrentPage,
    currentPage,
  } = props;

  const [isOpenPopUpApprove, setIsOpenPopUpApprove] = useState(false);
  const [isOpenPopUpDecline, setIsOpenPopUpDecline] = useState(false);

  const teams = data?.data?.teams;
  const meta = data?.meta;

  const totalPages = meta?.total_page;
  const totalRecords = meta?.total_record;

  // Columns Table
  const columns = [
    {
      name: 'Date',
      selector: (row) => row.date,
      cell: (row) => row.date || '-',
      sortable: true,
      minWidth: '100px',
    },
    {
      name: 'Club Name',
      selector: (row) => row.club_name,
      cell: (row) => row.club_name || '-',
      sortable: true,
      minWidth: '160px',
    },
    {
      name: 'Team Name',
      selector: (row) => row.name,
      cell: (row) => row.name || '-',
      sortable: true,
      minWidth: '160px',
    },
    {
      name: <span>Event Group Name</span>,
      selector: (row) => row.event_group_name,
      cell: (row) => row.event_group_name || '-',
      sortable: true,
      minWidth: '160px',
    },
    {
      name: <span>Event Group Date</span>,
      selector: (row) => row.event_group_date,
      cell: (row) => row.event_group_date || '-',
      sortable: true,
      minWidth: '160px',
    },
    {
      name: 'Action',
      center: true,
      width: '200px',
      cell: (props) => (
        <div className="flex items-center gap-2">
          <Button
            background="green"
            className="text-xs"
            onClick={() => setIsOpenPopUpApprove(true)}
          >
            Approve
          </Button>
          <Button
            background="red"
            className="text-xs"
            onClick={() => setIsOpenPopUpDecline(true)}
          >
            Decline
          </Button>
          {/* <ButtonAction
            setGetData={setGetData}
            setOpenModal={setOpenModal}
            {...props}
          /> */}
        </div>
      ),
    },
  ];

  return (
    <div>
      {isError ? (
        <ErrorFetchingData error={error} />
      ) : isLoading ? (
        <SkeletonTable />
      ) : isSuccess ? (
        <div className="border-t border-gray-200">
          <DataTable
            columns={columns}
            data={teams}
            fixedHeader
            fixedHeaderScrollHeight="50vh"
            customStyles={customTableStyles}
          />

          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            limitPerPage={limitPerPage}
          />
        </div>
      ) : null}

      {/* POPUP APPROVE */}
      <PopUp
        setIsOpenPopUp={setIsOpenPopUpApprove}
        isOpenPopUp={isOpenPopUpApprove}
        title="Confirmation"
      >
        <h5 className="mb-4 font-bold text-left">
          Are you sure you want to Approve?
        </h5>

        <div className="flex items-center justify-center">
          <div className="flex gap-2 mt-2">
            <Button
              background="red"
              className="w-28"
              onClick={() => setIsOpenPopUpApprove(false)}
            >
              Cancel
            </Button>
            <Button
              background="black"
              className="w-28"
              // onClick={handleApprove}
              disabled
            >
              Approve
            </Button>
          </div>
        </div>
      </PopUp>
      {/* END POPUP APPROVE */}

      {/* POPUP REFUND */}
      <PopUp
        setIsOpenPopUp={setIsOpenPopUpDecline}
        isOpenPopUp={isOpenPopUpDecline}
        title="Confirmation"
      >
        <h5 className="mb-4 font-bold text-left">
          Are you sure you want to Decline?
        </h5>

        <div className="flex items-center justify-center">
          <div className="flex gap-2 mt-2">
            <Button
              background="red"
              className="w-28"
              onClick={() => setIsOpenPopUpDecline(false)}
            >
              Cancel
            </Button>
            <Button
              background="black"
              className="w-28"
              // onClick={handleRefund}
              disabled
            >
              Decline
            </Button>
          </div>
        </div>
      </PopUp>
      {/* END POPUP REFUND */}
    </div>
  );
};

export default TableRequestRoster;
