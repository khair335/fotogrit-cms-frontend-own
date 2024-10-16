import React from 'react';
import { Button } from '@/components';
import DataTable from 'react-data-table-component';
import { FaMedal } from 'react-icons/fa';
import { CiBasketball } from 'react-icons/ci';

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

const TableSchedule = (props) => {
  const { data, currentPage, setCurrentPage, metaPagination, limitPerPage } =
    props;

  const schedule = data;

  // const metaClubData = data?.meta;
  const totalPages = 3;
  const totalRecords = schedule?.length;

  // Columns Table
  const columns = [
    {
      name: 'Date/Time',
      selector: (row) => row.dateTime,
      sortable: true,
      wrap: true,
      minWidth: '130px',
    },
    {
      name: 'Location',
      selector: (row) => row.location,
      sortable: true,
      wrap: true,
      minWidth: '80px',
    },
    {
      name: 'Event Categories',
      selector: (row) => row.eventCategories,
      sortable: true,
      wrap: true,
      minWidth: '180px',
    },
    {
      name: (
        <div className="flex flex-col items-center w-full">
          <p className="mb-2">TeamA</p>

          <div className="w-full flex justify-between text-left">
            <p className="w-2/5">Name</p>
            <p className="w-1/4">Score</p>
            <p className="w-1/3">Win/Lose</p>
          </div>
        </div>
      ),
      // sortable: true,
      wrap: true,
      minWidth: '300px',
      cell: (row) => {
        return (
          <div className="w-full flex justify-between text-left">
            <p className="w-2/5">{row.teamA.name}</p>
            <p className="w-1/4">{row.teamA.score}</p>
            <p className="w-1/3">{row.teamA.winLose}</p>
          </div>
        );
      },
    },
    {
      name: (
        <div className="flex flex-col items-center w-full">
          <p className="mb-2">TeamB</p>

          <div className="w-full flex justify-between text-left">
            <p className="w-2/5">Name</p>
            <p className="w-1/4">Score</p>
            <p className="w-1/3">Win/Lose</p>
          </div>
        </div>
      ),
      // sortable: true,
      wrap: true,
      minWidth: '300px',
      cell: (row) => {
        return (
          <div className="w-full flex justify-between text-left">
            <p className="w-2/5">{row.teamB.name}</p>
            <p className="w-1/4">{row.teamB.score}</p>
            <p className="w-1/3">{row.teamB.winLose}</p>
          </div>
        );
      },
    },
    {
      name: 'Hall of Fame',
      selector: (row) => row.hallOfFame,
      cell: (row) => {
        return (
          <div className="flex flex-col items-center gap-2 py-3">
            <div className="flex items-center gap-3">
              <FaMedal className="text-xl text-ftyellow" />
              <p>{row.hallOfFame}</p>
            </div>

            <div className="flex items-center gap-3">
              <CiBasketball className="text-xl text-ftyellow" />
              <p>{row.hallOfFame}</p>
            </div>
          </div>
        );
      },
      sortable: true,
      wrap: true,
      minWidth: '180px',
    },
    {
      name: 'Link to Event Detail',
      selector: (row) => row.eventDetail,
      center: true,
      width: '180px',
      cell: (row) => (
        <div>
          <Link to={row.eventDetail} target="_blank">
            <p className="text-ftblue underline italic">{row.eventDetail}</p>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="border-t border-gray-200 ">
        <DataTable
          columns={columns}
          data={schedule}
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

export default TableSchedule;
