import DataTable from 'react-data-table-component';

import { ButtonAction } from '@/components';
import { SkeletonTable } from '../Skeleton';
import { customTableStyles } from '@/constants/tableStyle';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';
import { ErrorFetchingData, NoDataMessage } from '@/components/Errors';

const TableMyContract = (props) => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    setOpenModal,
    setGetData,
    searchMyContract,
  } = props;

  const dataTable = data?.data;

  const filteredItems = searchMyContract
    ? dataTable?.filter((item) => {
        return (
          (item?.contract_id &&
            item?.contract_id
              .toLowerCase()
              .includes(searchMyContract.toLowerCase())) ||
          (item?.service_name &&
            item?.service_name
              ?.toLowerCase()
              .includes(searchMyContract.toLowerCase())) ||
          (item?.contract_type &&
            item?.contract_type
              .toLowerCase()
              .includes(searchMyContract.toLowerCase())) ||
          (item?.photographer_fsp_name &&
            item?.photographer_fsp_name
              ?.toLowerCase()
              .includes(searchMyContract.toLowerCase())) ||
          (item?.service_sales_model &&
            item?.service_sales_model
              ?.toLowerCase()
              .includes(searchMyContract.toLowerCase())) ||
          (item?.service_percent_share &&
            `${item?.service_percent_share}%`
              ?.toString()
              .includes(searchMyContract?.toLowerCase())) ||
          (item?.total_fee &&
            `Rp ${item?.total_fee}`
              ?.toString()
              ?.toLowerCase()
              .includes(searchMyContract?.toLowerCase()))
        );
      })
    : dataTable;

  // Columns Table
  const columns = [
    {
      name: 'Contract ID',
      selector: (row) => row.contract_id,
      sortable: true,
      minWidth: '130px',
    },
    {
      name: 'Name of Service',
      selector: (row) => row.service_name || '-',
      sortable: true,
      wrap: true,
      minWidth: '180px',
    },
    {
      name: 'Payment Period',
      selector: (row) => row.contract_type || '-',
      sortable: true,
      wrap: true,
      minWidth: '160px',
    },
    {
      name: 'Service Provider',
      selector: (row) => row.photographer_fsp_name || '-',
      sortable: true,
      minWidth: '190px',
      wrap: true,
    },
    {
      name: 'Sales Model',
      selector: (row) => row.service_sales_model || '-',
      sortable: true,
      minWidth: '150px',
      wrap: true,
    },
    {
      name: 'Fixed Fee',
      selector: (row) => row.total_fee,
      cell: (row) => {
        const periodActive = row?.periods?.find(
          (item) => item._is_active === 1
        );

        return CurrencyFormat(periodActive?.total_fee || 0);
      },
      sortable: true,
      minWidth: '100px',
      wrap: true,
    },
    {
      name: '% of Sharing',
      selector: (row) => row.service_percent_share,
      cell: (row) => `${row.service_percent_share || 0}%`,
      sortable: true,
      minWidth: '140px',
      wrap: true,
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

  const customPaginationOptions = {
    noRowsPerPage: true,
  };

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
            data={filteredItems}
            fixedHeader
            fixedHeaderScrollHeight="50vh"
            customStyles={customTableStyles}
            pagination
            paginationComponentOptions={customPaginationOptions}
            persistTableHead
            noDataComponent={<NoDataMessage title="My Contracts" />}
          />
        </div>
      ) : null}
    </div>
  );
};

export default TableMyContract;
