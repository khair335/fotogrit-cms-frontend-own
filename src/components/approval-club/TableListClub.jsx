import DataTable from 'react-data-table-component';

import {
  Button,
  ButtonAction,
  LoaderButtonAction,
  Pagination,
  PopUp,
} from '@/components';

import { customTableStyles } from '@/constants/tableStyle';
import { useState } from 'react';

const TableListClub = (props) => {
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

  const clubRequest = data;
  // const metaClubData = data?.meta;
  const totalPages = 2;
  const totalRecords = clubRequest?.length;

  const columns = [
    {
      name: 'Date',
      selector: (row) => row.date,
      sortable: true,
      wrap: true,
      width: '100px',
      minWidth: '100px',
    },
    {
      name: 'Logo',
      selector: (row) => row.logo,
      cell: (row) =>
        row.logo ? (
          <div className="p-2 ">
            <img
              src={row.logo}
              // alt={row.name}
              className="object-cover w-full h-14"
            />
          </div>
        ) : (
          <div className="p-2">
            <img
              src="/images/logo-fotogrit.png"
              alt="image placeholder"
              className="object-fill w-full h-14"
            />
          </div>
        ),
      width: '100px',
      center: true,
    },
    {
      name: 'Created By',
      selector: (row) => row.createdBy,
      sortable: true,
      wrap: true,
      minWidth: '100px',
    },
    {
      name: 'Club name',
      selector: (row) => row.clubName,
      sortable: true,
      minWidth: '130px',
      wrap: true,
    },
    {
      name: 'PIC User Id',
      selector: (row) => row.picUserId,
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: 'Legal Document Number',
      selector: (row) => row.legalDocumentNumber,
      sortable: true,
      wrap: true,
      minWidth: '250px',
    },
    {
      name: 'Action',
      selector: (row) => row.action,
      cell: (row) => (
        <span
          className={`${
            row.action === 'Waiting'
              ? 'text-purple-600'
              : row.action === 'Approved'
              ? 'text-ftgreen-600'
              : 'text-red-600'
          } capitalize font-bold`}
        >
          {row.action}
        </span>
      ),
      sortable: true,
      minWidth: '120px',
    },
  ];

  return (
    <div>
      <div className="border-t border-gray-200 ">
        <DataTable
          columns={columns}
          data={clubRequest}
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

export default TableListClub;
