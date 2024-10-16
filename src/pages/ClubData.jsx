import { lazy, Suspense, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BiReset } from 'react-icons/bi';
import { toast } from 'react-toastify';

const LazyBreadcrumb = lazy(() => import('@/components/Breadcrumb'));
const LazyButton = lazy(() => import('@/components/Button'));
const LazyFilterSearch = lazy(() =>
  import('@/components/form-input/FilterSearch')
);
const LazyFilterSelect = lazy(() =>
  import('@/components/form-input/FilterSelect')
);
const LazyButtonCollapse = lazy(() => import('@/components/ButtonCollapse'));
const LazyTableClubData = lazy(() =>
  import('@/components/club-data/TableClubData')
);

import { Collapse, Modal, PopUpDelete, Tooltip } from '@/components';
import { Card, CardBody } from '@/components/Card';
import { FormDetailClubData, FormAddClubData } from '@/components/club-data';
import {
  SkeletonBlock,
  SkeletonBreadcrumb,
  SkeletonTable,
} from '@/components/Skeleton';

import useDebounce from '@/hooks/useDebounce';
import { useGetCitiesQuery } from '@/services/api/cityApiSlice';
import {
  useDeleteClubMasterMutation,
  useGetClubListQuery,
} from '@/services/api/clubMasterApiSlice';
import { useGetCustomerDataListQuery } from '@/services/api/customerDataApiSlice';
import { selectCurrentModules } from '@/services/state/authSlice';

const breadcrumbItems = [
  { label: 'Club Management', url: '#' },
  { label: 'Add/Modify Club Management' },
];

const ClubData = () => {
  const [isOpenNewData, setIsOpenNewData] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [popUpDelete, setPopUpDelete] = useState(false);
  const [getDetailData, setGetDetailData] = useState('');
  const [filterSelectedValue, setFilterSelectedValue] = useState('');

  const modules = useSelector(selectCurrentModules);
  const isAccessThisPage = modules[15];

  // For options filter city, infinite scroll
  const [pageCity, setPageCity] = useState(1);
  const [searchQueryCity, setSearchQueryCity] = useState('');
  const debouncedSearchCity = useDebounce(searchQueryCity, 200);
  const { data: cities } = useGetCitiesQuery({
    page: pageCity,
    searchTerm: debouncedSearchCity,
  });
  const totalPageOptionCity = cities?.meta?.total_page;
  const selectDataCities = cities?.data?.map((item) => ({
    value: item?.city,
    label: item?.city,
  }));
  if (Array.isArray(selectDataCities)) {
    selectDataCities.unshift({ value: '', label: 'Select City' });
  }

  // Options customer data
  const [pageCustomerData, setPageCustomerData] = useState(1);
  const [searchQueryCustomerData, setSearchQueryCustomerData] = useState('');
  const debouncedSearchCustomerData = useDebounce(searchQueryCustomerData, 200);
  const { data: customerData } = useGetCustomerDataListQuery({
    page: pageCustomerData,
    searchTerm: debouncedSearchCustomerData,
  });
  const totalPageOptionCustomerData = customerData?.meta?.total_page;
  const selectCustomerData = customerData?.data?.map((item) => ({
    value: item?.id,
    label: `${item?.code} - ${item?.name}`,
  }));
  if (Array.isArray(selectCustomerData)) {
    selectCustomerData.unshift({ value: '', label: 'Select PIC User Id' });
  }

  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(10);
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const {
    data: clubs,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetClubListQuery({
    page: currentPage,
    limit: limitPerPage,
    searchTerm: debouncedSearchValue,
    city: filterSelectedValue,
  });
  const clubListCode = clubs?.data?.club_code;

  const [deleteClubMaster, { isLoading: isLoadingDelete }] =
    useDeleteClubMasterMutation();

  const handleDelete = async () => {
    try {
      const response = await deleteClubMaster({
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
      setPopUpDelete(false);
      console.error(err);
      toast.error(`Failed: ${err?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  useEffect(() => {
    setSearchQueryCustomerData('');
    setSearchQueryCity('');
  }, [openModal, getDetailData]);

  const handleResetFilter = () => {
    setFilterSelectedValue('');
    setSearchValue('');
  };

  return (
    <>
      <Card className="py-4 pb-0 px-6">
        <Suspense fallback={<SkeletonBreadcrumb />}>
          <LazyBreadcrumb
            title="Add/Modify Club Management"
            items={breadcrumbItems}
          />
        </Suspense>

        <CardBody className="mt-2">
          <div
            className={`flex flex-col-reverse gap-2 md:flex-row md:items-center  ${
              isAccessThisPage?.can_add
                ? 'md:justify-between'
                : 'md:justify-end'
            }`}
          >
            {isAccessThisPage?.can_add && (
              <Suspense fallback={<SkeletonBlock />}>
                <LazyButtonCollapse
                  label="Add New Club"
                  isOpen={isOpenNewData}
                  handleClick={() => setIsOpenNewData(!isOpenNewData)}
                />
              </Suspense>
            )}

            <div className="flex gap-2 flex-col sm:flex-row sm:items-center sm:justify-between w-full sm:w-[60%] lg:w-[50%]">
              <div className="w-full sm:w-[50%] z-50">
                <Suspense fallback={<SkeletonBlock width="w-full" />}>
                  <LazyFilterSelect
                    dataOptions={selectDataCities}
                    placeholder="Select City"
                    filterSelectedValue={filterSelectedValue}
                    setFilterSelectedValue={setFilterSelectedValue}
                    setCurrentPage={setCurrentPage}
                  />
                </Suspense>
              </div>

              <div className="w-full sm:w-[50%]">
                <Suspense fallback={<SkeletonBlock width="w-full" />}>
                  <LazyFilterSearch
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    setCurrentPage={setCurrentPage}
                  />
                </Suspense>
              </div>

              <Tooltip text="Reset Filter" position="top">
                <Suspense fallback={<SkeletonBlock width="w-10" />}>
                  <LazyButton
                    background="black"
                    onClick={handleResetFilter}
                    className="block w-full"
                  >
                    <BiReset className="mx-auto" />
                  </LazyButton>
                </Suspense>
              </Tooltip>
            </div>
          </div>

          <Collapse isOpen={isOpenNewData}>
            <FormAddClubData
              cities={selectDataCities}
              setOpenColapse={setIsOpenNewData}
              customerData={customerData}
              selectCustomerData={selectCustomerData}
              clubListCode={clubListCode}
              setPageOptionCity={setPageCity}
              setSearchQueryOptionCity={setSearchQueryCity}
              totalPageOptionCity={totalPageOptionCity}
              setPageOptionCustomerData={setPageCustomerData}
              setSearchQueryOptionCustomerData={setSearchQueryCustomerData}
              totalPageOptionCustomerData={totalPageOptionCustomerData}
            />
          </Collapse>

          <section className="mt-3">
            <Suspense fallback={<SkeletonTable />}>
              <LazyTableClubData
                openModal={openModal}
                setOpenModal={setOpenModal}
                setGetData={setGetDetailData}
                data={clubs}
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
              title="Detail Club Data"
              openModal={openModal}
              setOpenModal={setOpenModal}
              className="overflow-y-scroll"
              rounded="rounded-xl"
            >
              <FormDetailClubData
                data={getDetailData}
                setOpenModal={setOpenModal}
                setIsOpenPopUpDelete={setPopUpDelete}
                cities={selectDataCities}
                customerData={customerData}
                selectCustomerData={selectCustomerData}
                setPageOptionCity={setPageCity}
                setSearchQueryOptionCity={setSearchQueryCity}
                totalPageOptionCity={totalPageOptionCity}
                setPageOptionCustomerData={setPageCustomerData}
                setSearchQueryOptionCustomerData={setSearchQueryCustomerData}
                totalPageOptionCustomerData={totalPageOptionCustomerData}
                isAccess={isAccessThisPage}
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

export default ClubData;
