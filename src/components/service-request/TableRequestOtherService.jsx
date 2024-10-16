import DataTable from 'react-data-table-component';

import { ButtonAction } from '@/components';
import { SkeletonTable } from '../Skeleton';
import { customTableStyles } from '@/constants/tableStyle';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';
import { ErrorFetchingData, NoDataMessage } from '@/components/Errors';
import { CapitalizeFirstLetter } from '@/helpers/CapitalizeFirstLetter';
import useFetchScoringData from '@/hooks/useFetchScoringData';
import { statusColorCheck, statusWorkCheck } from '@/helpers/StatusWorkCheck';

const TableRequestOtherService = (props) => {
  const {
    data,
    searchValue,
    isLoading,
    isSuccess,
    isError,
    error,
    setOpenModal,
    setGetData,
    isClient,
    isAdmin,
    userID,
  } = props;

  const allData = useFetchScoringData(data?.data);

  const dataTable = allData;

  const filteredItems = searchValue
    ? dataTable?.filter((item) => {
        const statusToMatch =
          item?.photographer_ssp_id === item?.photographer_fsp_id
            ? item?.status_work_fsp
            : item?.status_work_ssp;

        const totalFeeToMatch =
          item?.photographer_ssp_id === item?.photographer_fsp_id
            ? item?.total_fee_order
            : item?.total_fee;

        return (
          (item.created_by_code &&
            item.created_by_name &&
            `${item.created_by_code} - ${item.created_by_name}`
              .toLowerCase()
              .includes(searchValue.toLowerCase())) ||
          (item.photographer_fsp_code &&
            item.photographer_fsp_name &&
            `${item.photographer_fsp_code} - ${item.photographer_fsp_name}`
              .toLowerCase()
              .includes(searchValue.toLowerCase())) ||
          (item.photographer_ssp_code &&
            item.photographer_ssp_name &&
            `${item.photographer_ssp_code} - ${item.photographer_ssp_name}`
              .toLowerCase()
              .includes(searchValue.toLowerCase())) ||
          (item.event_name &&
            item.event_name
              .toLowerCase()
              .includes(searchValue.toLowerCase())) ||
          (item.event_group_name &&
            item.event_group_name
              .toLowerCase()
              .includes(searchValue.toLowerCase())) ||
          (statusToMatch &&
            statusToMatch.toLowerCase().includes(searchValue.toLowerCase())) ||
          totalFeeToMatch === parseInt(searchValue) ||
          (item.compensation &&
            item.compensation
              .toLowerCase()
              .includes(searchValue.toLowerCase())) ||
          (item.request_type &&
            item.request_type.toUpperCase().includes(searchValue.toUpperCase()))
        );
      })
    : dataTable;

  // Columns Table
  const columns = [
    {
      name: <span>Initial Request</span>,
      selector: (row) => row.created_by_code,
      cell: (row) =>
        `${row.created_by_code} ${
          row.created_by_name && `- ${row.created_by_name}`
        }`,
      sortable: true,
      wrap: true,
      minWidth: '130px',
    },
    {
      name: <span>First Service Provider</span>,
      selector: (row) => row.photographer_fsp_code,
      cell: (row) =>
        `${row.photographer_fsp_code} ${
          row.photographer_fsp_name && `- ${row.photographer_fsp_name}`
        }`,
      sortable: true,
      wrap: true,
      minWidth: '160px',
    },
    {
      name: <span>Second Service Provider</span>,
      selector: (row) => row.photographer_ssp_code,
      cell: (row) =>
        `${row.photographer_ssp_code} ${
          row.photographer_ssp_name && `- ${row.photographer_ssp_name}`
        }`,
      sortable: true,
      minWidth: '160px',
      omit: isClient,
    },
    {
      name: 'Event Group',
      selector: (row) => row.event_group_name,
      sortable: true,
      wrap: true,
      minWidth: '170px',
    },
    {
      name: 'Event Name',
      selector: (row) => row.event_name,
      sortable: true,
      wrap: true,
      minWidth: '170px',
    },
    {
      name: <span>Request Type</span>,
      selector: (row) => row.request_type,
      sortable: true,
      wrap: true,
      minWidth: '130px',
    },
    {
      name: 'Work Status',
      selector: (row) =>
        isClient ? row?.status_tracking : row.status_work_fsp,
      sortable: true,
      cell: (row) => {
        const status = statusWorkCheck(row, isClient, isAdmin, userID);

        const statusColor = statusColorCheck(status);

        return (
          <span className={`${statusColor} font-medium`}>
            {CapitalizeFirstLetter(status)}
          </span>
        );
      },
      minWidth: '160px',
    },
    {
      name: <span>Payment Period</span>,
      selector: (row) => row.payment_period,
      cell: (row) => {
        return (
          <span className="capitalize">
            {row?.photographer_ssp_code === row?.photographer_fsp_code
              ? row?.payment_period_fsp || '-'
              : row?.payment_period_ssp || '-'}
          </span>
        );
      },
      sortable: true,
      minWidth: '160px',
    },
    {
      name: <span>Contract ID</span>,
      selector: (row) => row.contract_id,
      sortable: true,
      minWidth: '140px',
      cell: (row) => {
        return (
          <span>
            {row?.photographer_ssp_code === row?.photographer_fsp_code
              ? row?.contract_id || '-'
              : row?.subcontract_id || '-'}
          </span>
        );
      },
    },
    {
      name: <span>Remaining Assignment</span>,
      selector: (row) => row.remaining_assign_fsp,
      sortable: true,
      minWidth: '140px',
      cell: (row) => {
        return (
          <span>
            {row?.photographer_ssp_code === row?.photographer_fsp_code
              ? row?.remaining_assign_fsp
              : row?.remaining_assign_ssp}
          </span>
        );
      },
    },
    {
      name: 'Total Fees',
      selector: (row) => row.total_fee_ssp,
      sortable: true,
      cell: (row) => {
        return (
          <span>
            {isClient ||
            row?.photographer_ssp_code === row?.photographer_fsp_code
              ? CurrencyFormat(row.total_fee_fsp)
              : CurrencyFormat(row.total_fee_ssp)}
          </span>
        );
      },
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

  const uniqueKey = (row, index) => `${row.id}_${index}`;

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
            keyField={uniqueKey}
            persistTableHead
            noDataComponent={<NoDataMessage title="Request Service" />}
          />
        </div>
      ) : null}
    </div>
  );
};

export default TableRequestOtherService;
