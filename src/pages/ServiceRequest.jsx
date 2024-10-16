import { Suspense, lazy, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaPlus, FaRegBookmark } from 'react-icons/fa';
import { PiSealCheckLight } from 'react-icons/pi';

const LazyBreadcrumb = lazy(() => import('@/components/Breadcrumb'));
const LazyButtonCustom = lazy(() => import('@/components/ButtonCustom'));
const LazyTitle = lazy(() => import('@/components/typography/Title'));
const LazyFilterSearch = lazy(() =>
  import('@/components/form-input/FilterSearch')
);
const LazyTableRequestOtherService = lazy(() =>
  import('@/components/service-request/TableRequestOtherService')
);
const LazyTableMyContract = lazy(() =>
  import('@/components/service-request/TableMyContract')
);
const LazyFilterSelect = lazy(() =>
  import('@/components/form-input/FilterSelect')
);

import { Card, CardBody } from '@/components/Card';
import { Collapse, Modal } from '@/components';
import { FilterSearch } from '@/components/form-input';
import {
  FormAddRequestNewService,
  FormDetailMyContract,
  FormDetailRequestOtherService,
  FormSubcontractMyService,
} from '@/components/service-request';
import {
  SkeletonBlock,
  SkeletonBreadcrumb,
  SkeletonTable,
} from '@/components/Skeleton';

import {
  selectCurrentModules,
  selectCurrentUser,
} from '@/services/state/authSlice';
import {
  useGetContractsQuery,
  useGetListServiceRequestQuery,
} from '@/services/api/serviceRequestApiSlice';
import { Title } from '@/components/typography';
import { optionsProviders } from '@/constants';
import { userTypeAdminCheck } from '@/helpers/UserTypeCheck';

const breadcrumbItems = [
  { label: 'Service Management', url: '#' },
  { label: 'Request Other Service' },
];

const ServiceRequest = () => {
  const menuParamSubcontract = new URLSearchParams(location.search).get(
    'subcontract'
  );
  const menuParamMyContract = new URLSearchParams(location.search).get(
    'my-contract'
  );
  const [isOpenRequestNewService, setIsOpenRequestNewService] = useState(false);
  const [isOpenMyContract, setIsOpenMyContract] = useState(
    menuParamMyContract || false
  );
  const [isOpenSubcontractMyService, setIsOpenSubcontractMyService] = useState(
    menuParamSubcontract || false
  );

  const userProfile = useSelector(selectCurrentUser);
  const isAdmin = userTypeAdminCheck(userProfile);

  const isClient = userProfile?.user_type === 'UT003';
  const userID = userProfile?.id;

  const modules = useSelector(selectCurrentModules);
  const isAccessServiceRequest = modules[25];
  const isAccessSubcontract = modules[29];

  const [filterSelectProvider, setFilterSelectProvider] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [getDetailData, setGetDetailData] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const { data, isLoading, isSuccess, isError, error } =
    useGetListServiceRequestQuery({ serviceType: filterSelectProvider });

  const [openModalMyContract, setOpenModalMyContract] = useState(false);
  const [getDetailMyContract, setGetDetailMyContract] = useState('');
  const [limitPerPageMyContract] = useState(1000);
  const [searchMyContract, setSearchMyContract] = useState('');
  const {
    data: dataMyContract,
    isLoading: isLoadingMyContract,
    isSuccess: isSuccessMyContract,
    isError: isErrorMyContract,
    error: errorMyContract,
  } = useGetContractsQuery({
    limit: limitPerPageMyContract,
    serviceType: filterSelectProvider,
  });

  const handleClickBtnRequestNewService = () => {
    setIsOpenRequestNewService(!isOpenRequestNewService);
    setIsOpenSubcontractMyService(false);
    setIsOpenMyContract(false);
  };
  const handleClickBtnSubcontract = () => {
    setIsOpenSubcontractMyService(!isOpenSubcontractMyService);
    setIsOpenRequestNewService(false);
    setIsOpenMyContract(false);
  };
  const handleClickBtnContract = () => {
    setIsOpenMyContract(!isOpenMyContract);
    setIsOpenSubcontractMyService(false);
    setIsOpenRequestNewService(false);
  };

  return (
    <>
      <Card className="p-4 px-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 ">
          <Suspense fallback={<SkeletonBreadcrumb />}>
            <LazyBreadcrumb
              title="Request Other Service"
              items={breadcrumbItems}
            />
          </Suspense>

          <div className="z-40 w-full sm:w-3/12">
            <Suspense fallback={<SkeletonBlock width="w-full" />}>
              <LazyFilterSelect
                dataOptions={optionsProviders}
                placeholder="Select Provider"
                filterSelectedValue={filterSelectProvider}
                setFilterSelectedValue={setFilterSelectProvider}
              />
            </Suspense>
          </div>
        </div>

        <CardBody className="mt-3">
          <div
            className={`flex flex-col-reverse gap-2 md:flex-row md:items-center  ${
              isAccessServiceRequest?.can_add
                ? 'md:justify-between'
                : 'md:justify-end'
            }`}
          >
            <div className="flex gap-2 sm:gap-4 flex-row">
              {isAccessServiceRequest?.can_add && (
                <Suspense fallback={<SkeletonBlock width="w-48" />}>
                  <LazyButtonCustom
                    className={`flex items-center gap-2 px-6 sm:px-3 sm:pr-4 py-2 ${
                      isOpenSubcontractMyService || isOpenMyContract
                        ? 'opacity-30'
                        : ''
                    } text-white bg-[#111111] rounded-lg  group hover:bg-opacity-80 hover:text-opacity-80 `}
                    onClick={handleClickBtnRequestNewService}
                  >
                    <FaPlus />
                    <span className="hidden sm:block text-sm font-medium group-hover:text-opacity-60">
                      Request New Service
                    </span>
                  </LazyButtonCustom>
                </Suspense>
              )}
              {isAccessSubcontract?.can_menu && (
                <Suspense fallback={<SkeletonBlock width="w-52" />}>
                  <LazyButtonCustom
                    className={`flex items-center gap-2 px-6 sm:px-3 sm:pr-4 py-2 ${
                      isOpenRequestNewService || isOpenMyContract
                        ? 'opacity-40'
                        : ''
                    }  text-white bg-ftbrown rounded-lg group hover:bg-opacity-80 hover:text-opacity-80 `}
                    onClick={handleClickBtnSubcontract}
                  >
                    <FaRegBookmark />
                    <span className="hidden sm:block text-sm text-left font-medium group-hover:text-opacity-60">
                      Subcontract My Service
                    </span>
                  </LazyButtonCustom>
                </Suspense>
              )}
              {/* {isAccessSubcontract?.can_menu && ( */}
              <Suspense fallback={<SkeletonBlock width="w-32" />}>
                <LazyButtonCustom
                  className={`flex items-center gap-2 px-6 sm:px-3 sm:pr-4 py-2 ${
                    isOpenRequestNewService || isOpenSubcontractMyService
                      ? 'opacity-40'
                      : ''
                  } text-white bg-[#718355] rounded-lg group hover:bg-opacity-80 hover:text-opacity-80 `}
                  onClick={handleClickBtnContract}
                >
                  <PiSealCheckLight />
                  <span className="hidden sm:block text-sm font-medium group-hover:text-opacity-60">
                    My Contract
                  </span>
                </LazyButtonCustom>
              </Suspense>
              {/* )} */}
            </div>
          </div>

          {isAccessServiceRequest?.can_add && (
            <Collapse isOpen={isOpenRequestNewService}>
              <FormAddRequestNewService
                setOpenColapseRequest={setIsOpenRequestNewService}
                isClient={isClient}
                userProfile={userProfile}
                isAdmin={isAdmin}
                userID={userID}
                selectedProvider={filterSelectProvider}
              />
            </Collapse>
          )}

          {isAccessSubcontract?.can_menu && (
            <Collapse isOpen={isOpenSubcontractMyService}>
              <FormSubcontractMyService
                setOpenColapse={setIsOpenSubcontractMyService}
                isAccessSubcontract={isAccessSubcontract}
                setIsOpenRequestNewService={setIsOpenRequestNewService}
                selectedProvider={filterSelectProvider}
              />
            </Collapse>
          )}

          {isOpenMyContract ? (
            // MY CONTRACT
            <section className="mt-4">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-2">
                <Title>List of {isAdmin && 'All'} My Contract</Title>
                <div className="w-full sm:w-[50%] lg:w-[30%]">
                  <FilterSearch
                    searchValue={searchMyContract}
                    setSearchValue={setSearchMyContract}
                    noPagination
                  />
                </div>
              </div>

              <Suspense fallback={<SkeletonTable />}>
                <LazyTableMyContract
                  data={dataMyContract}
                  openModal={openModalMyContract}
                  setOpenModal={setOpenModalMyContract}
                  setGetData={setGetDetailMyContract}
                  isLoading={isLoadingMyContract}
                  isSuccess={isSuccessMyContract}
                  isError={isErrorMyContract}
                  error={errorMyContract}
                  searchMyContract={searchMyContract}
                  selectedProvider={filterSelectProvider}
                />
              </Suspense>
            </section>
          ) : (
            // Service Request
            <section className="mt-4">
              <div className="flex flex-col gap-2 sm:flex-row items-center justify-between mb-2">
                <Suspense
                  fallback={
                    <SkeletonBlock width="w-full sm:w-60" height="h-6" />
                  }
                >
                  <LazyTitle>
                    List of {isAdmin && 'All'} Service Request
                  </LazyTitle>
                </Suspense>
                <div className="w-full sm:w-[50%] lg:w-[30%]">
                  <Suspense fallback={<SkeletonBlock width="w-full" />}>
                    <LazyFilterSearch
                      searchValue={searchValue}
                      setSearchValue={setSearchValue}
                      noPagination
                    />
                  </Suspense>
                </div>
              </div>

              <Suspense fallback={<SkeletonTable />}>
                <LazyTableRequestOtherService
                  openModal={openModal}
                  setOpenModal={setOpenModal}
                  setGetData={setGetDetailData}
                  data={data}
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  isLoading={isLoading}
                  isSuccess={isSuccess}
                  isError={isError}
                  error={error}
                  isClient={isClient}
                  isAdmin={isAdmin}
                  userID={userID}
                />
              </Suspense>
            </section>
          )}

          {/* MODAL */}
          <Modal
            title="Detail List of All Service Request"
            openModal={openModal}
            setOpenModal={setOpenModal}
          >
            <FormDetailRequestOtherService
              data={getDetailData}
              setOpenModal={setOpenModal}
              isClient={isClient}
              isAdmin={isAdmin}
              userID={userID}
            />
          </Modal>
          {/* END MODAL */}

          {/* MODAL MY CONTRACT */}
          <Modal
            title="Detail List of My Contract"
            openModal={openModalMyContract}
            setOpenModal={setOpenModalMyContract}
            className={`overflow-visible`}
            rounded="rounded-xl"
          >
            <FormDetailMyContract
              data={getDetailMyContract}
              setOpenModal={setOpenModalMyContract}
            />
          </Modal>
          {/* END MODAL MY CONTRACT */}
        </CardBody>
      </Card>
    </>
  );
};

export default ServiceRequest;
