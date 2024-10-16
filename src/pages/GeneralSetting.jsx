import { Suspense, lazy, useState } from 'react';

const LazyBreadcrumb = lazy(() => import('@/components/Breadcrumb'));
const LazyTableGeneralSetting = lazy(() =>
  import('@/components/general-setting/TableGeneralSetting')
);
const LazyTableHistoryGeneralSetting = lazy(() =>
  import('@/components/general-setting/TableHistoryGeneralSetting')
);

import { Modal } from '@/components';
import { Card, CardBody } from '@/components/Card';
import { FormDetailGeneralSetting } from '@/components/general-setting';
import {
  SkeletonBreadcrumb,
  SkeletonTable,
  SkeletonTableTwoRow,
} from '@/components/Skeleton';

import {
  useGetGeneralSettingQuery,
  useGetPricesQuery,
} from '@/services/api/generalSettingApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentModules } from '@/services/state/authSlice';

const breadcrumbItems = [
  { label: 'Commerce Setting', url: '#' },
  { label: 'General Setting' },
];

const GeneralSetting = () => {
  const [openModal, setOpenModal] = useState(false);
  const [getData, setGetData] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(10);

  const modules = useSelector(selectCurrentModules);
  const generalSettingAccess = modules[8];

  const {
    data: getHistories,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetGeneralSettingQuery({
    page: currentPage,
    limit: limitPerPage,
  });

  const {
    data: getPrices,
    isLoading: isLoadingPrice,
    isSuccess: isSuccessPrice,
    isError: isErrorPrice,
    error: errorPrice,
  } = useGetPricesQuery();

  return (
    <>
      <Card className="p-4">
        <Suspense fallback={<SkeletonBreadcrumb />}>
          <LazyBreadcrumb title="General Setting" items={breadcrumbItems} />
        </Suspense>

        <CardBody className="mt-2">
          <Suspense fallback={<SkeletonTableTwoRow />}>
            <LazyTableGeneralSetting
              openModal={openModal}
              setOpenModal={setOpenModal}
              setGetData={setGetData}
              data={getPrices?.data?.master_commerce}
              isLoading={isLoadingPrice}
              isSuccess={isSuccessPrice}
              isError={isErrorPrice}
              error={errorPrice}
            />
          </Suspense>

          <section className="">
            <h5 className="mt-3 mb-1 font-bold">History</h5>

            <Suspense fallback={<SkeletonTable />}>
              <LazyTableHistoryGeneralSetting
                data={getHistories}
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

          {/* MODAL */}
          <Modal
            title="Detail General Setting"
            openModal={openModal}
            setOpenModal={setOpenModal}
          >
            <FormDetailGeneralSetting
              data={getData}
              isAccess={generalSettingAccess}
            />
          </Modal>
          {/* END MODAL */}
        </CardBody>
      </Card>
    </>
  );
};

export default GeneralSetting;
