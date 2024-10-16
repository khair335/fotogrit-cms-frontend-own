import DataTable from 'react-data-table-component';

import { SkeletonTable } from '../Skeleton';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';
import { formatDateTime } from '@/helpers/FormatDateTime';
import { Pagination } from '..';
import { ErrorFetchingData } from '@/components/Errors';

const TableHistoryGeneralSetting = (props) => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    currentPage,
    setCurrentPage,
    limitPerPage,
  } = props;

  const histories = data?.data?.log_commerce?.log_commerce;
  const meta = data?.data?.log_commerce?.meta;

  const totalPages = meta?.total_page;
  const totalRecords = meta?.total_record;

  // Columns Table
  const columns = [
    {
      name: 'Date',
      selector: (row) => formatDateTime(row?.date),
      sortable: true,
    },
    {
      name: 'Changed By',
      selector: (row) => row?.created_by,
      sortable: true,
    },
    {
      name: 'Price Name',
      selector: (row) => row?.price_name,
      sortable: true,
    },
    {
      name: 'Price',
      selector: (row) => CurrencyFormat(row?.price),
      sortable: true,
    },
  ];

  // Custom Style Table
  const customStyles = {
    headRow: {
      style: {
        border: 'none',
      },
    },
    rows: {
      style: {
        '&:not(:last-of-type)': {
          border: 'none',
        },
      },
    },
    headCells: {
      style: {
        fontWeight: 800,
        fontSize: '13px',
      },
    },
    cells: {
      style: {
        fontSize: '11px',
      },
    },
  };

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
            data={histories}
            fixedHeader
            fixedHeaderScrollHeight="50vh"
            customStyles={customStyles}
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

export default TableHistoryGeneralSetting;
