import { useState } from 'react';
import DataTable from 'react-data-table-component';

import { SkeletonTable } from '../Skeleton';
import { Pagination, PopUp, Tooltip } from '@/components';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';
import { customTableStyles } from '@/constants/tableStyle';
import { ErrorFetchingData, NoDataMessage } from '@/components/Errors';
import { formatDate } from '@/helpers/FormatDate';
import { FaCircleInfo } from 'react-icons/fa6';

const TableServiceTransaction = (props) => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    currentPage,
    setCurrentPage,
    limitPerPage,
  } = props;

  const [transactionDetail, setTransactionDetail] = useState({});
  const [openPopUpDescription, setOpenPopUpDescription] = useState(false);

  const dataTable = data?.data;
  const meta = data?.meta;

  const totalPages = meta?.total_page;
  const totalRecords = meta?.total_record;

  const handleClickPopUpDescription = (data) => {
    setTransactionDetail(data);
    setOpenPopUpDescription(true);
  };

  // Columns Table
  const columns = [
    {
      name: 'Payment Number',
      selector: (row) => row.payment_number,
      cell: (row) => (
        <div className="w-full h-full py-[14px] flex items-start justify-between">
          <p className="w-[80%]">{row.payment_number || '-'}</p>
          {row.description && (
            <div className="">
              <Tooltip text="Description" position="top">
                <FaCircleInfo
                  className="cursor-pointer text-lg text-cyan-500 hover:text-cyan-700 transition-all duration-300"
                  onClick={() => handleClickPopUpDescription(row)}
                />
              </Tooltip>
            </div>
          )}
        </div>
      ),
      sortable: true,
      width: '190px',
    },
    {
      name: 'User ID',
      selector: (row) => row.destination,
      cell: (row) => row.destination || '-',
      sortable: true,
      width: '140px',
    },
    {
      name: 'Payment Type',
      selector: (row) => row.payment_type,
      cell: (row) => row.payment_type || '-',
      sortable: true,
      minWidth: '200px',
    },
    {
      name: 'Due Date',
      selector: (row) => row.due_date,
      cell: (row) =>
        row.due_date !== '0001-01-01T00:00:00Z'
          ? formatDate(row.due_date)
          : '-',
      sortable: true,
      minWidth: '140px',
    },
    {
      name: 'Amount',
      selector: (row) => row.amount,
      cell: (row) => CurrencyFormat(row?.amount || 0),
      sortable: true,
      minWidth: '140px',
    },
    {
      name: 'Status',
      selector: (row) => row.is_paid,
      cell: (row) =>
        row.is_paid === 0 ? (
          <span className="bg-red-600 py-1 px-3 rounded-full text-white font-medium">
            unpaid
          </span>
        ) : row.is_paid === 1 ? (
          <span className="bg-green-600 py-1 px-3 rounded-full text-white font-medium">
            paid
          </span>
        ) : (
          '-'
        ),
      sortable: true,
      width: '120px',
      center: true,
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
            data={dataTable}
            fixedHeader
            fixedHeaderScrollHeight="54vh"
            responsive={true}
            customStyles={customTableStyles}
            persistTableHead
            noDataComponent={<NoDataMessage title="Service Transaction" />}
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

      <PopUp
        isOpenPopUp={openPopUpDescription}
        setIsOpenPopUp={setOpenPopUpDescription}
        title="Description"
      >
        <div className="max-w-xl text-sm">
          <p>{transactionDetail?.description}</p>
        </div>
      </PopUp>
    </div>
  );
};

export default TableServiceTransaction;
