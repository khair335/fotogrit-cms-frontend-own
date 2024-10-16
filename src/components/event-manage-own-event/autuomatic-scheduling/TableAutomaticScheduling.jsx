import DataTable from 'react-data-table-component';

import { ButtonAction, Pagination } from '@/components';

import { customTableStyles } from '@/constants/tableStyle';
import { ErrorFetchingData } from '@/components/Errors';
import { SkeletonTable } from '@/components/Skeleton';

const TableAutomaticScheduling = (props) => {
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

  const teams = data?.data?.teams;
  const meta = data?.meta;

  const totalPages = meta?.total_page;
  const totalRecords = meta?.total_record;

  // Columns Table
  const columns = [
    {
      name: 'Event ID',
      selector: (row) => row.event_code,
      cell: (row) => row.event_code || '-',
      sortable: true,
      minWidth: '140px',
    },
    {
      name: 'Age Group',
      selector: (row) => row.age_group,
      cell: (row) => row.age_group || '-',
      sortable: true,
      minWidth: '130px',
    },
    {
      name: 'Event Categories',
      selector: (row) => row.event_categories,
      cell: (row) => row.event_categories || '-',
      sortable: true,
      minWidth: '170px',
    },
    {
      name: 'Pool',
      selector: (row) => row.pool,
      cell: (row) => row.pool || '-',
      sortable: true,
      minWidth: '160px',
    },
    {
      name: 'Date / Time',
      selector: (row) => row.date_time,
      cell: (row) => row.date_time || '-',
      sortable: true,
      minWidth: '160px',
    },
    {
      name: 'Location',
      selector: (row) => row.location,
      cell: (row) => row.location || '-',
      sortable: true,
      minWidth: '160px',
    },
    {
      name: 'Team A',
      selector: (row) => row.team_a,
      cell: (row) => row.team_a || '-',
      sortable: true,
      minWidth: '160px',
    },
    {
      name: 'Team B',
      selector: (row) => row.team_b,
      cell: (row) => row.team_b || '-',
      sortable: true,
      minWidth: '160px',
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
            selectableRows
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

export default TableAutomaticScheduling;
