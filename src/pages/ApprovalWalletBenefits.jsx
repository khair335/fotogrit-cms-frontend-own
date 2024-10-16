import { Suspense, lazy, useState } from 'react';

const LazyBreadcrumb = lazy(() => import('@/components/Breadcrumb'));
const LazyFilterSearch = lazy(() =>
  import('@/components/form-input/FilterSearch')
);
const LazyTableApprovalWalletBenefits = lazy(() =>
  import('@/components/approval-wallet-benefits/TableApprovalWalletBenefits')
);

import { Modal } from '@/components';
import { Card, CardBody } from '@/components/Card';
import { FormDetailApprovalWalletBenefits } from '@/components/approval-wallet-benefits';
import {
  SkeletonBlock,
  SkeletonBreadcrumb,
  SkeletonTable,
} from '@/components/Skeleton';

import useDebounce from '@/hooks/useDebounce';
import { useGetApprovalReferralCodeQuery } from '@/services/api/referralCodeApiSlice';
import { useGetCustomerDataListQuery } from '@/services/api/customerDataApiSlice';

const ApprovalWalletBenefits = () => {
  const [openModal, setOpenModal] = useState(false);
  const [getDetailData, setGetDetailData] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(10);

  const debouncedSearchValue = useDebounce(searchValue, 500);

  const { data, isLoading, isSuccess, isError, error } =
    useGetApprovalReferralCodeQuery({
      searchTerm: debouncedSearchValue,
      page: currentPage,
      limit: limitPerPage,
    });

  // Get Options Customers from customer-data
  const [pageUserData, setPageUserData] = useState(1);
  const [searchQueryUserData, setSearchQueryUserData] = useState('');
  const debouncedSearchUserData = useDebounce(searchQueryUserData, 200);
  const { data: users } = useGetCustomerDataListQuery({
    page: pageUserData,
    searchTerm: debouncedSearchUserData,
  });
  const selectOptionsUsers = users?.data?.map((item) => ({
    value: item?.id,
    label: item?.name || '-',
  }));
  if (Array.isArray(selectOptionsUsers)) {
    selectOptionsUsers.unshift({ value: '', label: 'Select User' });
  }

  const breadcrumbItems = [
    { label: 'Approval Management', url: '#' },
    { label: 'Approval Wallet Benefits' },
  ];

  return (
    <>
      <Card className="p-5">
        <Suspense fallback={<SkeletonBreadcrumb />}>
          <LazyBreadcrumb
            title="Approval Wallet Benefits"
            items={breadcrumbItems}
          />
        </Suspense>

        <CardBody className="mt-3">
          <div
            className={`flex flex-col-reverse gap-2 md:flex-row md:items-center  md:justify-end`}
          >
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

          <section className="mt-3">
            <Suspense fallback={<SkeletonTable />}>
              <LazyTableApprovalWalletBenefits
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
              title="Detail Approval Walet Benefits"
              openModal={openModal}
              setOpenModal={setOpenModal}
              rounded="rounded-xl"
            >
              <FormDetailApprovalWalletBenefits
                data={getDetailData}
                setOpenModal={setOpenModal}
              />
            </Modal>
            {/* END MODAL */}
          </section>
        </CardBody>
      </Card>
    </>
  );
};

export default ApprovalWalletBenefits;
