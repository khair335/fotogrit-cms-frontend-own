import DataTable from 'react-data-table-component';

import { Pagination } from '@/components';
import { ErrorFetchingData } from '@/components/Errors';
import { SkeletonTableTwoRow } from '@/components/Skeleton';

// Custom Style Table
const customStyles = {
  headRow: {
    style: {
      border: 'none',
      minHeight: '36px',
    },
  },
  rows: {
    style: {
      minHeight: '32px',
      '&:not(:last-of-type)': {
        border: 'none',
      },
    },
  },
  headCells: {
    style: {
      fontWeight: 800,
      fontSize: '14px',
    },
  },
  cells: {
    style: {
      fontSize: '12px',
    },
  },
};

const TableTotalSales = (props) => {
  const { fetchData, limitPerPage, setCurrentPage, currentPage } = props;

  const { data, isLoading, isError, error, isSuccess } = fetchData;

  const dataTable = data?.data;
  const meta = data?.meta;

  const totalPages = meta?.total_page;
  const totalRecords = meta?.total_record;

  const columns = [
    {
      name: 'Monday',
      selector: (row) => row.monday,
      cell: (row) => row.monday || '-',
      sortable: true,
      minWidth: '100px',
    },
    {
      name: 'Tuesday',
      selector: (row) => row.tuesday,
      cell: (row) => row.tuesday || '-',
      sortable: true,
      minWidth: '100px',
    },
    {
      name: 'Wednesday',
      selector: (row) => row.wednesday,
      cell: (row) => row.wednesday || '-',
      sortable: true,
      minWidth: '140px',
    },
    {
      name: 'Thursday',
      selector: (row) => row.thursday,
      cell: (row) => row.thursday || '-',
      sortable: true,
      minWidth: '100px',
    },
    {
      name: 'Friday',
      selector: (row) => row.friday,
      cell: (row) => row.friday || '-',
      sortable: true,
      minWidth: '100px',
    },
    {
      name: 'Saturday',
      selector: (row) => row.saturday,
      cell: (row) => row.saturday || '-',
      sortable: true,
      minWidth: '100px',
    },
    {
      name: 'Sunday',
      selector: (row) => row.sunday,
      cell: (row) => row.sunday || '-',
      sortable: true,
      minWidth: '100px',
    },
  ];

  return (
    <div>
      {isError ? (
        <ErrorFetchingData error={error} />
      ) : isLoading ? (
        <SkeletonTableTwoRow />
      ) : isSuccess ? (
        <div className="">
          <DataTable
            columns={columns}
            data={dataTable}
            fixedHeader
            fixedHeaderScrollHeight="150px"
            customStyles={customStyles}
          />

          {/* <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            limitPerPage={limitPerPage}
          /> */}
        </div>
      ) : null}
    </div>
  );
};

export default TableTotalSales;
