import { Suspense, lazy, useState } from 'react';

const LazyBreadcrumb = lazy(() => import('@/components/Breadcrumb'));
const LazyFilterSearch = lazy(() =>
  import('@/components/form-input/FilterSearch')
);
const LazyFilterSelect = lazy(() =>
  import('@/components/form-input/FilterSelect')
);
const LazyFilterRangeDatePicker = lazy(() =>
  import('@/components/form-input/FilterRangeDatePicker')
);
const LazyTableServiceTransaction = lazy(() =>
  import('@/components/wallet-service-transaction/TableServiceTransaction')
);

import { Card, CardBody } from '@/components/Card';
import {
  SkeletonBlock,
  SkeletonBreadcrumb,
  SkeletonTable,
} from '@/components/Skeleton';

import useDebounce from '@/hooks/useDebounce';
import { optionsItems } from '@/constants';
import { useGetServiceTransactionQuery } from '@/services/api/serviceRequestApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/services/state/authSlice';
import { userTypeAdminCheck } from '@/helpers/UserTypeCheck';
import { formatDateYearToDay } from '@/helpers/FormatDateYearToDay';

const breadcrumbItems = [
  { label: 'Commerce Setting', url: '#' },
  { label: 'Service Transaction' },
];

const WalletServiceTransaction = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const [limitPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearchValue = useDebounce(searchValue, 500);

  const user = useSelector(selectCurrentUser);
  const isAdmin = userTypeAdminCheck(user);

  const {
    data: serviceTransactions,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetServiceTransactionQuery({
    page: currentPage,
    searchTerm: debouncedSearchValue,
    limit: limitPerPage,
    to: isAdmin ? '' : user?.id,
    startDate: startDate ? formatDateYearToDay(startDate) : '',
    endDate: endDate ? formatDateYearToDay(endDate) : '',
    item: selectedItem,
  });

  return (
    <>
      <Card className="pt-4 pb-0 px-4">
        <Suspense fallback={<SkeletonBreadcrumb />}>
          <LazyBreadcrumb title="Service Transaction" items={breadcrumbItems} />
        </Suspense>

        <CardBody className="mt-3">
          <div className="flex flex-col w-full gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="sm:w-[60%] lg:w-[40%] flex sm:flex-row flex-col gap-2">
              <div className="z-20 w-full">
                <Suspense fallback={<SkeletonBlock width="w-full" />}>
                  <LazyFilterRangeDatePicker
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => {
                      setDateRange(update);
                    }}
                    placeholder="Filter by date"
                  />
                </Suspense>
              </div>
              <div className="z-10 w-full ">
                <Suspense fallback={<SkeletonBlock width="w-full" />}>
                  <LazyFilterSelect
                    dataOptions={optionsItems}
                    placeholder="Select Item"
                    filterSelectedValue={selectedItem}
                    setFilterSelectedValue={setSelectedItem}
                    setCurrentPage={setCurrentPage}
                  />
                </Suspense>
              </div>
            </div>
            <div className="w-full sm:w-[35%] lg:w-[25%]">
              <Suspense fallback={<SkeletonBlock width="w-full" />}>
                <LazyFilterSearch
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  setCurrentPage={setCurrentPage}
                />
              </Suspense>
            </div>
          </div>

          <section className="mt-3">
            <Suspense fallback={<SkeletonTable />}>
              <LazyTableServiceTransaction
                data={serviceTransactions}
                isLoading={isLoading}
                isSuccess={isSuccess}
                isError={isError}
                error={error}
                limitPerPage={limitPerPage}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
              />
            </Suspense>
          </section>
        </CardBody>
      </Card>
    </>
  );
};

export default WalletServiceTransaction;
