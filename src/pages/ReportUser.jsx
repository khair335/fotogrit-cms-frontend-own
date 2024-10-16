import { useState } from 'react';
import { useSelector } from 'react-redux';

import { Breadcrumb, Modal } from '@/components';
import { Card, CardBody } from '@/components/Card';
import { FilterSearch } from '@/components/form-input';

import useDebounce from '@/hooks/useDebounce';
import { useGetTeamMasterQuery } from '@/services/api/teamMasterApiSlice';
import { selectCurrentModules } from '@/services/state/authSlice';
import {
  FormDetailReportUser,
  TableReportUser,
} from '@/components/report-user';

const breadcrumbItems = [{ label: 'Reports', url: '#' }, { label: 'Users' }];

const ReportUser = () => {
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
        <Breadcrumb title="Users" items={breadcrumbItems} />

        <CardBody className="mt-2">
          <div
            className={`flex flex-col-reverse gap-2 md:flex-row md:items-center md:justify-end`}
          >
            <div className="w-full sm:w-[40%] lg:w-[25%]">
              <FilterSearch
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>

          <section className="mt-3">
            <TableReportUser
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
              title="Detail User"
              openModal={openModal}
              setOpenModal={setOpenModal}
              // className="overflow-visible"
              // rounded="rounded-xl"
            >
              <FormDetailReportUser
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

export default ReportUser;
