import { useState } from 'react';

import { FilterSearch, FilterSelect, Input } from '@/components/form-input';
import { Modal, Progress } from '@/components';
import TableCheckRequirement from './TableCheckRequirement';
import FormDetailCheckRequirement from './FormDetailCheckRequirement';

import useDebounce from '@/hooks/useDebounce';
import { useGetTeamMasterQuery } from '@/services/api/teamMasterApiSlice';

const CheckRequirement = () => {
  const [isOpenNewData, setIsOpenNewData] = useState(false);
  const [filterSelectedAgeGroup, setFilterSelectedAgeGroup] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [getDetailData, setGetDetailData] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(10);
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const {
    data: dataListRequest,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetTeamMasterQuery({
    city: filterSelectedAgeGroup,
    searchTerm: debouncedSearchValue,
    page: currentPage,
    limit: limitPerPage,
  });

  return (
    <>
      <div className="flex flex-col gap-2 border-b border-ftbrown/70 pb-3">
        <div className="w-full sm:w-[36%] sm:ml-auto">
          <Progress value="30" label="Progress of Admin" />
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 sm:items-end gap-2 lg:gap-4">
          <div className="w-full z-20">
            <FilterSelect
              // dataOptions={options}
              placeholder="Select Age group"
              filterSelectedValue={filterSelectedAgeGroup}
              setFilterSelectedValue={setFilterSelectedAgeGroup}
            />
          </div>
          <div className="w-full z-10">
            <FilterSelect
              // dataOptions={options}
              placeholder="Select Group ID"
              filterSelectedValue={filterSelectedAgeGroup}
              setFilterSelectedValue={setFilterSelectedAgeGroup}
            />
          </div>
          <Input
            label="Club ID"
            name="clubIdAdmin"
            placeholder="Select Club ID"
            value="12345"
            disabled
          />
          <Input
            label="Participation Status"
            name="participationStatusAdmin"
            placeholder="Participation Status"
            value="Approved"
            disabled
          />
          <div className="w-full z-10">
            <FilterSelect
              // dataOptions={options}
              placeholder="Select Group ID"
              filterSelectedValue={filterSelectedAgeGroup}
              setFilterSelectedValue={setFilterSelectedAgeGroup}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end my-2">
        <div className="w-full sm:w-[30%]">
          <FilterSearch
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        </div>
      </div>

      <section>
        <TableCheckRequirement
          openModal={openModal}
          setOpenModal={setOpenModal}
          setGetData={setGetDetailData}
          data={dataListRequest}
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
          title="Detail Requirement"
          openModal={openModal}
          setOpenModal={setOpenModal}
        >
          <FormDetailCheckRequirement
            data={getDetailData}
            setOpenModal={setOpenModal}
          />
        </Modal>
        {/* END MODAL */}
      </section>
    </>
  );
};

export default CheckRequirement;
