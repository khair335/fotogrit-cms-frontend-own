import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Button, LoaderButtonAction } from '@/components';
import {
  Checkbox,
  DatePickerCustom,
  Input,
  MultiSelectCustom,
  SelectCustom,
  SelectInput,
  TextArea,
  UpdateImage,
} from '../form-input';
import { Paragraph } from '../typography';

import { formatDateYearToDay } from '@/helpers/FormatDateYearToDay';
import { CurrencyFormat, removeCurrencyFormat } from '@/helpers/CurrencyFormat';
import { formatDate } from '@/helpers/FormatDate';

import {
  useAddMvpRankMutation,
  useGetDetailMvpRankQuery,
  useUpdateEventGroupMutation,
} from '@/services/api/eventGroupApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/services/state/authSlice';

const validationSchema = yup
  .object({
    name: yup.string().required('Name is a required field'),
    shortName: yup
      .string()
      .required('Short name is a required field')
      .max(30, 'Short name must be at most 30 characters'),
    organizerName: yup.string().required('Group name is a required field'),
    location: yup.string().required('Location is a required field'),
    photoPrice: yup.string().required('Photo price is a required field'),
    videoPrice: yup.string().required('Video price is a required field'),
  })
  .required();

const FormDetailEventGroup = (props) => {
  const {
    data,
    cities,
    optionsEventType,
    setOpenModal,
    setIsOpenPopUpDelete,
    isAccess,
    optionsMvpRank,
    optionsSponsors,
    optionsUsers,
  } = props;

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const currentUser = useSelector(selectCurrentUser);
  const isUT014 = currentUser?.user_type === 'UT014';

  const [isEventLogoChanged, setEventLogoChanged] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedOrganizerPIC, setSelectedOrganizerPIC] = useState('');
  const [selectedEventValue, setSelectedEventValue] = useState('');
  const [selectedCityValue, setSelectedCityValue] = useState('');
  const [getNewData, setGetNewData] = useState({});
  const [errorImg, setErrorImg] = useState(null);
  const [selectedMvpRank, setSelectedMvpRank] = useState('');
  const [selectedSponsorsGold, setSelectedSponsorsGold] = useState([]);
  const [selectedSponsorsSilver, setSelectedSponsorsSilver] = useState([]);
  const [selectedSponsorsBronze, setSelectedSponsorsBronze] = useState([]);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [checkVisibilityOnWebPage, setCheckVisibilityOnWebPage] =
    useState(false);
  const [checkVisibilityOnFotogritApp, setCheckVisibilityOnFotogritApp] =
    useState(false);
  const [checkVisibilityOnCalculation, setCheckVisibilityOnCalculation] =
    useState(false);

  const [formEventGroup, setFormEventGroup] = useState({
    ID: data?.id,
    code: data?.code,
    name: data?.name,
    shortName: data?.short_name.replaceAll(' ', ''),
    organizerName: data?.organizer_name,
    dateStart: new Date(data?.date_start),
    dateFinish: new Date(data?.date_finish),
    lockRosterDate: '',
    lockOfficialDate: '',
    location: data?.location,
    photoPrice: data?.photo_price,
    videoPrice: data?.video_price,
    eventLogo: data?.event_logo,
    description: data?.description,
  });

  const { data: detailMvpRank } = useGetDetailMvpRankQuery({
    groupID: data?.id,
  });

  const [updateEventGroup, { error: errServer }] =
    useUpdateEventGroupMutation();
  const [addMvpRank] = useAddMvpRankMutation();

  const handleUpdate = async () => {
    try {
      if (errorImg) {
        toast.error(`Failed Input: Please select a JPG or JPEG image.`, {
          position: 'top-right',
          theme: 'light',
        });
        return;
      }
      setIsLoadingUpdate(true);
      const formData = new FormData();
      formData.append('id', formEventGroup.ID);
      formData.append('code', formEventGroup.code);
      formData.append('name', formEventGroup.name);
      formData.append('organizer_name', formEventGroup.organizerName);
      formData.append('pic_organizer', selectedOrganizerPIC?.value);
      formData.append('event_type', selectedEventValue?.value);
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
      formData.append('city', selectedCityValue);
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
      formData.append('visibility[V001]', checkVisibilityOnFotogritApp);
      formData.append('visibility[V002]', checkVisibilityOnWebPage);
      formData.append('visibility[V003]', checkVisibilityOnCalculation);

      // Sponsors
      if (selectedSponsorsGold?.length > 0) {
        const dataSponsorsGoldId = selectedSponsorsGold
          ?.map((item) => item?.value)
          .join(',');
        formData.append('sponsors_gold', dataSponsorsGoldId);
      } else {
        formData.append('sponsors_gold', '');
      }
      if (selectedSponsorsSilver?.length > 0) {
        const dataSponsorsSilverId = selectedSponsorsSilver
          ?.map((item) => item?.value)
          .join(',');
        formData.append('sponsors_silver', dataSponsorsSilverId);
      } else {
        formData.append('sponsors_silver', '');
      }
      if (selectedSponsorsBronze?.length > 0) {
        const dataSponsorsBronzeId = selectedSponsorsBronze
          ?.map((item) => item?.value)
          .join(',');
        formData.append('sponsors_bronze', dataSponsorsBronzeId);
      } else {
        formData.append('sponsors_bronze', '');
      }

      const response = await updateEventGroup(formData).unwrap();

      if (!response.error) {
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
            setIsLoadingUpdate(false);
            setOpenModal(false);
            const newData = {
              name: formEventGroup.name,
              organizerName: formEventGroup.organizerName,
              dateStart: formatDate(formEventGroup.dateStart),
              dateFinish: formatDate(formEventGroup.dateFinish),
              location: formEventGroup.location,
            };

            // Check if the event logo is changed, then add it to the newData
            if (isEventLogoChanged) {
              newData.image = formEventGroup?.eventLogo;
            }

            // Set the new data in the state using setGetNewData function
            setGetNewData(newData);

            toast.success(`"${formEventGroup?.name}" has been updated!`, {
              position: 'top-right',
              theme: 'light',
            });
          }
        } else {
          setIsLoadingUpdate(false);
          setOpenModal(false);
          const newData = {
            name: formEventGroup.name,
            organizerName: formEventGroup.organizerName,
            dateStart: formatDate(formEventGroup.dateStart),
            dateFinish: formatDate(formEventGroup.dateFinish),
            location: formEventGroup.location,
          };

          if (isEventLogoChanged) {
            newData.image = formEventGroup?.eventLogo;
          }
          setGetNewData(newData);

          toast.success(`"${formEventGroup?.name}" has been updated!`, {
            position: 'top-right',
            theme: 'light',
          });
        }
      }
    } catch (err) {
      setIsLoadingUpdate(false);
      console.error(`Failed: `, err);
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

  const handleShortNameChange = (e) => {
    const { name, value } = e.target;

    const inputValue = value.replaceAll(' ', ''); // don't allow space in short name

    setFormEventGroup((prevData) => ({
      ...prevData,
      [name]: inputValue,
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

      setEventLogoChanged(true);
    }
  };

  const handleStartDateChange = (date) => {
    setFormEventGroup((prevState) => ({
      ...prevState,
      dateStart: date,
      dateFinish: '',
    }));
  };

  const handleEndDateChange = (date) => {
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

  useEffect(() => {
    if (data) {
      const matchEventType = optionsEventType?.find(
        (item) => item?.label === data?.event_type
      );

      const matchedData = detailMvpRank
        ? detailMvpRank?.data?.map((item1) => {
            const match = optionsMvpRank?.find(
              (item2) => item2?.label === item1?.name
            );

            return match;
          })
        : '';

      if (data?.pic_organizer_id !== 'd03a050e4841eb38d61da409dc82b35b') {
        const matchedOrganizerPIC = optionsUsers?.find(
          (item) => item?.value === data?.pic_organizer_id
        );
        setSelectedOrganizerPIC(matchedOrganizerPIC);
      }

      setSelectedMvpRank(matchedData || '');
      setSelectedEventValue(matchEventType);
      setSelectedCityValue(data?.city);
      setFormEventGroup({
        ID: data?.id,
        code: data?.code,
        name: data?.name,
        shortName: data?.short_name.replaceAll(' ', ''),
        organizerName: data?.organizer_name,
        dateStart: new Date(data?.date_start),
        dateFinish: new Date(data?.date_finish),
        location: data?.location,
        photoPrice: CurrencyFormat(data?.photo_price),
        videoPrice: CurrencyFormat(data?.video_price),
        eventLogo: data?.event_logo,
        description: data?.description,
      });

      if (
        data?.lock_roaster_date !== '0001-01-01T00:00:00Z' &&
        data?.lock_roaster_date !== '0001-01-01T07:07:12+07:07'
      ) {
        setFormEventGroup((prevState) => ({
          ...prevState,
          lockRosterDate: new Date(data?.lock_roaster_date),
        }));
      }
      if (
        data?.lock_official_date !== '0001-01-01T00:00:00Z' &&
        data?.lock_official_date !== '0001-01-01T07:07:12+07:07'
      ) {
        setFormEventGroup((prevState) => ({
          ...prevState,
          lockOfficialDate: new Date(data?.lock_official_date),
        }));
      }

      if (data?.visibilities) {
        const visibilityFotogritApp = data?.visibilities.find(
          (v) => v.code === 'V001'
        )?.is_show;
        const visibilityWebPage = data?.visibilities.find(
          (v) => v.code === 'V002'
        )?.is_show;
        const visibilityCalculation = data?.visibilities.find(
          (v) => v.code === 'V003'
        )?.is_show;
        setCheckVisibilityOnFotogritApp(visibilityFotogritApp);
        setCheckVisibilityOnWebPage(visibilityWebPage);
        setCheckVisibilityOnCalculation(visibilityCalculation);
      }

      if (data?.sponsors_gold) {
        const matchedSponsorsGold = optionsSponsors?.filter((option) =>
          data?.sponsors_gold?.find((sponsor) => sponsor.id === option.value)
        );

        setSelectedSponsorsGold(matchedSponsorsGold);
      }
      if (data?.sponsors_silver) {
        const matchedSponsorsSilver = optionsSponsors?.filter((option) =>
          data?.sponsors_silver?.find((sponsor) => sponsor.id === option.value)
        );

        setSelectedSponsorsSilver(matchedSponsorsSilver);
      }
      if (data?.sponsors_bronze) {
        const matchedSponsorsBronze = optionsSponsors?.filter((option) =>
          data?.sponsors_bronze?.find((sponsor) => sponsor.id === option.value)
        );

        setSelectedSponsorsBronze(matchedSponsorsBronze);
      }
    }
  }, [
    data,
    detailMvpRank,
    setFormEventGroup,
    setSelectedEventValue,
    setSelectedCityValue,
  ]);

  // Removing required error when input is filled.
  useEffect(() => {
    const fieldsToCheck = [
      'name',
      'shortName',
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

  const imageData =
    getNewData?.image || data?.event_logo || '/images/logo-fotogrit.png';

  const isStartDatePassed = (date) => {
    const today = new Date();
    const dateWithoutTime = new Date(date.setHours(0, 0, 0, 0));
    const todayWithoutTime = new Date(today.setHours(0, 0, 0, 0));
    return todayWithoutTime > dateWithoutTime;
  };
  const disableLockDate = isStartDatePassed(new Date(data?.date_start));

  return (
    <div className="w-full ">
      <div className="grid grid-cols-1 gap-2 mb-6 text-sm sm:grid-cols-3 lg:grid-cols-7">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Group Code</h5>
          <Paragraph loading={isLoadingUpdate}>{data?.code}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Event Group Photo</h5>

          <Paragraph loading={isLoadingUpdate}>
            <img
              src={
                getNewData?.image
                  ? URL.createObjectURL(getNewData.image)
                  : imageData
              }
              alt="image"
              className="object-contain w-[98%] max-h-[100px]"
            />
          </Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Group Name</h5>
          <Paragraph loading={isLoadingUpdate}>
            {getNewData?.name ? getNewData?.name : data?.name}
          </Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Company Name</h5>
          <Paragraph loading={isLoadingUpdate}>
            {getNewData?.organizerName
              ? getNewData?.organizerName
              : data?.organizer_name}
          </Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Organizer PIC</h5>
          <Paragraph loading={isLoadingUpdate}>
            {optionsUsers?.find(
              (item) => item?.value === data?.pic_organizer_id
            )?.label || '-'}
          </Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Event Date</h5>
          <Paragraph loading={isLoadingUpdate}>
            {getNewData?.dateStart
              ? getNewData?.dateStart
              : formatDate(data?.date_start)}{' '}
            s/d{' '}
            {getNewData?.dateFinish
              ? getNewData?.dateFinish
              : formatDate(data?.date_finish)}
          </Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Location</h5>
          <Paragraph loading={isLoadingUpdate}>
            {getNewData?.location ? getNewData?.location : data?.location}
          </Paragraph>
        </div>
      </div>

      <form className="" onSubmit={handleSubmit(handleUpdate)}>
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
              disabled={!isAccess?.can_edit}
            />

            <SelectCustom
              name="picOrganizer"
              data={optionsUsers}
              label="Organizer PIC"
              placeholder="Select Organizer PIC"
              selectedValue={selectedOrganizerPIC}
              setSelectedValue={setSelectedOrganizerPIC}
              errServer={errServer?.data}
              errCodeServer="xxx403"
              errServerMessage="Organizer PIC is a required field"
              disabled={!isAccess?.can_edit}
            />
            <SelectCustom
              name="eventType"
              data={optionsEventType}
              label="Event Type"
              placeholder="Select Event"
              selectedValue={selectedEventValue}
              setSelectedValue={setSelectedEventValue}
              errServer={errServer?.data}
              errCodeServer="x01015"
              disabled
            />

            <MultiSelectCustom
              label="MVP Ranking"
              placeholder="Select MVP Ranking"
              options={optionsMvpRank}
              selectedOptions={selectedMvpRank}
              setSelectedOptions={setSelectedMvpRank}
              errServer={errServer?.data}
              errCodeServer="x01Dummy"
              disabled={!isAccess?.can_edit}
            />

            <TextArea
              label="Description"
              name="description"
              rows={3}
              value={formEventGroup.description}
              onChange={handleChange}
              disabled={!isAccess?.can_edit}
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
              disabled={!isAccess?.can_edit}
            />

            <Input
              type="text"
              label="Short Name"
              name="shortName"
              value={formEventGroup.shortName} // for existing short name with spaces, remove it!
              onChange={handleShortNameChange}
              errServer={errServer?.data}
              errCodeServer="xxx414"
              errValidation={errors}
              register={register}
              disabled={!isAccess?.can_edit}
            />

            <DatePickerCustom
              label="Start Date"
              name="dateStart"
              value={formEventGroup.dateStart}
              onChange={handleStartDateChange}
              placeholder="Select Start Date"
              errServer={errServer?.data}
              errCodeServer="x01005"
              errValidation={errors}
              register={register}
              disabled={!isAccess?.can_edit}
            />

            <DatePickerCustom
              label="Finish Date"
              name="dateFinish"
              value={formEventGroup.dateFinish}
              onChange={handleEndDateChange}
              placeholder="Select Finish Date"
              errServer={errServer?.data}
              errCodeServer="x01006"
              min={formEventGroup.dateStart}
              errValidation={errors}
              register={register}
              disabled={!isAccess?.can_edit}
            />

            <DatePickerCustom
              label="Lock Roster Date"
              name="lockRosterDate"
              placeholder="Select Date"
              value={formEventGroup.lockRosterDate}
              onChange={handleChangeLockRosterDate}
              disabled={isUT014 ? disableLockDate : false}
            />

            <DatePickerCustom
              label="Lock Official Date"
              name="lockOfficialDate"
              placeholder="Select Date"
              value={formEventGroup.lockOfficialDate}
              onChange={handleChangeLockOfficialDate}
              disabled={isUT014 ? disableLockDate : false}
            />
          </div>

          <div className="flex flex-col gap-2">
            <SelectInput
              name="city"
              data={cities}
              label="City"
              placeholder="Select City"
              selectedValue={selectedCityValue}
              setSelectedValue={setSelectedCityValue}
              errServer={errServer?.data}
              errCodeServer="x01013"
              disabled={!isAccess?.can_edit}
            />
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
              disabled={!isAccess?.can_edit}
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
              disabled={!isAccess?.can_edit}
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
              disabled={!isAccess?.can_edit}
            />

            <div className="space-y-2 mt-2">
              <div className="flex items-start justify-start gap-2">
                <div className="w-4 h-4">
                  <Checkbox
                    name="checkVisibilityOnWebPage"
                    checked={checkVisibilityOnWebPage}
                    onChange={() =>
                      setCheckVisibilityOnWebPage(!checkVisibilityOnWebPage)
                    }
                    className="w-4 h-4"
                  />
                </div>

                <div className="">
                  <span
                    className={`text-sm ${
                      checkVisibilityOnWebPage ? 'text-black' : 'text-gray-500'
                    }`}
                  >
                    Visibilty on statistic web page
                  </span>
                </div>
              </div>

              <div className="flex items-start justify-start gap-2">
                <div className="w-4 h-4">
                  <Checkbox
                    name="checkVisibilityOnFotogritApp"
                    checked={checkVisibilityOnFotogritApp}
                    onChange={() =>
                      setCheckVisibilityOnFotogritApp(
                        !checkVisibilityOnFotogritApp
                      )
                    }
                    className="w-4 h-4"
                  />
                </div>

                <div className="">
                  <span
                    className={`text-sm ${
                      checkVisibilityOnFotogritApp
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
                    name="checkVisibilityOnCalculation"
                    checked={checkVisibilityOnCalculation}
                    onChange={() =>
                      setCheckVisibilityOnCalculation(
                        !checkVisibilityOnCalculation
                      )
                    }
                    className="w-4 h-4"
                  />
                </div>

                <div className="">
                  <span
                    className={`text-sm ${
                      checkVisibilityOnCalculation
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
            <UpdateImage
              label="Event Group Photo"
              name="eventLogo"
              onChange={handleImageChange}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              dataImage={formEventGroup.eventLogo}
              accept="image/jpg,image/jpeg"
              disabled={!isAccess?.can_edit}
              errServer={errServer?.data}
              errCodeServer="xxx025"
              errorImg={errorImg}
              setErrorImg={setErrorImg}
              height="h-28 sm:h-[168px]"
              objectFit="object-contain"
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
            className={`w-32 ${isAccess?.can_delete ? '' : 'hidden'}`}
            onClick={() => setIsOpenPopUpDelete(true)}
            disabled={isLoadingUpdate ? true : false}
          >
            {isLoadingUpdate ? <LoaderButtonAction /> : 'Delete'}
          </Button>
          <Button
            type="submit"
            background="black"
            className={`w-32 ${isAccess?.can_edit ? '' : 'hidden'}`}
            disabled={isLoadingUpdate ? true : false}
          >
            {isLoadingUpdate ? <LoaderButtonAction /> : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FormDetailEventGroup;
