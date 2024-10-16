import { useState } from 'react';
import DataTable from 'react-data-table-component';

import { Paragraph } from '@/components/typography';
import { Button, Pagination } from '@/components';
import { FilterRangeDatePicker } from '../form-input';
import { SkeletonTable } from '../Skeleton';
import { ErrorFetchingData } from '@/components/Errors';

import { customTableStyles } from '@/constants/tableStyle';
import { useGetListEventByContractQuery } from '@/services/api/serviceRequestApiSlice';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';
import { formatDate } from '@/helpers/FormatDate';
import { formatDateYearToDay } from '@/helpers/FormatDateYearToDay';

const FormDetailMyContract = (props) => {
  const { data, setOpenModal } = props;

  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const [currentPageMyContract, setCurrentPageMyContract] = useState(1);
  const [limitPerPageMyContract] = useState(5);
  const {
    data: dataListEvent,
    isLoading: isLoadingListEvent,
    isSuccess: isSuccessListEvent,
    isError: isErrorListEvent,
    error: errorListEvent,
  } = useGetListEventByContractQuery({
    contractID: data?.id,
    payment: 'paid',
    startDate: startDate ? formatDateYearToDay(startDate) : '',
    endDate: endDate ? formatDateYearToDay(endDate) : '',
    limit: limitPerPageMyContract,
  });
  const dataTable = dataListEvent?.data;
  const meta = dataListEvent?.meta;

  const totalPages = meta?.total_page;
  const totalRecords = meta?.total_record;

  const periodActive = data?.periods?.find((item) => item._is_active === 1);
  const isPaymentPeriodPerEvent = data?.contract_type === 'per event';

  // Columns Table
  const columns = [
    {
      name: 'Event Group',
      selector: (row) => row.event_group_name || '-',
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: 'Event Name',
      selector: (row) => row.event_name || '-',
      sortable: true,
      wrap: true,
      minWidth: '160px',
    },
    {
      name: 'Event Date',
      selector: (row) => row.date,
      cell: (row) => formatDate(row.date),
      sortable: true,
      wrap: true,
      minWidth: '160px',
    },
    {
      name: 'Work Status',
      selector: (row) => row.status_work_ssp || row.status_work_fsp || '-',
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: 'Total Payment',
      selector: (row) =>
        row.photographer_fsp_id === row.photographer_ssp_id
          ? row.total_fee_fsp
          : row.total_fee_ssp,
      cell: (row) => {
        const totalFee =
          row.photographer_fsp_id === row.photographer_ssp_id
            ? row.total_fee_fsp
            : row.total_fee_ssp;

        return CurrencyFormat(
          isPaymentPeriodPerEvent ? periodActive?.total_fee : totalFee
        );
      },
      sortable: true,
      minWidth: '150px',
      wrap: true,
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 gap-2 mb-4 text-sm sm:grid-cols-4 lg:grid-cols-7">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Contract ID</h5>
          <Paragraph>{data?.contract_id || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Name of Service</h5>
          <Paragraph>{data?.service_name || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Payment Period</h5>
          <Paragraph>{data?.contract_type || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Photographer</h5>
          <Paragraph>{data?.photographer_fsp_name || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Sales Model</h5>
          <Paragraph>{data?.service_sales_model || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Fixed Fee</h5>
          <Paragraph>{CurrencyFormat(periodActive?.total_fee || 0)}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">% of Sharing</h5>
          <Paragraph>{`${data?.service_percent_share || 0}%`}</Paragraph>
        </div>
      </div>

      <div className="">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xl">List Event</h3>

          <div className="my-2">
            <FilterRangeDatePicker
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                setDateRange(update);
              }}
              placeholder="Assignment date"
            />
          </div>
        </div>

        <div className="">
          {isErrorListEvent ? (
            <ErrorFetchingData error={errorListEvent} />
          ) : isLoadingListEvent ? (
            <SkeletonTable />
          ) : isSuccessListEvent ? (
            <div className="border-t border-gray-200 ">
              <DataTable
                columns={columns}
                data={dataTable}
                customStyles={customTableStyles}
              />

              <Pagination
                currentPage={currentPageMyContract}
                setCurrentPage={setCurrentPageMyContract}
                totalPages={totalPages}
                totalRecords={totalRecords}
                limitPerPage={limitPerPageMyContract}
              />
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex justify-end w-full gap-4 py-2 mt-4">
        <Button
          background="red"
          className="w-32"
          onClick={() => setOpenModal(false)}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default FormDetailMyContract;
