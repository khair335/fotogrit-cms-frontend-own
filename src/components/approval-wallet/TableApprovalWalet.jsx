import React from 'react';
import DataTable from 'react-data-table-component';

import { ErrorFetchingData } from '@/components/Errors';
import { SkeletonTable } from '@/components/Skeleton';
import { Button, ButtonAction, Pagination } from '@/components';

import { CurrencyFormat } from '@/helpers/CurrencyFormat';
import { customTableStyles } from '@/constants/tableStyle';
import { formatDateTime } from '@/helpers/FormatDateTime';

const TableApprovalWalet = (props) => {
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

  const walletAmount = data?.data;
  const meta = data?.meta;

  const totalPages = meta?.total_page;
  const totalRecords = meta?.total_record;

  const columns = [
    {
      name: 'Date / Time',
      selector: (row) => formatDateTime(row.expired_date),
      sortable: true,
      wrap: true,
      minWidth: '120px',
    },
    {
      name: 'User ID - Name',
      selector: (row) => row.user_id,
      sortable: true,
      wrap: true,
      minWidth: '160px',
    },
    {
      name: 'Amount Before',
      selector: (row) => row.amount,
      cell: (row) => CurrencyFormat(row.amount),
      sortable: true,
      minWidth: '160px',
    },
    {
      name: 'Amount After',
      selector: (row) => row.amount,
      cell: (row) => CurrencyFormat(row.amount),
      sortable: true,
      minWidth: '160px',
    },
    {
      name: 'Reason',
      selector: (row) => row.reason || 'reason..',
      wrap: true,
      minWidth: '160px',
    },
    {
      name: 'Approval Status',
      minWidth: '190px',
      center: true,
      cell: (row) => (
        <div className="flex gap-2">
          <Button background="green" className="text-xs">
            Approved
          </Button>
          <Button background="red" className="text-xs">
            Decline
          </Button>
        </div>
      ),
    },
    {
      name: 'Action',
      center: true,
      width: '100px',
      cell: (props) => (
        <ButtonAction
          setGetData={setGetData}
          setOpenModal={setOpenModal}
          {...props}
        />
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
            data={walletAmount}
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
    </div>
  );
};

export default TableApprovalWalet;
