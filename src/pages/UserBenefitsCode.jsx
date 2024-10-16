import { useState } from 'react';

import { Breadcrumb, ButtonCollapse, Collapse, Modal } from '@/components';
import { Card, CardBody } from '@/components/Card';
import { FilterSearch } from '@/components/form-input';

import useDebounce from '@/hooks/useDebounce';
import { useGetReferralCodeQuery } from '@/services/api/referralCodeApiSlice';
import {
  FormAddCodeBenefits,
  FormAddUserBenefits,
  FormDetailUserBenefitsCode,
  TableUserBenefitsCode,
} from '@/components/user-benefits-code';
import { useGetCustomerDataListQuery } from '@/services/api/customerDataApiSlice';

const breadcrumbItems = [
  { label: 'Commerce Setting', url: '#' },
  { label: 'Add/Modify User Benefits & Code' },
];

const UserBenefitsCode = () => {
  const [isOpenNewUser, setIsOpenNewUser] = useState(false);
  const [isOpenNewCode, setIsOpenNewCode] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [getDetailData, setGetDetailData] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(10);

  // const modules = useSelector(selectCurrentModules);
  const isAccessThisPage = {
    can_access: true,
    can_add: true,
    can_delete: true,
    can_edit: true,
  };

  const debouncedSearchValue = useDebounce(searchValue, 500);

  const { data, isLoading, isSuccess, isError, error } =
    useGetReferralCodeQuery({
      searchTerm: debouncedSearchValue,
      page: currentPage,
      limit: limitPerPage,
    });

  const handleOpenNewUser = () => {
    setIsOpenNewUser(!isOpenNewUser);
    setIsOpenNewCode(false);
  };
  const handleOpenNewCode = () => {
    setIsOpenNewCode(!isOpenNewCode);
    setIsOpenNewUser(false);
  };

  // For Options Users from customer-data
  const [pageCustomerData, setPageCustomerData] = useState(1);
  const [searchQueryCustomerData, setSearchQueryCustomerData] = useState('');
  const debouncedSearchCustomerData = useDebounce(searchQueryCustomerData, 200);
  const { data: customers } = useGetCustomerDataListQuery({
    page: pageCustomerData,
    searchTerm: debouncedSearchCustomerData,
  });
  const optionsCustomers = customers?.data?.map((item) => ({
    value: item?.id,
    label: item?.name || '-',
  }));
  if (Array.isArray(optionsCustomers)) {
    optionsCustomers.unshift({ value: '', label: 'Select User' });
  }

  return (
    <>
      <Card className="p-5">
        <Breadcrumb
          title="Add/Modify Wallet Benefits Code"
          items={breadcrumbItems}
        />

        <CardBody className="mt-2">
          <div
            className={`flex flex-col-reverse gap-2 md:flex-row md:items-center  ${
              isAccessThisPage.can_add ? 'md:justify-between' : 'md:justify-end'
            }`}
          >
            {isAccessThisPage.can_add && (
              <div className="flex items-center gap-2">
                <ButtonCollapse
                  label="Add New User Benefits"
                  isOpen={isOpenNewUser}
                  handleClick={handleOpenNewUser}
                />
                <ButtonCollapse
                  label="Add New Code Benefits"
                  isOpen={isOpenNewCode}
                  handleClick={handleOpenNewCode}
                />
              </div>
            )}

            <div className="w-full sm:w-[40%] lg:w-[30%]">
              <FilterSearch
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>

          <Collapse isOpen={isOpenNewUser}>
            <FormAddUserBenefits
              setOpenColapse={setIsOpenNewUser}
              optionsUsers={optionsCustomers}
            />
          </Collapse>

          <Collapse isOpen={isOpenNewCode}>
            <FormAddCodeBenefits setOpenColapse={setIsOpenNewCode} />
          </Collapse>

          <section className="mt-2">
            <TableUserBenefitsCode
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
              title="Detail User Benefits Code"
              openModal={openModal}
              setOpenModal={setOpenModal}
              rounded="rounded-xl"
            >
              <FormDetailUserBenefitsCode
                data={getDetailData}
                setOpenModal={setOpenModal}
                isAccess={isAccessThisPage}
              />
            </Modal>
            {/* END MODAL */}
          </section>
        </CardBody>
      </Card>
    </>
  );
};

export default UserBenefitsCode;
