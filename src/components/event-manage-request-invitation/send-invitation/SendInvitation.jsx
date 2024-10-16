import { useState } from 'react';

import { FilterSearch, FilterSelect, TextArea } from '@/components/form-input';
import { Modal } from '@/components';
import TableSendInvitation from './TableSendInvitation';
import FormDetailSendInvitation from './FormDetailSendInvitation';

import useDebounce from '@/hooks/useDebounce';
import { useGetTeamMasterQuery } from '@/services/api/teamMasterApiSlice';

const SendInvitation = () => {
  const [filterSelectedAgeGroup, setFilterSelectedAgeGroup] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
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
        <div className="w-full xl:w-[80%] flex flex-col sm:flex-row gap-2 items-center">
          <div className="w-full sm:w-[50%]">
            <TextArea
              // label="Description"
              name="description"
              rows={2}
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="Input message"
            />
          </div>
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
        <TableSendInvitation
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
          title="Detail Send Invitation"
          openModal={openModal}
          setOpenModal={setOpenModal}
        >
          <FormDetailSendInvitation
            data={getDetailData}
            setOpenModal={setOpenModal}
          />
        </Modal>
        {/* END MODAL */}
      </section>
    </>
  );
};

export default SendInvitation;
