import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Button, LoaderButtonAction, Tooltip } from '@/components';
import { Input, SelectCustom, SelectInput, UpdateImage } from '../form-input';
import { Paragraph } from '../typography';

import { useUpdateTeamMasterMutation } from '@/services/api/teamMasterApiSlice';
import { FaCircleInfo } from 'react-icons/fa6';

const validationSchema = yup
  .object({
    teamName: yup.string().required('Team name is a required field'),
    shortName: yup
      .string()
      .required('Short name is a required field')
      .max(10, 'Short name must be at most 10 characters'),
    picTeam: yup.string(),
    location: yup.string(),
    picTelephone: yup.string(),
    instagramTeam: yup.string(),
    picEmail: yup.string(),
  })
  .required();

const FormDetailTeamMaster = (props) => {
  const {
    data,
    setOpenModal,
    setIsOpenPopUpDelete,
    isAccess,
    optionsCities,
    optionsClubs,
    optionsAgeGroups,
    optionsEventType,
    optionsPools,
    optionsCustomers,
  } = props;

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const initialInputValue = {
    id: '',
    teamCode: '',
    teamName: '',
    shortName: '',
    picTeam: '',
    picTelephone: '',
    picEmail: '',
    location: '',
    city: '',
    instagramTeam: '',
    logo: null,
  };
  const [formInput, setFormInput] = useState(initialInputValue);
  const [selectedCityValue, setSelectedCityValue] = useState('');
  const [selectedClub, setSelectedClub] = useState({
    value: '',
    label: '',
    logo: '',
  });
  const [selectedAgeGroupValue, setSelectedAgeGroupValue] = useState('');
  const [selectedEventTypeValue, setSelectedEventTypeValue] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedPool, setSelectedPool] = useState('');
  const [isEventLogoChanged, setEventLogoChanged] = useState(false);
  const [getDetailUpdated, setGetDetailUpdated] = useState({});
  const defaultID0 = 'd03a050e4841eb38d61da409dc82b35b';
  const [currentPic, setCurrentPic] = useState({});
  const [selectedPicTeam, setSelectedPicTeam] = useState({
    value: '',
    label: 'Select PIC',
    email: '',
    phone: '',
  });

  const [updateTeamMaster, { isLoading, error: errServer }] =
    useUpdateTeamMasterMutation();

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('id', formInput.id);
      formData.append('name', formInput.teamName);
      formData.append('short_name', formInput.shortName);
      formData.append('pic_id', selectedPicTeam?.value);
      formData.append(
        'pic_team',
        selectedPicTeam?.value === '' ? '-' : selectedPicTeam?.label
      );
      formData.append('pic_team_phone_number', formInput.picTelephone);
      formData.append('pic_team_email', formInput.picEmail);
      formData.append('location', formInput.location);
      formData.append('city', selectedCityValue);
      formData.append('instagram_team', formInput.instagramTeam);
      formData.append('logo_team', formInput?.logo);
      formData.append('event_type', selectedEventTypeValue);
      if (selectedAgeGroupValue !== defaultID0) {
        formData.append('age_group', selectedAgeGroupValue);
      }
      if (selectedClub?.value !== defaultID0) {
        formData.append('club', selectedClub?.value);
      }
      formData.append('pool', defaultID0 === selectedPool ? '' : selectedPool);

      const response = await updateTeamMaster(formData).unwrap();

      if (!response.error) {
        setOpenModal(false);

        const newData = {
          teamCode: formInput.teamCode,
          teamName: formInput.teamName,
          shortName: formInput.shortName,
          picTeam: formInput.picTeam,
          picTelephone: formInput.picTelephone,
          picEmail: formInput.picEmail,
          location: formInput.location,
          city: formInput.city,
          instagramTeam: formInput.instagramTeam,
        };

        // Check if the event logo is changed, then add it to the newData
        if (isEventLogoChanged) {
          newData.logo = formInput?.logo;
        }

        setGetDetailUpdated(newData);

        toast.success(`"${formInput?.teamName}" has been updated!`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      console.error('Failed to update the team', err);
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

  const handleChangePhone = (e) => {
    const { name, value } = e.target;

    const inputValue = value.replace(/[^0-9]/g, '');

    setFormInput((prevData) => ({
      ...prevData,
      [name]: inputValue,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setFormInput((prevState) => ({
        ...prevState,
        logo: file,
      }));
      setEventLogoChanged(true);
    }
  };

  const handleChangeSelectedClub = (data) => {
    setSelectedClub(data);

    setFormInput((prevFormInput) => ({
      ...prevFormInput,
      logo: data?.logo,
    }));
  };

  const imageData =
    getDetailUpdated?.logo || data?.logo_team || '/images/logo-fotogrit.png';

  useEffect(() => {
    if (data) {
      setFormInput((prevState) => ({
        ...prevState,
        id: data?.id,
        teamCode: data?.code,
        shortName: data?.short_name,
        teamName: data?.name,
        picTeam: data?.pic_team,
        picTelephone: data?.pic_team_phone,
        picEmail: data?.pic_team_email,
        location: data?.location,
        city: data?.city,
        instagramTeam: data?.instagram_team,
        logo: data?.logo_team,
      }));
      setSelectedCityValue(data?.city);
      setSelectedAgeGroupValue(data?.age_group_id);
      setSelectedEventTypeValue(data?.event_type_id);
      setSelectedPool(data?.pool_id || '');

      const matchedClub = optionsClubs?.find(
        (item) =>
          item?.value === (data?.club_id === defaultID0 ? '' : data?.club_id)
      );
      setSelectedClub(matchedClub);
      const matchedPIC = optionsCustomers?.find(
        (item) => item?.value === data?.pic_id
      );
      setSelectedPicTeam(matchedPIC);
      setCurrentPic(matchedPIC);
    }
  }, [data, setFormInput]);

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

  // Default Value for validation react hook form
  useEffect(() => {
    if (data) {
      setValue('teamName', data?.name);
      setValue('picTeam', data?.pic_team);
      setValue('shortName', data?.short_name);
      setValue('picTelephone', data?.pic_team_phone);
      setValue('picEmail', data?.pic_team_email);
      setValue('location', data?.location);
      setValue('city', data?.city);
      setValue('instagramTeam', data?.instagram_team);
    }
  }, [data, setFormInput, setValue]);

  useEffect(() => {
    setFormInput((prevFormInput) => ({
      ...prevFormInput,
      picEmail: selectedPicTeam?.email || '-',
      picTelephone: selectedPicTeam?.phone || '-',
    }));
  }, [selectedPicTeam]);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 mb-6 text-sm sm:grid-cols-3 lg:grid-cols-7">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Code</h5>
          <Paragraph loading={isLoading} className="capitalize">
            {data?.code || '-'}
          </Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Logo</h5>

          <Paragraph loading={isLoading}>
            <img
              src={
                getDetailUpdated?.logo
                  ? URL.createObjectURL(getDetailUpdated?.logo)
                  : imageData
              }
              alt="image"
              className="object-contain w-[98%] max-h-[100px]"
            />
          </Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Team Name</h5>
          <Paragraph loading={isLoading}>
            {getDetailUpdated?.teamName
              ? getDetailUpdated?.teamName
              : `${data?.name} ${
                  data?.age_group
                    ? `- ${data?.age_group} ${data?.age_group_gender} ${data?.age_group_desc}`
                    : ''
                }`}
          </Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Short Name</h5>
          <Paragraph loading={isLoading}>
            {getDetailUpdated?.shortName
              ? getDetailUpdated?.shortName
              : data?.short_name || '-'}
          </Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">PIC Team</h5>
          <Paragraph loading={isLoading}>
            {getDetailUpdated?.picTeam
              ? getDetailUpdated?.picTeam
              : data?.pic_team || '-'}
          </Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">PIC Telephone</h5>
          <Paragraph loading={isLoading}>
            {getDetailUpdated?.picTelephone
              ? getDetailUpdated?.picTelephone
              : data?.pic_team_phone || '-'}
          </Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Location</h5>
          <Paragraph loading={isLoading}>
            {getDetailUpdated?.location
              ? getDetailUpdated?.location
              : data?.location || '-'}
          </Paragraph>
        </div>
      </div>

      <form className="w-full" onSubmit={handleSubmit(handleUpdate)}>
        <div className="grid grid-flow-row-dense grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2">
          <Input
            type="text"
            label="Team Code"
            name="teamCode"
            value={formInput.teamCode}
            onChange={handleChange}
            disabled
          />
          <div className="z-40">
            <SelectCustom
              name="club"
              data={optionsClubs}
              label="Club ID"
              placeholder="Club ID"
              selectedValue={selectedClub}
              setSelectedValue={handleChangeSelectedClub}
              errServer={errServer?.data}
              errCodeServer="x15001"
            />
          </div>
          <Input
            type="text"
            label="Team Name"
            name="teamName"
            value={formInput.teamName}
            onChange={handleChange}
            errServer={errServer?.data}
            errCodeServer="xxx029"
            errValidation={errors}
            register={register}
            disabled={!isAccess?.can_edit}
          />
          <Input
            type="text"
            label="Short Name"
            name="shortName"
            value={formInput.shortName}
            onChange={handleChange}
            errServer={errServer?.data}
            errCodeServer="x07006"
            errValidation={errors}
            register={register}
          />

          <div className="z-[35] sm:z-40 relative">
            <SelectCustom
              name="eventType"
              data={optionsCustomers}
              label="PIC Team"
              placeholder="PIC Team"
              selectedValue={selectedPicTeam}
              setSelectedValue={setSelectedPicTeam}
              errServer={errServer?.data}
              errCodeServer="xxx030"
            />

            {currentPic?.label !== data?.pic_team &&
              data?.pic_team !== '' &&
              data?.pic_team !== '-' && (
                <div className="absolute top-0 right-2">
                  <Tooltip
                    text={`latest PIC: "${data?.pic_team}"`}
                    position="top"
                  >
                    <FaCircleInfo className="cursor-pointer text-sm text-cyan-500 hover:text-cyan-700 transition-all duration-300" />
                  </Tooltip>
                </div>
              )}
          </div>
          <Input
            type="text"
            label="PIC Telephone"
            name="picTelephone"
            value={formInput.picTelephone}
            onChange={handleChangePhone}
            errValidation={errors}
            register={register}
            disabled={!isAccess?.can_edit}
          />
          <Input
            type="text"
            label="PIC Email"
            name="picEmail"
            value={formInput.picEmail}
            onChange={handleChange}
            errValidation={errors}
            register={register}
            disabled={!isAccess?.can_edit}
          />

          <div className="z-30">
            <SelectInput
              name="ageGroup"
              data={optionsAgeGroups}
              label="Age Group"
              placeholder="Age Group"
              selectedValue={selectedAgeGroupValue}
              setSelectedValue={setSelectedAgeGroupValue}
              errServer={errServer?.data}
              errCodeServer="x07023"
            />
          </div>

          <div className="z-20">
            <SelectInput
              name="eventType"
              data={optionsEventType}
              label="Event Type"
              placeholder="Event Type"
              selectedValue={selectedEventTypeValue}
              setSelectedValue={setSelectedEventTypeValue}
              errServer={errServer?.data}
              errCodeServer="x06016"
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
            disabled={!isAccess?.can_edit}
          />

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
              disabled={!isAccess?.can_edit}
            />
          </div>
          <Input
            type="text"
            label="Instagram Team"
            name="instagramTeam"
            value={formInput.instagramTeam}
            onChange={handleChange}
            errValidation={errors}
            register={register}
            disabled={!isAccess?.can_edit}
          />

          <UpdateImage
            label="Team Logo"
            onChange={handleImageChange}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            dataImage={formInput.logo}
            disabled={!isAccess?.can_edit}
            objectFit="object-contain"
          />

          <SelectInput
            name="pool"
            data={optionsPools}
            placeholder="Select Pool"
            label="Pool"
            selectedValue={selectedPool}
            setSelectedValue={setSelectedPool}
            errServer={errServer?.data}
            errCodeServer="x06060"
          />
        </div>

        <div className="flex justify-end w-full gap-4 py-2 mt-4">
          <Button
            background="red"
            className={`w-32 ${isAccess?.can_delete ? '' : 'hidden'}`}
            disabled={isLoading ? true : false}
            onClick={() => setIsOpenPopUpDelete(true)}
          >
            {isLoading ? <LoaderButtonAction /> : 'Delete'}
          </Button>
          <Button
            type="submit"
            background="black"
            className={`w-32 ${isAccess?.can_edit ? '' : 'hidden'}`}
            disabled={isLoading ? true : false}
          >
            {isLoading ? <LoaderButtonAction /> : 'Save'}
          </Button>
        </div>
      </form>
    </>
  );
};

export default FormDetailTeamMaster;
