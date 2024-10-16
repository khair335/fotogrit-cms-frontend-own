import { useState } from 'react';
import { useSelector } from 'react-redux';

import { Breadcrumb, ButtonCollapse, Collapse, Modal } from '@/components';
import { Card, CardBody } from '@/components/Card';
import { FilterSearch } from '@/components/form-input';

import useDebounce from '@/hooks/useDebounce';
import { useGetTeamMasterQuery } from '@/services/api/teamMasterApiSlice';
import { selectCurrentModules } from '@/services/state/authSlice';
import {
  FormAddWithdrawWallet,
  FormDetailWithdrawWallet,
  TableWithdrawWallet,
} from '@/components/withdraw-wallet';
import { useGetCustomerDataListQuery } from '@/services/api/customerDataApiSlice';

const breadcrumbItems = [
  { label: 'Wallet Management', url: '#' },
  { label: 'Withdraw Wallet to Bank' },
];

const WithdrawWallet = () => {
  const [isOpenNewData, setIsOpenNewData] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [filterSelectedValue, setFilterSelectedValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [getDetailData, setGetDetailData] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(10);

  const modules = useSelector(selectCurrentModules);
  const teamMasterAccess = modules[10];

  const debouncedSearchValue = useDebounce(searchValue, 500);

  const {
    data: dataTeam,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetTeamMasterQuery({
    city: filterSelectedValue,
    searchTerm: debouncedSearchValue,
    page: currentPage,
    limit: limitPerPage,
  });

  // For Options Customers from customer-data
  const [pageCustomerData, setPageCustomerData] = useState(1);
  const [searchQueryCustomerData, setSearchQueryCustomerData] = useState('');
  const debouncedSearchCustomerData = useDebounce(searchQueryCustomerData, 200);
  const { data: customers } = useGetCustomerDataListQuery({
    page: pageCustomerData,
    searchTerm: debouncedSearchCustomerData,
  });
  const selectOptionsCustomers = customers?.data?.map((item) => ({
    value: item?.id,
    label: `${item?.code} - ${item?.name || 'Anonymous'}`,
  }));
  if (Array.isArray(selectOptionsCustomers)) {
    selectOptionsCustomers.unshift({ value: '', label: 'Select User' });
  }

  return (
    <>
      <Card className="p-4">
        <Breadcrumb title="Withdraw Wallet to Bank" items={breadcrumbItems} />

        <CardBody className="mt-2">
          <div
            className={`flex flex-col-reverse gap-2 md:flex-row md:items-center md:justify-between`}
          >
            <ButtonCollapse
              label="Add New Withdraw Request"
              isOpen={isOpenNewData}
              handleClick={() => setIsOpenNewData(!isOpenNewData)}
            />

            <div className="w-full sm:w-[40%] lg:w-[25%]">
              <FilterSearch
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>

          <Collapse isOpen={isOpenNewData}>
            <FormAddWithdrawWallet
              setOpenColapse={setIsOpenNewData}
              optionsCustomers={selectOptionsCustomers}
              setPageCustomerData={setPageCustomerData}
              setSearchQueryCustomerData={setSearchQueryCustomerData}
            />
          </Collapse>

          <section className="mt-3">
            <TableWithdrawWallet
              openModal={openModal}
              setOpenModal={setOpenModal}
              setGetData={setGetDetailData}
              data={dataTeam}
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
              title="Detail Withdraw Wallet"
              openModal={openModal}
              setOpenModal={setOpenModal}
              // className="overflow-visible"
              // rounded="rounded-xl"
            >
              <FormDetailWithdrawWallet
                data={getDetailData}
                setOpenModal={setOpenModal}
                isAccess={teamMasterAccess}
              />
            </Modal>
            {/* END MODAL */}
          </section>
        </CardBody>
      </Card>
    </>
  );
};

export default WithdrawWallet;
