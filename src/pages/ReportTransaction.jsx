import { lazy, Suspense, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BiReset } from 'react-icons/bi';

import { Breadcrumb, Tooltip } from '@/components';
import { Card, CardBody } from '@/components/Card';
import useDebounce from '@/hooks/useDebounce';
import { selectCurrentModules } from '@/services/state/authSlice';
import { TableReportTransaction } from '@/components/report-transaction';
import { useGetReportTransactionsQuery } from '@/services/api/reportApiSlice';
import {
  getAllFilterTransaction,
  getFilterTransactionByKey,
  resetFilterTransactions,
} from '@/services/state/reportSlice';
import { SkeletonBlock } from '@/components/Skeleton';

const LazyButton = lazy(() => import('@/components/Button'));

const breadcrumbItems = [
  { label: 'Reports', url: '#' },
  { label: 'Transaction' },
];

const ReportTransaction = () => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(10);

  const modules = useSelector(selectCurrentModules);
  const accessModule = modules[43]; // rule_code = transaction

  const debouncedSearchValue = useDebounce(searchValue, 500);

  const getAllFilters = useSelector(getAllFilterTransaction);
  const isFilterSelected = Object.keys(getAllFilters).length > 0;

  // Get Filter Transaction
  const filterDate = useSelector((state) =>
    getFilterTransactionByKey(state, 'date')
  );
  const filterCompensation = useSelector((state) =>
    getFilterTransactionByKey(state, 'compensation')
  );
  const filterTransactionService = useSelector((state) =>
    getFilterTransactionByKey(state, 'transactionService')
  );
  const filterTransactionOrder = useSelector((state) =>
    getFilterTransactionByKey(state, 'transactionOrder')
  );
  const filterAmount = useSelector((state) =>
    getFilterTransactionByKey(state, 'amount')
  );
  const filterCompensationPaymentMethod = useSelector((state) =>
    getFilterTransactionByKey(state, 'compensationPaymentMethod')
  );
  const filterPaymentMethod = useSelector((state) =>
    getFilterTransactionByKey(state, 'paymentMethod')
  );
  const filterUserCode = useSelector((state) =>
    getFilterTransactionByKey(state, 'userCode')
  );
  const filterUserName = useSelector((state) =>
    getFilterTransactionByKey(state, 'userName')
  );
  const filterTeamACode = useSelector((state) =>
    getFilterTransactionByKey(state, 'teamACode')
  );
  const filterTeamAName = useSelector((state) =>
    getFilterTransactionByKey(state, 'teamAName')
  );
  const filterTeamBCode = useSelector((state) =>
    getFilterTransactionByKey(state, 'teamBCode')
  );
  const filterTeamBName = useSelector((state) =>
    getFilterTransactionByKey(state, 'teamBName')
  );
  const filterClubACode = useSelector((state) =>
    getFilterTransactionByKey(state, 'clubACode')
  );
  const filterClubAName = useSelector((state) =>
    getFilterTransactionByKey(state, 'clubAName')
  );
  const filterClubBCode = useSelector((state) =>
    getFilterTransactionByKey(state, 'clubBCode')
  );
  const filterClubBName = useSelector((state) =>
    getFilterTransactionByKey(state, 'clubBName')
  );
  const filterEventGroupCode = useSelector((state) =>
    getFilterTransactionByKey(state, 'eventGroupCode')
  );
  const filterEventGroupName = useSelector((state) =>
    getFilterTransactionByKey(state, 'eventGroupName')
  );
  const filterEventCode = useSelector((state) =>
    getFilterTransactionByKey(state, 'eventCode')
  );
  const filterEventName = useSelector((state) =>
    getFilterTransactionByKey(state, 'eventName')
  );
  const filterServiceType = useSelector((state) =>
    getFilterTransactionByKey(state, 'serviceType')
  );
  const filterFSPCode = useSelector((state) =>
    getFilterTransactionByKey(state, 'fspCode')
  );
  const filterFSPName = useSelector((state) =>
    getFilterTransactionByKey(state, 'fspName')
  );
  const filterFSPIncomeShare = useSelector((state) =>
    getFilterTransactionByKey(state, 'fspIncomeShare')
  );
  const filterSSPCode = useSelector((state) =>
    getFilterTransactionByKey(state, 'sspCode')
  );
  const filterSSPName = useSelector((state) =>
    getFilterTransactionByKey(state, 'sspName')
  );
  const filterSSPIncomeShare = useSelector((state) =>
    getFilterTransactionByKey(state, 'sspIncomeShare')
  );

  const formatFilterForQuery = useMemo(() => {
    return (filterArray) => filterArray?.map((item) => item?.name).join(',');
  }, []);

  const {
    data: dataTransactions,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetReportTransactionsQuery({
    searchTerm: debouncedSearchValue,
    page: currentPage,
    limit: limitPerPage,
    startDate: filterDate?.startDate,
    endDate: filterDate?.endDate,
    compensation: formatFilterForQuery(filterCompensation),
    transactionTypeOrder: formatFilterForQuery(filterTransactionOrder),
    transactionTypeService: formatFilterForQuery(filterTransactionService),
    minPrice: filterAmount?.min,
    maxPrice: filterAmount?.max,
    compensationPaymentMethod: formatFilterForQuery(
      filterCompensationPaymentMethod
    ),
    paymentMethod: formatFilterForQuery(filterPaymentMethod),
    userCode: formatFilterForQuery(filterUserCode),
    userName: formatFilterForQuery(filterUserName),
    teamACode: formatFilterForQuery(filterTeamACode),
    teamAName: formatFilterForQuery(filterTeamAName),
    teamBCode: formatFilterForQuery(filterTeamBCode),
    teamBName: formatFilterForQuery(filterTeamBName),
    clubACode: formatFilterForQuery(filterClubACode),
    clubAName: formatFilterForQuery(filterClubAName),
    clubBCode: formatFilterForQuery(filterClubBCode),
    clubBName: formatFilterForQuery(filterClubBName),
    eventGroupCode: formatFilterForQuery(filterEventGroupCode),
    eventGroupName: formatFilterForQuery(filterEventGroupName),
    eventCode: formatFilterForQuery(filterEventCode),
    eventName: formatFilterForQuery(filterEventName),
    serviceType: formatFilterForQuery(filterServiceType),
    fspCode: formatFilterForQuery(filterFSPCode),
    fspName: formatFilterForQuery(filterFSPName),
    fspShareMin: filterFSPIncomeShare?.min,
    fspShareMax: filterFSPIncomeShare?.max,
    sspCode: formatFilterForQuery(filterSSPCode),
    sspName: formatFilterForQuery(filterSSPName),
    sspShareMin: filterSSPIncomeShare?.min,
    sspShareMax: filterSSPIncomeShare?.max,
  });

  const handleResetAllFilter = () => {
    dispatch(resetFilterTransactions());
  };

  return (
    <>
      <Card className="p-4 pb-0">
        <div className="flex justify-between items-end">
          <Breadcrumb title="Transaction" items={breadcrumbItems} />

          {isFilterSelected && (
            <Tooltip text="Reset All Filter" position="left">
              <Suspense fallback={<SkeletonBlock width="w-10" />}>
                <LazyButton
                  background="black"
                  onClick={handleResetAllFilter}
                  className="block w-full "
                >
                  <BiReset className="mx-auto" />
                </LazyButton>
              </Suspense>
            </Tooltip>
          )}
        </div>

        <CardBody className="mt-3">
          <section>
            <TableReportTransaction
              data={dataTransactions}
              isLoading={isLoading}
              isSuccess={isSuccess}
              isError={isError}
              error={error}
              limitPerPage={limitPerPage}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          </section>
        </CardBody>
      </Card>
    </>
  );
};

export default ReportTransaction;
