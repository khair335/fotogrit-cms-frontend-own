import { Suspense, lazy, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const LazyBreadcrumb = lazy(() => import('@/components/Breadcrumb'));
const LazyButtonCollapse = lazy(() => import('@/components/ButtonCollapse'));
const LazyTitle = lazy(() => import('@/components/typography/Title'));
const LazyFilterSearch = lazy(() =>
  import('@/components/form-input/FilterSearch')
);
const LazyTableAddModifyMyService = lazy(() =>
  import('@/components/service-add-modify/TableAddModifyMyService')
);
const LazyFilterSelect = lazy(() =>
  import('@/components/form-input/FilterSelect')
);

import { Collapse, Modal, PopUpDelete } from '@/components';
import { Card, CardBody } from '@/components/Card';
import {
  FormAddModifyService,
  FormDetailAddModifyMyService,
} from '@/components/service-add-modify';
import {
  SkeletonBlock,
  SkeletonBreadcrumb,
  SkeletonTable,
} from '@/components/Skeleton';

import useDebounce from '@/hooks/useDebounce';
import {
  selectCurrentModules,
  selectCurrentUser,
} from '@/services/state/authSlice';
import {
  useDeleteServiceMutation,
  useDeleteVariableFeeMutation,
  useGetCompensationQuery,
  useGetListServiceTypesQuery,
  useGetOptionsUsersQuery,
  useGetServicesQuery,
} from '@/services/api/serviceRequestApiSlice';
import { optionsProviders } from '@/constants';
import { userTypeAdminCheck } from '@/helpers/UserTypeCheck';

const breadcrumbItems = [
  {
    label: 'Service Management',
    url: '/service-management/request-other-service',
  },
  { label: 'My Services', url: '#' },
  { label: 'Add/Modify My Service' },
];

const ServiceAddModify = () => {
  const [isOpenNewData, setIsOpenNewData] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [popUpDelete, setPopUpDelete] = useState(false);
  const [getDetailData, setGetDetailData] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [filterSelectProvider, setFilterSelectProvider] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(10);

  const userProfile = useSelector(selectCurrentUser);
  const isAdmin = userTypeAdminCheck(userProfile);

  const modules = useSelector(selectCurrentModules);
  const isAccessAddMyService = modules[26];

  const debouncedSearchValue = useDebounce(searchValue, 500);

  const { data, isLoading, isSuccess, isError, error } = useGetServicesQuery({
    searchTerm: debouncedSearchValue,
    page: currentPage,
    limit: limitPerPage,
    serviceType: filterSelectProvider,
  });

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

  // For Options Compensation
  const { data: compensations } = useGetCompensationQuery();
  const optionsPaymenPeriod = compensations?.data?.map((item) => ({
    value: item?._id,
    label: item?.name || '-',
  }));

  // For Options Service Types
  const { data: serviceTypes } = useGetListServiceTypesQuery();
  const disableServiceType = [
    'photography',
    'streaming',
    'scoring',
    'videography',
    'validator',
  ];
  const optionsServiceTypes = serviceTypes?.data
    ?.map((item) => {
      return {
        value: item?._id,
        label: item?.name || '-',
        // isDisabled: !disableServiceType.includes(item?.name),
      };
    })
    .sort((a, b) => {
      if (a.isDisabled) return 1;
      if (!a.isDisabled) return -1;
      return a?.label.localeCompare(b?.label);
    });

  // .sort((a, b) => {
  //   if (a.isDisabled && !b.isDisabled) return 1;
  //   if (!a.isDisabled && b.isDisabled) return -1;
  //   return a?.label.localeCompare(b?.label);
  // });

  const [deleteService] = useDeleteServiceMutation();
  const [deleteVariableFee] = useDeleteVariableFeeMutation();

  const handleDelete = async () => {
    try {
      setIsLoadingDelete(true);

      const responseService = await deleteService({
        id: getDetailData?.id,
      }).unwrap();

      const transformDataVariableFee = getDetailData?.variable_fees?.map(
        (data) => ({
          id: data?.id,
        })
      );

      // Delete Variable Fee
      let resVariableFee;
      for (const deleteVariable of transformDataVariableFee) {
        resVariableFee = await deleteVariableFee(deleteVariable).unwrap();
      }

      if (!responseService?.error) {
        setIsLoadingDelete(false);
        setPopUpDelete(false);
        setOpenModal(false);

        toast.success(`"${getDetailData?.name}" has been deleted!`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      setIsLoadingDelete(false);
      console.error(err);
      toast.error(`Failed: ${err?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  return (
    <>
      <Card className="p-4 pb-0 pt-3">
        <Suspense fallback={<SkeletonBreadcrumb />}>
          <LazyBreadcrumb
            title="Add/Modify My Service"
            items={breadcrumbItems}
          />
        </Suspense>

        <CardBody className="mt-3">
          <div
            className={`flex flex-col-reverse gap-2 md:flex-row md:items-center  ${
              isAccessAddMyService?.can_add
                ? 'md:justify-between'
                : 'md:justify-end'
            }`}
          >
            {isAccessAddMyService?.can_add && (
              <Suspense fallback={<SkeletonBlock />}>
                <LazyButtonCollapse
                  label="Add New Service"
                  isOpen={isOpenNewData}
                  handleClick={() => setIsOpenNewData(!isOpenNewData)}
                />
              </Suspense>
            )}

            <div className="flex gap-2 flex-col sm:flex-row sm:items-center sm:justify-between w-full sm:w-[60%] lg:w-[50%]">
              <div className="w-full sm:w-[40%] z-50">
                <Suspense fallback={<SkeletonBlock width="w-full" />}>
                  <LazyFilterSelect
                    dataOptions={optionsProviders}
                    placeholder="Select Provider"
                    filterSelectedValue={filterSelectProvider}
                    setFilterSelectedValue={setFilterSelectProvider}
                  />
                </Suspense>
              </div>

              <div className="w-full sm:w-[60%]">
                <Suspense fallback={<SkeletonBlock width="w-full" />}>
                  <LazyFilterSearch
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    setCurrentPage={setCurrentPage}
                  />
                </Suspense>
              </div>
            </div>
          </div>

          {isAccessAddMyService?.can_add && (
            <Collapse isOpen={isOpenNewData}>
              <FormAddModifyService
                setOpenColapse={setIsOpenNewData}
                optionsPaymenPeriod={optionsPaymenPeriod}
                optionsServiceTypes={optionsServiceTypes}
              />
            </Collapse>
          )}

          <section className="mt-3">
            <Suspense
              fallback={<SkeletonBlock width="w-40" height="h-6 mb-2" />}
            >
              <LazyTitle className="mb-2 text-xl font-bold">
                List of {isAdmin && 'All'} Service
              </LazyTitle>
            </Suspense>

            <Suspense fallback={<SkeletonTable />}>
              <LazyTableAddModifyMyService
                openModal={openModal}
                setOpenModal={setOpenModal}
                setGetData={setGetDetailData}
                data={data}
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
              title="Detail My Service"
              openModal={openModal}
              setOpenModal={setOpenModal}
              rounded="rounded-xl"
            >
              <FormDetailAddModifyMyService
                data={getDetailData}
                setOpenModal={setOpenModal}
                isAccess={isAccessAddMyService}
                optionsClients={optionsClients}
                isAccessAddMyService={isAccessAddMyService}
                optionsPaymenPeriod={optionsPaymenPeriod}
                optionsServiceTypes={optionsServiceTypes}
                setIsOpenPopUpDelete={setPopUpDelete}
                isAdmin={isAdmin}
              />
            </Modal>
            {/* END MODAL */}

            {/* Pop Up Delete */}
            <PopUpDelete
              handleDelete={handleDelete}
              isLoading={isLoadingDelete}
              isOpenPopUpDelete={popUpDelete}
              setIsOpenPopUpDelete={setPopUpDelete}
            />
            {/* End Pop Up Delete */}
          </section>
        </CardBody>
      </Card>
    </>
  );
};

export default ServiceAddModify;
