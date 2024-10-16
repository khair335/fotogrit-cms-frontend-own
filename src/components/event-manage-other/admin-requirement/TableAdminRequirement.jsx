import React, { useEffect, useRef } from 'react';
import DataTable from 'react-data-table-component';

import { FormDetailRequirement } from '@/components/event-manage-other';
import { ErrorFetchingData } from '@/components/Errors';
import { Input } from '@/components/form-input';
import { Button, ButtonAction, Pagination, Progress } from '@/components';
import { customTableStyles } from '@/constants/tableStyle';
import { useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { useUploadImagesMutation } from '@/services/api/uploadApiSlice';
import { toast } from 'react-toastify';

const TableAdminRequirement = (props) => {
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

  const [eventRoster, setEventRoster] = useState(data);
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
      cell: (row) => {
        return (
          <div className="text-ftgreen-600 font-bold italic">{row.status}</div>
        );
      },
      sortable: true,
      wrap: true,
      minWidth: '150px',
    },
    {
      name: 'Status of Administrative Requirements',
      center: true,
      selector: (row) => row.statusAdministrative,
      cell: (row, index) => {
        return (
          <div className="w-full py-2">
            <Progress
              value={row.statusAdministrative.overallProgress}
              size="small"
              label="Overall progress"
              // hideValue
            />
          </div>
        );
      },
      sortable: true,
      wrap: true,
      minWidth: '330px',
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
              onClick={() => {
                setShowAdministrative(!showAdministrative);
              }}
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

export default TableAdminRequirement;
