import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import useDebounce from '@/hooks/useDebounce';

import {
  Checkbox,
  DatePickerCustom,
  DatePickerInput,
  Input,
  MultiSelectCustom,
  SelectDropdown,
  SelectInput,
  UploadImage,
} from '@/components/form-input';
import { Button, LoaderButtonAction } from '@/components';
import { optionsNewSingleEvent } from '@/constants';
import { useAddNewEventListMutation } from '@/services/api/eventsApiSlice';
import { formatDateYearToDay } from '@/helpers/FormatDateYearToDay';
import { CurrencyFormat, removeCurrencyFormat } from '@/helpers/CurrencyFormat';
import { useGetTeamMasterListQuery } from '@/services/api/teamMasterApiSlice';
import { useAddNewEventGroupMutation } from '@/services/api/eventGroupApiSlice';

const validationSchema = yup
  .object({
    eventName: yup.string().required('Event Name is a required field'),
    picOrganizer: yup.object().required('Organizer PIC is a required field'),
    location: yup.string().required('Location is a required field'),
    timeStart: yup.string().required('Start Time is a required field'),
    timeFinish: yup.string().required('Finish Time is a required field'),
    photoPrice: yup.string().required('Photo price is a required field'),
    videoPrice: yup.string().required('Video price is a required field'),
    eventType: yup.object().required('Event Type is a required field'),
    dateStart: yup.string().required('Start date is a required field'),
    dateFinish: yup.string().required('Finish date is a required field'),
    city: yup.object().required('City is a required field'),
  })
  .required();

const FormSingleEvent = (props) => {
  const {
    setOpenColapse,
    price,
    cities,
    optionsEventType,
    checkSingleEvent,
    eventGroupSingleCode,
    setPopUpConfirmationSingle,
    isConfirmSingle,
    setIsConfirmSingle,
    optionsSponsors,
    optionsUsers,
  } = props;

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const initialInputValue = {
    groupCode: '',
    groupName: '',
    shortName: '',
    eventName: '',
    teamA: '',
    teamB: '',
    dateStart: '',
    dateFinish: '',
    lockRosterDate: '',
    lockOfficialDate: '',
    timeStart: '',
    timeFinish: '',
    photoPrice: '',
    videoPrice: '',
    location: '',
    city: '',
    typeOfPayment: '',
    photographer: '',
    linkYouTube: '',
    linkMedia: '',
    description: '',
    image: null,
    isSingle: false,
  };
  const [formInput, setFormInput] = useState(initialInputValue);
  const [selectedTeamA, setSelectedTeamA] = useState('');
  const [selectedTeamB, setSelectedTeamB] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSingleEventType, setSelectedSingleEventType] = useState(1);
  const [selectedEventType, setSelectedEventType] = useState('');
  const [selectedOrganizerPIC, setSelectedOrganizerPIC] = useState('');
  const [errorImg, setErrorImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [checkVisibiltyOnWebPage, setCheckVisibiltyOnWebPage] = useState(false);
  const [checkVisibiltyOnFotogritApp, setCheckVisibiltyOnFotogritApp] =
    useState(false);
  const [checkVisibiltyOnCalculation, setCheckVisibiltyOnCalculation] =
    useState(false);
  const [selectedSponsorsGold, setSelectedSponsorsGold] = useState([]);
  const [selectedSponsorsSilver, setSelectedSponsorsSilver] = useState([]);
  const [selectedSponsorsBronze, setSelectedSponsorsBronze] = useState([]);

  // For Options Teams A from team-list
  const [pageTeamsDataA, setPageTeamsDataA] = useState(1);
  const [searchQueryTeamsA, setSearchQueryTeamsA] = useState('');
  const debouncedSearchTeamsA = useDebounce(searchQueryTeamsA, 200);
  const { data: teamsA } = useGetTeamMasterListQuery({
    page: pageTeamsDataA,
    searchTerm: debouncedSearchTeamsA,
  });
  const totalPageOptionTeamsA = teamsA?.meta?.total_page;
  const selectOptionsTeamsA = teamsA?.data?.teams?.map((item) => ({
    value: item?.id,
    label: `${item?.code} - ${item?.name}`,
  }));
  if (Array.isArray(selectOptionsTeamsA)) {
    selectOptionsTeamsA.unshift({ value: '', label: 'Select Team A' });
  }

  // For Options Teams B from team-list
  const [pageTeamsDataB, setPageTeamsDataB] = useState(1);
  const [searchQueryTeamsB, setSearchQueryTeamsB] = useState('');
  const debouncedSearchTeamsB = useDebounce(searchQueryTeamsB, 200);
  const { data: teamsB } = useGetTeamMasterListQuery({
    page: pageTeamsDataB,
    searchTerm: debouncedSearchTeamsB,
  });
  const totalPageOptionTeamsB = teamsB?.meta?.total_page;
  const selectOptionsTeamsB = teamsB?.data?.teams?.map((item) => ({
    value: item?.id,
    label: `${item?.code} - ${item?.name}`,
  }));
  if (Array.isArray(selectOptionsTeamsB)) {
    selectOptionsTeamsB.unshift({ value: '', label: 'Select Team B' });
  }

  const [addNewEventGroup] = useAddNewEventGroupMutation();
  const [addNewEventList, { error: errServer }] = useAddNewEventListMutation();

  const matchedPhoto = price?.find((item) => item?.name === 'Photo');
  const matchedVideo = price?.find((item) => item?.name === 'Video');
  const pricePhoto = matchedPhoto?.price || 0;
  const priceVideo = matchedVideo?.price || 0;

  useEffect(() => {
    if (isConfirmSingle) {
      handleOnSubmit();
    }
  }, [isConfirmSingle]);

  const handleOnSubmit = async () => {
    try {
      if (errorImg) {
        toast.error(`Failed Input: Please select a JPG or JPEG image.`, {
          position: 'top-right',
          theme: 'light',
        });
        return;
      }
      setIsLoading(true);
      const formDataEventGroup = new FormData();
      formDataEventGroup.append('name', '-');
      formDataEventGroup.append('organizer_name', '-');
      formDataEventGroup.append('pic_organizer', selectedOrganizerPIC.value);
      formDataEventGroup.append('event_type', selectedEventType.value);
      formDataEventGroup.append(
        'date_start',
        formInput.dateStart ? formatDateYearToDay(formInput.dateStart) : ''
      );
      formDataEventGroup.append(
        'date_finish',
        formInput.dateFinish ? formatDateYearToDay(formInput.dateFinish) : ''
      );
      formDataEventGroup.append('location', formInput.location);
      formDataEventGroup.append('city', selectedCity.value);
      formDataEventGroup.append(
        'photo_price',
        removeCurrencyFormat(formInput.photoPrice)
      );
      formDataEventGroup.append(
        'video_price',
        removeCurrencyFormat(formInput.videoPrice)
      );
      formDataEventGroup.append('image', formInput.image);
      formDataEventGroup.append('is_single', formInput.isSingle);
      formDataEventGroup.append(
        'lock_roaster_date',
        formInput.lockRosterDate
          ? formatDateYearToDay(formInput.lockRosterDate)
          : ''
      );
      formDataEventGroup.append(
        'lock_official_date',
        formInput.lockOfficialDate
          ? formatDateYearToDay(formInput.lockOfficialDate)
          : ''
      );
      formDataEventGroup.append('short_name', formInput.shortName);
      formDataEventGroup.append(
        'visibility[V001]',
        checkVisibiltyOnFotogritApp
      );
      formDataEventGroup.append('visibility[V002]', checkVisibiltyOnWebPage);
      formDataEventGroup.append(
        'visibility[V003]',
        checkVisibiltyOnCalculation
      );

      if (selectedSponsorsGold?.length > 0) {
        const dataSponsorsGoldId = selectedSponsorsGold
          ?.map((item) => item?.value)
          .join(',');
        formDataEventGroup.append('sponsors_gold', dataSponsorsGoldId);
      }
      if (selectedSponsorsSilver?.length > 0) {
        const dataSponsorsSilverId = selectedSponsorsSilver
          ?.map((item) => item?.value)
          .join(',');
        formDataEventGroup.append('sponsors_silver', dataSponsorsSilverId);
      }
      if (selectedSponsorsBronze?.length > 0) {
        const dataSponsorsBronzeId = selectedSponsorsBronze
          ?.map((item) => item?.value)
          .join(',');
        formDataEventGroup.append('sponsors_bronze', dataSponsorsBronzeId);
      }

      if (!isConfirmSingle) {
        setPopUpConfirmationSingle(true);
        setIsLoading(false);
        return;
      }

      setPopUpConfirmationSingle(false);

      const resEventGroup = await addNewEventGroup(formDataEventGroup);

      if (!resEventGroup?.error) {
        const eventGroupID = resEventGroup?.data?.data?.id;
        const formData = new FormData();
        formData.append('event_group_id', eventGroupID);
        formData.append('name', formInput.eventName);
        formData.append('team_a_id', selectedTeamA);
        formData.append('team_b_id', selectedTeamB);
        formData.append('pic_event', selectedOrganizerPIC.label);
        formData.append(
          'date_start',
          formInput.dateStart ? formatDateYearToDay(formInput.dateStart) : ''
        );
        formData.append(
          'date_finish',
          formInput.dateFinish ? formatDateYearToDay(formInput.dateFinish) : ''
        );
        formData.append('time_start', formInput.timeStart);
        formData.append('time_finish', formInput.timeFinish);
        formData.append(
          'photo_price',
          removeCurrencyFormat(formInput.photoPrice)
        );
        formData.append(
          'video_price',
          removeCurrencyFormat(formInput.videoPrice)
        );
        formData.append('location', formInput.location);
        formData.append('city', selectedCity.value);
        formData.append('payment_method', selectedPayment);
        formData.append('photographer', formInput.photographer);
        formData.append('link_youtube', formInput.linkYouTube);
        formData.append('link_media', formInput.linkMedia);
        formData.append('image', formInput.image);
        formData.append('description', formInput.description);
        formData.append('is_single', formInput.isSingle);

        const response = await addNewEventList(formData);

        if (!response.error) {
          setIsConfirmSingle(false);
          setSelectedImage(null);
          setSelectedCity('');
          setSelectedPayment('');
          setSelectedTeamA('');
          setSelectedTeamB('');
          setFormInput(initialInputValue);
          reset();
          setOpenColapse(false);
          setIsLoading(false);

          toast.success(`Single Event has been added!`, {
            position: 'top-right',
            theme: 'light',
          });
        }
      }
    } catch (err) {
      setIsLoading(false);
      setIsConfirmSingle(false);
      console.error('Failed to save:', err);
      toast.error(`Failed: ${err?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangePrice = (e) => {
    const { name, value } = e.target;

    // Remove characters other than digits (0-9)
    const numericValue = value.replace(/[^0-9]/g, '');

    // Format the price as desired, for example: "Rp 10,000"
    const formattedPrice = `Rp ${numericValue
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

    setFormInput((prevData) => ({
      ...prevData,
      [name]: formattedPrice,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.type === 'image/jpeg') {
        setErrorImg(null);
        setSelectedImage(file);
        setFormInput((prevState) => ({
          ...prevState,
          image: file,
        }));
      } else {
        setErrorImg('Invalid file type. Please select a JPG or JPEG image.');
        setSelectedImage(null);
      }
    }
  };

  const handleStartDateChange = (date, field) => {
    field.onChange(date);
    setFormInput((prevState) => ({
      ...prevState,
      dateStart: date,
    }));
  };

  const handleEndDateChange = (date, field) => {
    field.onChange(date);
    setFormInput((prevState) => ({
      ...prevState,
      dateFinish: date,
    }));
  };

  const handleChangeLockRosterDate = (date) => {
    setFormInput((prevState) => ({
      ...prevState,
      lockRosterDate: date,
    }));
  };
  const handleChangeLockOfficialDate = (date) => {
    setFormInput((prevState) => ({
      ...prevState,
      lockOfficialDate: date,
    }));
  };

  const handleCancel = () => {
    setOpenColapse(false);
  };

  useEffect(() => {
    if (checkSingleEvent) {
      setFormInput((prevFormInput) => ({
        ...prevFormInput,
        groupCode: eventGroupSingleCode || '',
        groupName: eventGroupSingleCode || '',
        shortName: eventGroupSingleCode || '',
        photoPrice: CurrencyFormat(pricePhoto),
        videoPrice: CurrencyFormat(priceVideo),
        isSingle: checkSingleEvent,
      }));
      setSelectedPayment('postpaid');
    }
  }, [price, checkSingleEvent, eventGroupSingleCode]);

  // Default Value for validation react hook form
  useEffect(() => {
    if (price) {
      setValue('photoPrice', CurrencyFormat(pricePhoto));
      setValue('videoPrice', CurrencyFormat(priceVideo));
    }
  }, [price]);

  // Removing required error when input is filled.
  useEffect(() => {
    const fieldsToCheck = [
      'eventName',
      'dateStart',
      'dateFinish',
      'location',
      'photoPrice',
      'videoPrice',
      'timeStart',
      'timeFinish',
    ];

    fieldsToCheck.forEach((field) => {
      if (errors[field] && formInput[field] !== '') {
        clearErrors(field);
      }
    });
  }, [formInput, clearErrors, errors]);

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)}>
      <div className="grid grid-cols-1 gap-4 mb-3 sm:grid-cols-3 lg:grid-cols-4">
        <SelectInput
          name="team"
          data={optionsNewSingleEvent}
          placeholder="New Single Event Type"
          label="New Single Event Type"
          selectedValue={selectedSingleEventType}
          setSelectedValue={setSelectedSingleEventType}
        />
      </div>

      <div className="grid grid-flow-row-dense grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2">
        <div className="flex flex-col gap-y-2">
          <Input
            type="text"
            label="Group Code"
            name="groupCode"
            value={formInput.groupCode}
            onChange={handleChange}
            disabled
            errServer={errServer?.data}
            errCodeServer="x06004"
          />

          <Input
            type="text"
            label="Group Name / Short Name"
            name="groupName"
            value={formInput.groupName}
            onChange={handleChange}
            disabled
          />

          <Input
            type="text"
            label="Event Name"
            name="eventName"
            value={formInput.eventName}
            onChange={handleChange}
            errServer={errServer?.data}
            errCodeServer="x06005"
            errValidation={errors}
            register={register}
          />

          <Controller
            control={control}
            name="eventType"
            render={({ field }) => (
              <SelectDropdown
                field={field}
                name="eventType"
                data={optionsEventType}
                placeholder="Select Event Type"
                label="Event Type"
                selectedValue={selectedEventType}
                setSelectedValue={setSelectedEventType}
                errValidation={errors}
              />
            )}
          />

          <Controller
            control={control}
            name="picOrganizer"
            render={({ field }) => (
              <SelectDropdown
                field={field}
                name="picOrganizer"
                data={optionsUsers}
                label="Organizer PIC"
                placeholder="Select Organizer PIC"
                selectedValue={selectedOrganizerPIC}
                setSelectedValue={setSelectedOrganizerPIC}
                errServer={errServer?.data}
                errCodeServer="xxx403"
                errValidation={errors}
              />
            )}
          />

          <DatePickerCustom
            label="Lock Roster Date"
            name="lockRosterDate"
            placeholder="Select Date"
            value={formInput.lockRosterDate}
            onChange={handleChangeLockRosterDate}
          />
        </div>

        <div className="flex flex-col gap-y-2">
          {selectedSingleEventType === 1 && (
            <SelectInput
              name="team"
              data={selectOptionsTeamsA}
              placeholder="Select Team A"
              label="Team A"
              selectedValue={selectedTeamA}
              setSelectedValue={setSelectedTeamA}
              errServer={errServer?.data}
              errCodeServer="x06002"
              infiniteScroll
              setPageOption={setPageTeamsDataA}
              setSearchQueryOption={setSearchQueryTeamsA}
              totalPageOptions={totalPageOptionTeamsA}
            />
          )}

          {selectedSingleEventType === 1 && (
            <SelectInput
              name="team"
              data={selectOptionsTeamsB}
              placeholder="Select Team B"
              label="Team B"
              selectedValue={selectedTeamB}
              setSelectedValue={setSelectedTeamB}
              errServer={errServer?.data}
              errCodeServer="x06003"
              infiniteScroll
              setPageOption={setPageTeamsDataB}
              setSearchQueryOption={setSearchQueryTeamsB}
              totalPageOptions={totalPageOptionTeamsB}
            />
          )}

          <Controller
            control={control}
            name="dateStart"
            render={({ field }) => (
              <DatePickerInput
                field={field}
                label="Start Date"
                name="dateStart"
                onChange={(date) => handleStartDateChange(date, field)}
                placeholder="Select Start Date"
                max={formInput.dateFinish}
                errServer={errServer?.data}
                errCodeServer="x06000"
                errValidation={errors}
              />
            )}
          />

          <Controller
            control={control}
            name="dateFinish"
            render={({ field }) => (
              <DatePickerInput
                field={field}
                label="Finish Date"
                name="dateFinish"
                onChange={(date) => handleEndDateChange(date, field)}
                placeholder="Select Finish Date"
                errServer={errServer?.data}
                errCodeServer="x06001"
                min={formInput.dateStart}
                errValidation={errors}
              />
            )}
          />

          <div className="grid grid-cols-2 gap-2">
            <Input
              type="time"
              label="Start Time"
              name="timeStart"
              value={formInput.timeStart}
              onChange={handleChange}
              errValidation={errors}
              register={register}
            />

            <Input
              type="time"
              label="Finish Time"
              name="timeFinish"
              value={formInput.timeFinish}
              onChange={handleChange}
              errValidation={errors}
              register={register}
            />
          </div>

          <DatePickerCustom
            label="Lock Official Date"
            name="lockOfficialDate"
            placeholder="Select Date"
            value={formInput.lockOfficialDate}
            onChange={handleChangeLockOfficialDate}
          />
        </div>

        <div className="flex flex-col gap-y-2">
          <Controller
            control={control}
            name="city"
            render={({ field }) => (
              <SelectDropdown
                field={field}
                name="city"
                data={cities}
                label="City"
                placeholder="Select City"
                selectedValue={selectedCity}
                setSelectedValue={setSelectedCity}
                errValidation={errors}
                errServer={errServer?.data}
                errCodeServer="x06013"
              />
            )}
          />

          <Input
            type="text"
            label="Event Location"
            name="location"
            value={formInput.location}
            onChange={handleChange}
            errServer={errServer?.data}
            errCodeServer="x06007"
            errValidation={errors}
            register={register}
          />

          <Input
            type="text"
            label="Photo Price"
            name="photoPrice"
            value={formInput.photoPrice}
            onChange={handleChangePrice}
            errValidation={errors}
            register={register}
          />

          <Input
            type="text"
            label="Video Price"
            name="videoPrice"
            value={formInput.videoPrice}
            onChange={handleChangePrice}
            errValidation={errors}
            register={register}
          />

          <div className="space-y-2 mt-2">
            <div className="flex items-start justify-start gap-2">
              <div className="w-4 h-4">
                <Checkbox
                  name="checkVisibiltyOnWebPage"
                  checked={checkVisibiltyOnWebPage}
                  onChange={() =>
                    setCheckVisibiltyOnWebPage(!checkVisibiltyOnWebPage)
                  }
                  className="w-4 h-4"
                />
              </div>

              <div className="">
                <span
                  className={`text-sm ${
                    checkVisibiltyOnWebPage ? 'text-black' : 'text-gray-500'
                  }`}
                >
                  Visibilty on statistic web page
                </span>
              </div>
            </div>

            <div className="flex items-start justify-start gap-2">
              <div className="w-4 h-4">
                <Checkbox
                  name="checkVisibiltyOnFotogritApp"
                  checked={checkVisibiltyOnFotogritApp}
                  onChange={() =>
                    setCheckVisibiltyOnFotogritApp(!checkVisibiltyOnFotogritApp)
                  }
                  className="w-4 h-4"
                />
              </div>

              <div className="">
                <span
                  className={`text-sm ${
                    checkVisibiltyOnFotogritApp ? 'text-black' : 'text-gray-500'
                  }`}
                >
                  Visibilty on fotogrit app
                </span>
              </div>
            </div>

            <div className="flex items-start justify-start gap-2">
              <div className="w-4 h-4">
                <Checkbox
                  name="checkVisibiltyOnCalculation"
                  checked={checkVisibiltyOnCalculation}
                  onChange={() =>
                    setCheckVisibiltyOnCalculation(!checkVisibiltyOnCalculation)
                  }
                  className="w-4 h-4"
                />
              </div>

              <div className="">
                <span
                  className={`text-sm ${
                    checkVisibiltyOnCalculation ? 'text-black' : 'text-gray-500'
                  }`}
                >
                  Visibilty on inclusion in statistic calculation
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="sm:grid sm:grid-cols-3 sm:col-span-3 lg:flex lg:flex-col gap-2  lg:col-span-1">
          <UploadImage
            label="Logo"
            name="image"
            height="h-28 sm:h-[168px]"
            onChange={handleImageChange}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            accept="image/jpg,image/jpeg"
            errorImg={errorImg}
            setErrorImg={setErrorImg}
            errServer={errServer?.data}
            errCodeServer="xxx025"
          />

          <div className="flex flex-col gap-2">
            <MultiSelectCustom
              label="Sponsors Gold"
              placeholder="Select Sponsors Gold"
              options={optionsSponsors}
              selectedOptions={selectedSponsorsGold}
              setSelectedOptions={setSelectedSponsorsGold}
              errServer={errServer?.data}
              errCodeServer="x01Dummy"
            />
            <MultiSelectCustom
              label="Sponsors Silver"
              placeholder="Select Sponsors Silver"
              options={optionsSponsors}
              selectedOptions={selectedSponsorsSilver}
              setSelectedOptions={setSelectedSponsorsSilver}
              errServer={errServer?.data}
              errCodeServer="x01Dummy"
            />
            <MultiSelectCustom
              label="Sponsors Bronze"
              placeholder="Select Sponsors Bronze"
              options={optionsSponsors}
              selectedOptions={selectedSponsorsBronze}
              setSelectedOptions={setSelectedSponsorsBronze}
              errServer={errServer?.data}
              errCodeServer="x01Dummy"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end w-full gap-4 py-2 mt-4">
        <Button
          background="red"
          className="w-40"
          disabled={isLoading ? true : false}
          onClick={() => handleCancel()}
        >
          {isLoading ? <LoaderButtonAction /> : 'Cancel'}
        </Button>
        <Button
          type="submit"
          background="black"
          className="w-40"
          disabled={isLoading ? true : false}
        >
          {isLoading ? <LoaderButtonAction /> : 'Add'}
        </Button>
      </div>
    </form>
  );
};

export default FormSingleEvent;
