import React, { useEffect, useState } from 'react';
import { Button, LoaderButtonAction } from '@/components';
import { FaPlus } from 'react-icons/fa';
import { SelectInput, Input } from '@/components/form-input';
import { toast } from 'react-toastify';
import { formatDateYearToDay } from '@/helpers/FormatDateYearToDay';
import { useAddNewEventGroupMutation } from '@/services/api/eventGroupApiSlice';
import { useAddNewEventListMutation } from '@/services/api/eventsApiSlice';
import { useUpdateStatusEventCheckingMutation } from '@/services/api/serviceRequestApiSlice';
import { optionsEventType } from '@/constants';

const FormConfirmationEventChecking = (props) => {
  const {
    data,
    prices,
    optionsEventGroups,
    setPageOptionEventGroup,
    setSearchQueryOptionEventGroup,
    totalPageOptionEventGroup,
    setIsOpenModalConfirmation,
    optionsEvents,
    setPageOptionEvent,
    setSearchQueryOptionEvent,
    totalPageOptionEvent,
    setEventGropID,
  } = props;

  const intialValueEventGroup = {
    name: '',
    dateStart: '',
    dateFinish: '',
    location: '',
    photoPrice: 0,
    videoPrice: 0,
  };
  const intialValueEvent = {
    eventGroupID: '',
    eventName: '',
    location: '',
    date: '',
    photoPrice: 0,
    videoPrice: 0,
    timeStart: '',
    timeFinish: '',
    picName: '',
  };
  const [formEventGroup, setFormEventGroup] = useState(intialValueEventGroup);
  const [formEvent, setFormEvent] = useState(intialValueEvent);
  const [selectedEventGroup, setSelectedEventGroup] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('');
  const [isDisableHasAddedEventGroup, setIsDisableHasAddedEventGroup] =
    useState(false);
  const [isDisableHasAddedEvent, setIsDisableHasAddedEvent] = useState(false);

  const [isHasAddedEventGroup, setHasAddedEventGroup] = useState(true);
  const [isHasAddedEvent, setHasAddedEvent] = useState(true);

  const [dataEventGroupAdded, setDataEventGroupAdded] = useState({});
  const [dataEventAdded, setDataEventAdded] = useState({});

  const matchedPhoto = prices.find((item) => item?.name === 'Photo');
  const matchedVideo = prices.find((item) => item?.name === 'Video');
  const pricePhoto = matchedPhoto?.price || 0;
  const priceVideo = matchedVideo?.price || 0;

  const isDisabledInputAndButton = selectedEventGroup === '' ? false : true;

  const [
    addNewEventGroup,
    { isLoading: isLoadingEventGroup, error: errServerEventGroup },
  ] = useAddNewEventGroupMutation();

  const [
    addNewEventList,
    { isLoading: isLoadingEvent, error: errServerEvent },
  ] = useAddNewEventListMutation();

  const [
    updateStatusEventChecking,
    { isLoading: isLoadingUpdateStatus, error: errServerUpdateStatus },
  ] = useUpdateStatusEventCheckingMutation();

  const selectDataEventType = optionsEventType?.map((item) => ({
    value: item?.name,
    label: item?.name,
  }));

  const handleSubmitEventGroup = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', formEventGroup.name);
      formData.append('date_start', formEventGroup.dateStart);
      formData.append('date_finish', formEventGroup.dateStart);
      formData.append('location', formEventGroup.location);
      formData.append('photo_price', formEventGroup.photoPrice);
      formData.append('video_price', formEventGroup.videoPrice);
      formData.append('city', '-');
      formData.append('organizer_name', '-');
      formData.append('pic_organizer', '-');
      formData.append('event_type', selectedEventType);

      const response = await addNewEventGroup(formData);

      if (!response.error) {
        setIsDisableHasAddedEventGroup(true);
        setDataEventGroupAdded(response?.data?.data);
        setSelectedEventGroup(response?.data?.data?.id);
        setHasAddedEventGroup(false);

        toast.success(`Event Group "${formEventGroup?.name}" has been added!`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      console.error('Failed to save the event-group', err);
      toast.error(`Failed to save the event-group`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const handleSubmitEvent = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('event_group_id', selectedEventGroup);
      formData.append('name', formEvent.eventName);
      formData.append('location', formEvent.location);
      formData.append('date_start', formEvent.date);
      formData.append('date_finish', formEvent.date);
      formData.append('time_start', formEvent.timeStart);
      formData.append('time_finish', formEvent.timeFinish);

      formData.append('pic_event', formEvent.picName ? formEvent.picName : '-');
      formData.append('city', '-');

      formData.append('photo_price', formEvent.photoPrice);
      formData.append('video_price', formEvent.videoPrice);

      const response = await addNewEventList(formData);

      if (!response.error) {
        setIsDisableHasAddedEvent(true);
        setDataEventAdded(response?.data?.data);
        setSelectedEvent(response?.data?.data?.id);
        setHasAddedEventGroup(false);

        toast.success(`"${formEvent?.eventName}" has been added!`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      console.error('Failed to save the event list', err);
      toast.error(`Failed to save the event list`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();

    try {
      const updateData = {
        id: data?.id,
        event_group_id: dataEventGroupAdded?.id,
        event_id: dataEventAdded?.id,
      };

      const response = await updateStatusEventChecking(updateData).unwrap();

      if (!response.error) {
        setIsDisableHasAddedEvent(true);
        setIsDisableHasAddedEventGroup(true);
        setIsOpenModalConfirmation(false);

        toast.success(`Data has been added!`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      console.error('Failed to save data', err);
      toast.error(`Failed to save data`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  // Default Form Event Group
  useEffect(() => {
    if (data) {
      setFormEventGroup((prevFormInput) => ({
        ...prevFormInput,
        name: data?.event_group_name,
        location: data?.location,
        dateStart: formatDateYearToDay(data?.date),
        photoPrice: pricePhoto,
        videoPrice: priceVideo,
      }));
    }
  }, []);

  // Default Form Event
  useEffect(() => {
    if (data) {
      setFormEvent((prevFormInput) => ({
        ...prevFormInput,
        eventName: data?.event_name,
        location: data?.location,
        date: formatDateYearToDay(data?.date),
        timeStart: data?.time_start,
        timeFinish: data?.time_finish,
        picName: data?.pic_name,
      }));
    }
  }, []);

  useEffect(() => {
    if (selectedEventGroup) {
      setEventGropID(selectedEventGroup);
    } else {
      setEventGropID('');
    }
  }, [selectedEventGroup]);

  const handleChangeEventGroup = (e) => {
    const { name, value } = e.target;
    setFormEventGroup((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeEvent = (e) => {
    const { name, value } = e.target;
    setFormEvent((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      {/* FORM EVENT GROUP */}
      <form onSubmit={handleSubmitEventGroup}>
        <div className="grid gap-2 sm:grid-cols-4">
          <Input
            type="text"
            label="Event Group Request to Input"
            name="name"
            value={formEventGroup.name}
            onChange={handleChangeEventGroup}
            disabled={isDisableHasAddedEventGroup || isDisabledInputAndButton}
            errServer={errServerEventGroup?.data}
            errCodeServer="x01001"
          />
          <div className="z-10">
            <SelectInput
              name="eventType"
              data={selectDataEventType}
              label="Event Type"
              placeholder="Select Event Type"
              selectedValue={selectedEventType}
              setSelectedValue={setSelectedEventType}
              errServer={errServerEventGroup?.data}
              errCodeServer="x01015"
              disabled={isDisableHasAddedEventGroup || isDisabledInputAndButton}
            />
          </div>
          <Input
            type="text"
            label="Location"
            name="location"
            value={formEventGroup.location}
            onChange={handleChangeEventGroup}
            disabled={isDisableHasAddedEventGroup || isDisabledInputAndButton}
            errServer={errServerEventGroup?.data}
            errCodeServer="x01003"
          />
          <Input
            type="date"
            label="Date"
            name="dateStart"
            value={formEventGroup.dateStart}
            onChange={handleChangeEventGroup}
            disabled={isDisableHasAddedEventGroup || isDisabledInputAndButton}
            errServer={errServerEventGroup?.data}
            errCodeServer="x01005"
          />
        </div>
        <div className="grid gap-2 mt-2 sm:grid-cols-4 sm:mt-0">
          <div className="">
            <SelectInput
              name="eventGroup"
              data={optionsEventGroups}
              label="Correction Event Group"
              selectedValue={selectedEventGroup}
              setSelectedValue={setSelectedEventGroup}
              infiniteScroll
              setPageOption={setPageOptionEventGroup}
              setSearchQueryOption={setSearchQueryOptionEventGroup}
              totalPageOptions={totalPageOptionEventGroup}
              errServer={errServerEventGroup?.data}
              errCodeServer="x06004"
              disabled={isDisableHasAddedEventGroup}
            />
          </div>
        </div>

        <Button
          type="submit"
          background="black"
          className="mt-2 w-44"
          disabled={
            isLoadingEventGroup ||
            isDisableHasAddedEventGroup ||
            isDisabledInputAndButton
          }
        >
          {isLoadingEventGroup ? (
            <LoaderButtonAction />
          ) : (
            <span className="flex items-center gap-2">
              <FaPlus /> Add Event Group
            </span>
          )}
        </Button>
      </form>

      <hr className="my-6 border-1 border-gray-300/70" />

      {/* FORM EVENT */}
      <form onSubmit={handleSubmitEvent}>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          <Input
            type="text"
            label="Event Name Request to Input"
            name="eventName"
            value={formEvent.eventName}
            onChange={handleChangeEvent}
            disabled={isDisableHasAddedEvent || !isDisabledInputAndButton}
            errServer={errServerEvent?.data}
            errCodeServer="x06005"
          />
          <Input
            type="text"
            label="Location"
            name="location"
            value={formEvent.location}
            onChange={handleChangeEvent}
            disabled={isDisableHasAddedEvent || !isDisabledInputAndButton}
            errServer={errServerEvent?.data}
            errCodeServer="x06007"
          />
          <Input
            type="date"
            label="Date"
            name="date"
            value={formEvent.date}
            onChange={handleChangeEvent}
            disabled={isDisableHasAddedEvent || !isDisabledInputAndButton}
            errServer={errServerEvent?.data}
            errCodeServer="x06000"
          />
        </div>

        <div className="grid gap-4 mt-2 sm:grid-cols-3 sm:mt-0">
          <div className="">
            <SelectInput
              name="event"
              data={optionsEvents}
              label="Correction Event Name"
              selectedValue={selectedEvent}
              setSelectedValue={setSelectedEvent}
              infiniteScroll
              setPageOption={setPageOptionEvent}
              setSearchQueryOption={setSearchQueryOptionEvent}
              totalPageOptions={totalPageOptionEvent}
              errServer={errServerEvent?.data}
              errCodeServer="x06004"
              disabled={isDisableHasAddedEvent || !isDisabledInputAndButton}
            />
          </div>
        </div>

        <Button
          type="submit"
          background="black"
          className="mt-2 w-44"
          disabled={
            isLoadingEvent ||
            isDisableHasAddedEvent ||
            !isDisabledInputAndButton
          }
        >
          {isLoadingEvent ? (
            <LoaderButtonAction />
          ) : (
            <span className="flex items-center gap-2">
              <FaPlus /> Add Event Name
            </span>
          )}
        </Button>
      </form>

      <div className="flex items-center justify-end gap-4 mt-4">
        <Button
          background="red"
          className="w-32"
          onClick={() => setIsOpenModalConfirmation(false)}
          disabled={
            isLoadingUpdateStatus || !isHasAddedEventGroup || !isHasAddedEvent
          }
        >
          {isLoadingUpdateStatus ? <LoaderButtonAction /> : 'Cancel'}
        </Button>
        <Button
          background="black"
          className="w-32"
          onClick={handleUpdateStatus}
          disabled={isLoadingUpdateStatus || isHasAddedEventGroup}
        >
          {isLoadingUpdateStatus ? <LoaderButtonAction /> : 'Ok'}
        </Button>
      </div>
    </>
  );
};

export default FormConfirmationEventChecking;
