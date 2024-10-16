import React from 'react';
import DataTable from 'react-data-table-component';

import { SkeletonTable } from '../Skeleton';
import { ButtonAction, Pagination } from '@/components';

import { customTableStyles } from '@/constants/tableStyle';
import { ErrorFetchingData } from '@/components/Errors';

const TableReportUser = (props) => {
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

  const teams = data?.data?.teams;
  const meta = data?.meta;

  const totalPages = meta?.total_page;
  const totalRecords = meta?.total_record;

  // Columns Table
  const columns = [
    {
      name: 'ID',
      selector: (row) => row.user_code || '-',
      sortable: true,
      minWidth: '90px',
      wrap: true,
    },
    {
      name: 'Join Date',
      selector: (row) => row.join_date || '-',
      sortable: true,
      minWidth: '130px',
      wrap: true,
    },
    {
      name: 'User Name',
      selector: (row) => row.username || '-',
      sortable: true,
      minWidth: '140px',
      wrap: true,
    },
    {
      name: 'Full Name',
      selector: (row) => row.full_name || '-',
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: 'Email & Phone',
      selector: (row) => row.email || '-',
      sortable: true,
      minWidth: '150px',
      wrap: true,
    },
    {
      name: 'Total Transaction',
      selector: (row) => row.total_transaction || '-',
      sortable: true,
      minWidth: '170px',
      wrap: true,
    },
    {
      name: <span>Total Sales by User</span>,
      selector: (row) => row.total_sales || '-',
      sortable: true,
      minWidth: '140px',
      wrap: true,
    },
    {
      name: 'Action',
      center: true,
      width: '80px',
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
    </div>
  );
};

export default TableReportUser;
