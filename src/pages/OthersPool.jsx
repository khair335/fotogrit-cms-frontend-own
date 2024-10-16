import { lazy, Suspense, useState } from 'react';
import { useSelector } from 'react-redux';

const LazyBreadcrumb = lazy(() => import('@/components/Breadcrumb'));
const LazyFilterSearch = lazy(() =>
  import('@/components/form-input/FilterSearch')
);
const LazyButtonCollapse = lazy(() => import('@/components/ButtonCollapse'));
const LazyTablePool = lazy(() => import('@/components/others-pool/TablePool'));

import { Collapse, Modal, PopUpDelete } from '@/components';
import { Card, CardBody } from '@/components/Card';
import { FormAddPool, FormDetailPool } from '@/components/others-pool';
import {
  SkeletonBlock,
  SkeletonBreadcrumb,
  SkeletonTable,
} from '@/components/Skeleton';

import useDebounce from '@/hooks/useDebounce';
import { selectCurrentModules } from '@/services/state/authSlice';
import {
  useDeleteEventPoolMutation,
  useGetEventPoolQuery,
} from '@/services/api/othersApiSlice';
import { toast } from 'react-toastify';

const breadcrumbItems = [{ label: 'Settings', url: '#' }, { label: 'Pool' }];

const OthersPool = () => {
  const [isOpenNewData, setIsOpenNewData] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [getDetailData, setGetDetailData] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [popUpDelete, setPopUpDelete] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(10);

  const modules = useSelector(selectCurrentModules);
  const isAccessThisPage = modules[39];

  const debouncedSearchValue = useDebounce(searchValue, 500);

  const {
    data: eventPool,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetEventPoolQuery({
    searchTerm: debouncedSearchValue,
    page: currentPage,
    limit: limitPerPage,
  });

  const [deleteEventPool, { isLoading: isLoadingDelete }] =
    useDeleteEventPoolMutation();

  const handleDelete = async () => {
    try {
      const response = await deleteEventPool({
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
          <LazyBreadcrumb title="Pool" items={breadcrumbItems} />
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
                  label="Add New Pool"
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
            <FormAddPool setOpenColapse={setIsOpenNewData} />
          </Collapse>

          <section className="mt-4">
            <Suspense fallback={<SkeletonTable />}>
              <LazyTablePool
                openModal={openModal}
                setOpenModal={setOpenModal}
                setGetData={setGetDetailData}
                data={eventPool}
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
              title="Detail Pool"
              openModal={openModal}
              setOpenModal={setOpenModal}
            >
              <FormDetailPool
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

export default OthersPool;
