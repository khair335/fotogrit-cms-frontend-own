import { useState } from 'react';

import { FilterSearch, FilterSelect } from '@/components/form-input';
import { ButtonCollapse, Collapse, Modal } from '@/components';

import FormDetailCreateRequirement from './FormDetailCreateRequirement';
import TableCreateRequirement from './TableCreateRequirement';
import FormAddNewRequirement from './FormAddNewRequirement';

import useDebounce from '@/hooks/useDebounce';
import { useGetTeamMasterQuery } from '@/services/api/teamMasterApiSlice';

const CreateRequirement = () => {
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
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-ftbrown/70 pb-3">
        <ButtonCollapse
          label="Add New Requirement"
          isOpen={isOpenNewData}
          handleClick={() => setIsOpenNewData(!isOpenNewData)}
        />

        <div className="w-full sm:w-[60%] lg:w-[50%] flex flex-col sm:flex-row gap-2 items-center">
          <div className="w-full sm:w-[50%] z-20">
            <FilterSelect
              // dataOptions={options}
              placeholder="Select Age group"
              filterSelectedValue={filterSelectedAgeGroup}
              setFilterSelectedValue={setFilterSelectedAgeGroup}
            />
          </div>
          <div className="w-full sm:w-[50%] z-10">
            <FilterSelect
              // dataOptions={options}
              placeholder="Select Group ID"
              filterSelectedValue={filterSelectedAgeGroup}
              setFilterSelectedValue={setFilterSelectedAgeGroup}
            />
          </div>
        </div>
      </div>

      <Collapse isOpen={isOpenNewData}>
        <FormAddNewRequirement setOpenColapse={setIsOpenNewData} />
      </Collapse>

      <div className="flex items-center justify-end my-2">
        <div className="w-full sm:w-[30%]">
          <FilterSearch
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        </div>
      </div>

      <section>
        <TableCreateRequirement
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
          <FormDetailCreateRequirement
            data={getDetailData}
            setOpenModal={setOpenModal}
          />
        </Modal>
        {/* END MODAL */}
      </section>
    </>
  );
};

export default CreateRequirement;
