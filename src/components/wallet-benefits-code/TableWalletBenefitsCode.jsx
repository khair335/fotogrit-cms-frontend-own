import DataTable from 'react-data-table-component';

import { ErrorFetchingData, NoDataMessage } from '@/components/Errors';
import { SkeletonTable } from '@/components/Skeleton';
import { ButtonAction, Pagination } from '@/components';

import { CurrencyFormat } from '@/helpers/CurrencyFormat';
import { customTableStyles } from '@/constants/tableStyle';

const TableWalletBenefitsCode = (props) => {
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
      name: 'Name of Code',
      selector: (row) => row.code,
      sortable: true,
      minWidth: '120px',
    },
    {
      name: 'Wallet Amount',
      selector: (row) => row.amount,
      cell: (row) => CurrencyFormat(row.amount),
      sortable: true,
      minWidth: '160px',
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
      minWidth: '160px',
      cell: (row) => row.status,
      conditionalCellStyles: [
        {
          when: (row) => row.status === 'active',
          style: {
            color: '#03E079',
            textTransform: 'capitalize',
          },
        },
        {
          when: (row) => row.status === 'not active',
          style: {
            color: 'red',
            textTransform: 'capitalize',
          },
        },
        {
          when: (row) => row.status === 'waiting for approval',
          style: {
            color: '#7209b7',
            textTransform: 'capitalize',
          },
        },
      ],
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
            fixedHeaderScrollHeight="54vh"
            customStyles={customTableStyles}
            persistTableHead
            noDataComponent={<NoDataMessage title="Wallet Benefits Code" />}
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

export default TableWalletBenefitsCode;
