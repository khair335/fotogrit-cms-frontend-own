import { Suspense, lazy, useState } from 'react';

const LazyBreadcrumb = lazy(() => import('@/components/Breadcrumb'));
const LazyFilterSearch = lazy(() =>
  import('@/components/form-input/FilterSearch')
);
const LazyFilterSelect = lazy(() =>
  import('@/components/form-input/FilterSelect')
);
const LazyTableOrder = lazy(() => import('@/components/orders/TableOrder'));

import { Modal } from '@/components';
import { Card, CardBody } from '@/components/Card';
import { FormDetailOrder } from '@/components/orders';
import {
  SkeletonBlock,
  SkeletonBreadcrumb,
  SkeletonTable,
} from '@/components/Skeleton';

import useDebounce from '@/hooks/useDebounce';

import { useGetOrdersQuery } from '@/services/api/orderApiSlice';
import { useGetCustomerDataListQuery } from '@/services/api/customerDataApiSlice';

const Order = () => {
  const [openModal, setOpenModal] = useState(false);
  const [filterSelectedCustomer, setFilterSelectedCustomer] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [getData, setGetData] = useState('');

  const debouncedSearchValue = useDebounce(searchValue, 500);

  const {
    data: orders,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetOrdersQuery({
    customerName: filterSelectedCustomer,
    searchTerm: debouncedSearchValue,
  });

  // For filter customer, infinite scroll
  const [pageCustomer, setPageCustomer] = useState(1);
  const [searchQueryCustomer, setSearchQueryCustomer] = useState('');
  const debouncedSearchCustomer = useDebounce(searchQueryCustomer, 200);
  const { data: customers } = useGetCustomerDataListQuery({
    page: pageCustomer,
    searchTerm: debouncedSearchCustomer,
  });
  const totalPageOptionCustomer = customers?.meta?.total_page;

  const breadcrumbItems = [{ label: 'Order', url: '#' }, { label: 'Orders' }];

  const selectCustomerData = customers?.data?.map((item) => ({
    value: item?.name || 'Anonymous',
    label: item?.name || 'Anonymous',
  }));
  // Check if selectCustomerData is an array before adding the default option
  if (Array.isArray(selectCustomerData)) {
    selectCustomerData.unshift({ value: '', label: 'Select Customer' });
  }

  return (
    <>
      <Card className="pt-4 pb-0 px-4">
        <Suspense fallback={<SkeletonBreadcrumb />}>
          <LazyBreadcrumb title="Orders" items={breadcrumbItems} />
        </Suspense>

        <CardBody className="mt-3">
          <div className="flex flex-col w-full gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="z-10 w-full sm:w-[25%]">
              <Suspense fallback={<SkeletonBlock width="w-full" />}>
                <LazyFilterSelect
                  dataOptions={selectCustomerData}
                  placeholder="Select Customer"
                  filterSelectedValue={filterSelectedCustomer}
                  setFilterSelectedValue={setFilterSelectedCustomer}
                  infiniteScroll
                  setPage={setPageCustomer}
                  setSearchQuery={setSearchQueryCustomer}
                  totalPageOptions={totalPageOptionCustomer}
                />
              </Suspense>
            </div>

            <div className="w-full sm:w-[25%]">
              <Suspense fallback={<SkeletonBlock width="w-full" />}>
                <LazyFilterSearch
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  noPagination
                />
              </Suspense>
            </div>
          </div>

          <section className="mt-3">
            <Suspense fallback={<SkeletonTable />}>
              <LazyTableOrder
                openModal={openModal}
                setOpenModal={setOpenModal}
                setGetData={setGetData}
                data={orders?.data}
                isLoading={isLoading}
                isSuccess={isSuccess}
                isError={isError}
                error={error}
              />
            </Suspense>

            {/* MODAL */}
            <Modal
              title="Detail Order"
              openModal={openModal}
              setOpenModal={setOpenModal}
            >
              <FormDetailOrder data={getData} setOpenModal={setOpenModal} />
            </Modal>
            {/* END MODAL */}
          </section>
        </CardBody>
      </Card>
    </>
  );
};

export default Order;
