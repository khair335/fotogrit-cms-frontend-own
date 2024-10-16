import { useState } from 'react';

import { Breadcrumb, ButtonCollapse, Collapse, Modal } from '@/components';
import { Card, CardBody } from '@/components/Card';
import { FilterSearch } from '@/components/form-input';
import {
  FormAddApprovalWallet,
  FormDetailApprovalWallet,
  TableApprovalWalet,
} from '@/components/approval-wallet';

import useDebounce from '@/hooks/useDebounce';
import { useGetReferralCodeQuery } from '@/services/api/referralCodeApiSlice';
import { useGetCustomerDataListQuery } from '@/services/api/customerDataApiSlice';

const ApprovalWallet = () => {
  const [isOpenNewData, setIsOpenNewData] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [getDetailData, setGetDetailData] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(10);

  const debouncedSearchValue = useDebounce(searchValue, 500);

  const { data, isLoading, isSuccess, isError, error } =
    useGetReferralCodeQuery({
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
    { label: 'Approval Wallet' },
  ];

  return (
    <>
      <Card className="p-5">
        <Breadcrumb title="Approval Wallet" items={breadcrumbItems} />

        <CardBody className="mt-3">
          <div
            className={`flex flex-col-reverse gap-2 md:flex-row md:items-center  md:justify-end`}
          >
            <ButtonCollapse
              label="Add New Request Change Wallet Amount"
              isOpen={isOpenNewData}
              handleClick={() => setIsOpenNewData(!isOpenNewData)}
            />

            <div className="w-full sm:w-[40%] lg:w-[30%]">
              <FilterSearch
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>

          <Collapse isOpen={isOpenNewData}>
            <FormAddApprovalWallet
              setOpenColapse={setIsOpenNewData}
              optionsUsers={selectOptionsUsers}
              setPageOptionUser={setPageUserData}
              setSearchQueryOptionUser={setSearchQueryUserData}
            />
          </Collapse>

          <section className="mt-3">
            <TableApprovalWalet
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

            {/* MODAL */}
            <Modal
              title="Detail Approval Walet"
              openModal={openModal}
              setOpenModal={setOpenModal}
              rounded="rounded-xl"
            >
              <FormDetailApprovalWallet
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

export default ApprovalWallet;
