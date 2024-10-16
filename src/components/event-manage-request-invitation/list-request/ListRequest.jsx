import { useState } from 'react';

import { FilterSearch, FilterSelect } from '@/components/form-input';
import { Modal } from '@/components';
import TableListRequest from './TableListRequest';
import FormDetailListRequest from './FormDetailListRequest';
import useDebounce from '@/hooks/useDebounce';
import { useGetTeamMasterQuery } from '@/services/api/teamMasterApiSlice';

const ListRequest = () => {
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
      <div className="flex items-center justify-end border-b border-ftbrown/70 pb-3">
        <div className="w-full sm:w-[70%] lg:w-1/2 flex flex-col sm:flex-row gap-2 items-center">
          <div className="w-full sm:w-[50%] z-50">
            <FilterSelect
              // dataOptions={options}
              placeholder="Select Age group"
              filterSelectedValue={filterSelectedAgeGroup}
              setFilterSelectedValue={setFilterSelectedAgeGroup}
            />
          </div>
          <div className="w-full sm:w-[50%] z-50">
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
        <TableListRequest
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
          title="Detail List Request"
          openModal={openModal}
          setOpenModal={setOpenModal}
          // className="overflow-visible"
          // rounded="rounded-xl"
        >
          <FormDetailListRequest
            data={getDetailData}
            setOpenModal={setOpenModal}
          />
        </Modal>
        {/* END MODAL */}
      </section>
    </>
  );
};

export default ListRequest;
