import DataTable from 'react-data-table-component';

import { Button, ButtonAction, Pagination } from '@/components';
import { ErrorFetchingData } from '@/components/Errors';
import { SkeletonTable } from '@/components/Skeleton';
import { customTableStyles } from '@/constants/tableStyle';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';
import { useNavigate } from 'react-router-dom';

const TableList = (props) => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    setCurrentPage,
    limitPerPage,
    currentPage,
  } = props;

  const dataTable = data?.data;
  const metaEventGroup = data?.meta;

  const totalPages = metaEventGroup?.total_page;
  const totalRecords = metaEventGroup?.total_record;

  const navigate = useNavigate();

  const handleAddToCart = () => {
    navigate('/payment-and-cart');
  };

  // Columns Table
  const columns = [
    {
      name: 'Rent Request ID',
      selector: (row) => row.code,
      sortable: true,
      minWidth: '150px',
    },

    {
      name: 'Equipment / Group ID',
      selector: (row) => row.equip || '-',
      sortable: true,
      wrap: true,
      minWidth: '200px',
    },
    {
      name: 'Equipment Name',
      selector: (row) => row.equip_name,
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: 'Pickup Date',
      selector: (row) => row.pickup_date || '-',
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: 'Return Date',
      selector: (row) => row.return_date || '-',
      sortable: true,
      wrap: true,
      minWidth: '160px',
    },
    {
      name: 'Action',
      center: true,
      width: '140px',
      cell: (props) => {
        return (
          <Button
            background="black"
            className="w-32 font-normal"
            // onClick={handleAddToCart}
          >
            Rent
          </Button>
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

export default TableList;
