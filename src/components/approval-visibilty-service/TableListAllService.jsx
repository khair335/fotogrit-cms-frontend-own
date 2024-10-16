import React from 'react';
import DataTable from 'react-data-table-component';

import { ErrorFetchingData, NoDataMessage } from '@/components/Errors';
import { SkeletonTable } from '@/components/Skeleton';
import { ButtonAction, Pagination } from '@/components';

import { customTableStyles } from '@/constants/tableStyle';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';

const TableListAllService = (props) => {
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

  const referralCode = data?.data;
  const meta = data?.meta;

  const totalPages = meta?.total_page;
  const totalRecords = meta?.total_record;

  const columns = [
    {
      name: 'Service ID',
      selector: (row) => row.code || '-',
      sortable: true,
      wrap: true,
      minWidth: '120px',
    },
    {
      name: 'User ID',
      selector: (row) => row.created_by_code,
      cell: (row) =>
        `${row.created_by_code} - ${row.created_by_name || 'noname'}`,
      sortable: true,
      wrap: true,
      minWidth: '140px',
    },
    {
      name: 'Service Name',
      selector: (row) => row.name || '-',
      sortable: true,
      wrap: true,
      minWidth: '160px',
    },
    {
      name: 'Service Type',
      selector: (row) => row.service_type || '-',
      sortable: true,
      wrap: true,
      minWidth: '140px',
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
      sortable: true,
      wrap: true,
      minWidth: '190px',
    },
    {
      name: 'Rating',
      selector: (row) => row.rating || '-',
      sortable: true,
      wrap: true,
      width: '120px',
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
            data={referralCode}
            fixedHeader
            fixedHeaderScrollHeight="34vh"
            customStyles={customTableStyles}
            persistTableHead
            noDataComponent={<NoDataMessage title="All Service" />}
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

export default TableListAllService;
