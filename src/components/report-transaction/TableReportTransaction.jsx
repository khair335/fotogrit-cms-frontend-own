import { useDispatch } from 'react-redux';
import DataTable from 'react-data-table-component';

import { SkeletonTable } from '../Skeleton';
import { Pagination } from '@/components';
import { ErrorFetchingData, NoDataMessage } from '@/components/Errors';
import PriceFilter from './filters/PriceFilter';
import DateFilter from './filters/DateFilter';
import MultiSearchFilter from './filters/MultiSearchFilter';
import { formatDate } from '@/helpers/FormatDate';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';
import {
  useOptionsCompensationMethodQuery,
  useOptionsCompensationQuery,
  useOptionsListClubsQuery,
  useOptionsListEventGroupsQuery,
  useOptionsListEventsQuery,
  useOptionsListServiceTypesQuery,
  useOptionsListTeamsQuery,
  useOptionsListUserFSPQuery,
  useOptionsListUsersQuery,
  useOptionsListUserSSPQuery,
  useOptionsPaymentMethodQuery,
} from '@/services/api/reportApiSlice';
import { setFilterTransactions } from '@/services/state/reportSlice';

export const customTableStyles = {
  table: {
    style: {
      minHeight: '400px',
    },
  },
  rows: {
    style: {
      borderBottom: '1px solid #ccc',
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

const TableReportTransaction = (props) => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    limitPerPage,
    setCurrentPage,
    currentPage,
  } = props;

  const dispatch = useDispatch();

  const dataTable = data?.data;
  const meta = data?.meta;

  const totalPages = meta?.total_page;
  const totalRecords = meta?.total_record;

  const emptyOption = {
    key: '-',
    name: '-',
    label: '-',
  };

  const optionsTransactionType = [
    emptyOption,
    { key: 1, label: 'Media', name: 'media' },
    { key: 2, label: 'Service', name: 'service' },
  ];

  // For Options Users
  const { data: dataAllUsers } = useOptionsListUsersQuery();
  const optionsUserCodes = [
    emptyOption,
    ...(dataAllUsers?.data?.map((item) => ({
      key: item?.id,
      name: item?.code,
      label: item?.code,
    })) || []),
  ];
  const optionsUserNames = [
    emptyOption,
    ...(dataAllUsers?.data?.map((item) => ({
      key: item?.id,
      name: item?.name,
      label: item?.name,
    })) || []),
  ];

  // For Options User FSP
  const { data: dataAllFSP } = useOptionsListUserFSPQuery();
  const optionsFSPCodes = [
    emptyOption,
    ...(dataAllFSP?.data?.map((item) => ({
      key: item?.id,
      name: item?.code,
      label: item?.code,
    })) || []),
  ];
  const optionsFSPNames = [
    emptyOption,
    ...(dataAllFSP?.data?.map((item) => ({
      key: item?.id,
      name: item?.name,
      label: item?.name,
    })) || []),
  ];

  // For Options User SSP
  const { data: dataAllSSP } = useOptionsListUserSSPQuery();
  const optionsSSPCodes = [
    emptyOption,
    ...(dataAllSSP?.data?.map((item) => ({
      key: item?.id,
      name: item?.code,
      label: item?.code,
    })) || []),
  ];
  const optionsSSPNames = [
    emptyOption,
    ...(dataAllSSP?.data?.map((item) => ({
      key: item?.id,
      name: item?.name,
      label: item?.name,
    })) || []),
  ];

  // For Options Teams
  const { data: dataAllTeams } = useOptionsListTeamsQuery();
  const optionsTeamCodes = [
    emptyOption,
    ...(dataAllTeams?.data?.teams?.map((item) => ({
      key: item?.id,
      name: item?.code,
      label: item?.code,
    })) || []),
  ];
  const optionsTeamNames = [
    emptyOption,
    ...(dataAllTeams?.data?.teams?.map((item) => ({
      key: item?.id,
      name: item?.name,
      label: item?.name,
    })) || []),
  ];

  // For Options clubs
  const { data: dataAllClubs } = useOptionsListClubsQuery();
  const optionsClubCodes = [
    emptyOption,
    ...(dataAllClubs?.data?.clubs?.map((item) => ({
      key: item?.id,
      name: item?.code,
      label: item?.code,
    })) || []),
  ];
  const optionsClubNames = [
    emptyOption,
    ...(dataAllClubs?.data?.clubs?.map((item) => ({
      key: item?.id,
      name: item?.name,
      label: item?.name,
    })) || []),
  ];

  // For Options Event Groups
  const { data: dataAllEventGroups } = useOptionsListEventGroupsQuery();
  const optionsEventGroupCodes = [
    emptyOption,
    ...(dataAllEventGroups?.data?.event_groups?.map((item) => ({
      key: item?.id,
      name: item?.code,
      label: item?.code,
    })) || []),
  ];
  const optionsEventGroupNames = [
    emptyOption,
    ...(dataAllEventGroups?.data?.event_groups?.map((item) => ({
      key: item?.id,
      name: item?.name,
      label: item?.name,
    })) || []),
  ];

  // For Options Events
  const { data: dataAllEvents } = useOptionsListEventsQuery();
  const optionsEventCodes = [
    emptyOption,
    ...(dataAllEvents?.data?.events?.map((item) => ({
      key: item?.id,
      name: item?.event_code,
      label: item?.event_code,
    })) || []),
  ];
  const optionsEventNames = [
    emptyOption,
    ...(dataAllEvents?.data?.events?.map((item) => ({
      key: item?.id,
      name: item?.event_name,
      label: item?.event_name,
    })) || []),
  ];

  // For Options Service Types
  const { data: dataAllServiceTypes } = useOptionsListServiceTypesQuery();
  const optionsServiceTypes = [
    emptyOption,
    ...(dataAllServiceTypes?.data?.map((item) => ({
      key: item?.id,
      label: item?.name,
      name: item?.name,
    })) || []),
  ];

  // For Options Compensation
  const { data: dataCompensation } = useOptionsCompensationQuery();
  const optionsCompensation = [
    emptyOption,
    ...(dataCompensation?.data?.map((item) => ({
      key: item?.id,
      name: item?.payment_number,
      label: item?.payment_number,
    })) || []),
  ];

  // For Options Compensation Method
  const { data: dataCompensationMethod } = useOptionsCompensationMethodQuery();
  const optionsCompensationMethod = [
    emptyOption,
    ...(dataCompensationMethod?.data?.map((item) => ({
      key: item?.id,
      name: item?.name,
      label: item?.name,
    })) || []),
  ];

  // For Options Payment Method
  const { data: dataPaymentMethod } = useOptionsPaymentMethodQuery();
  const optionsPaymentMethod = [
    emptyOption,
    ...(dataPaymentMethod?.data?.map((item) => ({
      key: item?.id,
      name: item?.name,
      label: item?.name,
    })) || []),
  ];

  // Columns Table
  const columns = [
    {
      name: (
        <DateFilter
          id="DF-DATE"
          title="Date"
          onDateChange={(data) =>
            dispatch(
              setFilterTransactions({
                filterKey: 'date',
                filterValue: data,
              })
            )
          }
        />
      ),
      selector: (row) => row.date,
      cell: (row) => formatDate(row.date),
      minWidth: '160px',
      wrap: true,
    },
    {
      name: (
        <MultiSearchFilter
          id="MSF-COMPENSATION"
          title="Compensation"
          options={optionsCompensation}
          onFilterChange={(data) =>
            dispatch(
              setFilterTransactions({
                filterKey: 'compensation',
                filterValue: data,
              })
            )
          }
        />
      ),
      selector: (row) => row.compensation,
      cell: (row) => row.compensation || '-',
      minWidth: '180px',
      wrap: true,
    },
    {
      name: (
        <MultiSearchFilter
          id="MSF-TRANSACTION-SERVICE"
          title="Transaction Type (Service)"
          options={optionsTransactionType}
          onFilterChange={(data) =>
            dispatch(
              setFilterTransactions({
                filterKey: 'transactionService',
                filterValue: data,
              })
            )
          }
        />
      ),
      selector: (row) => row.transaction_type_service,
      cell: (row) => row.transaction_type_service || '-',
      minWidth: '180px',
      wrap: true,
    },
    {
      name: (
        <MultiSearchFilter
          id="MSF-TRANSACTION-ORDER"
          title="Transaction (Order)"
          options={optionsTransactionType}
          onFilterChange={(data) =>
            dispatch(
              setFilterTransactions({
                filterKey: 'transactionOrder',
                filterValue: data,
              })
            )
          }
        />
      ),
      selector: (row) => row.transaction_type,
      cell: (row) => row.transaction_type || '-',
      minWidth: '180px',
      wrap: true,
    },
    {
      name: (
        <PriceFilter
          id="PF-AMOUNT"
          title="Amount"
          onFilterChange={(data) =>
            dispatch(
              setFilterTransactions({
                filterKey: 'amount',
                filterValue: data,
              })
            )
          }
        />
      ),
      selector: (row) => row?.amount,
      cell: (row) => CurrencyFormat(row?.amount || 0),
      minWidth: '160px',
      wrap: true,
    },
    {
      name: (
        <MultiSearchFilter
          id="MSF-COMP-PAYMENT-METHOD"
          title="Compensation Payment Method"
          options={optionsCompensationMethod}
          onFilterChange={(data) =>
            dispatch(
              setFilterTransactions({
                filterKey: 'compensationPaymentMethod',
                filterValue: data,
              })
            )
          }
        />
      ),
      selector: (row) => row.compensation_payment_method,
      cell: (row) => row.compensation_payment_method || '-',
      minWidth: '180px',
      wrap: true,
    },
    {
      name: (
        <MultiSearchFilter
          id="MSF-PAYMENT-METHOD"
          title="Payment Method"
          options={optionsPaymentMethod}
          onFilterChange={(data) =>
            dispatch(
              setFilterTransactions({
                filterKey: 'paymentMethod',
                filterValue: data,
              })
            )
          }
        />
      ),
      selector: (row) => row.payment_method,
      cell: (row) => row.payment_method || '-',
      minWidth: '160px',
      wrap: true,
    },
    {
      name: (
        <MultiSearchFilter
          id="MSF-USER-ID"
          title="User ID"
          options={optionsUserCodes}
          onFilterChange={(data) =>
            dispatch(
              setFilterTransactions({
                filterKey: 'userCode',
                filterValue: data,
              })
            )
          }
        />
      ),
      selector: (row) => row.user_code,
      cell: (row) => row.user_code || '-',
      minWidth: '140px',
      wrap: true,
    },
    {
      name: (
        <MultiSearchFilter
          id="MSF-USER-NAME"
          title="User Fullname"
          options={optionsUserNames}
          onFilterChange={(data) =>
            dispatch(
              setFilterTransactions({
                filterKey: 'userName',
                filterValue: data,
              })
            )
          }
        />
      ),
      selector: (row) => row.user_name,
      cell: (row) => row.user_name || '-',
      minWidth: '160px',
      wrap: true,
    },
    {
      name: (
        <MultiSearchFilter
          id="MSF-TEAM-A-ID"
          title="Team A ID"
          options={optionsTeamCodes}
          onFilterChange={(data) =>
            dispatch(
              setFilterTransactions({
                filterKey: 'teamACode',
                filterValue: data,
              })
            )
          }
        />
      ),
      selector: (row) => row.team_a_code,
      cell: (row) => row.team_a_code,
      minWidth: '140px',
      wrap: true,
    },
    {
      name: (
        <MultiSearchFilter
          id="MSF-TEAM-A-NAME"
          title="Team A Name"
          options={optionsTeamNames}
          onFilterChange={(data) =>
            dispatch(
              setFilterTransactions({
                filterKey: 'teamAName',
                filterValue: data,
              })
            )
          }
          // setSearchValue={setSearchValue}
        />
      ),
      selector: (row) => row.team_a_name,
      cell: (row) => row.team_a_name || '-',
      minWidth: '160px',
      wrap: true,
    },
    {
      name: (
        <MultiSearchFilter
          id="MSF-TEAM-B-ID"
          title="Team B ID"
          options={optionsTeamCodes}
          onFilterChange={(data) =>
            dispatch(
              setFilterTransactions({
                filterKey: 'teamBCode',
                filterValue: data,
              })
            )
          }
        />
      ),
      selector: (row) => row.team_b_code,
      cell: (row) => row.team_b_code || '-',
      minWidth: '140px',
      wrap: true,
    },
    {
      name: (
        <MultiSearchFilter
          id="MSF-TEAM-B-NAME"
          title="Team B Name"
          options={optionsTeamNames}
          onFilterChange={(data) =>
            dispatch(
              setFilterTransactions({
                filterKey: 'teamBName',
                filterValue: data,
              })
            )
          }
          // setSearchValue={setSearchValue}
        />
      ),
      selector: (row) => row.team_b_name,
      cell: (row) => row.team_b_name || '-',
      minWidth: '160px',
      wrap: true,
    },
    {
      name: (
        <MultiSearchFilter
          id="MSF-CLUB-A-ID"
          title="Club A ID"
          options={optionsClubCodes}
          onFilterChange={(data) =>
            dispatch(
              setFilterTransactions({
                filterKey: 'clubACode',
                filterValue: data,
              })
            )
          }
        />
      ),
      selector: (row) => row.club_a_code,
      cell: (row) => row.club_a_code || '-',
      minWidth: '140px',
      wrap: true,
    },
    {
      name: (
        <MultiSearchFilter
          id="MSF-CLUB-A-NAME"
          title="Club A Name"
          options={optionsClubNames}
          onFilterChange={(data) =>
            dispatch(
              setFilterTransactions({
                filterKey: 'clubAName',
                filterValue: data,
              })
            )
          }
        />
      ),
      selector: (row) => row.club_a_name,
      cell: (row) => row.club_a_name || '-',
      minWidth: '160px',
      wrap: true,
    },
    {
      name: (
        <MultiSearchFilter
          id="MSF-CLUB-B-ID"
          title="Club B ID"
          options={optionsClubCodes}
          onFilterChange={(data) =>
            dispatch(
              setFilterTransactions({
                filterKey: 'clubBCode',
                filterValue: data,
              })
            )
          }
        />
      ),
      selector: (row) => row.club_b_code,
      cell: (row) => row?.club_b_code || '-',
      minWidth: '140px',
      wrap: true,
    },
    {
      name: (
        <MultiSearchFilter
          id="MSF-CLUB-B-NAME"
          title="Club B Name"
          options={optionsClubNames}
          onFilterChange={(data) =>
            dispatch(
              setFilterTransactions({
                filterKey: 'clubBName',
                filterValue: data,
              })
            )
          }
        />
      ),
      selector: (row) => row.club_b_name,
      cell: (row) => row.club_b_name || '-',
      minWidth: '160px',
      wrap: true,
    },
    {
      name: (
        <MultiSearchFilter
          id="MSF-EVENT-GROUP-ID"
          title="Event Group ID"
          options={optionsEventGroupCodes}
          onFilterChange={(data) =>
            dispatch(
              setFilterTransactions({
                filterKey: 'eventGroupCode',
                filterValue: data,
              })
            )
          }
        />
      ),
      selector: (row) => row.event_group_code || '-',
      minWidth: '140px',
      wrap: true,
    },
    {
      name: (
        <MultiSearchFilter
          id="MSF-EVENT-GROUP-NAME"
          title="Event Group Name"
          options={optionsEventGroupNames}
          onFilterChange={(data) =>
            dispatch(
              setFilterTransactions({
                filterKey: 'eventGroupName',
                filterValue: data,
              })
            )
          }
        />
      ),
      selector: (row) => row.event_group_name || '-',
      minWidth: '160px',
      wrap: true,
    },
    {
      name: (
        <MultiSearchFilter
          id="MSF-EVENT-ID"
          title="Event ID"
          options={optionsEventCodes}
          onFilterChange={(data) =>
            dispatch(
              setFilterTransactions({
                filterKey: 'eventCode',
                filterValue: data,
              })
            )
          }
        />
      ),
      selector: (row) => row.event_code || '-',
      minWidth: '140px',
      wrap: true,
    },
    {
      name: (
        <MultiSearchFilter
          id="MSF-EVENT-NAME"
          title="Event Name"
          options={optionsEventNames}
          onFilterChange={(data) =>
            dispatch(
              setFilterTransactions({
                filterKey: 'eventName',
                filterValue: data,
              })
            )
          }
        />
      ),
      selector: (row) => row.event_name || '-',
      minWidth: '160px',
      wrap: true,
    },
    {
      name: (
        <MultiSearchFilter
          id="MSF-SERVICE-TYPE"
          title="Service Type"
          options={optionsServiceTypes}
          onFilterChange={(data) =>
            dispatch(
              setFilterTransactions({
                filterKey: 'serviceType',
                filterValue: data,
              })
            )
          }
        />
      ),
      selector: (row) => row.service_type || '-',
      minWidth: '160px',
      wrap: true,
    },
    {
      name: (
        <MultiSearchFilter
          id="MSF-FSP-ID"
          title="FSP ID"
          options={optionsFSPCodes}
          onFilterChange={(data) =>
            dispatch(
              setFilterTransactions({
                filterKey: 'fspCode',
                filterValue: data,
              })
            )
          }
        />
      ),
      selector: (row) => row.fsp_code || '-',
      minWidth: '140px',
      wrap: true,
    },
    {
      name: (
        <MultiSearchFilter
          id="MSF-FSP-NAME"
          title="FSP Name"
          options={optionsFSPNames}
          onFilterChange={(data) =>
            dispatch(
              setFilterTransactions({
                filterKey: 'fspName',
                filterValue: data,
              })
            )
          }
        />
      ),
      selector: (row) => row.fsp_name || '-',
      minWidth: '160px',
      wrap: true,
    },
    {
      name: (
        <PriceFilter
          id="PF-FSP-INCOME-SHARE"
          title="FSP Income Share"
          onFilterChange={(data) =>
            dispatch(
              setFilterTransactions({
                filterKey: 'fspIncomeShare',
                filterValue: data,
              })
            )
          }
        />
      ),
      selector: (row) => row.fsp_share,
      cell: (row) => CurrencyFormat(row.fsp_share || 0),
      minWidth: '160px',
      wrap: true,
    },
    {
      name: (
        <MultiSearchFilter
          id="MSF-SSP-ID"
          title="SSP ID"
          options={optionsSSPCodes}
          onFilterChange={(data) =>
            dispatch(
              setFilterTransactions({
                filterKey: 'sspCode',
                filterValue: data,
              })
            )
          }
        />
      ),
      selector: (row) => row.ssp_code || '-',
      minWidth: '140px',
      wrap: true,
    },
    {
      name: (
        <MultiSearchFilter
          id="MSF-SSP-NAME"
          title="SSP Name"
          options={optionsSSPNames}
          onFilterChange={(data) =>
            dispatch(
              setFilterTransactions({
                filterKey: 'sspName',
                filterValue: data,
              })
            )
          }
        />
      ),
      selector: (row) => row.ssp_name || '-',
      minWidth: '160px',
      wrap: true,
    },
    {
      name: (
        <PriceFilter
          id="PF-SSP-INCOME-SHARE"
          title="SSP Income Share"
          onFilterChange={(data) =>
            dispatch(
              setFilterTransactions({
                filterKey: 'sspIncomeShare',
                filterValue: data,
              })
            )
          }
        />
      ),
      selector: (row) => row.ssp_share,
      cell: (row) => CurrencyFormat(row.ssp_share || 0),
      minWidth: '180px',
      wrap: true,
    },
  ];

  return (
    <div>
      {isError ? (
        <ErrorFetchingData error={error} />
      ) : isLoading ? (
        <SkeletonTable />
      ) : isSuccess ? (
        <div className="border-t border-gray-200 report_transaction">
          <DataTable
            columns={columns}
            data={dataTable}
            fixedHeader
            fixedHeaderScrollHeight="63vh"
            customStyles={customTableStyles}
            persistTableHead
            noDataComponent={
              <NoDataMessage title="Report Transaction" col={4} />
            }
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

export default TableReportTransaction;
