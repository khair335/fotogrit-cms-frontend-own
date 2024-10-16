import DataTable from 'react-data-table-component';

import { ButtonAction, Pagination } from '@/components';
import { ErrorFetchingData } from '@/components/Errors';
import { SkeletonTable } from '@/components/Skeleton';
import { customTableStyles } from '@/constants/tableStyle';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';

const TableRentalPickup = (props) => {
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

  const dataTable = data?.data;
  const metaEventGroup = data?.meta;

  const totalPages = metaEventGroup?.total_page;
  const totalRecords = metaEventGroup?.total_record;

  // Columns Table
  const columns = [
    {
      name: 'Rent ID',
      selector: (row) => row.code,
      sortable: true,
      minWidth: '150px',
    },

    {
      name: 'Event Group',
      selector: (row) => row.event_group || '-',
      sortable: true,
      wrap: true,
      minWidth: '180px',
    },
    {
      name: 'Equipment Name',
      selector: (row) => row.equipment_name || '-',
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: 'Date / Time',
      selector: (row) => row.date || '-',
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: 'Action',
      center: true,
      width: '140px',
      cell: (props) => {
        return (
          <ButtonAction
            setGetData={setGetData}
            setOpenModal={setOpenModal}
            {...props}
          />
        );
      },
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
            data={dataTable}
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
      ) : null}
    </div>
  );
};

export default TableRentalPickup;
