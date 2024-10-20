import { Collapse, Modal, PopUpDelete } from '@/components';
import { Card, CardBody } from '@/components/Card';
import FormAddNews from '@/components/news-master/FormAddNews';
import FormDetailNews from '@/components/news-master/FormDetailNews';
import { SkeletonBlock, SkeletonBreadcrumb, SkeletonTable } from '@/components/Skeleton';
import FormAddSponsor from '@/components/sponsor-master/FormAddSponsor';
import FormDetailSponsor from '@/components/sponsor-master/FormDetailSponsor';
import useDebounce from '@/hooks/useDebounce';
import { useDeleteSponsorMutation, useGetSponsorsQuery } from '@/services/api/othersApiSlice';
import { selectCurrentModules } from '@/services/state/authSlice';
import { lazy, Suspense, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
const LazyBreadcrumb = lazy(() => import('@/components/Breadcrumb'));
const LazyFilterSearch = lazy(() =>
  import('@/components/form-input/FilterSearch')
);
const LazyButtonCollapse = lazy(() => import('@/components/ButtonCollapse'));
const LazyTableNews = lazy(() =>
  import('@/components/news-master/TableNews')
);
const breadcrumbItems = [];

const News = () => {
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
    <Card className="p-4 px-6 pb-0">
       <Suspense fallback={<SkeletonBreadcrumb />}>
          <LazyBreadcrumb title="Add/Modify News" items={breadcrumbItems} />
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
                  label="Add new News"
                  isOpen={isOpenNewData}
                  handleClick={() => setIsOpenNewData(!isOpenNewData)}
                />
              </Suspense>
            )}


          </div>

          <Collapse isOpen={isOpenNewData}>
            <FormAddNews setOpenColapse={setIsOpenNewData} />
          </Collapse>

          <section className="mt-4">
            <Suspense fallback={<SkeletonTable />}>
              <LazyTableNews
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
              <FormDetailNews
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
  );
};

export default News;