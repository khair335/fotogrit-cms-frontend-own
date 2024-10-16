import { FaCalendarAlt, FaFileInvoiceDollar, FaUser } from 'react-icons/fa';
import CardItem from '../card-item';
import { FaBriefcase } from 'react-icons/fa6';
import { FiActivity } from 'react-icons/fi';
import { SkeletonBlock, SkeletonTableTwoRow } from '@/components/Skeleton';
import { lazy, Suspense, useState } from 'react';
import { useGetAgeGroupQuery } from '@/services/api/othersApiSlice';
import useDebounce from '@/hooks/useDebounce';

const LazyFilterSelect = lazy(() =>
  import('@/components/form-input/FilterSelect')
);
const LazyTableTotalSales = lazy(() =>
  import('@/components/reports/week/TableTotalSales')
);

const dummyOptionsMediaSales = [
  {
    label: 'All Media Sales',
    value: 'all',
  },
  {
    label: 'Media 1',
    value: 'media-1',
  },
  {
    label: 'Media 2',
    value: 'media-2',
  },
];

const ReportPerWeek = () => {
  const [filterMediaSales, setFilterMediaSales] = useState('');

  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(2);

  const debouncedSearchValue = useDebounce(searchValue, 500);

  const dataTotalSales = useGetAgeGroupQuery({
    searchTerm: debouncedSearchValue,
    page: currentPage,
    limit: limitPerPage,
  });

  return (
    <>
      <section className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4 md:gap-3">
        <CardItem
          label="Total New Sales"
          text="Rp 5.000.000"
          icon={<FaFileInvoiceDollar />}
          backgroundColor="bg-gradient-to-t from-[#A25600] to-[#DC7A0A]"
        />

        <CardItem
          label="Total Sales"
          text="334"
          icon={<FaUser />}
          backgroundColor="bg-gradient-to-t from-[#773900] to-[#C56A00]"
        />

        <CardItem
          label="Total New Service Greated"
          text="2"
          icon={<FaBriefcase />}
          backgroundColor="bg-gradient-to-t from-[#57422D] to-[#A17850]"
        />

        <CardItem
          label="Total New Events"
          text="15"
          icon={<FaCalendarAlt />}
          backgroundColor="bg-gradient-to-t from-[#2B2E33] to-[#585D67]"
        />
      </section>

      <section className="w-full flex flex-col-reverse md:flex-row md:items-center md:justify-between mt-4 gap-2">
        <div className="flex items-center gap-2">
          <h5 className="font-medium text-xl">Total Sales</h5>
          <div className="w-8 h-8 grid place-items-center rounded-md bg-[#2B2F34]">
            <FiActivity className="text-white" size={24} />
          </div>
        </div>
        <div className="w-full md:w-[40%] lg:w-[20%]">
          <Suspense fallback={<SkeletonBlock width="w-full" />}>
            <LazyFilterSelect
              dataOptions={dummyOptionsMediaSales}
              placeholder="Media Sales"
              filterSelectedValue={filterMediaSales}
              setFilterSelectedValue={setFilterMediaSales}
            />
          </Suspense>
        </div>
      </section>

      <section className="grid grid-cols-3 md:grid-cols-[auto,1fr] md:gap-24 mt-4">
        <div className="flex flex-col justify-end font-bold text-xs sm:text-sm">
          <p className="mb-2">New Sales</p>
          <p className="mb-2">Cumulative</p>
        </div>
        <div className="col-span-2 md:col-span-1">
          <div className="w-full">
            <Suspense fallback={<SkeletonTableTwoRow />}>
              <LazyTableTotalSales
                fetchData={dataTotalSales}
                limitPerPage={limitPerPage}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
              />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
};

export default ReportPerWeek;
