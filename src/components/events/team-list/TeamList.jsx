import { useState } from 'react';

import TableTeamList from './TableTeamList';
import FormDetailTeamList from './FormDetailTeamList';
import { Modal } from '@/components';
import { FilterSearch } from '@/components/form-input';

const TeamList = (props) => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    searchValue,
    setSearchValue,
    eventGroupID,
    optionsTeams,
    isAccess,
    currentPage,
    setCurrentPage,
    limitPerPage,
    metaPagination,
    isTeamManager,
  } = props;

  const [openModal, setOpenModal] = useState(false);
  const [getData, setGetData] = useState('');

  return (
    <div>
      <div className="flex items-center justify-end w-full mb-5">
        <div className="w-full sm:w-[50%] lg:w-[30%] ">
          <FilterSearch
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      <TableTeamList
        openModal={openModal}
        setOpenModal={setOpenModal}
        setGetData={setGetData}
        data={data}
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        error={error}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        metaPagination={metaPagination}
        limitPerPage={limitPerPage}
        isTeamManager={isTeamManager}
      />

      {/* MODAL */}
      <Modal
        title="Detail Team List"
        openModal={openModal}
        setOpenModal={setOpenModal}
        className={`overflow-visible`}
        rounded="rounded-xl"
      >
        <FormDetailTeamList
          data={getData}
          eventGroupID={eventGroupID}
          optionsTeams={optionsTeams}
          isAccess={isAccess}
          setOpenModal={setOpenModal}
        />
      </Modal>
      {/* END MODAL */}
    </div>
  );
};

export default TeamList;
