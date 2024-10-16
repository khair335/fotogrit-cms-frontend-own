import { lazy, Suspense, useState } from 'react';
import { useSelector } from 'react-redux';

const LazyBreadcrumb = lazy(() => import('@/components/Breadcrumb'));
const LazyFilterSearch = lazy(() =>
  import('@/components/form-input/FilterSearch')
);
const LazyButtonCollapse = lazy(() => import('@/components/ButtonCollapse'));
const LazyTableCoinManagement = lazy(() =>
  import('@/components/coin-management/TableCoin')
);

import { Collapse, Modal } from '@/components';
import { Card, CardBody } from '@/components/Card';
import { FormDetailCoin, FormAddCoin } from '@/components/coin-management';
import {
  SkeletonBlock,
  SkeletonBreadcrumb,
  SkeletonTable,
} from '@/components/Skeleton';

import useDebounce from '@/hooks/useDebounce';
import { selectCurrentModules } from '@/services/state/authSlice';
import { useGetCoinsQuery } from '@/services/api/coinsManagementApiSlice';

const breadcrumbItems = [
  { label: 'Commerce Setting', url: '#' },
  { label: 'List Coin' },
];

const CoinManagement = () => {
  const [isOpenNewData, setIsOpenNewData] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [getDetailData, setGetDetailData] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(10);

  const modules = useSelector(selectCurrentModules);
  const isAccessPage = modules[41];

  const debouncedSearchValue = useDebounce(searchValue, 500);

  const {
    data: coins,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetCoinsQuery({
    searchTerm: debouncedSearchValue,
    page: currentPage,
    limit: limitPerPage,
  });

  return (
    <>
      <Card className="pt-4 pb-0 px-4">
        <Suspense fallback={<SkeletonBreadcrumb />}>
          <LazyBreadcrumb title="Coin Management" items={breadcrumbItems} />
        </Suspense>

        <CardBody className="mt-2">
          <div
            className={`flex flex-col-reverse gap-2 md:flex-row md:items-center  ${
              isAccessPage?.can_add ? 'md:justify-between' : 'md:justify-end'
            }`}
          >
            {isAccessPage?.can_add && (
              <Suspense fallback={<SkeletonBlock />}>
                <LazyButtonCollapse
                  label="Add Coin"
                  isOpen={isOpenNewData}
                  handleClick={() => setIsOpenNewData(!isOpenNewData)}
                />
              </Suspense>
            )}

            <div className="w-full sm:w-[25%]">
              <Suspense fallback={<SkeletonBlock width="w-full" />}>
                <LazyFilterSearch
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  setCurrentPage={setCurrentPage}
                />
              </Suspense>
            </div>
          </div>

          <Collapse isOpen={isOpenNewData}>
            <FormAddCoin setOpenColapse={setIsOpenNewData} />
          </Collapse>

          <section className="mt-3">
            <Suspense fallback={<SkeletonTable />}>
              <LazyTableCoinManagement
                openModal={openModal}
                setOpenModal={setOpenModal}
                setGetData={setGetDetailData}
                data={coins}
                isLoading={isLoading}
                isSuccess={isSuccess}
                isError={isError}
                error={error}
                limitPerPage={limitPerPage}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
              />
            </Suspense>

            {/* MODAL */}
            <Modal
              title="Detail Coin"
              openModal={openModal}
              setOpenModal={setOpenModal}
              rounded="rounded-xl"
            >
              <FormDetailCoin
                data={getDetailData}
                setOpenModal={setOpenModal}
              />
            </Modal>
            {/* END MODAL */}
          </section>
        </CardBody>
      </Card>
    </>
  );
};

export default CoinManagement;
