import DataTable from 'react-data-table-component';

import { ButtonAction, Pagination } from '@/components';
import { ErrorFetchingData, NoDataMessage } from '@/components/Errors';
import { SkeletonTable } from '../../Skeleton';
import { customTableStyles } from '@/constants/tableStyle';

const TableMediaList = (props) => {
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
    setLimitPerPage,
    setSelectRows,
    clearSelectedRows,
  } = props;

  const totalPages = metaPagination?.total_page;
  const totalRecords = metaPagination?.total_record;

  const columns = [
    {
      name: 'Media Code',
      selector: (row) => row.code_media,
      sortable: true,
      width: '160px',
    },
    {
      name: 'Event Name',
      selector: (row) => row.event_name,
      sortable: true,
      minWidth: '180px',
      wrap: true,
    },
    {
      name: 'Thumbnail',
      cell: (row) =>
        row.thumbnail ? (
          <div className="p-2">
            <div className="w-14 h-14 overflow-hidden rounded-md">
              <img
                src={row?.thumbnail}
                alt={`img-${row?.event_name}`}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        ) : (
          <div className="p-2">
            <img
              src="/images/logo-fotogrit.png"
              alt="image placeholder"
              className="object-fill w-full h-14"
            />
          </div>
        ),
      width: '160px',
      center: true,
    },

    {
      name: 'Action',
      center: true,
      width: '100px',
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
        <div className="border-t border-gray-200 ">
          <DataTable
            columns={columns}
            data={data}
            fixedHeader
            fixedHeaderScrollHeight="50vh"
            customStyles={customTableStyles}
            selectableRows
            onSelectedRowsChange={({ selectedRows }) =>
              setSelectRows(selectedRows)
            }
            clearSelectedRows={clearSelectedRows}
            persistTableHead
            noDataComponent={<NoDataMessage title="Media" />}
          />

          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            limitPerPage={limitPerPage}
            setLimitPerPage={setLimitPerPage}
            rowPerPage={true}
          />
        </div>
      ) : null}
    </div>
  );
};

export default TableMediaList;
