import { SkeletonTable } from '../Skeleton';
import DataTable from 'react-data-table-component';
import { formatDate } from '@/helpers/FormatDate';
import { ErrorFetchingData, NoDataMessage } from '@/components/Errors';
import useFetchScoringData from '@/hooks/useFetchScoringData';
import { CapitalizeFirstLetter } from '@/helpers/CapitalizeFirstLetter';
import { statusColorCheck } from '@/helpers/StatusWorkCheck';

const TableSubcontract = (props) => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    setSelectedRows,
    selectedRows,
    searchValue,
  } = props;

  const allData = useFetchScoringData(data?.data);
  const dataTable = allData;

  const handleChange = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };

  const filteredItems = searchValue
    ? dataTable?.filter((item) => {
        const statusToMatch =
          item?.photographer_id === item?.photographer_company_id
            ? item?.status_work
            : item?.status_work_photographer;

        return (
          (item.date &&
            formatDate(item.date)
              .toLowerCase()
              .includes(searchValue.toLowerCase())) ||
          (item.time_start &&
            item.time_finish &&
            `${formatDate(item.date)} | ${item.time_start} - ${
              item.time_finish
            }`
              .toLowerCase()
              .includes(searchValue.toLowerCase())) ||
          (item.date &&
            item.time_start &&
            item.time_finish &&
            `${item.time_start} - ${item.time_finish}`
              .toLowerCase()
              .includes(searchValue.toLowerCase())) ||
          (item.event_group_name &&
            item.event_group_name
              .toLowerCase()
              .includes(searchValue.toLowerCase())) ||
          (item.is_private &&
            item.is_private
              .toLowerCase()
              .includes(searchValue.toLowerCase())) ||
          (item.event_name &&
            item.event_name
              .toLowerCase()
              .includes(searchValue.toLowerCase())) ||
          (item.request_type &&
            item.request_type
              .toUpperCase()
              .includes(searchValue.toUpperCase())) ||
          (item.service_type &&
            item.service_name &&
            `${item.service_type} - ${item.service_name}`
              .toLowerCase()
              .includes(searchValue.toLowerCase())) ||
          (item.location &&
            item.location.toUpperCase().includes(searchValue.toUpperCase())) ||
          (statusToMatch &&
            statusToMatch.toLowerCase().includes(searchValue.toLowerCase()))
        );
      })
    : dataTable;

  // Columns Table
  const columns = [
    {
      name: 'Date Time',
      selector: (row) => row.date,
      cell: (row) => (
        <span>{`${formatDate(row.date)} | ${row.time_start} - ${
          row.time_finish
        }`}</span>
      ),
      sortable: true,
      minWidth: '160px',
    },
    {
      name: 'Event Group',
      selector: (row) => row.event_group_name,
      sortable: true,
      wrap: true,
      minWidth: '160px',
    },
    {
      name: 'Event Type',
      selector: (row) => row.is_private,
      cell: (row) => (row.is_private === 'true' ? 'Private' : 'Public'),
      sortable: true,
      minWidth: '130px',
    },
    {
      name: 'Event Name',
      selector: (row) => row.event_name,
      sortable: true,
      wrap: true,
      minWidth: '160px',
    },
    {
      name: <span>Request Type</span>,
      selector: (row) => row.request_type,
      sortable: true,
      wrap: true,
      minWidth: '130px',
    },
    {
      name: 'Service Type',
      selector: (row) => row.service_type,
      cell: (row) => `${row.service_type} - ${row.service_name}`,
      sortable: true,
      minWidth: '160px',
    },
    {
      name: 'Payment Period',
      selector: (row) => row.payment_period,
      cell: (row) => row.payment_period || '-',
      sortable: true,
      minWidth: '160px',
    },
    {
      name: 'Contract ID',
      selector: (row) => row.contract_id,
      cell: (row) => row.contract_id || '-',
      sortable: true,
      minWidth: '160px',
    },
    {
      name: 'Location',
      selector: (row) => row.location || 'S-',
      sortable: true,
      wrap: true,
      minWidth: '160px',
    },
    {
      name: 'Work Status',
      selector: (row) => row.status_work_fsp,
      sortable: true,
      cell: (row) => {
        let status;
        if (row?.photographer_ssp_code === row?.photographer_fsp_code) {
          if (row?.status_work_fsp === 'decline') {
            status = row?.status_work_fsp;
          } else if (row?.service_type === 'scoring') {
            if (row?.status_work_fsp === 'assigned') {
              status = row?.status_work_fsp;
            } else {
              status =
                row?.status_work_scoring === 'NoScoreInfo'
                  ? 'Waiting for event'
                  : row?.status_work_scoring || '-';
            }
          } else {
            status = row?.status_work_fsp;
          }
        } else {
          if (row?.status_work_ssp === 'decline') {
            status = row?.status_work_ssp;
          } else if (row?.service_type === 'scoring') {
            if (row?.status_work_fsp === 'assigned') {
              status = row?.status_work_fsp;
            } else {
              status =
                row?.status_work_scoring === 'NoScoreInfo'
                  ? row?.status_work_fsp
                  : row?.status_work_scoring || '-';
            }
          } else {
            status = row?.status_work_ssp;
          }
        }

        const statusColor = statusColorCheck(status);

        return (
          <span className={`${statusColor} font-medium`}>
            {CapitalizeFirstLetter(status)}
          </span>
        );
      },
      minWidth: '160px',
    },
  ];

  const customStyles = {
    headRow: {
      style: {
        border: 'none',
      },
    },
    rows: {
      style: {
        '&:not(:last-of-type)': {
          border: 'none',
        },
      },
    },
    headCells: {
      style: {
        fontWeight: 800,
        fontSize: '14px',
      },
    },
    cells: {
      style: {
        fontSize: '12px',
      },
    },
  };

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
            fixedHeaderScrollHeight="34vh"
            customStyles={customStyles}
            selectableRows
            onSelectedRowsChange={handleChange}
            selectedRows={[selectedRows]}
            pagination
            paginationComponentOptions={customPaginationOptions}
            persistTableHead
            noDataComponent={<NoDataMessage title="SMS" />}
          />
        </div>
      ) : null}
    </div>
  );
};

export default TableSubcontract;
