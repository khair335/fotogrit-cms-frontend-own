import { Suspense, lazy, useState } from 'react';

const LazyBreadcrumb = lazy(() => import('@/components/Breadcrumb'));
const LazyTitle = lazy(() => import('@/components/typography/Title'));
const LazyFilterSearch = lazy(() =>
  import('@/components/form-input/FilterSearch')
);
const LazyTableListAllService = lazy(() =>
  import('@/components/approval-visibilty-service/TableListAllService')
);
const LazyTableListNewService = lazy(() =>
  import('@/components/approval-visibilty-service/TableListNewService')
);

import { Modal } from '@/components';
import { Card, CardBody } from '@/components/Card';
import {
  FormDetailAllService,
  FormDetailNewService,
} from '@/components/approval-visibilty-service';
import {
  SkeletonBlock,
  SkeletonBreadcrumb,
  SkeletonTable,
} from '@/components/Skeleton';

import useDebounce from '@/hooks/useDebounce';
import {
  useGetListApprovalServicesQuery,
  useGetApprovedServicesQuery,
  useGetOptionsUsersQuery,
} from '@/services/api/serviceRequestApiSlice';

const breadcrumbItems = [
  { label: 'Approval Management', url: '#' },
  { label: 'Approval & Visibilty Service' },
];

const ApprovalVisibiltyService = () => {
  const [openModalNewService, setOpenModalNewService] = useState(false);
  const [getDetailDataNewService, setGetDetailDataNewService] = useState('');
  const [searchValueNewService, setSearchValueNewService] = useState('');
  const [currentPageNewService, setCurrentPageNewService] = useState(1);
  const [limitPerPageNewService] = useState(10);

  const [openModalAllService, setOpenModalAllService] = useState(false);
  const [getDetailDataAllService, setGetDetailDataAllService] = useState('');
  const [searchValueAllService, setSearchValueAllService] = useState('');
  const [currentPageAllService, setCurrentPageAllService] = useState(1);
  const [limitPerPageAllService] = useState(10);

  const debouncedSearchValueNewService = useDebounce(
    searchValueNewService,
    500
  );
  const debouncedSearchValueAllService = useDebounce(
    searchValueAllService,
    500
  );

  // For Options Visibility (client&photographer)
  const { data: clients } = useGetOptionsUsersQuery({
    params: '7587cd95e124ffec707adaef8cdfb0bf,668bd0af021636808161dc583a51d15e', // only  client, photographer
  });
  const optionsClients = clients?.data?.map((item) => ({
    value: item?.id,
    label: `${item?.code} - ${item?.name || 'noname'} `,
  }));
  if (Array.isArray(optionsClients)) {
    optionsClients.unshift({ value: 'public', label: 'Public' });
  }

  const {
    data: dataNewService,
    isLoading: isLoadingNewService,
    isSuccess: isSuccessNewService,
    isError: isErrorNewService,
    error: errorNewService,
  } = useGetListApprovalServicesQuery({
    searchTerm: debouncedSearchValueNewService,
    page: currentPageNewService,
    limit: limitPerPageNewService,
  });

  const {
    data: dataAllService,
    isLoading: isLoadingAllService,
    isSuccess: isSuccessAllService,
    isError: isErrorAllService,
    error: errorAllService,
  } = useGetApprovedServicesQuery({
    searchTerm: debouncedSearchValueAllService,
    page: currentPageAllService,
    limit: limitPerPageAllService,
  });

  return (
    <>
      <Card className="px-4 pt-1.5 pb-0" height="h-[66vh]">
        <Suspense fallback={<SkeletonBreadcrumb />}>
          <LazyBreadcrumb
            title="Approval & Visibilty Service"
            items={breadcrumbItems}
          />
        </Suspense>

        <CardBody className="mt-1">
          <div
            className={`flex flex-col-reverse gap-2 md:flex-row md:items-center md:justify-between`}
          >
            <Suspense
              fallback={<SkeletonBlock width="w-full sm:w-40" height="h-6" />}
            >
              <LazyTitle className="text-xl font-medium">
                List of New Service
              </LazyTitle>
            </Suspense>
            <div className="w-full sm:w-[40%] lg:w-[30%]">
              <Suspense fallback={<SkeletonBlock width="w-full" />}>
                <LazyFilterSearch
                  searchValue={searchValueNewService}
                  setSearchValue={setSearchValueNewService}
                  setCurrentPage={setCurrentPageNewService}
                />
              </Suspense>
            </div>
          </div>

          <section className="mt-1">
            <Suspense fallback={<SkeletonTable />}>
              <LazyTableListNewService
                openModal={openModalNewService}
                setOpenModal={setOpenModalNewService}
                setGetData={setGetDetailDataNewService}
                data={dataNewService}
                isLoading={isLoadingNewService}
                isSuccess={isSuccessNewService}
                isError={isErrorNewService}
                error={errorNewService}
                limitPerPage={limitPerPageNewService}
                setCurrentPage={setCurrentPageNewService}
                currentPage={currentPageNewService}
                optionsClients={optionsClients}
              />
            </Suspense>

            {/* MODAL */}
            <Modal
              title="Detail New Service"
              openModal={openModalNewService}
              setOpenModal={setOpenModalNewService}
              rounded="rounded-xl"
            >
              <FormDetailNewService
                data={getDetailDataNewService}
                setOpenModal={setOpenModalNewService}
              />
            </Modal>
            {/* END MODAL */}
          </section>
        </CardBody>
      </Card>

      <Card className="p-4 pb-0 mt-4" height="h-[54vh]">
        <CardBody className="">
          <div
            className={`flex flex-col-reverse gap-2 md:flex-row md:items-center md:justify-between`}
          >
            <Suspense
              fallback={<SkeletonBlock width="w-full sm:w-40" height="h-6" />}
            >
              <LazyTitle className="text-xl font-medium">
                List of All Service
              </LazyTitle>
            </Suspense>
            <div className="w-full sm:w-[40%] lg:w-[30%]">
              <Suspense fallback={<SkeletonBlock width="w-full" />}>
                <LazyFilterSearch
                  searchValue={searchValueAllService}
                  setSearchValue={setSearchValueAllService}
                  setCurrentPage={setCurrentPageAllService}
                />
              </Suspense>
            </div>
          </div>

          <section className="mt-1">
            <Suspense fallback={<SkeletonTable />}>
              <LazyTableListAllService
                openModal={openModalAllService}
                setOpenModal={setOpenModalAllService}
                setGetData={setGetDetailDataAllService}
                data={dataAllService}
                isLoading={isLoadingAllService}
                isSuccess={isSuccessAllService}
                isError={isErrorAllService}
                error={errorAllService}
                limitPerPage={limitPerPageAllService}
                setCurrentPage={setCurrentPageAllService}
                currentPage={currentPageAllService}
              />
            </Suspense>

            {/* MODAL */}
            <Modal
              title="Detail All Service"
              openModal={openModalAllService}
              setOpenModal={setOpenModalAllService}
              rounded="rounded-xl"
            >
              <FormDetailAllService
                data={getDetailDataAllService}
                setOpenModal={setOpenModalAllService}
              />
            </Modal>
            {/* END MODAL */}
          </section>
        </CardBody>
      </Card>
    </>
  );
};

export default ApprovalVisibiltyService;
