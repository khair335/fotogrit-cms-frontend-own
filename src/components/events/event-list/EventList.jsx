import { useState } from 'react';
import { toast } from 'react-toastify';

import {
  ButtonCollapse,
  Collapse,
  Modal,
  PopUp,
  PopUpDelete,
  PopUpUploading,
} from '@/components';
import FormAddEventList from './FormAddEventList';
import TableEventList from './TableEventList';
import { FilterSearch } from '@/components/form-input';
import FormDetailEventList from './FormDetailEventList';

import { useDeleteEventListMutation } from '@/services/api/eventsApiSlice';
import { useGetOptionsEventMatchQuery } from '@/services/api/othersApiSlice';

const EventList = (props) => {
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
    optionsCities,
    currentPage,
    setCurrentPage,
    limitPerPage,
    isAccess,
    eventGroupData,
    price,
    setCurrentActiveTab,
    modules,
    isTeamManager,
  } = props;

  const [isOpenNewData, setIsOpenNewData] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [popUpDelete, setPopUpDelete] = useState(false);
  const [popUpUploading, setPopUpUploading] = useState(false);
  const [getData, setGetData] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [isUploadCompleted, setIsUploadCompleted] = useState(false);
  const [isOpenPopUpShowThumbnail, setIsOpenPopUpShowThumbnail] =
    useState(false);

  const streamContaboAccess = modules[20];
  const faceReqognitionAccess = modules[21];

  const metaPagination = data?.meta;
  const events = data?.data?.events;
  const eventCode = data?.data?.event_code;

  const [deleteEventList, { isLoading: isLoadingDelete }] =
    useDeleteEventListMutation();

  // for options event match category
  const { data: eventMatch } = useGetOptionsEventMatchQuery();
  const optionsEventMatch = eventMatch?.data?.map((item) => ({
    value: item?.id,
    label: item?.name,
  }));
  if (Array.isArray(optionsEventMatch)) {
    optionsEventMatch.unshift({ value: '', label: 'Select Event Match' });
  }

  const handleDelete = async () => {
    try {
      const response = await deleteEventList({
        id: getData?.id,
      }).unwrap();

      if (!response.error) {
        setPopUpDelete(false);
        setOpenModal(false);
        toast.success(`"${getData?.event_name}" has been deleted!`, {
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

  const fileExtensionCoverImage =
    getData && getData?.cover_image.split('.').pop().toLowerCase();

  return (
    <div>
      <div
        className={`flex flex-col-reverse gap-2 md:flex-row md:items-center mb-4  ${
          !isTeamManager
            ? isAccess?.can_add
              ? 'md:justify-between'
              : 'md:justify-end'
            : 'md:justify-end'
        }`}
      >
        {!isTeamManager
          ? isAccess?.can_add && (
              <ButtonCollapse
                label="Add New Event"
                isOpen={isOpenNewData}
                handleClick={() => setIsOpenNewData(!isOpenNewData)}
              />
            )
          : null}

        <div className="w-full sm:w-[50%] lg:w-[30%]">
          <FilterSearch
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      <Collapse isOpen={isOpenNewData}>
        <FormAddEventList
          setIsOpenNewData={setIsOpenNewData}
          optionsTeams={optionsTeams}
          optionsCities={optionsCities}
          optionsEventMatch={optionsEventMatch}
          eventCode={eventCode}
          eventGroupID={eventGroupID}
          eventGroupData={eventGroupData}
          price={price}
          data={data}
        />
      </Collapse>

      <TableEventList
        openModal={openModal}
        setOpenModal={setOpenModal}
        setGetData={setGetData}
        data={events}
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        error={error}
        isOpenPopUpUploading={popUpUploading}
        setIsOpenPopUpUploading={setPopUpUploading}
        selectedEventId={selectedEventId}
        setSelectedEventId={setSelectedEventId}
        setIsUploadCompleted={setIsUploadCompleted}
        isAccessStreamContabo={streamContaboAccess}
        isAccessFaceReqognition={faceReqognitionAccess}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        limitPerPage={limitPerPage}
        metaPagination={metaPagination}
        isTeamManager={isTeamManager}
      />

      {/* MODAL */}
      <Modal
        title="Detail Event List"
        openModal={openModal}
        setOpenModal={setOpenModal}
      >
        <FormDetailEventList
          data={getData}
          setIsOpenPopUpDelete={setPopUpDelete}
          setOpenModal={setOpenModal}
          optionsTeams={optionsTeams}
          optionsCities={optionsCities}
          optionsEventMatch={optionsEventMatch}
          eventGroupID={eventGroupID}
          setCurrentActiveTab={setCurrentActiveTab}
          isAccessStreamContabo={streamContaboAccess}
          isAccessFaceReqognition={faceReqognitionAccess}
          isAccess={isAccess}
          eventCode={eventCode}
          eventGroupData={eventGroupData}
          setIsOpenPopUpShowThumbnail={setIsOpenPopUpShowThumbnail}
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
      {/* End Pop Up Uploading */}

      {/* Pop Up Delete */}
      {popUpUploading && (
        <PopUpUploading
          isOpenPopUpUploading={popUpUploading}
          setIsOpenPopUpUploading={setPopUpUploading}
          setCurrentActiveTab={setCurrentActiveTab}
          selectedEventId={selectedEventId}
          isUploadCompleted={isUploadCompleted}
          setIsUploadCompleted={setIsUploadCompleted}
        />
      )}
      {/* End Pop Up Uploading */}

      {/* POPUP SHOW THUMBNAIL */}
      <div className="">
        <PopUp
          setIsOpenPopUp={setIsOpenPopUpShowThumbnail}
          isOpenPopUp={isOpenPopUpShowThumbnail}
        >
          <div className="w-[200px]  md:w-[400px] md:h-[300px] lg:w-[600px] lg:h-[400px] rounded-md overflow-hidden">
            {fileExtensionCoverImage === 'mp4' ? (
              <video
                className="object-contain object-center w-full h-full"
                controls={true}
                muted
              >
                <source
                  src={getData?.cover_image}
                  type={`video/${fileExtensionCoverImage}`}
                />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={getData?.cover_image}
                alt={`img-${getData?.group_code}`}
                className="object-contain rounded-sm object-center w-full h-full"
              />
            )}
          </div>
        </PopUp>
      </div>
      {/* END SHOW THUMBNAIL */}
    </div>
  );
};

export default EventList;
