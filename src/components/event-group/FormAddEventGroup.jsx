import { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Button } from '@/components';
import {
  Checkbox,
  DatePickerCustom,
  DatePickerInput,
  Input,
  MultiSelectCustom,
  TextArea,
  UploadImage,
} from '../form-input';
import {
  useAddMvpRankMutation,
  useAddNewEventGroupMutation,
} from '@/services/api/eventGroupApiSlice';

import LoaderButtonAction from './../LoaderButtonAction';
import { formatDateYearToDay } from '@/helpers/FormatDateYearToDay';

import SelectDropdown from './../form-input/SelectDropdown';
import { CurrencyFormat, removeCurrencyFormat } from '@/helpers/CurrencyFormat';
import FormSingleEvent from './FormSingleEvent';

const validationSchema = yup
  .object({
    name: yup.string().required('Name is a required field'),
    shortName: yup
      .string()
      .required('Short name is a required field')
      .max(10, 'Short name must be at most 10 characters'),
    organizerName: yup.string().required('Group name is a required field'),
    picOrganizer: yup
      .object()
      .nullable()
      .required('Organizer PIC is a required field'),
    dateStart: yup.string().required('Start date is a required field'),
    dateFinish: yup.string().required('Finish date is a required field'),
    location: yup.string().required('Location is a required field'),
    eventType: yup
      .object()
      .nullable()
      .required('Event Type is a required field'),
    city: yup.object().nullable().required('City is a required field'),
    photoPrice: yup.string().required('Photo price is a required field'),
    videoPrice: yup.string().required('Video price is a required field'),
  })
  .required();

const FormAddEventGroup = (props) => {
  const {
    cities,
    setOpenColapse,
    optionsEventType,
    price,
    eventGroupCode,
    eventGroupSingleCode,
    optionsMvpRank,
    setPopUpConfirmation,
    isConfirm,
    setIsConfirm,
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
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const matchedPhoto = price?.find((item) => item?.name === 'Photo');
  const matchedVideo = price?.find((item) => item?.name === 'Video');
  const pricePhoto = matchedPhoto?.price || 0;
  const priceVideo = matchedVideo?.price || 0;

  const INITIAL_FORM_INPUT = {
    ID: '',
    code: '',
    name: '',
    shortName: '',
    organizerName: '',
    eventType: '',
    dateStart: '',
    dateFinish: '',
    lockRosterDate: '',
    lockOfficialDate: '',
    location: '',
    city: '',
    photoPrice: pricePhoto,
    videoPrice: priceVideo,
    eventLogo: null,
    description: '',
  };

  const [formEventGroup, setFormEventGroup] = useState(INITIAL_FORM_INPUT);

  const [selectedOrganizerPIC, setSelectedOrganizerPIC] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('');
  const [selectedCityValue, setSelectedCityValue] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorImg, setErrorImg] = useState(null);
  const [checkSingleEvent, setCheckSingleEvent] = useState(false);
  const [selectedMvpRank, setSelectedMvpRank] = useState('');
  const [selectedSponsorsGold, setSelectedSponsorsGold] = useState([]);
  const [selectedSponsorsSilver, setSelectedSponsorsSilver] = useState([]);
  const [selectedSponsorsBronze, setSelectedSponsorsBronze] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checkVisibiltyOnWebPage, setCheckVisibiltyOnWebPage] = useState(false);
  const [checkVisibiltyOnFotogritApp, setCheckVisibiltyOnFotogritApp] =
    useState(false);
  const [checkVisibiltyOnCalculation, setCheckVisibiltyOnCalculation] =
    useState(false);

  const [addNewEventGroup, { error: errServer }] =
    useAddNewEventGroupMutation();
  const [addMvpRank] = useAddMvpRankMutation();

  useEffect(() => {
    if (isConfirm) {
      handleOnSubmit();
    }
  }, [isConfirm]);

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
      const formData = new FormData();
      formData.append('code', formEventGroup.code);
      formData.append('name', formEventGroup.name);
      formData.append('organizer_name', formEventGroup.organizerName);
      formData.append('pic_organizer', selectedOrganizerPIC?.value);
      formData.append('event_type', selectedEventType?.value);
      formData.append(
        'date_start',
        formEventGroup.dateStart
          ? formatDateYearToDay(formEventGroup.dateStart)
          : ''
      );
      formData.append(
        'date_finish',
        formEventGroup.dateFinish
          ? formatDateYearToDay(formEventGroup.dateFinish)
          : ''
      );
      formData.append('location', formEventGroup.location);
      formData.append('city', selectedCityValue?.value);
      formData.append(
        'photo_price',
        removeCurrencyFormat(formEventGroup.photoPrice)
      );
      formData.append(
        'video_price',
        removeCurrencyFormat(formEventGroup.videoPrice)
      );
      formData.append('image', formEventGroup.eventLogo);
      formData.append('description', formEventGroup.description);
      formData.append(
        'lock_roaster_date',
        formEventGroup.lockRosterDate
          ? formatDateYearToDay(formEventGroup.lockRosterDate)
          : ''
      );
      formData.append(
        'lock_official_date',
        formEventGroup.lockOfficialDate
          ? formatDateYearToDay(formEventGroup.lockOfficialDate)
          : ''
      );
      formData.append('short_name', formEventGroup.shortName);
      formData.append('visibility[V001]', checkVisibiltyOnFotogritApp);
      formData.append('visibility[V002]', checkVisibiltyOnWebPage);
      formData.append('visibility[V003]', checkVisibiltyOnCalculation);

      if (selectedSponsorsGold?.length > 0) {
        const dataSponsorsGoldId = selectedSponsorsGold
          ?.map((item) => item?.value)
          .join(',');
        formData.append('sponsors_gold', dataSponsorsGoldId);
      }
      if (selectedSponsorsSilver?.length > 0) {
        const dataSponsorsSilverId = selectedSponsorsSilver
          ?.map((item) => item?.value)
          .join(',');
        formData.append('sponsors_silver', dataSponsorsSilverId);
      }
      if (selectedSponsorsBronze?.length > 0) {
        const dataSponsorsBronzeId = selectedSponsorsBronze
          ?.map((item) => item?.value)
          .join(',');
        formData.append('sponsors_bronze', dataSponsorsBronzeId);
      }

      if (!isConfirm) {
        setPopUpConfirmation(true);
        setIsLoading(false);
        return;
      }

      setPopUpConfirmation(false);

      const response = await addNewEventGroup(formData).unwrap();

      if (!response.error) {
        setIsConfirm(false);
        if (selectedMvpRank) {
          // Add MVP Rank
          const mvpTransform = selectedMvpRank?.map((item, index) => ({
            rank: index + 1,
            name: item?.name,
          }));

          const newDataMvpRank = {
            event_group_id: response?.data?.id,
            mvp_rank: mvpTransform,
          };

          const resMvpRank = await addMvpRank(newDataMvpRank).unwrap();

          if (!resMvpRank?.error) {
            setIsLoading(false);
            setOpenColapse(false);
            reset();

            toast.success(`"${formEventGroup?.name}" has been added!`, {
              position: 'top-right',
              theme: 'light',
            });
          }
        } else {
          setIsLoading(false);
          setOpenColapse(false);
          reset();

          toast.success(`"${formEventGroup?.name}" has been added!`, {
            position: 'top-right',
            theme: 'light',
          });
        }
      }
    } catch (err) {
      setIsLoading(false);
      setIsConfirm(false);
      console.error('Failed:', err);
      toast.error(`Failed: ${err?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormEventGroup((prevData) => ({
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

    setFormEventGroup((prevData) => ({
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
        setFormEventGroup((prevState) => ({
          ...prevState,
          eventLogo: file,
        }));
      } else {
        setErrorImg('Invalid file type. Please select a JPG or JPEG image.');
        setSelectedImage(null);
      }
    }
  };

  const handleStartDateChange = (date, field) => {
    field.onChange(date);
    setFormEventGroup((prevState) => ({
      ...prevState,
      dateStart: date,
    }));
  };

  const handleEndDateChange = (date, field) => {
    field.onChange(date);
    setFormEventGroup((prevState) => ({
      ...prevState,
      dateFinish: date,
    }));
  };

  const handleChangeLockRosterDate = (date) => {
    setFormEventGroup((prevState) => ({
      ...prevState,
      lockRosterDate: date,
    }));
  };
  const handleChangeLockOfficialDate = (date) => {
    setFormEventGroup((prevState) => ({
      ...prevState,
      lockOfficialDate: date,
    }));
  };

  const handleCancel = () => {
    setOpenColapse(false);
  };

  useEffect(() => {
    if (eventGroupCode) {
      setFormEventGroup((prevFormInput) => ({
        ...prevFormInput,
        code: eventGroupCode,
        shortName: eventGroupCode,
        photoPrice: CurrencyFormat(pricePhoto),
        videoPrice: CurrencyFormat(priceVideo),
      }));
    }
  }, [eventGroupCode]);

  // Removing required error when input is filled.
  useEffect(() => {
    const fieldsToCheck = [
      'name',
      'shortName',
      'picOrganizer',
      'organizerName',
      'dateStart',
      'dateFinish',
      'location',
    ];

    fieldsToCheck.forEach((field) => {
      if (errors[field] && formEventGroup[field] !== '') {
        if (errors[field].type === 'required') {
          clearErrors(field);
        }
      }
    });
  }, [formEventGroup, clearErrors, errors]);

  return (
    <div className="z-10 relative">
      <div className="mb-3">
        <div className="flex items-center gap-4 hover:opacity-70">
          <Checkbox
            name="singleEvent"
            checked={checkSingleEvent}
            onChange={() => setCheckSingleEvent(!checkSingleEvent)}
            className="w-4 h-4"
          />

          <span
            className={`text-sm cursor-pointer text-black font-bold `}
            onClick={() => setCheckSingleEvent(!checkSingleEvent)}
          >
            Create New Single Event
          </span>
        </div>
      </div>

      {!checkSingleEvent ? (
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <div className="grid grid-flow-row-dense grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2">
            <div className="flex flex-col gap-2">
              <Input
                type="text"
                label="Group Code"
                name="code"
                value={formEventGroup.code}
                onChange={handleChange}
                disabled
              />

              <Input
                type="text"
                label="Group Name"
                name="name"
                value={formEventGroup.name}
                onChange={handleChange}
                errServer={errServer?.data}
                errCodeServer="x01001"
                errValidation={errors}
                register={register}
              />

              <div className="z-[21]">
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
              </div>

              <div className="z-20">
                <Controller
                  control={control}
                  name="eventType"
                  render={({ field }) => (
                    <SelectDropdown
                      field={field}
                      name="eventType"
                      data={optionsEventType}
                      label="Event Type"
                      placeholder="Select Event"
                      selectedValue={selectedEventType}
                      setSelectedValue={setSelectedEventType}
                      errServer={errServer?.data}
                      errCodeServer="x01015"
                      errValidation={errors}
                    />
                  )}
                />
              </div>

              <MultiSelectCustom
                label="MVP Ranking"
                placeholder="Select MVP Ranking"
                options={optionsMvpRank}
                selectedOptions={selectedMvpRank}
                setSelectedOptions={setSelectedMvpRank}
                errServer={errServer?.data}
                errCodeServer="x01Dummy"
              />

              <TextArea
                label="Description"
                name="description"
                rows={3}
                value={formEventGroup.description}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Input
                type="text"
                label="Company Name"
                name="organizerName"
                value={formEventGroup.organizerName}
                onChange={handleChange}
                errServer={errServer?.data}
                errCodeServer="x01011"
                errValidation={errors}
                register={register}
              />

              <Input
                type="text"
                label="Short Name"
                name="shortName"
                value={formEventGroup.shortName}
                onChange={handleChange}
                errServer={errServer?.data}
                errCodeServer="xxx414"
                errValidation={errors}
                register={register}
              />

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
                    errServer={errServer?.data}
                    errCodeServer="x01005"
                    errValidation={errors}
                    max={formEventGroup.dateFinish}
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
                    errCodeServer="x01006"
                    errValidation={errors}
                    min={formEventGroup.dateStart}
                  />
                )}
              />

              <DatePickerCustom
                label="Lock Roster Date"
                name="lockRosterDate"
                placeholder="Select Date"
                value={formEventGroup.lockRosterDate}
                onChange={handleChangeLockRosterDate}
              />

              <DatePickerCustom
                label="Lock Official Date"
                name="lockOfficialDate"
                placeholder="Select Date"
                value={formEventGroup.lockOfficialDate}
                onChange={handleChangeLockOfficialDate}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="ms:z-10">
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
                      selectedValue={selectedCityValue}
                      setSelectedValue={setSelectedCityValue}
                      errServer={errServer?.data}
                      errCodeServer="x01013"
                      errValidation={errors}
                    />
                  )}
                />
              </div>
              <Input
                type="text"
                label="Location"
                name="location"
                value={formEventGroup.location}
                onChange={handleChange}
                errServer={errServer?.data}
                errCodeServer="x01003"
                errValidation={errors}
                register={register}
              />

              <Input
                type="text"
                label="Photo Price"
                name="photoPrice"
                value={formEventGroup.photoPrice}
                onChange={handleChangePrice}
                errServer={errServer?.data}
                errCodeServer="x01016"
                errValidation={errors}
                register={register}
                placeholder="Rp 0"
              />

              <Input
                type="text"
                label="Video Price"
                name="videoPrice"
                value={formEventGroup.videoPrice}
                onChange={handleChangePrice}
                errServer={errServer?.data}
                errCodeServer="x01017"
                errValidation={errors}
                register={register}
                placeholder="Rp 0"
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
                        setCheckVisibiltyOnFotogritApp(
                          !checkVisibiltyOnFotogritApp
                        )
                      }
                      className="w-4 h-4"
                    />
                  </div>

                  <div className="">
                    <span
                      className={`text-sm ${
                        checkVisibiltyOnFotogritApp
                          ? 'text-black'
                          : 'text-gray-500'
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
                        setCheckVisibiltyOnCalculation(
                          !checkVisibiltyOnCalculation
                        )
                      }
                      className="w-4 h-4"
                    />
                  </div>

                  <div className="">
                    <span
                      className={`text-sm ${
                        checkVisibiltyOnCalculation
                          ? 'text-black'
                          : 'text-gray-500'
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
                label="Event Group Photo"
                name="eventLogo"
                onChange={handleImageChange}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                accept="image/jpg,image/jpeg"
                height="h-28 sm:h-[168px]"
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

          <div className="flex justify-end w-full gap-4 py-2 mt-6">
            <Button
              background="red"
              className="w-40"
              disabled={isLoading ? true : false}
              onClick={handleCancel}
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
      ) : (
        <FormSingleEvent
          setOpenColapse={setOpenColapse}
          price={price}
          cities={cities}
          eventGroupSingleCode={eventGroupSingleCode}
          optionsEventType={optionsEventType}
          checkSingleEvent={checkSingleEvent}
          setPopUpConfirmationSingle={setPopUpConfirmationSingle}
          isConfirmSingle={isConfirmSingle}
          setIsConfirmSingle={setIsConfirmSingle}
          optionsSponsors={optionsSponsors}
          optionsUsers={optionsUsers}
        />
      )}
    </div>
  );
};

export default FormAddEventGroup;
