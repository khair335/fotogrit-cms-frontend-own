import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import {
  Button,
  ButtonCollapse,
  Collapse,
  Modal,
  PopUp,
  PopUpDelete,
} from '@/components';
import { FilterSearch, FilterSelect } from '@/components/form-input';
import FormAddRosterList from './FormAddRosterList';
import TableRosterList from './TableRosterList';
import FormDetailRosterList from './FormDetailRosterList';

import { useDeleteRosterListMutation } from '@/services/api/eventsApiSlice';

const RosterList = (props) => {
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
    optionsCustomers,
    setCurrentPage,
    limitPerPage,
    isAccess,
    eventGroupData,
    currentPage,
    filterSelectedRosterTeam,
    setFilterSelectedRosterTeam,
    optionsEventGroup,
    isUT014,
    isAdmin,
  } = props;

  const [isOpenNewData, setIsOpenNewData] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [popUpDelete, setPopUpDelete] = useState(false);
  const [getData, setGetData] = useState('');
  const [isOpenPopUp, setIsOpenPopUp] = useState(false);

  const metaPagination = data?.meta;
  const rosters = data?.data?.rosters;
  const rosterCode = data?.data?.roster_code;

  const [deleteRosterList, { isLoading: isLoadingDelete }] =
    useDeleteRosterListMutation();

  const handleDelete = async () => {
    try {
      const response = await deleteRosterList({
        id: getData?.id,
      }).unwrap();

      if (!response.error) {
        setPopUpDelete(false);
        setOpenModal(false);
        toast.success(`Roster list "${getData?.code}" has been deleted!`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      console.error('Failed to delete data', err);
      toast.error(`Failed to delete`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const matchedEventGroup = optionsEventGroup?.find(
    (item) => item?.value === eventGroupID
  );

  const today = new Date();
  const lockRosterDate = new Date(matchedEventGroup?.lockRosterDate);
  const isTodayOrAfterLockDate = (date) => {
    const dateWithoutTime = new Date(date.setHours(0, 0, 0, 0));
    const todayWithoutTime = new Date(today.setHours(0, 0, 0, 0));
    return todayWithoutTime >= dateWithoutTime;
  };
  const disableRoster = isTodayOrAfterLockDate(lockRosterDate);

  const handleClickButtonAddRoster = () => {
    if (disableRoster && !isAdmin) {
      setIsOpenPopUp(true);
    } else {
      setIsOpenNewData(!isOpenNewData);
    }
  };

  useEffect(() => {
    setIsOpenNewData(false);
  }, [eventGroupID]);

  return (
    <>
      <div
        className={`flex flex-col-reverse gap-2 md:flex-row md:items-center  ${
          isAccess?.can_add ? 'md:justify-between' : 'md:justify-end'
        }`}
      >
        {isAccess?.can_add && (
          <ButtonCollapse
            label="Add New Roster"
            isOpen={isOpenNewData}
            handleClick={() => handleClickButtonAddRoster()}
          />
        )}

        <div className="flex gap-2 flex-col sm:flex-row sm:items-center sm:justify-between w-full sm:w-[60%] lg:w-[50%]">
          <div className="w-full sm:w-[50%] z-20">
            <FilterSelect
              dataOptions={optionsTeams}
              placeholder="Select Team"
              filterSelectedValue={filterSelectedRosterTeam}
              setFilterSelectedValue={setFilterSelectedRosterTeam}
              setCurrentPage={setCurrentPage}
            />
          </div>

          <div className="w-full sm:w-[50%]">
            <FilterSearch
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </div>

      <Collapse isOpen={isOpenNewData}>
        <FormAddRosterList
          setIsOpenNewData={setIsOpenNewData}
          optionsTeams={optionsTeams}
          optionsCustomers={optionsCustomers}
          rosterCode={rosterCode}
          eventGroupID={eventGroupID}
          eventGroupData={eventGroupData}
        />
      </Collapse>

      <div className="mt-4">
        <TableRosterList
          openModal={openModal}
          setOpenModal={setOpenModal}
          setGetData={setGetData}
          data={rosters}
          isLoading={isLoading}
          isSuccess={isSuccess}
          isError={isError}
          error={error}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          metaPagination={metaPagination}
          limitPerPage={limitPerPage}
          eventGroupID={eventGroupID}
        />
      </div>

      {/* MODAL */}
      <Modal
        title="Detail Roster List"
        openModal={openModal}
        setOpenModal={setOpenModal}
        className="sm:overflow-visible "
        rounded="rounded-xl"
      >
        <FormDetailRosterList
          data={getData}
          setIsOpenPopUpDelete={setPopUpDelete}
          setOpenModal={setOpenModal}
          optionsTeams={optionsTeams}
          optionsCustomers={optionsCustomers}
          isAccess={isAccess}
          isAdmin={isAdmin}
          disableRoster={disableRoster}
          eventGroupID={eventGroupID}
        />
      </Modal>
      {/* END MODAL */}

      {/* Pop Up Delete */}
      {popUpDelete && (
        <PopUpDelete
          handleDelete={handleDelete}
          isLoading={isLoadingDelete}
          isOpenPopUpDelete={popUpDelete}
          setIsOpenPopUpDelete={setPopUpDelete}
        />
      )}
      {/* End Pop Up Delete */}

      {/* POPUP */}
      <PopUp isOpenPopUp={isOpenPopUp} setIsOpenPopUp={setIsOpenPopUp}>
        <p className="max-w-sm mb-4 font-medium text-center mt-2 text-base">
          Not possible to add this Roster anymore.
        </p>

        <div className="flex items-center justify-center">
          <Button
            background="black"
            className="w-16"
            onClick={() => setIsOpenPopUp(false)}
          >
            Ok
          </Button>
        </div>
      </PopUp>
      {/* END */}
    </>
  );
};

export default RosterList;
