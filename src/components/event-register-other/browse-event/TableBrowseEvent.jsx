import React, { useState } from 'react';

import { Button, PopUp } from '@/components';
import DataTable from 'react-data-table-component';

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

const TableBrowseEvent = (props) => {
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

  const [isOpenPopUpRegister, setIsOpenPopUpRegister] = useState(false);
  const [isOpenPopUpAgeGroup, setIsOpenPopUpAgeGroup] = useState(false);

  const handleIsOpenPopupRegister = (data) => {
    setIsOpenPopUpRegister(true);
  };

  const handleIsOpenPopupAgeGroup = () => {
    setIsOpenPopUpRegister(false);
    setIsOpenPopUpAgeGroup(true);
  };

  const handleCancelRegister = () => {
    setIsOpenPopUpRegister(false);
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
      name: 'Deadline',
      selector: (row) => row.deadline,
      cell: (row) => (
        <div className="text-ftbrown font-bold italic">{row.deadline}</div>
      ),
      sortable: true,
      wrap: true,
      minWidth: '130px',
    },
    {
      name: 'Action',
      center: true,
      width: '200px',
      cell: (props) => (
        <div className="flex items-center gap-3 flex-1">
          <Button
            background="brown"
            className="w-full"
            onClick={() => handleIsOpenPopupRegister(props.row)}
          >
            Register
          </Button>

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

      {/* POPUP REGISTER */}
      <PopUp
        setIsOpenPopUp={setIsOpenPopUpRegister}
        isOpenPopUp={isOpenPopUpRegister}
        title="Confirmation"
      >
        <h5 className="font-bold text-left py-3">
          Are you sure want to register this tournament?
        </h5>

        <div className="flex items-center justify-end">
          <div className="flex justify-evenly items-center gap-2 mt-4 w-full">
            <Button
              background="red"
              className="w-28"
              onClick={handleCancelRegister}
            >
              Cancel
            </Button>
            <Button
              background="black"
              className="w-28"
              onClick={handleIsOpenPopupAgeGroup}
            >
              Yes, Next!
            </Button>
          </div>
        </div>
      </PopUp>
      {/* END POPUP REGISTER */}

      {/* POPUP CHOOSE AGE GROUP */}
      <PopUp
        setIsOpenPopUp={setIsOpenPopUpAgeGroup}
        isOpenPopUp={isOpenPopUpAgeGroup}
        title="Choose Age Group"
      >
        {/* <h5 className="mb-4 font-bold text-left">Pilih Age Group anda</h5> */}

        <div>
          <div className="flex flex-col gap-0.5 z-30">
            <SelectInput name="Age Group" placeholder="Select Age Group" />
          </div>
        </div>

        <div className="flex items-center justify-end">
          <div className="flex justify-evenly items-center gap-2 mt-4 w-full">
            <Button
              background="black"
              className="w-28"
              onClick={() => {
                setIsOpenPopUpAgeGroup(false);
              }}
            >
              Ok
            </Button>
          </div>
        </div>
      </PopUp>
      {/* END POPUP CHOOSE AGE GROUP */}
    </div>
  );
};

export default TableBrowseEvent;
