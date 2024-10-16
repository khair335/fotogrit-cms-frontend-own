import DataTable from 'react-data-table-component';

import { ErrorFetchingData } from '@/components/Errors';
import { SkeletonTable } from '@/components/Skeleton';
import { ButtonAction, Pagination } from '@/components';

import { CurrencyFormat } from '@/helpers/CurrencyFormat';
import { customTableStyles } from '@/constants/tableStyle';

const TableUserBenefitsCode = (props) => {
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

  const walletAmount = data?.data;
  const meta = data?.meta;

  const totalPages = meta?.total_page;
  const totalRecords = meta?.total_record;

  const columns = [
    {
      name: 'Benefits ID',
      selector: (row) => row.benefits_id || '-',
      sortable: true,
      minWidth: '120px',
    },
    {
      name: 'Benefits Name',
      selector: (row) => row.name || '-',
      sortable: true,
      minWidth: '120px',
    },
    {
      name: 'List of Benefits',
      selector: (row) => row.name || '-',
      sortable: true,
      minWidth: '180px',
    },
    {
      name: 'User ID under Benefits',
      selector: (row) => row.name || '-',
      sortable: true,
      minWidth: '180px',
    },
    {
      name: 'Status of Benefits',
      selector: (row) => row.status_benefits,
      sortable: true,
      minWidth: '160px',
      cell: (row) => row.status_benefits || '-',
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
        <div className="border-t border-gray-200">
          <DataTable
            columns={columns}
            data={walletAmount}
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

export default TableUserBenefitsCode;
