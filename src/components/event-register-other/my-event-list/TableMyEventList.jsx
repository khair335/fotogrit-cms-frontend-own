import React, { useState } from 'react';

import { Button } from '@/components';
import DataTable from 'react-data-table-component';
import { IoIosArrowForward } from 'react-icons/io';

import {
  Input,
  RadioInput,
  SelectInput,
  TextArea,
} from '@/components/form-input';

import { SkeletonTable } from '../../Skeleton';

import { ButtonAction, Pagination } from '@/components';
import { customTableStyles } from '@/constants/tableStyle';
import { Link } from 'react-router-dom';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';

const TableMyEventList = (props) => {
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

  // Expand Row
  // const [expandRow, setExpandRow] = useState(false);
  // const [expandRowIndex, setExpandRowIndex] = useState(0);
  // data[expandRowIndex].defaultExpanded = expandRow;

  const totalPages = 3;
  const totalRecords = 12;

  const initialInputValue = {
    userId: '',
    email: '',
  };

  const [formInput, setFormInput] = useState(initialInputValue);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

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
      name: 'Status',
      selector: (row) => row.status,
      cell: (row) => (
        <div
          className={`${
            row.status == 'Waiting for Finalization'
              ? 'text-ftbrown'
              : row.status == 'On Going'
              ? 'text-ftgreen-600'
              : ''
          } font-bold italic`}
        >
          {row.status}
        </div>
      ),
      sortable: true,
      wrap: true,
      minWidth: '180px',
    },
    {
      name: 'Action',
      center: true,
      width: '130px',
      cell: (props) => (
        <div className="flex gap-2">
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

export default TableMyEventList;
