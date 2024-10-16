import { lazy, Suspense, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const LazyBreadcrumb = lazy(() => import('@/components/Breadcrumb'));
const LazyFilterSearch = lazy(() =>
  import('@/components/form-input/FilterSearch')
);
const LazyTableCustomerData = lazy(() =>
  import('@/components/customer-data/TableCustomerData')
);

import { Modal, PopUpDelete } from '@/components';
import { Card, CardBody } from '@/components/Card';
import { FormDetailCustomerData } from '@/components/customer-data';
import {
  SkeletonBlock,
  SkeletonBreadcrumb,
  SkeletonTable,
} from '@/components/Skeleton';

import useDebounce from '@/hooks/useDebounce';
import {
  useDeleteCustomerDataMutation,
  useGetCustomerDataQuery,
  useOptionsUserTypesQuery,
} from '@/services/api/customerDataApiSlice';
import { selectCurrentModules } from '@/services/state/authSlice';
import { useGetOptionsMainPositionsQuery } from '@/services/api/othersApiSlice';
import { useGetOptionsClubsQuery } from '@/services/api/clubMasterApiSlice';

const breadcrumbItems = [
  { label: 'User Management', url: '#' },
  { label: 'Customer Data' },
];

const CustomerData = () => {
  const [openModal, setOpenModal] = useState(false);
  const [popUpDelete, setPopUpDelete] = useState(false);
  const [getDetailData, setGetDetailData] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const modules = useSelector(selectCurrentModules);
  const customerDataAccess = modules[12];

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(10);
  const debouncedSearchValue = useDebounce(searchValue, 500);

  // Get Options Main Position
  const { data: positions } = useGetOptionsMainPositionsQuery();
  const optionsMainPositions = positions?.data?.map((item) => ({
    value: item?.id,
    label: item?.name,
  }));

  // Get Options Clubs
  const { data: clubsData } = useGetOptionsClubsQuery();
  const optionsClubs = clubsData?.data?.clubs?.map((item) => ({
    value: item?.id,
    label: `${item?.code} - ${item?.name}`,
  }));

  // Get Options Clubs
  const { data: userTypes } = useOptionsUserTypesQuery();
  const optionsUserTypes = userTypes?.data?.map((item) => ({
    value: item?.id,
    label: `${item?.code} - ${item?.name}`,
    id: item?._id,
  }));

  const dataUserTypes = optionsUserTypes
    ? optionsUserTypes?.map((item) => item?.value)?.join(',')
    : '';

  const { data, isLoading, isSuccess, isError, error } =
    useGetCustomerDataQuery({
      searchTerm: debouncedSearchValue,
      page: currentPage,
      limit: limitPerPage,
      userTypes: dataUserTypes || '',
    });

  const [deleteCustomerData, { isLoading: isLoadingDelete }] =
    useDeleteCustomerDataMutation();

  const handleDelete = async () => {
    try {
      const response = await deleteCustomerData({
        id: getDetailData?.id,
      }).unwrap();

      if (!response?.error) {
        setPopUpDelete(false);
        setOpenModal(false);

        toast.success(`"${getDetailData?.name}" has been deleted!`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed: ${err?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  return (
    <>
      <Card className="py-4 pb-0 px-6">
        <Suspense fallback={<SkeletonBreadcrumb />}>
          <LazyBreadcrumb title="Customer Data" items={breadcrumbItems} />
        </Suspense>

        <CardBody className="mt-2">
          <div className="flex flex-col-reverse gap-2 mb-4 md:flex-row md:items-center md:justify-end">
            <div className="w-full sm:w-[50%] lg:w-[30%]">
              <Suspense fallback={<SkeletonBlock width="w-full" />}>
                <LazyFilterSearch
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  setCurrentPage={setCurrentPage}
                />
              </Suspense>
            </div>
          </div>

          <section className="mt-4">
            <Suspense fallback={<SkeletonTable />}>
              <LazyTableCustomerData
                openModal={openModal}
                setOpenModal={setOpenModal}
                setGetData={setGetDetailData}
                data={data}
                isLoading={isLoading}
                isSuccess={isSuccess}
                isError={isError}
                error={error}
                limitPerPage={limitPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </Suspense>

            {/* MODAL */}
            <Modal
              title="Detail Customer Data"
              openModal={openModal}
              setOpenModal={setOpenModal}
              rounded="rounded-xl"
            >
              <FormDetailCustomerData
                data={getDetailData}
                setOpenModal={setOpenModal}
                setIsOpenPopUpDelete={setPopUpDelete}
                isAccess={customerDataAccess}
                optionsMainPositions={optionsMainPositions}
                optionsClubs={optionsClubs}
                optionsUserTypes={optionsUserTypes}
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

export default CustomerData;
