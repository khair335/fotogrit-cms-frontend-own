import React from 'react';
import DataTable from 'react-data-table-component';

import { ButtonAction, Pagination } from '@/components';
import { ErrorFetchingData } from '@/components/Errors';
import { SkeletonTable } from '../Skeleton';

import { customTableStyles } from '@/constants/tableStyle';
import { formatDate } from '@/helpers/FormatDate';

const TableEventChecking = (props) => {
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
    setIsOpenModalConfirmation,
    isAccessEventChecking,
  } = props;

  const dataTable = data?.data;
  const meta = data?.meta;

  const totalPages = meta?.total_page;
  const totalRecords = meta?.total_record;

  const handleClick = (data) => {
    setGetData(data);
    setIsOpenModalConfirmation(true);
  };

  // Columns Table
  const columns = [
    {
      name: 'Date Time',
      selector: (row) => row.date,
      cell: (row) => (
        <span>{`${formatDate(row.date)} | ${row.time_start} - ${
          row.time_finish
        }`}</span>
      ),
      sortable: true,
      wrap: true,
    },
    {
      name: 'Event Group',
      selector: (row) => row.event_group_name,
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: 'Event Type',
      selector: (row) => row.event_type,
      sortable: true,
      minWidth: '140px',
    },
    {
      name: 'Event Name',
      selector: (row) => row.event_name,
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: 'Service Type',
      selector: (row) => row._service_id,
      cell: (row) => (row._service_id === 1 ? 'Team Pose' : 'Match'),
      sortable: true,
      minWidth: '140px',
      wrap: true,
    },
    {
      name: 'Location',
      selector: (row) => row.location,
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },

    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
      width: '150px',
      cell: (row) =>
        row.status === 'already input' ? (
          <span>{row.status}</span>
        ) : (
          <div className="">
            <button
              className="py-2 px-3 bg-[#8F815E] rounded-md text-white hover:bg-opacity-90 duration-300 disabled:bg-opacity-50"
              onClick={() => handleClick(row)}
              disabled={
                !isAccessEventChecking?.can_edit &&
                !isAccessEventChecking?.can_add
              }
            >
              Accept & Input
            </button>
          </div>
        ),
      style: {
        color: '#8F815E',
        textTransform: 'capitalize',
        fontWeight: 'bold',
      },
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
            data={dataTable}
            fixedHeader
            fixedHeaderScrollHeight="54vh"
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

export default TableEventChecking;
