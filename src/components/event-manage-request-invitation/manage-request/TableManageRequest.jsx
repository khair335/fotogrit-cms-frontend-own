import { useState } from 'react';
import DataTable from 'react-data-table-component';

import { Button, ButtonAction, Pagination, PopUp } from '@/components';

import { customTableStyles } from '@/constants/tableStyle';
import { ErrorFetchingData } from '@/components/Errors';
import { SkeletonTable } from '@/components/Skeleton';

const TableManageRequest = (props) => {
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
  const [isOpenPopUpRefund, setIsOpenPopUpRefund] = useState(false);

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
      name: 'Team Name',
      selector: (row) => row.name,
      cell: (row) => row.name || '-',
      sortable: true,
      minWidth: '160px',
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      cell: (row) => row.status || '-',
      sortable: true,
      minWidth: '160px',
    },
    {
      name: 'Action',
      center: true,
      width: '240px',
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
            onClick={() => setIsOpenPopUpRefund(true)}
          >
            Refund
          </Button>
          <ButtonAction
            setGetData={setGetData}
            setOpenModal={setOpenModal}
            {...props}
          />
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
          Are you sure you want to approve it as the final list?
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
        setIsOpenPopUp={setIsOpenPopUpRefund}
        isOpenPopUp={isOpenPopUpRefund}
        title="Confirmation"
      >
        <h5 className="mb-4 font-bold text-left">
          Are you sure you want to cancel and refund?
        </h5>

        <div className="flex items-center justify-center">
          <div className="flex gap-2 mt-2">
            <Button
              background="red"
              className="w-28"
              onClick={() => setIsOpenPopUpRefund(false)}
            >
              Cancel
            </Button>
            <Button
              background="black"
              className="w-28"
              // onClick={handleRefund}
              disabled
            >
              Refund
            </Button>
          </div>
        </div>
      </PopUp>
      {/* END POPUP REFUND */}
    </div>
  );
};

export default TableManageRequest;
