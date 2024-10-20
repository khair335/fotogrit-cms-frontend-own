import DataTable from 'react-data-table-component';

import { SkeletonTable } from '../Skeleton';
import { ButtonAction, Pagination } from '@/components';
import { customTableStyles } from '@/constants/tableStyle';
import { ErrorFetchingData, NoDataMessage } from '@/components/Errors';

const TableNews = (props) => {
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

  const dataTable = data?.data;
  const meta = data?.meta;

  const totalPages = meta?.total_page;
  const totalRecords = meta?.total_record;

  const columns = [
    {
      name: 'News Code',
      selector: (row) => row.sponsor_code,
      cell: (row) => row.sponsor_code || '-',
      sortable: true,
      width: '200px',
    },
    {
      name: 'Publishing Start Date',
      selector: (row) => row.logo,
      cell: (row) =>
        row.logo ? (
          <div className="w-full h-full p-2">
            <div className="w-16 h-16 overflow-hidden mx-auto rounded-sm">
              <img
                src={row.logo}
                alt={row.name}
                className="object-cover object-center w-full h-full"
              />
            </div>
          </div>
        ) : (
          <div className="p-2">
            <img
              src="/images/logo-fotogrit.png"
              alt="image placeholder"
              className="object-fill w-14 h-14"
            />
          </div>
        ),
      width: '180px',
      center: true,
    },
    {
      name: 'Publishing End Date',
      selector: (row) => row.name,
      cell: (row) => row.name || '-',
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: 'Picture',
    },
    {
      name: 'Action when Clicked',
    },
    {
      name: 'Number of clicks',
    }
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
            data={dataTable}
            fixedHeader
            fixedHeaderScrollHeight="54vh"
            customStyles={customTableStyles}
            persistTableHead
            noDataComponent={<NoDataMessage title="Sponsor" />}
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

export default TableNews;
