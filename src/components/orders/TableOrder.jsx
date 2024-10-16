import DataTable from 'react-data-table-component';

import { SkeletonTable } from '../Skeleton';
import { ButtonAction } from '@/components';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';
import { customTableStyles } from '@/constants/tableStyle';
import { ErrorFetchingData, NoDataMessage } from '@/components/Errors';

const TableOrder = (props) => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    setOpenModal,
    setGetData,
  } = props;

  // Columns Table
  const columns = [
    {
      name: 'Order Code',
      selector: (row) => row.invoice,
      sortable: true,
      minWidth: '150px',
    },
    {
      name: 'Customer Name',
      selector: (row) => row.customer_name,
      cell: (row) => <span className="capitalize">{row.customer_name}</span>,
      sortable: true,
      minWidth: '180px',
    },
    {
      name: 'Total Item',
      selector: (row) => row.total_item,
      sortable: true,
      width: '120px',
    },
    {
      name: 'Total Payment',
      selector: (row) => row.total_payment,
      cell: (row) => CurrencyFormat(row.total_payment),
      sortable: true,
      width: '150px',
    },
    {
      name: 'Date Purchase',
      selector: (row) => row.date_purchase,
      cell: (row) => (row.date_purchase === '' ? '....' : row.date_purchase),
      sortable: true,
      minWidth: '150px',
    },
    {
      name: 'Purchase Type',
      selector: (row) => row.purchase_type,
      cell: (row) => <span className="capitalize">{row.purchase_type}</span>,
      sortable: true,
      minWidth: '160px',
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      cell: (row) => (
        <span
          className={`${
            row.status === 'waiting'
              ? 'text-purple-600'
              : row.status === 'complete'
              ? 'text-ftgreen-600'
              : 'text-red-600'
          } capitalize font-bold`}
        >
          {row.status}
        </span>
      ),
      sortable: true,
      minWidth: '120px',
    },
    {
      name: 'Action',
      center: true,
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
            data={data}
            fixedHeader
            fixedHeaderScrollHeight="54vh"
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[5, 10, 20]}
            customStyles={customTableStyles}
            persistTableHead
            noDataComponent={<NoDataMessage title="Orders" />}
          />
        </div>
      ) : null}
    </div>
  );
};

export default TableOrder;
