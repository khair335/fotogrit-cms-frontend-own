import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import {
  DatePickerCustom,
  Input,
  SelectInput,
  UploadImage,
} from '@/components/form-input';
import { Button, LoaderButtonAction } from '@/components';
import TextArea from '@/components/form-input/TextArea';

import { selectTypeOfPayment } from '@/constants';
import { formatDateYearToDay } from '@/helpers/FormatDateYearToDay';

import { useAddNewEventListMutation } from '@/services/api/eventsApiSlice';
import { CurrencyFormat, removeCurrencyFormat } from '@/helpers/CurrencyFormat';
import {
  getIsRequiredGroupID,
  setIsRequiredFilterGroupEvent,
} from '@/services/state/eventsSlice';
import { checkFileType } from '@/helpers/CheckFileType';

const validationSchema = yup
  .object({
    eventName: yup.string().required('Event Name is a required field'),
    picEvent: yup.string().required('Event PIC is a required field'),
    location: yup.string().required('Location is a required field'),
    timeStart: yup.string().required('Start Time is a required field'),
    timeFinish: yup.string().required('Finish Time is a required field'),
    photoPrice: yup
      .string()
      .required('Photo price is a required field')
      .nullable(),
    videoPrice: yup
      .string()
      .required('Video price is a required field')
      .nullable(),
  })
  .required();

const FormAddEventList = (props) => {
  const {
    setIsOpenNewData,
    optionsTeams,
    optionsCities,
    optionsEventMatch,
    eventCode,
    eventGroupID,
    eventGroupData,
    price,
  } = props;

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const dispatch = useDispatch();
  const isRequiredGroupID = useSelector(getIsRequiredGroupID);

  const initialInputValue = {
    groupCode: '',
    eventCode: '',
    eventName: '',
    teamA: '',
    teamB: '',
    picEvent: '',
    dateStart: '',
    dateFinish: '',
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
    thumbnailTime: '00:00',
  };
  const [formInput, setFormInput] = useState(initialInputValue);
  const [selectedTeamA, setSelectedTeamA] = useState('');
  const [selectedTeamB, setSelectedTeamB] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedEventMatch, setSelectedEventMatch] = useState('');
  const [errorImg, setErrorImg] = useState(null);
  const [groupCode, setGroupCode] = useState('');

  const [addNewEventList, { isLoading, error: errServer }] =
    useAddNewEventListMutation();

  const matchedEventGroupCode = eventGroupData?.find(
    (item) => item.id === eventGroupID
  );

  const matchedPhoto = price?.find((item) => item?.name === 'Photo');
  const matchedVideo = price?.find((item) => item?.name === 'Video');
  const pricePhoto = matchedPhoto?.price || 0;
  const priceVideo = matchedVideo?.price || 0;
  const photoPriceByEvenGroup = parseInt(
    matchedEventGroupCode?.photo_price || 0
  );
  const videoPriceByEvenGroup = parseInt(
    matchedEventGroupCode?.video_price || 0
  );

  const typeOfMedia = selectedImage && checkFileType(selectedImage);

  const handleOnSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('event_group_id', eventGroupID);
      formData.append('name', formInput.eventName);
      formData.append('team_a_id', selectedTeamA);
      formData.append('team_b_id', selectedTeamB);
      formData.append('pic_event', formInput.picEvent);
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
      formData.append('city', selectedCity);
      formData.append('payment_method', selectedPayment);
      formData.append('photographer', formInput.photographer);
      formData.append('link_youtube', formInput.linkYouTube);
      formData.append('link_media', formInput.linkMedia);
      formData.append('image', formInput.image);
      formData.append('description', formInput.description);
      formData.append('is_single', formInput.isSingle);
      formData.append('match_category_id', selectedEventMatch);

      if (typeOfMedia === 'video') {
        const [minutes, seconds] = formInput.thumbnailTime.split(':');
        formData.append('minutes', minutes);
        formData.append('seconds', seconds);
      }

      const response = await addNewEventList(formData);

      if (!response?.error) {
        reset();
        setIsOpenNewData(false);

        toast.success(`"${formInput?.eventName}" has been added!`, {
          position: 'top-right',
          theme: 'light',
        });
      }

      if (response?.error) {
        toast.error(`Failed: ${response?.error?.data?.message}`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      console.error('Failed to save the event list', err);
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
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        setErrorImg(null);
        setSelectedImage(file);
        setFormInput((prevState) => ({
          ...prevState,
          image: file,
        }));
      } else {
        setErrorImg('Invalid file type. Please select an image or video.');
        setSelectedImage(null);
      }
    }
  };

  const handleStartDateChange = (date) => {
    setFormInput((prevState) => ({
      ...prevState,
      dateStart: date,
      dateFinish: '',
    }));
  };

  const handleEndDateChange = (date) => {
    setFormInput((prevState) => ({
      ...prevState,
      dateFinish: date,
    }));
  };

  const handleCancel = () => {
    setSelectedImage(null);
    setSelectedCity('');
    setSelectedPayment('');
    setSelectedTeamA('');
    setSelectedTeamB('');
    setFormInput(initialInputValue);
    setFormInput((prevFormInput) => ({
      ...prevFormInput,
      eventCode: eventCode || '',
      groupCode: groupCode || '',
      photoPrice: pricePhoto,
      videoPrice: priceVideo,
    }));
    reset();
    setIsOpenNewData(false);
  };

  useEffect(() => {
    if (eventGroupID) {
      const codeGroup = matchedEventGroupCode?.code;
      setGroupCode(codeGroup);
    } else {
      setGroupCode('');
    }
  }, [eventGroupID]);

  // Handle the display of the required error for the event Group filter
  useEffect(() => {
    dispatch(setIsRequiredFilterGroupEvent(false));

    if (errServer?.data?.status === 'x06004') {
      dispatch(setIsRequiredFilterGroupEvent(true));
    }

    if (eventGroupID !== '') {
      dispatch(setIsRequiredFilterGroupEvent(false));
    }
  }, [errServer, eventGroupID]);

  useEffect(() => {
    setFormInput((prevFormInput) => ({
      ...prevFormInput,
      eventCode: eventCode || '',
      groupCode: groupCode || '-',
      photoPrice:
        eventGroupID !== ''
          ? CurrencyFormat(photoPriceByEvenGroup)
          : CurrencyFormat(pricePhoto),
      videoPrice:
        eventGroupID !== ''
          ? CurrencyFormat(videoPriceByEvenGroup)
          : CurrencyFormat(priceVideo),
    }));
    setSelectedPayment('postpaid');
  }, [eventCode, eventGroupID, price, groupCode]);

  // Default Value for validation react hook form
  useEffect(() => {
    if (price) {
      setValue(
        'photoPrice',
        eventGroupID !== ''
          ? CurrencyFormat(photoPriceByEvenGroup)
          : CurrencyFormat(pricePhoto)
      );
      setValue(
        'videoPrice',
        eventGroupID !== ''
          ? CurrencyFormat(videoPriceByEvenGroup)
          : CurrencyFormat(priceVideo)
      );
    }
  }, [price, eventGroupID]);

  useEffect(() => {
    if (eventGroupID) {
      setSelectedTeamA('');
      setSelectedTeamB('');
    }
  }, [eventGroupID]);

  useEffect(() => {
    setFormInput((prevFormInput) => ({
      ...prevFormInput,
      isSingle: matchedEventGroupCode?.is_single,
      location: matchedEventGroupCode?.location,
      description: matchedEventGroupCode?.description,
      city: matchedEventGroupCode?.city,
    }));
    if (matchedEventGroupCode?.city) {
      setSelectedCity(matchedEventGroupCode?.city);
    }
  }, [matchedEventGroupCode]);

  useEffect(() => {
    // Set the default value for "picEvent" only if it exists and the form field is empty
    if (matchedEventGroupCode?.pic_organizer && !formInput.picEvent) {
      setValue('picEvent', matchedEventGroupCode?.pic_organizer);

      setFormInput((prev) => ({
        ...prev,
        picEvent: matchedEventGroupCode?.pic_organizer,
      }));
    }
  }, [matchedEventGroupCode, setValue]);

  useEffect(() => {
    if (matchedEventGroupCode?.location && !formInput.location) {
      setValue('location', matchedEventGroupCode.location, {
        shouldValidate: true,
      });
      setFormInput((prev) => ({
        ...prev,
        location: matchedEventGroupCode.location,
      }));
    }
  }, [matchedEventGroupCode, setValue]);

  // Removing required error when input is filled.
  useEffect(() => {
    const fieldsToCheck = [
      'eventName',
      'picEvent',
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
  const [defaultInputValue, setDefaultInputValue] = useState(null);
  const [eventNameDefaultData, setEventNameDefaultData] = useState('');

  useEffect(() => {
    setDefaultInputValue(eventNameDefaultData);
  }, [eventNameDefaultData]);

  const selectedOptionTeamA = optionsTeams
    ?.find((option) => option.value === selectedTeamA)
    ?.label?.replace(/^\S+\s*/, '')
    ?.replace(/\s*-\s*.*/, '');
  const selectedOptionTeamB = optionsTeams
    ?.find((option) => option.value === selectedTeamB)
    ?.label?.replace(/^\S+\s*/, '')
    ?.replace(/\s*-\s*.*/, '');

  const ageGroupTeamAFull = optionsTeams
    ?.find((option) => option.value === selectedTeamA)
    ?.label.split(' - ');
  const ageGroupTeamBFull = optionsTeams
    ?.find((option) => option.value === selectedTeamB)
    ?.label.split(' - ');
  const ageGroupTeamA = ageGroupTeamAFull?.slice(1).join(' ');
  const ageGroupTeamB = ageGroupTeamBFull?.slice(1).join(' ');
  const ageGroup =
    ageGroupTeamA == ageGroupTeamB
      ? ageGroupTeamA
      : `${ageGroupTeamA}  ${ageGroupTeamB}`;

  useEffect(() => {
    if (selectedOptionTeamA !== 'Team' && selectedOptionTeamB !== 'Team') {
      setEventNameDefaultData(
        `${selectedOptionTeamA} vs ${selectedOptionTeamB} - age group`
      );
      setFormInput((prevData) => ({
        ...prevData,
        ['eventName']: `${selectedOptionTeamA} vs ${selectedOptionTeamB} - ${ageGroup}`,
      }));
    }
  }, [selectedTeamA, selectedTeamB]);

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)}>
      <div className="grid grid-flow-row-dense grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2 z-10 relative">
        <div className="flex flex-col gap-1">
          <Input
            type="text"
            label="Group Code"
            name="groupCode"
            value={formInput.groupCode}
            onChange={handleChange}
            disabled
          />
          {isRequiredGroupID && (
            <span className="text-[10px] animate-pulse text-red-600 ">
              Group Code is a required field
            </span>
          )}
        </div>

        <Input
          type="text"
          label="Event Code"
          name="eventCode"
          value={formInput.eventCode}
          onChange={handleChange}
          disabled
        />

        <div className="sm:col-span-2">
          {formInput.eventName || !defaultInputValue ? (
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
          ) : (
            <Input
              type="text"
              label="Event Name"
              name="eventName"
              onChange={handleChange}
              errServer={errServer?.data}
              errCodeServer="x06005"
              errValidation={errors}
              // register={register}
              defaultValue={defaultInputValue}
            />
          )}
        </div>

        <div className="">
          <SelectInput
            name="team"
            data={optionsTeams}
            placeholder="Select Team A"
            label="Team A"
            selectedValue={selectedTeamA}
            setSelectedValue={setSelectedTeamA}
            errServer={errServer?.data}
            errCodeServer="x06002"
          />
        </div>

        <div className="">
          <SelectInput
            name="team"
            data={optionsTeams}
            placeholder="Select Team B"
            label="Team B"
            selectedValue={selectedTeamB}
            setSelectedValue={setSelectedTeamB}
            errServer={errServer?.data}
            errCodeServer="x06003"
          />
        </div>

        <div className="">
          <DatePickerCustom
            label="Start Date"
            name="dateStart"
            value={formInput.dateStart}
            onChange={handleStartDateChange}
            placeholder="Select Start Date"
            errServer={errServer?.data}
            errCodeServer="x06000"
            errValidation={errors}
            register={register}
          />
        </div>

        <div className="">
          <DatePickerCustom
            label="Finish Date"
            name="dateFinish"
            value={formInput.dateFinish}
            onChange={handleEndDateChange}
            placeholder="Select Finish Date"
            errServer={errServer?.data}
            errCodeServer="x06001"
            min={formInput.dateStart}
            errValidation={errors}
            register={register}
          />
        </div>
        {formInput.picEvent || !matchedEventGroupCode?.pic_organizer ? (
          <Input
            type="text"
            label="Event PIC"
            name="picEvent"
            value={formInput.picEvent}
            onChange={handleChange}
            errServer={errServer?.data}
            errCodeServer="x06009"
            errValidation={errors}
            register={register}
          />
        ) : (
          <Input
            type="text"
            label="Event PIC"
            name="picEvent"
            onChange={handleChange}
            errServer={errServer?.data}
            errCodeServer="x06009"
            errValidation={errors}
            defaultValue={matchedEventGroupCode?.pic_organizer}
          />
        )}

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

        <div className="sm:col-span-2">
          {formInput.location || !matchedEventGroupCode?.location ? (
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
              // defaultInputValue={matchedEventGroupCode?.location}
            />
          ) : (
            <Input
              type="text"
              label="Event Location"
              name="location"
              // value={formInput.location}
              onChange={handleChange}
              errServer={errServer?.data}
              errCodeServer="x06007"
              errValidation={errors}
              register={register}
              value={matchedEventGroupCode?.location}
              // defaultValue={matchedEventGroupCode?.location}
            />
          )}
        </div>

        <div className="">
          <SelectInput
            name="city"
            data={optionsCities}
            placeholder="Select City"
            label="City"
            selectedValue={selectedCity}
            setSelectedValue={setSelectedCity}
            errServer={errServer?.data}
            errCodeServer="x06013"
          />
        </div>

        <div className="">
          <SelectInput
            name="payment"
            data={selectTypeOfPayment}
            placeholder="Select Payment"
            label="Type Of Payment"
            selectedValue={selectedPayment}
            setSelectedValue={setSelectedPayment}
          />
        </div>

        <Input
          type="text"
          label="Photographer"
          name="photographer"
          value={formInput.photographer}
          onChange={handleChange}
          placeholder="N/A"
          disabled
        />

        <Input
          type="text"
          label="Link Youtube"
          name="linkYouTube"
          value={formInput.linkYouTube}
          onChange={handleChange}
        />

        <div className="sm:col-span-2 lg:col-span-1">
          <Input
            type="text"
            label="Link Media"
            name="eventLocation"
            value={formInput.linkMedia}
            onChange={handleChange}
            disabled
          />
        </div>

        <TextArea
          label="Description"
          name="description"
          rows={6}
          value={formInput.description}
          onChange={handleChange}
        />

        <UploadImage
          label="Event Thumbnail"
          name="image"
          height="h-[136px]"
          onChange={handleImageChange}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          errorImg={errorImg}
          setErrorImg={setErrorImg}
          errServer={errServer?.data}
          errCodeServer="xxx025"
          accept="image/jpg,image/jpeg"
          // accept="image/jpg,image/jpeg,video/mp4"
        />

        {typeOfMedia === 'video' && (
          <Input
            type="time"
            label="Set Thumbnail Time"
            name="thumbnailTime"
            value={formInput.thumbnailTime}
            onChange={handleChange}
          />
        )}

        <SelectInput
          name="eventMatch"
          data={optionsEventMatch}
          placeholder="Select event match"
          label="Event Match Category"
          selectedValue={selectedEventMatch}
          setSelectedValue={setSelectedEventMatch}
          errServer={errServer?.data}
          errCodeServer="x06050"
        />
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

export default FormAddEventList;
