import { useState } from 'react';
import { useSelector } from 'react-redux';

import { Breadcrumb, ButtonCollapse, Collapse, Modal } from '@/components';
import { Card, CardBody } from '@/components/Card';
import { FilterSearch } from '@/components/form-input';

import useDebounce from '@/hooks/useDebounce';
import { useGetTeamMasterQuery } from '@/services/api/teamMasterApiSlice';
import { selectCurrentModules } from '@/services/state/authSlice';
import { FormAddTopup, FormDetailTopup, TableTopup } from '@/components/topup';

const breadcrumbItems = [
  { label: 'Wallet Management', url: '#' },
  { label: 'Top Up Wallet' },
];

const Topup = () => {
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

  return (
    <>
      <Card className="p-4">
        <Breadcrumb title="Top Up Wallet" items={breadcrumbItems} />

        <CardBody className="mt-2">
          <div
            className={`flex flex-col-reverse gap-2 md:flex-row md:items-center md:justify-between`}
          >
            <ButtonCollapse
              label="Top Up Wallet"
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
            <FormAddTopup setOpenColapse={setIsOpenNewData} />
          </Collapse>

          <section className="mt-3">
            <TableTopup
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
              title="Detail Top Up Wallet"
              openModal={openModal}
              setOpenModal={setOpenModal}
              // className="overflow-visible"
              // rounded="rounded-xl"
            >
              <FormDetailTopup
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

export default Topup;
