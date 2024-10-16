import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Button, LoaderButtonAction } from '@/components';
import {
  DatePickerCustom,
  Input,
  SelectInput,
  UploadImage,
} from '../form-input';

import { useAddNewTeamMasterMutation } from '@/services/api/teamMasterApiSlice';
import { optionsEventType } from '@/constants';

export const optionsAgeGroup = [
  {
    value: 1,
    label: 'KU 7',
  },
  {
    value: 2,
    label: 'KU 8',
  },
  {
    value: 3,
    label: 'KU 9',
  },
];

const validationSchema = yup
  .object({
    groupName: yup.string().required('Group name is a required field'),
  })
  .required();

const FormAddTeamMaster = (props) => {
  const {
    optionsCities,
    setOpenColapse,
    eventGroupCode,
    setPageOptionCity,
    setSearchQueryOptionCity,
    totalPageOptionCity,
  } = props;
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const initialInputValue = {
    code: '',
    groupName: '',
    createBy: '',
    startDate: '',
    endDate: '',
    location: '',
    registrationDetail: '',
    slot: '',
    minNumberOfPlayer: '',
    maxNumberOfPlayer: '',
    paticipantsFee: '',
    pricePerPhoto: '',
    pricePerMovie: '',
    logo: null,
  };
  const [formInput, setFormInput] = useState(initialInputValue);
  const [selectedCityValue, setSelectedCityValue] = useState('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('');
  const [selectedOrginizerPIC, setSelectedOrginizerPIC] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('');
  const [selectedStanding, setSelectedStanding] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorImg, setErrorImg] = useState(null);
  const [minEndDate, setMinEndDate] = useState(null);

  const [addNewTeamMaster, { isLoading, error: errServer }] =
    useAddNewTeamMasterMutation();

  const selectOptionsEventType = optionsEventType?.map((item) => ({
    value: item?.name,
    label: item?.name,
  }));

  useEffect(() => {
    if (eventGroupCode) {
      setFormInput((prevFormInput) => ({
        ...prevFormInput,
        code: eventGroupCode,
      }));
    }
  }, [eventGroupCode]);

  const handleOnSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('name', formInput.teamName);
      formData.append('short_name', formInput.shortName);
      formData.append('pic_team', formInput.picTeam);
      formData.append('pic_team_phone_number', formInput.picTelephone);
      formData.append('pic_team_email', formInput.picEmail);
      formData.append('location', formInput.location);
      formData.append('city', selectedCityValue);
      formData.append('instagram_team', formInput.instagramTeam);
      formData.append('logo_team', formInput.logo);

      const response = await addNewTeamMaster(formData).unwrap();

      if (!response.error) {
        setSelectedImage(null);
        setSelectedCityValue('');
        setFormInput(initialInputValue);
        reset();

        toast.success(`"${formInput?.teamName}" has been added!`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      console.error('Failed to save the team', err);
      toast.error(`Failed: ${err?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  // Removing required error when input is filled.
  useEffect(() => {
    const fieldsToCheck = ['teamName', 'picTeam', 'location'];

    fieldsToCheck.forEach((field) => {
      if (errors[field] && formInput[field] !== '') {
        if (errors[field].type === 'required') {
          clearErrors(field);
        }
      }
    });
  }, [formInput, clearErrors, errors]);

  const handleCancel = () => {
    setFormInput(initialInputValue);

    setOpenColapse(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setErrorImg(null);
        setSelectedImage(file);
        setFormInput((prevState) => ({
          ...prevState,
          logo: file,
        }));
      } else {
        setErrorImg('Invalid file type. Please select an image.');
        setSelectedImage(null);
      }
    }
  };

  const handleStartDateChange = (date) => {
    if (date) {
      setFormInput((prevState) => ({
        ...prevState,
        startDate: date,
        endDate: '',
      }));

      const minDate = new Date(date);
      setMinEndDate(minDate);
    } else {
      setMinEndDate(null);
    }
  };

  const handleEndDateChange = (date) => {
    setFormInput((prevState) => ({
      ...prevState,
      endDate: date,
    }));
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(handleOnSubmit)}>
      <div className="grid grid-flow-row-dense grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2">
        <Input
          type="text"
          label="Group Code"
          name="code"
          value={formInput.code}
          onChange={handleChange}
          disabled
        />
        <Input
          type="text"
          label="Group Name"
          name="groupName"
          value={formInput.groupName}
          onChange={handleChange}
          // errServer={errServer?.data}
          // errCodeServer="xxx029"
          // errValidation={errors}
          // register={register}
        />

        <div className="z-40">
          <SelectInput
            name="city"
            data={optionsAgeGroup}
            label="Age Group"
            placeholder="Select Age Group"
            selectedValue={selectedAgeGroup}
            setSelectedValue={setSelectedAgeGroup}
            // errServer={errServer?.data}
            // errCodeServer="x07004"
          />
        </div>

        <div className="z-30">
          <SelectInput
            name="organizer"
            // data={optionsAgeGroup}
            label="Organizier"
            placeholder="Select Organizer PIC"
            selectedValue={selectedOrginizerPIC}
            setSelectedValue={setSelectedOrginizerPIC}
            // errServer={errServer?.data}
            // errCodeServer="x07004"
          />
        </div>

        <Input
          type="text"
          label="Create By"
          name="createBy"
          value={formInput.createBy}
          onChange={handleChange}
          // errServer={errServer?.data}
          // errCodeServer="x07006"
          // errValidation={errors}
          // register={register}
          disabled
        />

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex flex-col gap-0.5">
            <DatePickerCustom
              label="Start Date"
              name="startDate"
              value={formInput.startDate}
              onChange={handleStartDateChange}
              placeholder="Select Start Date"
              // errServer={errServer?.data}
              // errCodeServer="x10007"
              withPortal
              showMonthDropdown
              showYearDropdown
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <DatePickerCustom
              label="End Date"
              name="endDate"
              value={formInput.endDate}
              onChange={handleEndDateChange}
              placeholder="Select End Date"
              min={minEndDate}
              // errServer={errServer?.data}
              // errCodeServer="x10008"
              withPortal
              showMonthDropdown
              showYearDropdown
            />
          </div>
        </div>

        <div className="z-20">
          <SelectInput
            name="eventType"
            data={selectOptionsEventType}
            label="Event Type"
            placeholder="Select event type"
            selectedValue={selectedEventType}
            setSelectedValue={setSelectedEventType}
            // errServer={errServer?.data}
            // errCodeServer="x07004"
          />
        </div>

        <div className="z-10">
          <SelectInput
            name="city"
            data={optionsCities}
            label="City"
            placeholder="Select City"
            selectedValue={selectedCityValue}
            setSelectedValue={setSelectedCityValue}
            errServer={errServer?.data}
            errCodeServer="x07004"
            infiniteScroll
            setPageOption={setPageOptionCity}
            setSearchQueryOption={setSearchQueryOptionCity}
            totalPageOptions={totalPageOptionCity}
          />
        </div>

        <Input
          type="text"
          label="Location"
          name="location"
          value={formInput.location}
          onChange={handleChange}
          errServer={errServer?.data}
          errCodeServer="xxx031"
          errValidation={errors}
          register={register}
        />

        <div className="">
          <SelectInput
            name="standing"
            // data={selectOptionsEventType}
            label="Standing"
            placeholder="Choose Individual Participants or Club"
            selectedValue={selectedStanding}
            setSelectedValue={setSelectedStanding}
            // errServer={errServer?.data}
            // errCodeServer="x07004"
          />
        </div>

        <Input
          type="text"
          label="Registration Detail"
          name="registrationDetail"
          value={formInput.registrationDetail}
          onChange={handleChange}
          // errServer={errServer?.data}
          // errCodeServer="xxx030"
          // errValidation={errors}
          // register={register}
        />
        <Input
          type="text"
          label="Slot"
          name="slot"
          value={formInput.slo}
          onChange={handleChange}
          // errValidation={errors}
          // register={register}
        />
        <Input
          type="text"
          label="Minimum Number of Player"
          name="minNumberOfPlayer"
          value={formInput.minNumberOfPlayer}
          onChange={handleChange}
          // errValidation={errors}
          // register={register}
        />

        <Input
          type="text"
          label="Maximum Number of Player"
          name="maxNumberOfPlayer"
          value={formInput.maxNumberOfPlayer}
          onChange={handleChange}
          // errValidation={errors}
          // register={register}
        />

        <Input
          type="text"
          label="Participants Fee"
          name="paticipantsFee"
          value={formInput.paticipant}
          onChange={handleChange}
          // errValidation={errors}
          // register={register}
        />

        <UploadImage
          label="Group Logo"
          onChange={handleImageChange}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          height="h-40"
          errorImg={errorImg}
          setErrorImg={setErrorImg}
        />

        <Input
          type="text"
          label="Price per Photo"
          name="pricePerPhoto"
          value={formInput.pricePerPhoto}
          onChange={handleChange}
          // errValidation={errors}
          // register={register}
        />
        <Input
          type="text"
          label="Price per Movie"
          name="pricePerMovie"
          value={formInput.pricePerMovie}
          onChange={handleChange}
          // errValidation={errors}
          // register={register}
        />
      </div>

      <div className="flex justify-end w-full gap-4 py-2 mt-4">
        <Button
          background="red"
          className="w-40"
          onClick={handleCancel}
          disabled={isLoading ? true : false}
        >
          {isLoading ? <LoaderButtonAction /> : 'Cancel'}
        </Button>
        <Button
          type="submit"
          background="black"
          className="w-40"
          // disabled={isLoading ? true : false}
          disabled
        >
          {isLoading ? <LoaderButtonAction /> : 'Add to Cart'}
        </Button>
      </div>
    </form>
  );
};

export default FormAddTeamMaster;
