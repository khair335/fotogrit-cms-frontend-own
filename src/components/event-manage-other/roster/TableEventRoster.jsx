import React from 'react';
import DataTable from 'react-data-table-component';

import { ErrorFetchingData } from '@/components/Errors';

import { ButtonAction, Pagination } from '@/components';
import { customTableStyles } from '@/constants/tableStyle';

const TableEventRoster = (props) => {
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

  const eventRoster = data;

  // const metaClubData = data?.meta;
  const totalPages = 3;
  const totalRecords = eventRoster?.length;

  const columns = [
    {
      name: 'Roster ID',
      selector: (row) => row.rosterId,
      sortable: true,
      wrap: true,
      minWidth: '130px',
    },
    {
      name: 'User ID',
      selector: (row) => row.userId,
      sortable: true,
      minWidth: '150px',
      wrap: true,
    },
    {
      name: 'Role',
      selector: (row) => row.role,
      sortable: true,
      minWidth: '100px',
      wrap: true,
    },
    {
      name: 'Position of Players',
      selector: (row) => row.positionOfPlayers,
      sortable: true,
      wrap: true,
      minWidth: '180px',
    },
    {
      name: 'Jersey/Number',
      selector: (row) => row.jerseyNumber,
      sortable: true,
      wrap: true,
      minWidth: '160px',
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
      wrap: true,
      minWidth: '100px',
    },
    {
      name: 'Action',
      center: true,
      width: '120px',
      cell: (props) => {
        return (
          <div>
            <ButtonAction
              setGetData={setGetData}
              setOpenModal={setOpenModal}
              {...props}
            />
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <div className="border-t border-gray-200 ">
        <DataTable
          columns={columns}
          data={eventRoster}
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
    </div>
  );
};

export default TableEventRoster;
