import DataTable from 'react-data-table-component';

import { SkeletonTable } from '../Skeleton';
import { ButtonAction, Pagination } from '@/components';

import { customTableStyles } from '@/constants/tableStyle';
import { ErrorFetchingData } from '@/components/Errors';

const TableWithdrawWallet = (props) => {
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
      name: 'Date / Time',
      selector: (row) => row.date || '-',
      sortable: true,
      minWidth: '140px',
      wrap: true,
    },
    {
      name: <span>Photograpehr ID - Name & Bank Info</span>,
      selector: (row) => row.code_name_bank || '-',
      sortable: true,
      minWidth: '100px',
      wrap: true,
    },
    {
      name: 'Amount',
      selector: (row) => row.amount || '-',
      sortable: true,
      minWidth: '140px',
      wrap: true,
    },
    {
      name: 'Reduce from Wallet',
      selector: (row) => row.reduce_wallet || '-',
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: 'Status',
      selector: (row) => row.status || '-',
      sortable: true,
      minWidth: '150px',
      wrap: true,
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

export default TableWithdrawWallet;
