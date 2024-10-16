import React from 'react';

import { ButtonAction, Pagination } from '@/components';
import { SkeletonTable } from '../Skeleton';
import DataTable from 'react-data-table-component';
import { customTableStyles } from '@/constants/tableStyle';
import { ErrorFetchingData, NoDataMessage } from '@/components/Errors';

const TableUserRole = (props) => {
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

  const roles = data?.data;
  const meta = data?.meta;

  const totalPages = meta?.total_page;
  const totalRecords = meta?.total_record;

  // Columns Table
  const columns = [
    {
      name: 'Role',
      selector: (row) => row.role,
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) => row.status_role,
      sortable: true,
      cell: (row) => (row.status_role === 1 ? 'Active' : 'Non Active'),
      conditionalCellStyles: [
        {
          when: (row) => row.status_role === 1,
          style: {
            color: '#03E079',
          },
        },
        {
          when: (row) => row.status_role === 0,
          style: {
            color: 'red',
          },
        },
      ],
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
        <div className="border-t border-gray-200 ">
          <DataTable
            columns={columns}
            data={roles}
            fixedHeader
            fixedHeaderScrollHeight="54vh"
            customStyles={customTableStyles}
            persistTableHead
            noDataComponent={<NoDataMessage title="User Roles" />}
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

export default TableUserRole;
