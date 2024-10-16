import { lazy, Suspense, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const LazyBreadcrumb = lazy(() => import('@/components/Breadcrumb'));
const LazyFilterSearch = lazy(() =>
  import('@/components/form-input/FilterSearch')
);
const LazyButtonCollapse = lazy(() => import('@/components/ButtonCollapse'));
const LazyTableModifyTopUp = lazy(() =>
  import('@/components/modify-topup/TableModifyTopUp')
);
const LazyFilterSelect = lazy(() =>
  import('@/components/form-input/FilterSelect')
);

import { Collapse, Modal, PopUpDelete } from '@/components';
import { Card, CardBody } from '@/components/Card';
import {
  FormAddModifyTopUp,
  FormDetailModifyTopUp,
} from '@/components/modify-topup';
import {
  SkeletonBlock,
  SkeletonBreadcrumb,
  SkeletonTable,
} from '@/components/Skeleton';

import useDebounce from '@/hooks/useDebounce';
import { selectCurrentModules } from '@/services/state/authSlice';
import {
  useDeleteWalletAmountMutation,
  useGetWalletAmountQuery,
} from '@/services/api/walletApiSlice';
import { optionsWalletType } from '@/constants';

const breadcrumbItems = [
  { label: 'Wallet Management', url: '#' },
  { label: 'Add/Modify Top Up Wallet' },
];

const ModifyTopUp = () => {
  const [isOpenNewData, setIsOpenNewData] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [popUpDelete, setPopUpDelete] = useState(false);
  const [getDetailData, setGetDetailData] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [filterSelectedValue, setFilterSelectedValue] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(10);

  const modules = useSelector(selectCurrentModules);
  const modifyTopUpAccess = modules[22];

  const debouncedSearchValue = useDebounce(searchValue, 500);

  const {
    data: walletAmountData,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetWalletAmountQuery({
    searchTerm: debouncedSearchValue,
    page: currentPage,
    limit: limitPerPage,
    walletType: filterSelectedValue,
  });

  const walletCode = walletAmountData?.data?.wallet_code || 'EXAMPLE-001';

  const [deleteWalletAmount, { isLoading: isLoadingDelete }] =
    useDeleteWalletAmountMutation();

  const handleDelete = async () => {
    try {
      const response = await deleteWalletAmount({
        id: getDetailData?.id,
      }).unwrap();

      if (!response?.error) {
        setPopUpDelete(false);
        setOpenModal(false);

        toast.success(`"${getDetailData?.code}" has been deleted!`, {
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

  const optionsTypes = optionsWalletType?.map((item) => ({
    value: item?.value,
    label: item?.label,
  }));
  if (Array.isArray(optionsTypes)) {
    optionsTypes.unshift({ value: '', label: 'Select Type' });
  }

  return (
    <>
      <Card className="p-4 px-6 pb-0">
        <Suspense fallback={<SkeletonBreadcrumb />}>
          <LazyBreadcrumb
            title="Add/Modify Top Up Wallet"
            items={breadcrumbItems}
          />
        </Suspense>

        <CardBody className="mt-3">
          <div
            className={`flex flex-col-reverse gap-2 md:flex-row md:items-center  ${
              modifyTopUpAccess?.can_add
                ? 'md:justify-between'
                : 'md:justify-end'
            }`}
          >
            {modifyTopUpAccess?.can_add && (
              <Suspense fallback={<SkeletonBlock />}>
                <LazyButtonCollapse
                  label="Add New Data"
                  isOpen={isOpenNewData}
                  handleClick={() => setIsOpenNewData(!isOpenNewData)}
                />
              </Suspense>
            )}

            <div className="flex gap-2 flex-col sm:flex-row sm:items-center sm:justify-between w-full sm:w-[60%] lg:w-[40%]">
              <div className="w-full sm:w-[50%] z-50">
                <Suspense fallback={<SkeletonBlock width="w-full" />}>
                  <LazyFilterSelect
                    dataOptions={optionsTypes}
                    placeholder="Select Type"
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
            </div>
          </div>

          <Collapse isOpen={isOpenNewData}>
            <FormAddModifyTopUp
              setOpenColapse={setIsOpenNewData}
              walletCode={walletCode}
            />
          </Collapse>

          <section className="mt-3">
            <Suspense fallback={<SkeletonTable />}>
              <LazyTableModifyTopUp
                openModal={openModal}
                setOpenModal={setOpenModal}
                setGetData={setGetDetailData}
                data={walletAmountData}
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
              title="Detail Modify Top Up"
              openModal={openModal}
              setOpenModal={setOpenModal}
              rounded="rounded-xl"
            >
              <FormDetailModifyTopUp
                data={getDetailData}
                setOpenModal={setOpenModal}
                setIsOpenPopUpDelete={setPopUpDelete}
                isAccess={modifyTopUpAccess}
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

export default ModifyTopUp;
