import React from 'react';

import DataTable from 'react-data-table-component';

import { SkeletonTable } from '../../Skeleton';

import { Button, ButtonAction, Pagination } from '@/components';
import { customTableStyles } from '@/constants/tableStyle';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';

const TableRespondNewEvent = (props) => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    setOpenModal,
    setGetData,
    currentPage,
    setCurrentPage,
    metaPagination,
    limitPerPage,
  } = props;

  const totalPages = 3;
  const totalRecords = 12;

  // Columns Table
  const columns = [
    {
      name: 'Event Group Name',
      selector: (row) => row.eventGroupName,
      cell: (row) => (
        <div className="flex flex-col gap-3 w-full h-full py-3">
          <p>{row.eventGroupName}</p>
          <Link to={row.link}>
            <p className="text-ftblue underline italic">{row.link}</p>
          </Link>
        </div>
      ),
      width: '200px',
    },
    {
      name: 'Age Group',
      selector: (row) => row.ageGroup,
      sortable: true,
      wrap: true,
      minWidth: '130px',
    },
    {
      name: 'Event Type',
      selector: (row) => row.eventType,
      sortable: true,
      wrap: true,
      minWidth: '130px',
    },
    {
      name: 'Slots',
      selector: (row) => row.slots,
      sortable: true,
      wrap: true,
      minWidth: '80px',
    },
    {
      name: 'Total Price',
      selector: (row) => CurrencyFormat(row.totalPrice),
      sortable: true,
      wrap: true,
      minWidth: '130px',
    },
    {
      name: 'Location',
      selector: (row) => row.location,
      sortable: true,
      wrap: true,
      minWidth: '130px',
    },
    {
      name: 'Event Date',
      selector: (row) => row.eventDate,
      sortable: true,
      wrap: true,
      minWidth: '180px',
    },
    {
      name: 'Deadline',
      selector: (row) => row.deadline,
      cell: (row) => {
        return (
          <div>
            <p className="text-ftbrown font-bold italic">{row.deadline}</p>
          </div>
        );
      },
      sortable: true,
      wrap: true,
      minWidth: '130px',
    },
    {
      name: 'Action',
      center: true,
      width: '200px',
      cell: (props) => (
        <div className="flex flex-row-reverse items-center gap-2 py-2 flex-1">
          <ButtonAction
            setGetData={setGetData}
            setOpenModal={setOpenModal}
            {...props}
          />

          <Button background="black" className="w-full">
            Share
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="border-t border-gray-200">
        <DataTable
          columns={columns}
          data={data}
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
    </div>
  );
};

export default TableRespondNewEvent;
