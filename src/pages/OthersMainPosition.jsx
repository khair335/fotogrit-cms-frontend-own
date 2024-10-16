import { lazy, Suspense, useState } from 'react';
import { useSelector } from 'react-redux';

const LazyBreadcrumb = lazy(() => import('@/components/Breadcrumb'));
const LazyFilterSearch = lazy(() =>
  import('@/components/form-input/FilterSearch')
);
const LazyButtonCollapse = lazy(() => import('@/components/ButtonCollapse'));
const LazyTableMainPosition = lazy(() =>
  import('@/components/others-main-position/TableMainPosition')
);

import { Collapse, Modal, PopUpDelete } from '@/components';
import { Card, CardBody } from '@/components/Card';
import {
  SkeletonBlock,
  SkeletonBreadcrumb,
  SkeletonTable,
} from '@/components/Skeleton';
import {
  FormAddMainPosition,
  FormDetailMainPosition,
} from '@/components/others-main-position';

import useDebounce from '@/hooks/useDebounce';
import { selectCurrentModules } from '@/services/state/authSlice';
import {
  useDeleteMainPositionMutation,
  useGetMainPositionsQuery,
} from '@/services/api/othersApiSlice';
import { toast } from 'react-toastify';

const breadcrumbItems = [
  { label: 'Settings', url: '#' },
  { label: 'Main Position' },
];

const OthersMainPosition = () => {
  const [isOpenNewData, setIsOpenNewData] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [getDetailData, setGetDetailData] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [popUpDelete, setPopUpDelete] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(10);

  const modules = useSelector(selectCurrentModules);
  const isAccessThisPage = modules[40]; // main-position

  const debouncedSearchValue = useDebounce(searchValue, 500);

  const {
    data: mainPositions,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetMainPositionsQuery({
    searchTerm: debouncedSearchValue,
    page: currentPage,
    limit: limitPerPage,
  });

  const [deleteMainPosition, { isLoading: isLoadingDelete }] =
    useDeleteMainPositionMutation();

  const handleDelete = async () => {
    try {
      const response = await deleteMainPosition({
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

  return (
    <>
      <Card className="p-4 px-6 pb-0">
        <Suspense fallback={<SkeletonBreadcrumb />}>
          <LazyBreadcrumb title="Main Position" items={breadcrumbItems} />
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
                  label="Add New Main Position"
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
            <FormAddMainPosition setOpenColapse={setIsOpenNewData} />
          </Collapse>

          <section className="mt-4">
            <Suspense fallback={<SkeletonTable />}>
              <LazyTableMainPosition
                openModal={openModal}
                setOpenModal={setOpenModal}
                setGetData={setGetDetailData}
                data={mainPositions}
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
              title="Detail Main Position"
              openModal={openModal}
              setOpenModal={setOpenModal}
            >
              <FormDetailMainPosition
                data={getDetailData}
                setOpenModal={setOpenModal}
                isAccess={isAccessThisPage}
                setIsOpenPopUpDelete={setPopUpDelete}
              />
            </Modal>
            {/* END MODAL */}
          </section>

          {/* Pop Up Delete */}
          <PopUpDelete
            handleDelete={handleDelete}
            isLoading={isLoadingDelete}
            isOpenPopUpDelete={popUpDelete}
            setIsOpenPopUpDelete={setPopUpDelete}
          />
          {/* End Pop Up Delete */}
        </CardBody>
      </Card>
    </>
  );
};

export default OthersMainPosition;
