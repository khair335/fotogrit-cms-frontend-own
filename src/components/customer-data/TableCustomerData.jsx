import React from 'react';
import DataTable from 'react-data-table-component';

import { ErrorFetchingData, NoDataMessage } from '@/components/Errors';
import { SkeletonTable } from '../Skeleton';
import { ButtonAction, Pagination } from '@/components';
import { customTableStyles } from '@/constants/tableStyle';

const TableCustomerData = (props) => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    setOpenModal,
    setGetData,
    limitPerPage,
    currentPage,
    setCurrentPage,
  } = props;

  const customers = data?.data;
  const meta = data?.meta;

  const totalPages = meta?.total_page;
  const totalRecords = meta?.total_record;

  const columns = [
    {
      name: 'User Code',
      selector: (row) => row.code,
      sortable: true,
      width: '140px',
    },
    // {
    //   name: 'Username',
    //   selector: (row) => row.username || '-',
    //   sortable: true,
    //   minWidth: '160px',
    //   wrap: true,
    // },
    {
      name: 'Name',
      selector: (row) => row.name || '-',
      sortable: true,
      minWidth: '200px',
      wrap: true,
    },
    {
      name: 'Email',
      selector: (row) => row.email || '-',
      sortable: true,
      minWidth: '200px',
      wrap: true,
    },
    {
      name: 'Gender',
      selector: (row) => row.gender,
      cell: (row) =>
        row.gender === 1 ? 'Pria' : row.gender === 0 ? 'Wanita' : '-',
      sortable: true,
      minWidth: '130px',
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
      minWidth: '110px',
      cell: (row) => (row.status === 1 ? 'Active' : 'Non Active'),
      conditionalCellStyles: [
        {
          when: (row) => row.status === 1,
          style: {
            color: '#03E079',
          },
        },
        {
          when: (row) => row.status === 0,
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
        <div className="border-t border-gray-200">
          <DataTable
            columns={columns}
            data={customers}
            fixedHeader
            fixedHeaderScrollHeight="54vh"
            customStyles={customTableStyles}
            persistTableHead
            noDataComponent={<NoDataMessage title="Customers" />}
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

export default TableCustomerData;
