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
import FormAddOfficialList from './FormAddOfficalList';
import TableOfficialList from './TableOfficalList';
import FormDetailOfficialList from './FormDetailOfficalList';

import {
  useDeleteOfficialListMutation,
  useGetOptionsOfficialsQuery,
} from '@/services/api/eventsApiSlice';

const OfficialList = (props) => {
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
    filterSelectedOfficialTeam,
    setFilterSelectedOfficialTeam,
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
  const officials = data?.data?.event_official;
  const officialCode = data?.data?.event_official_code;

  const [deleteOfficialList, { isLoading: isLoadingDelete }] =
    useDeleteOfficialListMutation();

  const handleDelete = async () => {
    try {
      const response = await deleteOfficialList({
        id: getData?.id,
      }).unwrap();

      if (!response.error) {
        setPopUpDelete(false);
        setOpenModal(false);
        toast.success(`Official "${getData?.code}" has been deleted!`, {
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
  const lockOfficialDate = new Date(matchedEventGroup?.lockOfficialDate);
  const isTodayOrAfterLockDate = (date) => {
    const dateWithoutTime = new Date(date.setHours(0, 0, 0, 0));
    const todayWithoutTime = new Date(today.setHours(0, 0, 0, 0));
    return todayWithoutTime >= dateWithoutTime;
  };
  const disableOfficial = isTodayOrAfterLockDate(lockOfficialDate);

  const handleClickButtonAddOfficial = () => {
     if (!eventGroupID) {
      toast.error('Please select an event group before adding a roster.');
      return;
    }
    if (!filterSelectedOfficialTeam) {
      toast.error('Please select a team before adding a roster.');
      return;
    }
    if (disableOfficial && !isAdmin) {
      setIsOpenPopUp(true);
    } else {
      setIsOpenNewData(!isOpenNewData);
    }
  };

  useEffect(() => {
    setIsOpenNewData(false);
  }, [eventGroupID]);

  // For Options Officials
  const { data: officialData } = useGetOptionsOfficialsQuery();
  const optionsOfficials = officialData?.data?.map((item) => ({
    value: item?.id,
    label: item?.official_name,
  }));
  console.log("filterSelectedOfficialTeam", filterSelectedOfficialTeam)

  const officialAddForm = isOpenNewData && (
         <FormAddOfficialList
          setIsOpenNewData={setIsOpenNewData}
          optionsTeams={optionsTeams}
          optionsCustomers={optionsCustomers}
          officialCode={officialCode}
          eventGroupID={eventGroupID}
          eventGroupData={eventGroupData}
          optionsOfficials={optionsOfficials}
          filterSelectedOfficialTeam={filterSelectedOfficialTeam}

        />
  )
  return (
    <>
      <div
        className={`flex flex-col-reverse gap-2 md:flex-row md:items-center  ${
          isAccess?.can_add ? 'md:justify-between' : 'md:justify-end'
        }`}
      >
        {isAccess?.can_add && (
          <ButtonCollapse
            label="Add New Official"
            isOpen={isOpenNewData}
            handleClick={() => handleClickButtonAddOfficial()}
          />
        )}

        <div className="flex gap-2 flex-col sm:flex-row sm:items-center sm:justify-between w-full sm:w-[60%] lg:w-[50%]">
          <div className="w-full sm:w-[50%] z-20">
            <FilterSelect
              dataOptions={optionsTeams}
              placeholder="Select Team"
              filterSelectedValue={filterSelectedOfficialTeam}
              setFilterSelectedValue={setFilterSelectedOfficialTeam}
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

      {/* <Collapse isOpen={isOpenNewData}>
        <FormAddOfficialList
          setIsOpenNewData={setIsOpenNewData}
          optionsTeams={optionsTeams}
          optionsCustomers={optionsCustomers}
          officialCode={officialCode}
          eventGroupID={eventGroupID}
          eventGroupData={eventGroupData}
          optionsOfficials={optionsOfficials}
          filterSelectedOfficialTeam={filterSelectedOfficialTeam}

        />
      </Collapse> */}

      <div className="mt-4">
        <TableOfficialList
          openModal={openModal}
          setOpenModal={setOpenModal}
          setGetData={setGetData}
          data={officials}
          isLoading={isLoading}
          isSuccess={isSuccess}
          isError={isError}
          error={error}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          metaPagination={metaPagination}
          limitPerPage={limitPerPage}
          eventGroupID={eventGroupID}
          officialAddForm={officialAddForm}
          optionsTeams={optionsTeams}
          filterSelectedOfficialTeam={filterSelectedOfficialTeam}
        />
      </div>

      {/* MODAL */}
      <Modal
        title="Detail Official List"
        openModal={openModal}
        setOpenModal={setOpenModal}
        className="sm:overflow-visible "
        rounded="rounded-xl"
      >
        <FormDetailOfficialList
          data={getData}
          setIsOpenPopUpDelete={setPopUpDelete}
          setOpenModal={setOpenModal}
          optionsTeams={optionsTeams}
          optionsCustomers={optionsCustomers}
          isAccess={isAccess}
          optionsOfficials={optionsOfficials}
          isAdmin={isAdmin}
          disableOfficial={disableOfficial}
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
          Not possible to add this Official anymore.
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

export default OfficialList;
