import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  DatePickerCustom,
  FilterSearch,
  Input,
  RadioInput,
  SelectCustom,
  TextArea,
} from '@/components/form-input';
import { Button, LoaderButtonAction } from '@/components';
import TableRequestNewService from './TableRequestNewService';

import { CurrencyFormat } from '@/helpers/CurrencyFormat';
import { formatDateYearToDay } from '@/helpers/FormatDateYearToDay';

import { optionsMedia } from '@/constants';

import {
  useAddNewEventGroupMutation,
  useGetEventGroupListQuery,
} from '@/services/api/eventGroupApiSlice';
import {
  useAddNewEventListMutation,
  useGetOptionsEventForServiceQuery,
} from '@/services/api/eventsApiSlice';
import { useGetPricesQuery } from '@/services/api/generalSettingApiSlice';
import {
  useAddNewContractMutation,
  useAddNewServiceRequestMutation,
  useAddNewServiceRequestScoringAllEventMutation,
  useCreateSubcontractMutation,
  useGetActiveContractsQuery,
  useGetActiveSubcontractQuery,
  useGetListServiceTypesQuery,
  useGetOptionsUsersQuery,
  useGetPhotographerOptionsQuery,
  useGetRequestNewServiceQuery,
  useGetServiceTypeOptionsQuery,
} from '@/services/api/serviceRequestApiSlice';
import { useGetOptionsEventTypeQuery } from '@/services/api/othersApiSlice';
import { getIsSubcontract, setIsSubcontract } from '@/services/state/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { formatDate } from '@/helpers/FormatDate';

const FormAddRequestNewService = (props) => {
  const {
    setOpenColapseRequest,
    isClient,
    userProfile,
    isAdmin,
    userID,
    selectedProvider,
  } = props;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isSubcontract = useSelector(getIsSubcontract);

  const initialInputValue = {
    location: '',
    date: '',
    picName: '',
    startContract: '',
    endContract: '',
    note: '',
    pickDate: '',
  };
  const [formInput, setFormInput] = useState(initialInputValue);
  const [newEventInput, setNewEventInput] = useState('');
  const [isServiceIncontract, setIsServiceIncontract] = useState(false);
  const [isServiceInSubcontract, setIsServiceInSubcontract] = useState(false);
  const [minEndContractDate, setMinEndContractDate] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [finishTime, setFinishTime] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [groupExisting, setGroupExisting] = useState(true);
  const [newSingleEvent, setNewSingleEvent] = useState(false);
  const [selectOneEvent, setSelectOneEvent] = useState(true);
  const [selectAllEvent, setSelectAllEvent] = useState(false);
  const [disableOptionMedia, setDisableOptionMedia] = useState('');
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [errorsInput, setErrorsInput] = useState([]);
  const [dateSelectedEventGroup, setDateSelectedEventGroup] = useState('');

  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [selectedServiceName, setSelecedtServiceName] = useState('');
  const [selectedPhotographer, setSelectedPhotographer] = useState('');
  const [selectedUserShared, setSelectedUserShared] = useState('');
  const [selectedMedia, setSelectedMedia] = useState('');
  const [selectedEventGroup, setSelectedEventGroup] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const isEventSelected =
    selectedEvent.value && selectedEvent.pic === undefined;

  const { data, isLoading, isSuccess, isError, error } =
    useGetRequestNewServiceQuery({ serviceType: selectedProvider });

  const [addNewEventGroup, { error: errServerNewGroup }] =
    useAddNewEventGroupMutation();

  const [addNewEventList, { error: errServerNewEvent }] =
    useAddNewEventListMutation();

  const [addNewServiceRequest, { error: errServer }] =
    useAddNewServiceRequestMutation();
  const [
    addNewServiceRequestScoringAllEvent,
    { error: errServerScoringAllEvent },
  ] = useAddNewServiceRequestScoringAllEventMutation();

  const [addNewContract, { error: errServerNewContract }] =
    useAddNewContractMutation();

  const [createSubcontract] = useCreateSubcontractMutation();

  // For Options Event Types
  const { data: eventTypeData } = useGetOptionsEventTypeQuery();
  const optionsEventTypes = eventTypeData?.data?.map((item) => ({
    value: item?.id,
    label: item?.event_type,
  }));

  // For options Media
  const dataOptionsMedia = optionsMedia?.map((item) => ({
    value: item?.value,
    label: item?.label,
    // isDisabled: item?.label === disableOptionMedia,
  }));

  // For Options Service Types
  const { data: serviceTypes } = useGetListServiceTypesQuery();
  const optionsServiceTypes = serviceTypes?.data
    ?.filter((item) => item?._id !== 9) // Remove document verificator
    ?.map((item) => ({
      value: item?._id,
      label: item?.name || '-',
    }))
    .sort((a, b) => {
      if (a.isDisabled) return 1;
      if (!a.isDisabled) return -1;
      return a?.label.localeCompare(b?.label);
    });

  // Get Active Contract
  const { data: activeContracts } = useGetActiveContractsQuery();
  const activeContractList = activeContracts?.data;

  // Get Active Subcontract
  const { data: activeSubcontracts } = useGetActiveSubcontractQuery();
  const activeSubcontractList = activeSubcontracts?.data;

  // For Options Photographer
  const { data: photographers } = useGetPhotographerOptionsQuery({
    serviceType: selectedServiceType?.label,
  });
  const photographerList = photographers?.data;
  const updateOptionsPhotographer =
    selectedServiceName !== '' && selectedServiceName?.value !== ''
      ? photographerList
          ?.filter((item) => item?.id === selectedServiceName?.created_by)
          .map((item) => {
            const isContracted = activeContractList
              ?.filter((item) => item?.contract_type !== 'per event')
              ?.some(
                (contracted) => contracted?.photographer_fsp_id === item?.id
              );
            const isSubcontracted = activeSubcontractList
              ?.filter((item) => item?.contract_type !== 'per event')
              ?.some(
                (contracted) => contracted?.photographer_fsp_id === item?.id
              );

            const labeling = isSubcontract
              ? isSubcontracted
                ? `${item.name || item.email} (in subcontract)`
                : item.name || item.email
              : isContracted
              ? `${item.name || item.email} (in contract)`
              : item.name || item.email;

            return {
              value: item.id,
              label: labeling,
              contracted: isSubcontract ? isSubcontracted : isContracted,
            };
          })
      : photographerList?.map((item) => {
          const isContracted = activeContractList
            ?.filter((item) => item?.contract_type !== 'per event')
            ?.some(
              (contracted) => contracted?.photographer_fsp_id === item?.id
            );

          const isSubcontracted = activeSubcontractList
            ?.filter((item) => item?.contract_type !== 'per event')
            ?.some(
              (contracted) => contracted?.photographer_ssp_id === item?.id
            );

          const labeling = isSubcontract
            ? isSubcontracted
              ? `${item.name || item.email} (in subcontract)`
              : item.name || item.email
            : isContracted
            ? `${item.name || item.email} (in contract)`
            : item.name || item.email;

          return {
            value: item.id,
            label: labeling,
            contracted: isSubcontract ? isSubcontracted : isContracted,
          };
        });
  const optionsPhotographer = updateOptionsPhotographer?.sort((a, b) => {
    return b.contracted - a.contracted;
  });
  if (Array.isArray(optionsPhotographer)) {
    optionsPhotographer.unshift({ value: '', label: 'Select Photographer' });
  }

  // For Options Service Name
  const { data: serviceName } = useGetServiceTypeOptionsQuery({
    photographerID: selectedPhotographer?.value,
    serviceType: selectedServiceType?.label,
  });

  const updateOptionsServiceName = serviceName?.data?.map((item) => {
    const isContracted = activeContractList?.some(
      (contracted) => contracted?.service_id === item?.id
    );
    const isSubcontracted = activeSubcontractList?.some(
      (contracted) => contracted?.service_id === item?.id
    );

    const matchedContract = activeContractList?.find(
      (contracted) => contracted?.service_id === item?.id
    );
    const matchedSubcontract = activeSubcontractList?.find(
      (contracted) => contracted?.service_id === item?.id
    );

    const labeling = isSubcontract
      ? isSubcontracted && item?.payment_period !== 'per event'
        ? `${item?.name} (in subcontract)`
        : item?.name
      : isContracted && item?.payment_period !== 'per event'
      ? `${item?.name} (in contract)`
      : item?.name;

    return {
      value: item?.id,
      label: labeling,
      sales_model: item?.sales_model,
      basic_fixed_fee: item?.basic_fixed_fee,
      variable_fees: item?.variable_fees || [],
      photo_price: item?.photo_price,
      video_price: item?.video_price,
      stream_price: item?.stream_price,
      score_price: item?.score_price,
      service_type: item?.service_type,
      payment_period: item?.payment_period,
      percent_to_shared: item?.percent_to_shared,
      created_by: item?.created_by,
      contracted:
        item?.payment_period === 'per event'
          ? false
          : isSubcontract
          ? isSubcontracted
          : isContracted,
      start_contract: isSubcontract
        ? matchedSubcontract?.start_contract || ''
        : matchedContract?.start_contract || '',
      end_contract: isSubcontract
        ? matchedSubcontract?.end_contract || ''
        : matchedContract?.end_contract || '',
      contract_period: isSubcontract
        ? matchedSubcontract?.periods || ''
        : matchedContract?.periods,
    };
  });
  const optionsServiceName = updateOptionsServiceName?.sort((a, b) => {
    return b.contracted - a.contracted;
  });
  if (Array.isArray(optionsServiceName)) {
    optionsServiceName.unshift({
      value: '',
      label: 'Select Service Type',
      percent_to_shared: 0,
    });
  }

  // For Options Event Group
  const { data: eventGroupList } = useGetEventGroupListQuery({
    page: '',
    searchTerm: '',
  });
  const eventGroupData = eventGroupList?.data?.event_groups;
  const optionsEventGroup = eventGroupData?.map((item) => ({
    value: item?.id,
    label:
      item?.name === item?.code ? item?.code : `${item?.code} - ${item?.name}`,
    date_start: item?.date_start,
    date_finish: item?.date_finish,
    location: item?.location,
    pic_name: item?.pic_organizer,
  }));
  if (Array.isArray(optionsEventGroup)) {
    optionsEventGroup.unshift({ value: '', label: 'Select Event Group Name' });
  }

  // For Options Event
  const [eventGroupID, setEventGropID] = useState('');
  const { data: events } = useGetOptionsEventForServiceQuery({
    eventGroup: eventGroupID,
    startDate:
      selectedServiceName?.payment_period === 'per day' &&
      selectedServiceName?.start_contract
        ? formatDateYearToDay(selectedServiceName?.start_contract)
        : '',
    endDate:
      selectedServiceName?.payment_period === 'per day' &&
      selectedServiceName.end_contract
        ? formatDateYearToDay(selectedServiceName?.end_contract)
        : '',
  });
  const optionsEvents = events?.data?.events?.map((item) => ({
    value: item?.id,
    label: `${item?.event_code} - ${item?.event_name}`,
    pic: item?.pic_event,
    location: item?.event_location,
    date: item?.date_start,
    startTime: item?.time_start,
    finishTime: item?.time_finish,
  }));
  if (Array.isArray(optionsEvents)) {
    optionsEvents.unshift({ value: '', label: 'Select Event Name' });
  }

  // For options Users
  const { data: users } = useGetOptionsUsersQuery({
    params: '7587cd95e124ffec707adaef8cdfb0bf,668bd0af021636808161dc583a51d15e', // only  client, photographer
  });
  const optionsUsers = users?.data?.map((item) => ({
    value: item?.id,
    label: `${item?.code} - ${item?.name || 'noname'} `,
  }));
  if (Array.isArray(optionsUsers)) {
    optionsUsers.unshift({ value: '', label: 'Select User to Shared' });
  }

  // get price (photo & video)
  const { data: priceData } = useGetPricesQuery();
  const getPrice = priceData?.data?.master_commerce?.map((item) => ({
    id: item?.id,
    name: item?.name,
    price: item?.price,
  }));
  const matchedPhoto = getPrice?.find((item) => item?.name === 'Photo');
  const matchedVideo = getPrice?.find((item) => item?.name === 'Video');
  const pricePhoto = matchedPhoto?.price || 0;
  const priceVideo = matchedVideo?.price || 0;

  const getContractID = activeContractList?.find(
    (item) => item?.service_id === selectedServiceName?.value
  );

  const validateRequiredFields = () => {
    const errors = {};

    if (selectedServiceType === '') {
      errors.serviceType = 'Service type is a required field';
    }
    if (
      (selectedServiceType !== '' && selectedServiceName === '') ||
      (selectedServiceType !== '' && selectedServiceName?.value === '')
    ) {
      errors.serviceName = 'Service name is a required field';
    }
    if (
      (selectedServiceType !== '' && selectedPhotographer === '') ||
      (selectedServiceType !== '' && selectedPhotographer?.value === '') ||
      (selectedServiceType !== '' && selectedPhotographer === undefined)
    ) {
      errors.photographerName = 'Photographer name is a required field';
    }

    if (!isServiceIncontract) {
      if (
        ['per day'].includes(selectedServiceName?.payment_period) &&
        !formInput.pickDate
      ) {
        errors.pickDate = 'Pick date is a required field';
      }

      if (
        ['per week', 'per month'].includes(
          selectedServiceName?.payment_period
        ) &&
        !formInput.startContract
      ) {
        errors.startContract = 'Start contract is a required field';
      }
      if (
        ['per week', 'per month'].includes(
          selectedServiceName?.payment_period
        ) &&
        !formInput.endContract
      ) {
        errors.endContract = 'End contract is a required field';
      }
    }

    if (groupExisting) {
      if (
        !['per week', 'per month', 'per day'].includes(
          selectedServiceName?.payment_period
        ) &&
        !selectedEventGroup
      ) {
        errors.eventGroup = 'Event group is a required field';
      }

      if (
        !['per week', 'per month', 'per group event', 'per day'].includes(
          selectedServiceName?.payment_period
        ) &&
        !selectedEvent
      ) {
        errors.eventName = 'Event is a required field';
      }
    }

    if (newSingleEvent) {
      if (!newEventInput) {
        errors.eventNameSingle = 'Event is a required field';
      }
      if (!selectedEventType) {
        errors.eventType = 'Event Type is a required field';
      }
    }

    return errors;
  };

  const findMatchingPeriodID = (dateEvent) => {
    const matchingPeriodID = selectedServiceName?.contract_period?.find(
      (period) => {
        const startDate = new Date(period?.start_date);
        const endDate = new Date(period?.end_date);
        const isActive = period?._is_active === 1;
        const dateToCheck = new Date(dateEvent);

        const result =
          dateToCheck >= startDate && dateToCheck <= endDate && isActive;

        return result;
      }
    );

    return matchingPeriodID || null;
  };

  // Function to handle form submission
  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const requiredFieldErrors = validateRequiredFields();
    setErrorsInput(requiredFieldErrors);

    if (Object.values(requiredFieldErrors).some((error) => error !== '')) {
      toast.error(`Invalid Input. Please check and correct them!`, {
        position: 'top-right',
        theme: 'light',
      });
      return;
    }

    try {
      setIsLoadingBtn(true);

      if (selectedServiceName?.payment_period !== 'per event') {
        if (isSubcontract) {
          // Subcontract
          const newSubcontract = {
            user_to_share: selectedUserShared?.value || '',
            event_group_id: selectedEventGroup?.value || '',
            service_id: selectedServiceName?.value,
            start_subcontract:
              selectedServiceName?.payment_period === 'per day'
                ? formInput?.pickDate
                  ? formatDateYearToDay(formInput?.pickDate)
                  : ''
                : formInput.startContract
                ? formatDateYearToDay(formInput.startContract)
                : '',
            end_subcontract:
              selectedServiceName?.payment_period === 'per day'
                ? formInput?.pickDate
                  ? formatDateYearToDay(formInput?.pickDate)
                  : ''
                : formInput.endContract
                ? formatDateYearToDay(formInput.endContract)
                : '',
          };

          const resSubcontract = await createSubcontract(
            newSubcontract
          ).unwrap();

          if (!resSubcontract?.error) {
            dispatch(setIsSubcontract(false));
            toast.success(
              `Subcontract ${selectedServiceName?.payment_period} added to cart`,
              {
                position: 'top-right',
                theme: 'light',
              }
            );
            navigate('/payment-and-cart');
          }
        } else {
          // Contract
          if (getContractID) {
            if (newSingleEvent) {
              const periodID = findMatchingPeriodID(formInput.date);
              const eventGroupID = await handleNewEventGroup();

              if (eventGroupID) {
                const eventSingleID = await handleNewSingleEvent(eventGroupID);

                if (eventSingleID) {
                  const newDataRequest = createNewDataRequest(
                    getContractID?.id,
                    periodID?.id,
                    eventGroupID,
                    eventSingleID
                  );
                  await handleNewServiceRequest(newDataRequest);
                }
              }
            } else {
              const periodID = findMatchingPeriodID(
                selectOneEvent ? selectedEvent?.date : selectedEventGroup.date
              );

              if (selectAllEvent) {
                const newDataRequest = createNewRequestScoringAllEvent(
                  getContractID?.id,
                  selectedEventGroup?.value
                );
                await handleNewServiceRequestScoringAllEvent(newDataRequest);
              } else {
                const newDataRequest = createNewDataRequest(
                  getContractID?.id,
                  periodID?.id,
                  selectedEventGroup?.value,
                  selectedEvent?.value
                );
                await handleNewServiceRequest(newDataRequest);
              }
            }
          } else {
            if (
              selectedServiceName?.payment_period === 'per month' ||
              selectedServiceName?.payment_period === 'per week' ||
              selectedServiceName?.payment_period === 'per group event'
            ) {
              const dataNewContract = {
                user_to_share: selectedUserShared?.value || '',
                service_id: selectedServiceName?.value,
                event_group_id: selectedEventGroup?.value || '',
                start_contract: formInput?.startContract
                  ? formatDateYearToDay(formInput?.startContract)
                  : '',
                end_contract: formInput?.endContract
                  ? formatDateYearToDay(formInput?.endContract)
                  : '',
              };

              const resNewContract = await addNewContract(
                dataNewContract
              ).unwrap();
              if (!resNewContract?.error) {
                toast.success(
                  `Contract ${selectedServiceName?.payment_period} added to cart`,
                  {
                    position: 'top-right',
                    theme: 'light',
                  }
                );
                navigate('/payment-and-cart');
              }
            }

            if (selectedServiceName?.payment_period === 'per day') {
              const dataNewContract = {
                user_to_share: selectedUserShared?.value || '',
                service_id: selectedServiceName?.value,
                event_group_id: selectedEventGroup?.value || '',
                start_contract: formInput?.pickDate
                  ? formatDateYearToDay(formInput?.pickDate)
                  : '',
                end_contract: formInput?.pickDate
                  ? formatDateYearToDay(formInput?.pickDate)
                  : '',
              };

              const resNewContract = await addNewContract(
                dataNewContract
              ).unwrap();

              if (!resNewContract?.error) {
                toast.success(
                  `Contract ${selectedServiceName?.payment_period} added to cart`,
                  {
                    position: 'top-right',
                    theme: 'light',
                  }
                );
                navigate('/payment-and-cart');
              }
            }
          }
        }
      } else {
        if (selectedServiceName?.payment_period === 'per event') {
          const dataNewContract = {
            user_to_share: selectedUserShared?.value || '',
            service_id: selectedServiceName?.value,
            event_group_id: selectedEventGroup?.value || '',
            start_contract: formInput?.date
              ? formatDateYearToDay(formInput?.date)
              : '',
            end_contract: formInput?.date
              ? formatDateYearToDay(formInput?.date)
              : '',
          };

          const resNewContract = await addNewContract(dataNewContract).unwrap();

          if (!resNewContract?.error) {
            const newContractID = resNewContract?.data?.id;
            const newPeriodID = resNewContract?.data?.periods[0]?.id;

            if (newSingleEvent) {
              const eventGroupID = await handleNewEventGroup();

              if (eventGroupID) {
                const eventSingleID = await handleNewSingleEvent(eventGroupID);

                if (eventSingleID) {
                  const newDataRequest = createNewDataRequest(
                    newContractID,
                    newPeriodID,
                    eventGroupID,
                    eventSingleID
                  );

                  await handleNewServiceRequest(newDataRequest);
                }
              }
            } else {
              const newDataRequest = createNewDataRequest(
                newContractID,
                newPeriodID,
                selectedEventGroup?.value,
                selectedEvent?.value
              );

              await handleNewServiceRequest(newDataRequest);
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed: ${err?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
      setIsLoadingBtn(false);
    } finally {
      setIsLoadingBtn(false);
    }
  };

  // Function to handle the creation of a new event group
  const handleNewEventGroup = async () => {
    const formDataEventGroup = createEventGroupFormData();
    const resNewEventGroupSingle = await addNewEventGroup(formDataEventGroup);

    if (!resNewEventGroupSingle.error) {
      return resNewEventGroupSingle?.data?.data?.id;
    } else {
      toast.error(`Failed: ${errServerNewGroup?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
      return null;
    }
  };

  // Function to handle the creation of a new single event
  const handleNewSingleEvent = async (eventGroupID) => {
    const formDataEvent = createEventFormData(eventGroupID);
    const response = await addNewEventList(formDataEvent);

    if (!response?.error) {
      return response?.data?.data?.id;
    } else {
      toast.error(`Failed: ${errServerNewEvent?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
      return null;
    }
  };

  // Function to create data for a new service request
  const createNewDataRequest = (
    contractID,
    periodID,
    eventGroupID,
    eventSingleID
  ) => {
    return {
      service_contract_id: contractID,
      service_contract_period_id: periodID || '',
      pic_name: formInput.picName,
      service_id: selectedServiceName?.value,
      photographer_fsp_id: selectedPhotographer?.value,
      time_start: selectAllEvent ? '00:00' : startTime,
      time_end: selectAllEvent ? '00:00' : finishTime,
      date: formInput.date ? formatDateYearToDay(formInput.date) : '',
      start_contract: formInput.startContract
        ? formatDateYearToDay(formInput.startContract)
        : '',
      end_contract: formInput.endContract
        ? formatDateYearToDay(formInput.endContract)
        : '',
      location: formInput.location,
      event_group_id: eventGroupID,
      event_id: eventSingleID,
      note: formInput.note,
      is_private: selectedMedia?.value === 2 ? true : false,
    };
  };
  // (Scoring Only) Function to create data for a new service request
  const createNewRequestScoringAllEvent = (contractID, eventGroupID) => {
    return {
      service_contract_id: contractID,
      event_group_id: eventGroupID,
      is_private: selectedMedia?.value === 2 ? true : false,
      note: formInput.note,
    };
  };

  // Function to handle the new service request
  const handleNewServiceRequest = async (newDataRequest) => {
    const resNewRequest = await addNewServiceRequest(newDataRequest).unwrap();

    if (!resNewRequest.error) {
      setOpenColapseRequest(false);
      toast.success(`Request service has been added!`, {
        position: 'top-right',
        theme: 'light',
      });
      navigate('/payment-and-cart');
    }
  };
  // (Scoring only and Select All of events) Function to handle the new service request
  const handleNewServiceRequestScoringAllEvent = async (newDataRequest) => {
    const resNewRequest = await addNewServiceRequestScoringAllEvent(
      newDataRequest
    ).unwrap();

    if (!resNewRequest.error) {
      setOpenColapseRequest(false);
      toast.success(`Request service has been added!`, {
        position: 'top-right',
        theme: 'light',
      });
      navigate('/payment-and-cart');
    }
  };

  // Function to create form data for a new event group
  const createEventGroupFormData = () => {
    const formDataEventGroup = new FormData();
    formDataEventGroup.append('name', '-');
    formDataEventGroup.append('organizer_name', '-');
    formDataEventGroup.append('pic_organizer', formInput.picName);
    formDataEventGroup.append('event_type', selectedEventType.value);
    formDataEventGroup.append(
      'date_start',
      formInput.date ? formatDateYearToDay(formInput.date) : ''
    );
    formDataEventGroup.append(
      'date_finish',
      formInput.date ? formatDateYearToDay(formInput.date) : ''
    );
    formDataEventGroup.append('location', formInput.location);
    formDataEventGroup.append('city', '');
    formDataEventGroup.append('photo_price', parseInt(pricePhoto));
    formDataEventGroup.append('video_price', parseInt(priceVideo));
    formDataEventGroup.append('is_single', newSingleEvent);

    return formDataEventGroup;
  };

  // Function to create form data for a new event
  const createEventFormData = (eventGroupID) => {
    const formDataEvent = new FormData();
    formDataEvent.append('event_group_id', eventGroupID);
    formDataEvent.append('name', newEventInput);
    formDataEvent.append('pic_event', formInput.picName);
    formDataEvent.append(
      'date_start',
      formInput.date ? formatDateYearToDay(formInput.date) : ''
    );
    formDataEvent.append(
      'date_finish',
      formInput.date ? formatDateYearToDay(formInput.date) : ''
    );
    formDataEvent.append('time_start', startTime);
    formDataEvent.append('time_finish', finishTime);
    formDataEvent.append('photo_price', parseInt(pricePhoto));
    formDataEvent.append('video_price', parseInt(priceVideo));
    formDataEvent.append('location', formInput.location);
    formDataEvent.append('city', '-');
    formDataEvent.append('is_single', newSingleEvent);

    return formDataEvent;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormInput((prevState) => ({
      ...prevState,
      date: date,
    }));
  };

  const handlePickDateChange = (date) => {
    setFormInput((prevState) => ({
      ...prevState,
      pickDate: date,
    }));
  };

  const handleStartContractChange = (date) => {
    if (date) {
      setFormInput((prevState) => ({
        ...prevState,
        startContract: date,
        endContract: '',
      }));

      const minDate = new Date(date);
      if (selectedServiceName?.payment_period === 'per week') {
        minDate.setDate(minDate.getDate() + 6);
        setMinEndContractDate(minDate);
      }
      if (selectedServiceName?.payment_period === 'per month') {
        minDate.setMonth(minDate.getMonth() + 1);
        setMinEndContractDate(minDate);
      }
      setMinEndContractDate(minDate);
    } else {
      setMinEndContractDate(null);
    }
  };

  const handleEndContractChange = (date) => {
    setFormInput((prevState) => ({
      ...prevState,
      endContract: date,
    }));
  };

  // Getting the current time
  const currentTime = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  // Converting the current time to an integer (for example: 1400)
  const currentHour = parseInt(
    currentTime.split(':')[0] + currentTime.split(':')[1]
  );

  const handleStartTimeChange = (e) => {
    const selectedTime = e.target.value;
    const selectedHour = parseInt(
      selectedTime.split(':')[0] + selectedTime.split(':')[1]
    );

    if (today === formInput.date) {
      if (selectedHour >= currentHour) {
        setStartTime(selectedTime);
      } else {
        toast.warn(`You cannot select a time earlier than the current time.`, {
          position: 'top-center',
          theme: 'light',
        });
        setStartTime('');
      }
    } else {
      setStartTime(selectedTime);
    }
  };

  const handleFinishTimeChange = (e) => {
    const selectedTime = e.target.value;
    const selectedHour = parseInt(selectedTime.split(':').join(''));
    const startTimeInput = parseInt(startTime.split(':').join(''));

    if (today === formInput.date && selectedHour < currentHour) {
      toast.warn(`You cannot select a time earlier than the current time.`, {
        position: 'top-center',
        theme: 'light',
      });
      setFinishTime('');
    } else if (selectedHour < startTimeInput) {
      toast.warn(`You cannot select finish time earlier than the start time.`, {
        position: 'top-center',
        theme: 'light',
      });
      setFinishTime('');
    } else {
      setFinishTime(selectedTime);
    }
  };

  const handleChangeGroupExisting = () => {
    setGroupExisting(true);
    setNewSingleEvent(false);
  };

  const handleChangeNewSingleEvent = () => {
    setNewSingleEvent(true);
    setGroupExisting(false);
  };

  const handleChangeOneEvent = () => {
    setSelectOneEvent(true);
    setSelectAllEvent(false);
  };

  const handleChangeAllEvent = () => {
    setSelectAllEvent(true);
    setSelectOneEvent(false);
    setSelectedEvent('');
    setDateSelectedEventGroup(
      `${formatDate(selectedEventGroup?.date_start)} s/d ${formatDate(
        selectedEventGroup.date_finish
      )}`
    );
  };

  useEffect(() => {
    setSelectAllEvent(false);
    setSelectOneEvent(true);
  }, [selectedEventGroup]);

  // Reset required errors
  useEffect(() => {
    const errors = { ...errorsInput };

    const fieldsToCheck = [
      { field: 'serviceType', value: selectedServiceType },
      { field: 'serviceName', value: selectedServiceName },
      { field: 'photographerName', value: selectedPhotographer },
      { field: 'eventGroup', value: selectedEventGroup },
      { field: 'eventName', value: selectedEvent },
      { field: 'eventNameSingle', value: newEventInput },
      { field: 'eventType', value: selectedEventType },
      { field: 'pickDate', value: formInput.pickDate },
      { field: 'startContract', value: formInput.startContract },
      { field: 'endContract', value: formInput.endContract },
    ];

    fieldsToCheck.forEach(({ field, value }) => {
      if (value) {
        delete errors[field];
      }
    });

    setErrorsInput(errors);
  }, [
    selectedServiceType,
    selectedServiceName,
    selectedPhotographer,
    selectedEventGroup,
    selectedEvent,
    newEventInput,
    selectedEventType,
    formInput,
  ]);

  useEffect(() => {
    const checkServiceInContract = activeContractList?.some(
      (item) => item.service_id === selectedServiceName?.value
    );
    const checkServiceInSubcontract = activeSubcontractList?.some(
      (item) => item.service_id === selectedServiceName?.value
    );

    setIsServiceIncontract(checkServiceInContract);
    setIsServiceInSubcontract(checkServiceInSubcontract);
  }, [selectedServiceName]);

  useEffect(() => {
    if (selectedEventGroup?.value) {
      setEventGropID(selectedEventGroup?.value);
      setSelectedEvent('');
    } else {
      setEventGropID('');
      setSelectedEvent('');
    }
  }, [selectedEventGroup?.value, selectedServiceName?.value]);

  useEffect(() => {
    if (activeContractList && selectedServiceType) {
      const foundPhotographer = optionsPhotographer?.find(
        (item) => item?.value === activeContractList[0]?.id
      );

      setSelectedPhotographer(foundPhotographer);
      setSelecedtServiceName('');
    } else {
      setSelectedPhotographer('');
      setSelecedtServiceName('');
    }
  }, [selectedServiceType, activeContractList]);

  useEffect(() => {
    if (selectedServiceName || selectedServiceName?.value === '') {
      const foundPhotographer = optionsPhotographer?.find(
        (item) => item?.value === selectedServiceName?.created_by
      );
      setSelectedPhotographer(foundPhotographer);

      if (selectedServiceName?.percent_to_shared !== 0) {
        const foundUserShared = optionsUsers?.find(
          (item) => item?.value === userProfile?.id
        );
        setSelectedUserShared(foundUserShared);
      } else {
        setSelectedUserShared('');
      }
    }
  }, [selectedServiceName]);

  useEffect(() => {
    if (selectedServiceName) {
      setFormInput((prevState) => ({
        ...prevState,
        startContract: null,
        endContract: null,
      }));
    }
  }, [selectedServiceName]);

  useEffect(() => {
    if (selectedServiceName?.contracted || selectedPhotographer?.contracted) {
      setGroupExisting(true);
      setNewSingleEvent(false);
    }
  }, [selectedServiceName, selectedPhotographer]);

  useEffect(() => {
    if (isEventSelected) {
      setFinishTime('');
      setStartTime('');
    }
  }, [formInput.date, selectedEvent]);

  useEffect(() => {
    if (isEventSelected) {
      setFinishTime('');
    }
  }, [startTime, selectedEvent]);

  useEffect(() => {
    if (
      getContractID &&
      selectedServiceName?.payment_period === 'per group event'
    ) {
      setSelectedEventGroup({
        value: getContractID?.event_group_id,
        label: getContractID?.event_group_name,
      });
    } else {
      setSelectedEventGroup('');
    }
  }, [getContractID, selectedServiceName]);

  useEffect(() => {
    if (
      selectedServiceName?.sales_model === 'individual media sales' ||
      selectedServiceName?.sales_model === 'individual player sales'
    ) {
      setSelectedMedia({
        value: 1,
        label: 'Public',
      });
      setDisableOptionMedia('Private');
    } else if (
      selectedServiceName?.sales_model === 'full media sales' ||
      selectedServiceName?.sales_model === 'full team sales' ||
      selectedServiceName?.sales_model === 'full streaming'
    ) {
      setSelectedMedia({
        value: 2,
        label: 'Private',
      });
      setDisableOptionMedia('Public');
    } else {
      setDisableOptionMedia('');
    }

    if (selectedServiceName?.value === '' || selectedServiceName === '') {
      setSelectedMedia('');
    }
  }, [selectedServiceName]);

  // auto fill (date, location, picName) if selected event
  useEffect(() => {
    if (selectedEvent.value !== '' && selectedEvent.pic) {
      setFormInput((prevFormInput) => ({
        ...prevFormInput,
        date: new Date(selectedEvent?.date),
        location: selectedEvent?.location,
        picName: selectedEvent?.pic,
      }));
      setStartTime(selectedEvent?.startTime);
      setFinishTime(selectedEvent?.finishTime);
    } else {
      setFormInput((prevFormInput) => ({
        ...prevFormInput,
        date: '',
        location: '',
        picName: '',
      }));
      setStartTime('');
      setFinishTime('');
    }
  }, [selectedEvent]);

  const customStylesSelectPhotographer = {
    option: (provided, state) => {
      return {
        ...provided,
        color: state.isSelected
          ? 'white'
          : state.data.contracted === true
          ? 'green'
          : 'black',
        textTransform: 'capitalize',
      };
    },

    control: (provided) => ({
      ...provided,
      border: 'none',
      outline: 'none',
      borderRadius: '12px',
      opacity: !selectedServiceType.value ? '0.8' : '1',
      backgroundColor: !selectedServiceType.value
        ? 'rgb(0 0 0 / 0.3)'
        : 'rgb(209 213 219 / 0.5)',
      boxShadow: 'inset 3px 3px 5px rgba(0, 0, 0, 0.15)',
      padding: '0px 3px 0px 0px',
      '&:hover': {
        border: 'none',
      },
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      backgroundColor: 'transparent',
      padding: '1px',
      margin: '0px 3px',
      borderRadius: '6px',
      cursor: 'pointer',
    }),
  };

  const isPerGroupEventInContract =
    selectedServiceName?.payment_period === 'per group event' &&
    selectedServiceName?.contracted;

  return (
    <>
      <form onSubmit={handleOnSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-1">
            <div className="z-60 flex flex-col gap-0.5">
              <SelectCustom
                data={optionsServiceTypes}
                label="Pick Service Type"
                selectedValue={selectedServiceType}
                setSelectedValue={setSelectedServiceType}
                placeholder="Select Service Type"
              />
              {errorsInput?.serviceType && (
                <span className="text-[10px] animate-pulse text-red-600">
                  {errorsInput?.serviceType}
                </span>
              )}
            </div>

            <div className="z-50 flex flex-col gap-0.5">
              <SelectCustom
                data={optionsServiceName}
                label="Service Name"
                placeholder="Select Service Name"
                selectedValue={selectedServiceName}
                setSelectedValue={setSelecedtServiceName}
                errServer={errServer?.data}
                errCodeServer="xxx035"
                disabled={!selectedServiceType.value}
                customStyle={customStylesSelectPhotographer}
              />
              {errorsInput?.serviceName && (
                <span className="text-[10px] animate-pulse text-red-600">
                  {errorsInput?.serviceName}
                </span>
              )}
            </div>

            {/* If Subcontract */}
            {isSubcontract &&
            !isServiceInSubcontract &&
            selectedServiceName?.payment_period === 'per day' ? (
              <div className="flex flex-col gap-0.5">
                <DatePickerCustom
                  label="Pick Date"
                  name="pickDate"
                  value={formInput.pickDate}
                  onChange={handlePickDateChange}
                  placeholder="Pick Date"
                  withPortal
                />
                {errorsInput?.pickDate && (
                  <span className="text-[10px] animate-pulse text-red-600">
                    {errorsInput?.pickDate}
                  </span>
                )}
              </div>
            ) : null}

            {/* If Contract */}
            {!isSubcontract &&
            !isServiceIncontract &&
            selectedServiceName?.payment_period === 'per day' ? (
              <div className="flex flex-col gap-0.5">
                <DatePickerCustom
                  label="Pick Date"
                  name="pickDate"
                  value={formInput.pickDate}
                  onChange={handlePickDateChange}
                  placeholder="Pick Date"
                  withPortal
                />
                {errorsInput?.pickDate && (
                  <span className="text-[10px] animate-pulse text-red-600">
                    {errorsInput?.pickDate}
                  </span>
                )}
              </div>
            ) : null}

            {/* If Subcontract */}
            {(isSubcontract &&
              !isServiceInSubcontract &&
              selectedServiceName?.payment_period === 'per month') ||
            (isSubcontract &&
              !isServiceInSubcontract &&
              selectedServiceName?.payment_period === 'per week') ? (
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex flex-col gap-0.5">
                  <DatePickerCustom
                    label="Start Contract Subcon"
                    name="startContract"
                    value={formInput.startContract}
                    onChange={handleStartContractChange}
                    placeholder="Select Date"
                    errServer={errServerNewContract?.data}
                    errCodeServer="x10007"
                    withPortal
                    showMonthDropdown
                    showYearDropdown
                  />
                  {errorsInput?.startContract && (
                    <span className="text-[10px] animate-pulse text-red-600">
                      {errorsInput?.startContract}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-0.5">
                  <DatePickerCustom
                    label="End Contract"
                    name="endContract"
                    value={formInput.endContract}
                    onChange={handleEndContractChange}
                    placeholder="Select Date"
                    min={minEndContractDate}
                    errServer={errServerNewContract?.data}
                    errCodeServer="x10008"
                    withPortal
                    showMonthDropdown
                    showYearDropdown
                  />
                  {errorsInput?.endContract && (
                    <span className="text-[10px] animate-pulse text-red-600">
                      {errorsInput?.endContract}
                    </span>
                  )}
                </div>
              </div>
            ) : null}

            {/* If Contract */}
            {(!isSubcontract &&
              !isServiceIncontract &&
              selectedServiceName?.payment_period === 'per month') ||
            (!isSubcontract &&
              !isServiceIncontract &&
              selectedServiceName?.payment_period === 'per week') ? (
              <>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="flex flex-col gap-0.5">
                    <DatePickerCustom
                      label="Start Contract"
                      name="startContract"
                      value={formInput.startContract}
                      onChange={handleStartContractChange}
                      placeholder="Select Date"
                      errServer={errServerNewContract?.data}
                      errCodeServer="x10007"
                      withPortal
                      showMonthDropdown
                      showYearDropdown
                    />
                    {errorsInput?.startContract && (
                      <span className="text-[10px] animate-pulse text-red-600">
                        {errorsInput?.startContract}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <DatePickerCustom
                      label="End Contract"
                      name="endContract"
                      value={formInput.endContract}
                      onChange={handleEndContractChange}
                      placeholder="Select Date"
                      min={minEndContractDate}
                      errServer={errServerNewContract?.data}
                      errCodeServer="x10008"
                      withPortal
                      showMonthDropdown
                      showYearDropdown
                    />
                    {errorsInput?.endContract && (
                      <span className="text-[10px] animate-pulse text-red-600">
                        {errorsInput?.endContract}
                      </span>
                    )}
                  </div>
                </div>
              </>
            ) : null}

            <div className="z-40">
              <SelectCustom
                data={optionsUsers}
                label="User to Shared"
                placeholder="Select User to Shared"
                selectedValue={selectedUserShared}
                setSelectedValue={setSelectedUserShared}
                disabled={
                  selectedServiceName?.percent_to_shared === 0 ||
                  selectedServiceName === '' ||
                  selectedServiceName?.value === ''
                }
              />
            </div>

            <div className="z-30 flex flex-col gap-0.5">
              <SelectCustom
                data={optionsPhotographer}
                label="Service Provider Name"
                placeholder="Select Service Provider"
                selectedValue={selectedPhotographer}
                setSelectedValue={setSelectedPhotographer}
                errServer={errServer?.data}
                errCodeServer="xxx032"
                disabled={!selectedServiceType.value}
                customStyle={customStylesSelectPhotographer}
              />
              {errorsInput?.photographerName && (
                <span className="text-[10px] animate-pulse text-red-600">
                  {errorsInput?.photographerName}
                </span>
              )}
            </div>

            {selectedServiceType.value !== 3 && (
              <div className="z-20">
                <SelectCustom
                  data={dataOptionsMedia}
                  label="Media"
                  placeholder="Select Media"
                  selectedValue={selectedMedia}
                  setSelectedValue={setSelectedMedia}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex flex-col gap-2 my-1">
              <RadioInput
                label="Find Existing Event Group"
                name="eventGroupExist"
                id="eventGroupExist"
                value="radio1"
                checked={groupExisting}
                onChange={handleChangeGroupExisting}
                labelStyle={`text-sm ${
                  groupExisting &&
                  selectedServiceName?.contracted &&
                  !isPerGroupEventInContract &&
                  !isSubcontract
                    ? 'text-black font-medium'
                    : 'text-gray-500'
                }`}
                disabled={
                  (!selectedServiceName?.contracted &&
                    selectedServiceName?.payment_period !== 'per event') ||
                  isPerGroupEventInContract ||
                  isSubcontract
                }
              />

              <RadioInput
                label="Create New Event Single"
                name="newSingleEvent"
                id="newSingleEvent"
                value="radio2"
                checked={newSingleEvent}
                onChange={handleChangeNewSingleEvent}
                labelStyle={`text-sm ${
                  newSingleEvent && selectedServiceName?.contracted
                    ? 'text-black font-medium'
                    : 'text-gray-500'
                }`}
                disabled={
                  (!selectedServiceName?.contracted &&
                    selectedServiceName?.payment_period !== 'per event') ||
                  isPerGroupEventInContract ||
                  isSubcontract
                }
              />
            </div>

            {groupExisting ||
            selectedServiceName?.contrated ||
            selectedPhotographer?.contrated ? (
              <div className="z-10 flex flex-col gap-0.5">
                <SelectCustom
                  data={optionsEventGroup}
                  label="Event Group Name"
                  selectedValue={selectedEventGroup}
                  setSelectedValue={setSelectedEventGroup}
                  placeholder="Select Event Group Name"
                  errServer={errServer?.data}
                  errCodeServer="x01001"
                  disabled={
                    (!selectedServiceName?.contracted &&
                      selectedServiceName?.payment_period === 'per month') ||
                    (!selectedServiceName?.contracted &&
                      selectedServiceName?.payment_period === 'per week') ||
                    (!selectedServiceName?.contracted &&
                      selectedServiceName?.payment_period === 'per day') ||
                    isPerGroupEventInContract ||
                    isSubcontract
                  }
                />
                {errorsInput?.eventGroup && (
                  <span className="text-[10px] animate-pulse text-red-600">
                    {errorsInput?.eventGroup}
                  </span>
                )}
                {errServerNewContract?.data?.status === 'x10018' && (
                  <span className="text-[10px] animate-pulse text-red-600">
                    group event is required
                  </span>
                )}
              </div>
            ) : null}

            {selectedServiceName?.payment_period !== 'per event' &&
              selectedServiceName?.payment_period !== 'per group event' &&
              !newSingleEvent &&
              selectedEventGroup !== '' &&
              selectedEventGroup.value !== '' && (
                <div className="flex gap-2 my-1">
                  <RadioInput
                    label="Select One Event"
                    name="selectOneEvent"
                    id="selectOneEvent"
                    value="radio3"
                    checked={selectOneEvent}
                    onChange={handleChangeOneEvent}
                    labelStyle={`text-sm ${
                      selectOneEvent && selectedServiceName?.contracted
                        ? 'text-black font-medium'
                        : 'text-gray-500'
                    }`}
                    // disabled={
                    //   (!selectedServiceName?.contracted &&
                    //     selectedServiceName?.payment_period !== 'per event') ||
                    //   isPerGroupEventInContract ||
                    //   isSubcontract
                    // }
                  />

                  <RadioInput
                    label="Select All of Event"
                    name="selectAllEvent"
                    id="selectAllEvent"
                    value="radio4"
                    checked={selectAllEvent}
                    onChange={handleChangeAllEvent}
                    labelStyle={`text-sm ${
                      selectAllEvent
                        ? 'text-black font-medium'
                        : 'text-gray-500'
                    }`}
                    // disabled={
                    //   (!selectedServiceName?.contracted &&
                    //     selectedServiceName?.payment_period !== 'per event') ||
                    //   isPerGroupEventInContract ||
                    //   isSubcontract
                    // }
                  />
                </div>
              )}

            {!selectAllEvent &&
            (groupExisting ||
              selectedServiceName?.contrated ||
              selectedPhotographer?.contrated) ? (
              <div className="flex flex-col gap-0.5">
                <SelectCustom
                  data={optionsEvents}
                  label="Event Name"
                  selectedValue={selectedEvent}
                  setSelectedValue={setSelectedEvent}
                  placeholder="Select Event Name"
                  errServer={errServer?.data}
                  errCodeServer="x06005"
                  disabled={
                    (!selectedServiceName?.contracted &&
                      selectedServiceName?.payment_period !== 'per event') ||
                    isPerGroupEventInContract ||
                    isSubcontract ||
                    selectAllEvent
                  }
                />
                {errorsInput?.eventName && (
                  <span className="text-[10px] animate-pulse text-red-600">
                    {errorsInput?.eventName}
                  </span>
                )}
              </div>
            ) : null}

            {newSingleEvent && (
              <div className="flex flex-col gap-0.5">
                <Input
                  type="text"
                  label="Event Name"
                  name="newEventGroup"
                  value={newEventInput}
                  onChange={(e) => setNewEventInput(e.target.value)}
                />
                {errorsInput?.eventNameSingle && (
                  <span className="text-[10px] animate-pulse text-red-600">
                    {errorsInput?.eventNameSingle}
                  </span>
                )}
              </div>
            )}
            {newSingleEvent && (
              <div className="z-10 flex flex-col gap-0.5">
                <SelectCustom
                  data={optionsEventTypes}
                  label="Event Type"
                  selectedValue={selectedEventType}
                  setSelectedValue={setSelectedEventType}
                  placeholder="Select Event Type"
                  errServer={errServerNewGroup?.data}
                  errCodeServer="x01015"
                />
                {errorsInput?.eventType && (
                  <span className="text-[10px] animate-pulse text-red-600">
                    {errorsInput?.eventType}
                  </span>
                )}
              </div>
            )}

            {selectAllEvent ? (
              <Input
                type="text"
                label="Date"
                name="DateSelectedEventGroup"
                value={dateSelectedEventGroup}
                // onChange={(e) => setSelectedEventGroup(e.target.value)}
                disabled
              />
            ) : (
              <DatePickerCustom
                label="Date"
                name="Date"
                value={formInput.date}
                onChange={handleDateChange}
                placeholder="Select Date"
                errServer={errServer?.data}
                errCodeServer="x10001"
                min={new Date()}
                withPortal
                disabled={!newSingleEvent}
              />
            )}

            {!selectAllEvent && (
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="time"
                  label="Start Time"
                  name="startTime"
                  value={startTime}
                  onChange={handleStartTimeChange}
                  errServer={errServer?.data}
                  errCodeServer="x10002"
                  disabled={formInput.date === '' || !newSingleEvent}
                />
                <Input
                  type="time"
                  label="Finish Time"
                  name="finishTime"
                  value={finishTime}
                  onChange={handleFinishTimeChange}
                  errServer={errServer?.data}
                  errCodeServer="x10003"
                  disabled={
                    formInput.date === '' || startTime === '' || !newSingleEvent
                  }
                />
              </div>
            )}
            {!selectAllEvent && (
              <Input
                type="text"
                name="picName"
                label="PIC Name"
                value={formInput.picName}
                onChange={handleChange}
                disabled={!newSingleEvent}
              />
            )}
            {!selectAllEvent && (
              <Input
                type="text"
                label="Location"
                name="location"
                value={formInput.location}
                onChange={handleChange}
                errServer={errServer?.data}
                errCodeServer="x10004"
                disabled={!newSingleEvent}
              />
            )}
          </div>

          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex flex-col gap-2">
              <div className="w-full p-4 bg-gray-100 rounded-md">
                <div className="flex flex-col gap-2 text-xs sm:text-sm">
                  <div className="flex flex-col gap-1 border-b border-gray-200 pb-2">
                    <div className="flex justify-between items-center">
                      <h5 className="text-lg font-bold">Sales Model</h5>
                      {isSubcontract && (
                        <span className="text-xs font-bold text-red-500 animate-pulse">
                          {isSubcontract ? '(subcontract)' : ''}
                        </span>
                      )}
                    </div>
                    <p className="text-sm capitalize font-medium text-gray-500">
                      {selectedServiceName?.sales_model || '-'}
                    </p>

                    <h6 className="text-xs">
                      <span className="text-sm font-medium">
                        {CurrencyFormat(selectedServiceName?.photo_price || 0)}
                      </span>
                      /
                      {selectedServiceName?.sales_model === 'full media sales'
                        ? 'all photo'
                        : 'photo'}
                    </h6>

                    <h6 className="text-xs">
                      <span className="text-sm font-medium">
                        {CurrencyFormat(selectedServiceName?.video_price || 0)}
                      </span>
                      /
                      {selectedServiceName?.sales_model === 'full media sales'
                        ? 'all video'
                        : 'video'}
                    </h6>
                  </div>

                  <div className="flex flex-col gap-1 ">
                    <h5 className="text-lg font-bold">Fees</h5>
                    <div className="flex items-center justify-between">
                      <p className="">Fixed</p>

                      <span className="font-bold sm:text-base">
                        {CurrencyFormat(
                          !selectedServiceName?.contracted
                            ? selectedServiceName?.basic_fixed_fee || 0
                            : 0
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="">% of Sharing</p>
                      <span className="font-bold sm:text-base">
                        {selectedServiceName?.percent_to_shared || 0}%
                      </span>
                    </div>
                    <div className="flex items-start justify-between">
                      <p className="">User to Shared</p>
                      <span className="font-medium sm:text-sm max-w-[150px] line-clamp-1 hover:line-clamp-none">
                        {selectedUserShared?.label || '-'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-4 border-t border-gray-200 pt-2">
                      <p className="font-medium">Amount Due Now</p>

                      <span className="font-bold sm:text-base">
                        {CurrencyFormat(
                          !selectedServiceName?.contracted
                            ? selectedServiceName?.basic_fixed_fee || 0
                            : 0
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {(selectedServiceName?.contracted &&
                selectedServiceName?.payment_period === 'per month') ||
              (selectedServiceName?.contracted &&
                selectedServiceName?.payment_period === 'per week') ||
              (selectedServiceName?.contracted &&
                selectedServiceName?.payment_period === 'per day') ? (
                <TextArea
                  name="note"
                  rows={2}
                  value={formInput.note}
                  onChange={handleChange}
                  placeholder="Note"
                />
              ) : null}
            </div>

            {!isPerGroupEventInContract ? (
              <div className="flex justify-end w-full gap-4 py-2 mt-4">
                <Button
                  background="red"
                  className="w-40"
                  disabled={isLoadingBtn}
                  onClick={() => setOpenColapseRequest(false)}
                >
                  {isLoadingBtn ? <LoaderButtonAction /> : 'Cancel'}
                </Button>

                <Button
                  type="submit"
                  background="black"
                  className="w-40"
                  disabled={
                    isLoadingBtn ||
                    isServiceInSubcontract ||
                    (isSubcontract &&
                      selectedServiceName?.payment_period === 'per event')
                  }
                >
                  {isLoadingBtn ? <LoaderButtonAction /> : 'Add to cart'}
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </form>

      <div className="my-4 mt-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-2">
          <h5 className="text-lg font-bold">List of My Service Request</h5>
          <div className="w-full sm:w-[50%] lg:w-[30%] mb-2 ml-auto">
            <FilterSearch
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              noPagination
            />
          </div>
        </div>

        <TableRequestNewService
          data={data}
          isLoading={isLoading}
          isSuccess={isSuccess}
          isError={isError}
          error={error}
          isClient={isClient}
          searchValue={searchValue}
          isAdmin={isAdmin}
          userID={userID}
        />
      </div>
    </>
  );
};

export default FormAddRequestNewService;
