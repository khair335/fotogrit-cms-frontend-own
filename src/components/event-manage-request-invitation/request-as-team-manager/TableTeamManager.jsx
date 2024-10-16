import { useState } from 'react';
import DataTable from 'react-data-table-component';

import { Button, ButtonAction, Pagination, PopUp } from '@/components';

import { customTableStyles } from '@/constants/tableStyle';
import { ErrorFetchingData } from '@/components/Errors';
import { SkeletonTable } from '@/components/Skeleton';

const TableTeamManager = (props) => {
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
  } = props;

  const [isOpenPopUpApprove, setIsOpenPopUpApprove] = useState(false);
  const [isOpenPopUpRefund, setIsOpenPopUpRefund] = useState(false);

  const teams = data?.data?.teams;
  const meta = data?.meta;

  const totalPages = meta?.total_page;
  const totalRecords = meta?.total_record;

  // Columns Table
  const columns = [
    {
      name: 'Team Manager',
      selector: (row) => row.team_manager,
      cell: (row) => row.team_manager || '-',
      sortable: true,
      minWidth: '160px',
    },
    {
      name: 'Club',
      selector: (row) => row.club,
      cell: (row) => row.club || '-',
      sortable: true,
      minWidth: '160px',
    },
    {
      name: <span>Event Group Name</span>,
      selector: (row) => row.event_group_name,
      cell: (row) => row.event_group_name || '-',
      sortable: true,
      minWidth: '160px',
    },
    {
      name: <span>Number of Roster</span>,
      selector: (row) => row.number_of_roster,
      cell: (row) => row.number_of_roster || '-',
      sortable: true,
      minWidth: '130px',
    },
    {
      name: <span className="py-1">Summary Requirement (%)</span>,
      selector: (row) => row.summary_requirement,
      cell: (row) => row.summary_requirement || '-',
      sortable: true,
      minWidth: '130px',
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      cell: (row) => row.status || '-',
      sortable: true,
      minWidth: '150px',
    },
    {
      name: 'Action',
      center: true,
      width: '80px',
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
            data={teams}
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
      ) : null}
    </div>
  );
};

export default TableTeamManager;
