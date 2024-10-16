import { lazy, Suspense, useState } from 'react';
import { useSelector } from 'react-redux';

const LazyBreadcrumb = lazy(() => import('@/components/Breadcrumb'));
const LazyFilterSearch = lazy(() =>
  import('@/components/form-input/FilterSearch')
);
const LazyButtonCollapse = lazy(() => import('@/components/ButtonCollapse'));
const LazyTableSponsor = lazy(() =>
  import('@/components/sponsor-master/TableSponsor')
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
  useDeleteSponsorMutation,
  useGetSponsorsQuery,
} from '@/services/api/othersApiSlice';
import { toast } from 'react-toastify';
import FormDetailSponsor from '@/components/sponsor-master/FormDetailSponsor';
import FormAddSponsor from '@/components/sponsor-master/FormAddSponsor';

const breadcrumbItems = [{ label: 'Sponsor Management', url: '#' }, { label: 'Sponsor' }];

const SponsorMaster = () => {
  const [isOpenNewData, setIsOpenNewData] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [popUpDelete, setPopUpDelete] = useState(false);
  const [getDetailData, setGetDetailData] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(10);
  const debouncedSearchValue = useDebounce(searchValue, 500);

  const modules = useSelector(selectCurrentModules);
  const isAccessThisPage = modules[42];

  const {
    data: ageGroupData,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetSponsorsQuery({
    searchTerm: debouncedSearchValue,
    page: currentPage,
    limit: limitPerPage,
  });

  const [deleteSponsor, { isLoading: isLoadingDelete }] =
    useDeleteSponsorMutation();
  const handleDelete = async () => {
    try {
      const response = await deleteSponsor({ id: getDetailData?.id }).unwrap();

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
          <LazyBreadcrumb title="Sponsor" items={breadcrumbItems} />
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
                  label="Add New Sponsor"
                  isOpen={isOpenNewData}
                  handleClick={() => setIsOpenNewData(!isOpenNewData)}
                />
              </Suspense>
            )}

            <div className="w-full sm:w-[40%] lg:w-[26%]">
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
            <FormAddSponsor setOpenColapse={setIsOpenNewData} />
          </Collapse>

          <section className="mt-4">
            <Suspense fallback={<SkeletonTable />}>
              <LazyTableSponsor
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
              title="Detail Sponsor"
              openModal={openModal}
              setOpenModal={setOpenModal}
              className="overflow-visible"
              rounded="rounded-lg"
            >
              <FormDetailSponsor
                data={getDetailData}
                setOpenModal={setOpenModal}
                isAccess={isAccessThisPage}
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

export default SponsorMaster;
