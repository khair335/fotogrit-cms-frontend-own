import DataTable from 'react-data-table-component';

import { ButtonAction, Pagination } from '@/components';
import { SkeletonTable } from '../Skeleton';
import { customTableStyles } from '@/constants/tableStyle';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';
import { ErrorFetchingData } from '@/components/Errors';

const TableAddModifyMyService = (props) => {
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

  const dataTable = data?.data;
  const meta = data?.meta;

  const totalPages = meta?.total_page;
  const totalRecords = meta?.total_record;

  // Columns Table
  const columns = [
    {
      name: 'Service ID',
      selector: (row) => row.code || '-',
      sortable: true,
      minWidth: '120px',
    },
    {
      name: 'Service Name',
      selector: (row) => row.name || '-',
      sortable: true,
      wrap: true,
      minWidth: '150px',
    },
    {
      name: 'Service Type',
      selector: (row) => row.service_type || '-',
      sortable: true,
      wrap: true,
      minWidth: '150px',
    },
    {
      name: 'Payment Period',
      selector: (row) => row.payment_period || '-',
      sortable: true,
      wrap: true,
      minWidth: '190px',
    },
    {
      name: 'Sales Model',
      selector: (row) => row.sales_model || '-',
      sortable: true,
      minWidth: '150px',
      wrap: true,
    },
    {
      name: 'Service Fees',
      selector: (row) => row.basic_fixed_fee || '-',
      cell: (row) => (
        <>
          <div className="flex flex-col py-1">
            {row.basic_fixed_fee !== 0 && (
              <span>Fixed Fee: {CurrencyFormat(row.basic_fixed_fee)}</span>
            )}
            {row.percent_to_shared !== 0 && (
              <span>% Paid to Other User: {row.percent_to_shared}%</span>
            )}
            {row.photo_price !== 0 && (
              <span>Photo Price: {CurrencyFormat(row.photo_price)}</span>
            )}
            {row.video_price !== 0 && (
              <span>Video Price: {CurrencyFormat(row.video_price)}</span>
            )}
            {row.score_price !== 0 && (
              <span>Score Price: {CurrencyFormat(row.score_price)}</span>
            )}
            {row.stream_price !== 0 && (
              <span>Stream Price: {CurrencyFormat(row.stream_price)}</span>
            )}

            {row?.variable_fees?.length === 0 ||
              (row?.variable_fees[0]?.amount !== 0 && (
                <>
                  <span className="text-gray-400">Variable Fees</span>
                  {row?.variable_fees?.map((item, i) => {
                    let unit;
                    const price = item?.fee_unit;

                    unit = `${item?.min_unit}-${item?.max_unit}`;

                    return (
                      <span key={`fixed-fee-${i}`} className="font-medium">
                        {`${unit} unit : ${CurrencyFormat(price)}`}
                      </span>
                    );
                  })}
                </>
              ))}
          </div>
        </>
      ),
      wrap: true,
      minWidth: '210px',
    },
    {
      name: 'Visibilty',
      selector: (row) => row.visibility || '-',
      cell: (row) => (
        <>
          {row.visibility.length !== 0 ? (
            <span
              className={`font-medium capitalize ${
                row.visibility[0] === 'waiting for admin to decide'
                  ? 'text-ftbrown'
                  : 'text-black'
              }`}
            >
              {row.visibility}
            </span>
          ) : (
            <ul className={`font-medium capitalize`}>
              {row.users.map((user, i) => (
                <li key={`user-${user.id ? user.id : i}`}>
                  {user.name || 'noname'}
                </li>
              ))}
            </ul>
          )}
        </>
      ),
      sortable: true,
      minWidth: '140px',
      wrap: true,
    },
    {
      name: 'Status',
      selector: (row) => row.status_approval || '-',
      cell: (row) => (
        <span
          className={`font-medium capitalize ${
            row.status_approval === 'approved'
              ? 'text-ftgreen-600'
              : row.status_approval === 'waiting for approval'
              ? 'text-ftbrown'
              : 'text-red-600'
          }`}
        >
          {row.status_approval}
        </span>
      ),
      sortable: true,
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
        <div className="border-t border-gray-200 ">
          <DataTable
            columns={columns}
            data={dataTable}
            fixedHeader
            fixedHeaderScrollHeight="50vh"
            customStyles={customTableStyles}
            keyField="key"
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

export default TableAddModifyMyService;
