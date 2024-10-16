import { lazy, Suspense, useState } from 'react';
import { useSelector } from 'react-redux';

const LazyBreadcrumb = lazy(() => import('@/components/Breadcrumb'));
const LazyFilterSearch = lazy(() =>
  import('@/components/form-input/FilterSearch')
);
const LazyButtonCollapse = lazy(() => import('@/components/ButtonCollapse'));
const LazyTableAgeGroup = lazy(() =>
  import('@/components/others-age-group/TableAgeGroup')
);

import { Collapse, Modal, PopUpDelete } from '@/components';
import { Card, CardBody } from '@/components/Card';
import {
  SkeletonBlock,
  SkeletonBreadcrumb,
  SkeletonTable,
} from '@/components/Skeleton';

import useDebounce from '@/hooks/useDebounce';
import { selectCurrentModules } from '@/services/state/authSlice';
import {
  FormAddAgeGroup,
  FormDetailAgeGroup,
  TableAgeGroup,
} from '@/components/others-age-group';
import {
  useDeleteAgeGroupMutation,
  useGetAgeGroupQuery,
} from '@/services/api/othersApiSlice';
import { toast } from 'react-toastify';

const breadcrumbItems = [{ label: 'Settings', url: '#' }, { label: 'Age Group' }];

export const optionsGender = [
  {
    value: -1,
    label: 'Select Gender',
  },
  {
    value: 1,
    label: 'Putri',
  },
  {
    value: 2,
    label: 'Putra',
  },
  {
    value: 3,
    label: 'Mix',
  },
];

const OthersAgeGroup = () => {
  const [isOpenNewData, setIsOpenNewData] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [popUpDelete, setPopUpDelete] = useState(false);
  const [getDetailData, setGetDetailData] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(10);

  const modules = useSelector(selectCurrentModules);
  const isAccessThisPage = modules[19];

  const debouncedSearchValue = useDebounce(searchValue, 500);

  const {
    data: ageGroupData,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetAgeGroupQuery({
    searchTerm: debouncedSearchValue,
    page: currentPage,
    limit: limitPerPage,
  });

  const [deleteAgeGroup, { isLoading: isLoadingDelete }] =
    useDeleteAgeGroupMutation();

  const handleDelete = async () => {
    try {
      const response = await deleteAgeGroup({ id: getDetailData?.id }).unwrap();

      if (!response?.error) {
        setPopUpDelete(false);
        setOpenModal(false);

        toast.success(
          `"${getDetailData?.age_group} ${getDetailData?.gender}" has been deleted!`,
          {
            position: 'top-right',
            theme: 'light',
          }
        );
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

  return (
    <>
      <Card className="p-4 px-6 pb-0">
        <Suspense fallback={<SkeletonBreadcrumb />}>
          <LazyBreadcrumb title="Age Group" items={breadcrumbItems} />
        </Suspense>

        <CardBody className="mt-4">
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
                  label="Add New Age Group"
                  isOpen={isOpenNewData}
                  handleClick={() => setIsOpenNewData(!isOpenNewData)}
                />
              </Suspense>
            )}

            <div className="w-full sm:w-[40%] lg:w-[30%]">
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
            <FormAddAgeGroup
              setOpenColapse={setIsOpenNewData}
              optionsGender={optionsGender}
            />
          </Collapse>

          <section className="mt-4">
            <Suspense fallback={<SkeletonTable />}>
              <LazyTableAgeGroup
                openModal={openModal}
                setOpenModal={setOpenModal}
                setGetData={setGetDetailData}
                data={ageGroupData}
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
              title="Detail Age Group"
              openModal={openModal}
              setOpenModal={setOpenModal}
              className="overflow-visible"
              rounded="rounded-lg"
            >
              <FormDetailAgeGroup
                data={getDetailData}
                setOpenModal={setOpenModal}
                isAccess={isAccessThisPage}
                optionsGender={optionsGender}
                setIsOpenPopUpDelete={setPopUpDelete}
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

export default OthersAgeGroup;
