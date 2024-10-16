import React from 'react';
import DataTable from 'react-data-table-component';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { ButtonAction, Pagination } from '@/components';
import { ErrorFetchingData } from '@/components/Errors';
import { SkeletonTable } from '@/components/Skeleton';
import { customTableStyles } from '@/constants/tableStyle';
import { formatDate } from '@/helpers/FormatDate';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';

const TableEquipment = (props) => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    setOpenModal,
    setGetData,
    setCurrentPage,
    limitPerPage,
    currentPage,
  } = props;

  const dataTable = data?.data;
  const metaEventGroup = data?.meta;

  const totalPages = metaEventGroup?.total_page;
  const totalRecords = metaEventGroup?.total_record;

  // Columns Table
  const columns = [
    {
      name: 'Equipment ID',
      selector: (row) => row.code,
      sortable: true,
      minWidth: '150px',
    },

    {
      name: 'Equipment Name',
      selector: (row) => row.equip_name,
      sortable: true,
      wrap: true,
      minWidth: '180px',
    },
    {
      name: 'Category',
      selector: (row) => row.category,
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: 'Availability / Stocks',
      selector: (row) => row.stock,
      cell: (row) => `${row.value}/${row.stock}`,
      sortable: true,
      minWidth: '190px',
      wrap: true,
    },
    {
      name: 'Replacement Value',
      selector: (row) => row.deposit_amount,
      cell: (row) => CurrencyFormat(row.deposit_amount),
      sortable: true,
      wrap: true,
      minWidth: '190px',
    },
    {
      name: 'Action',
      center: true,
      width: '140px',
      cell: (props) => {
        return (
          <ButtonAction
            setGetData={setGetData}
            setOpenModal={setOpenModal}
            {...props}
          />
        );
      },
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
            data={dataTable}
            fixedHeader
            fixedHeaderScrollHeight="50vh"
            responsive={true}
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

export default TableEquipment;
