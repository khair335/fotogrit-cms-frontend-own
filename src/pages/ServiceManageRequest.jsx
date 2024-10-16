import { Suspense, lazy, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Modal, PopUpUploading } from '@/components';
import { Card, CardBody } from '@/components/Card';
import {
  CompleteService,
  FormDetailManageServiceRequest,
} from '@/components/service-manage-request';
import {
  SkeletonBlock,
  SkeletonBreadcrumb,
  SkeletonTable,
} from '@/components/Skeleton';

import { selectCurrentModules } from '@/services/state/authSlice';
import {
  useGetServiceRequestFSPQuery,
  useGetServiceRequestSSPQuery,
} from '@/services/api/serviceRequestApiSlice';
import { formatDate } from '@/helpers/FormatDate';
import { optionsProviders } from '@/constants';
import useFetchScoringData from '@/hooks/useFetchScoringData';
// import { FetchDataScoring } from '@/helpers/FetchScoringData';

const LazyBreadcrumb = lazy(() => import('@/components/Breadcrumb'));
const LazyFilterSearch = lazy(() =>
  import('@/components/form-input/FilterSearch')
);
const LazyFilterDatePicker = lazy(() =>
  import('@/components/form-input/FilterDatePicker')
);
const LazyTableManageServiceRequest = lazy(() =>
  import('@/components/service-manage-request/TableManageServiceRequest')
);
const LazyFilterSelect = lazy(() =>
  import('@/components/form-input/FilterSelect')
);

const breadcrumbItems = [
  {
    label: 'Service Management',
    url: '/service-management/request-other-service',
  },
  { label: 'My Services', url: '#' },
  { label: 'Manage Service Request' },
];

const ServiceManageRequest = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openCompleteService, setOpenCompleteService] = useState(false);
  const [getDetailData, setGetDetailData] = useState('');
  const [dateFilter, setDateFilter] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [popUpUploading, setPopUpUploading] = useState(false);
  const [isUploadCompleted, setIsUploadCompleted] = useState(false);
  const [dataCombine, setDataCombine] = useState([]);
  const [filterSelectProvider, setFilterSelectProvider] = useState('');
  // const [data, setData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const modules = useSelector(selectCurrentModules);
  const isAccessManageService = modules[28];

  const {
    data: fsp,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetServiceRequestFSPQuery({
    dateFilter: dateFilter ? formatDate(dateFilter) : '',
    serviceType: filterSelectProvider,
  });
  const { data: ssp } = useGetServiceRequestSSPQuery({
    dateFilter: dateFilter ? formatDate(dateFilter) : '',
    serviceType: filterSelectProvider,
  });

  const fspData = fsp?.data || [];
  const sspData = ssp?.data || [];
  const updatedDataFSP = fspData?.map((item) => ({
    ...item,
    _type: 'fsp',
  }));
  const updatedDataSSP = sspData?.map((item) => ({
    ...item,
    _type: 'ssp',
  }));

  useEffect(() => {
    const combinedData = updatedDataFSP
      ?.concat(updatedDataSSP)
      ?.sort((a, b) => new Date(b?.date) - new Date(a?.date));

    setDataCombine(combinedData);
  }, [fsp, ssp]);

  const data = useFetchScoringData(dataCombine);

  // Close complete service if page change
  useEffect(() => {
    setOpenCompleteService(false);
  }, [currentPage, openModal]);

  return (
    <>
      <Card className="p-5">
        <Suspense fallback={<SkeletonBreadcrumb />}>
          <LazyBreadcrumb
            title="Manage Service Request"
            items={breadcrumbItems}
          />
        </Suspense>

        <CardBody className="mt-2">
          <div className="flex sm:flex-row flex-col gap-2 sm:justify-between sm:items-center">
            <div className="w-full sm:w-[30%] lg:w-[20%] z-20">
              <Suspense fallback={<SkeletonBlock width="w-full" />}>
                <LazyFilterSelect
                  dataOptions={optionsProviders}
                  placeholder="Select Provider"
                  filterSelectedValue={filterSelectProvider}
                  setFilterSelectedValue={setFilterSelectProvider}
                />
              </Suspense>
            </div>

            <div className="flex gap-2 flex-col sm:flex-row sm:items-center sm:justify-between w-full sm:w-[60%] lg:w-[50%]">
              <div className="w-full sm:w-[40%] z-10">
                <Suspense fallback={<SkeletonBlock width="w-full" />}>
                  <LazyFilterDatePicker
                    dateFilter={dateFilter}
                    setDateFilter={setDateFilter}
                  />
                </Suspense>
              </div>

              <div className="w-full sm:w-[60%]">
                <Suspense fallback={<SkeletonBlock width="w-full" />}>
                  <LazyFilterSearch
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    noPagination
                  />
                </Suspense>
              </div>
            </div>
          </div>

          <section className="mt-2">
            <Suspense fallback={<SkeletonTable />}>
              <LazyTableManageServiceRequest
                openModal={openModal}
                setOpenModal={setOpenModal}
                openCompleteService={openCompleteService}
                setOpenCompleteService={setOpenCompleteService}
                setGetData={setGetDetailData}
                data={data}
                isLoading={isLoading}
                isSuccess={isSuccess}
                isError={isError}
                error={error}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                isAccessManageService={isAccessManageService}
                searchValue={searchValue}
              />
            </Suspense>

            <hr className="border border-gray-400/50" />

            <div className="mt-4">
              {openCompleteService && (
                <CompleteService
                  data={getDetailData}
                  dataTable={data}
                  setIsOpenPopUpUploading={setPopUpUploading}
                  setIsUploadCompleted={setIsUploadCompleted}
                />
              )}
            </div>

            {/* MODAL */}
            <Modal
              title="Detail Manage Service Request"
              openModal={openModal}
              setOpenModal={setOpenModal}
              rounded="rounded-xl"
            >
              <FormDetailManageServiceRequest
                data={getDetailData}
                setOpenModal={setOpenModal}
              />
            </Modal>
            {/* END MODAL */}

            {/* Pop Up Uploading */}
            {popUpUploading && (
              <PopUpUploading
                isOpenPopUpUploading={popUpUploading}
                setIsOpenPopUpUploading={setPopUpUploading}
                isUploadCompleted={isUploadCompleted}
                setIsUploadCompleted={setIsUploadCompleted}
                disableBtnMedia
              />
            )}
            {/* End Pop Up Uploading */}
          </section>
        </CardBody>
      </Card>
    </>
  );
};

export default ServiceManageRequest;
