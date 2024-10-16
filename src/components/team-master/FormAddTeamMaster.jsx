import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Button, LoaderButtonAction } from '@/components';
import {
  Input,
  SelectCustom,
  SelectInput,
  UpdateImage,
  UploadImage,
} from '../form-input';

import { useAddNewTeamMasterMutation } from '@/services/api/teamMasterApiSlice';

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

const FormAddTeamMaster = (props) => {
  const {
    optionsCities,
    setOpenColapse,
    teamListCode,
    optionsClubs,
    optionsAgeGroups,
    optionsEventType,
    optionsPools,
    optionsCustomers,
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
    id: '',
    code: '',
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
    label: 'Select Club',
    logo: '',
  });
  const [selectedAgeGroupValue, setSelectedAgeGroupValue] = useState('');
  const [selectedEventTypeValue, setSelectedEventTypeValue] = useState('');
  const [selectedPicTeam, setSelectedPicTeam] = useState({
    value: '',
    label: 'Select PIC',
    email: '',
    phone: '',
  });
  const [selectedPool, setSelectedPool] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorImg, setErrorImg] = useState(null);

  const [addNewTeamMaster, { isLoading, error: errServer }] =
    useAddNewTeamMasterMutation();

  const handleOnSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('name', formInput.teamName);
      formData.append('short_name', formInput.shortName);
      formData.append('pic_id', selectedPicTeam.value);
      formData.append(
        'pic_team',
        selectedPicTeam?.value === '' ? '' : selectedPicTeam?.label
      );
      formData.append('pic_team_phone_number', formInput.picTelephone);
      formData.append('pic_team_email', formInput.picEmail);
      formData.append('location', formInput.location);
      formData.append('city', selectedCityValue);
      formData.append('instagram_team', formInput.instagramTeam);
      formData.append('logo_team', formInput.logo);
      formData.append('club', selectedClub.value);
      formData.append('age_group', selectedAgeGroupValue);
      formData.append('event_type', selectedEventTypeValue);
      formData.append('pool', selectedPool);

      const response = await addNewTeamMaster(formData).unwrap();

      if (!response.error) {
        setSelectedImage(null);
        setSelectedCityValue('');
        setSelectedAgeGroupValue('');
        setSelectedEventTypeValue('');
        setSelectedClub('');
        setFormInput(initialInputValue);
        reset();
        setOpenColapse(false);

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

  const handleChangeSelectedClub = (data) => {
    setSelectedClub(data);

    setFormInput((prevFormInput) => ({
      ...prevFormInput,
      logo: data?.logo,
    }));

    setSelectedImage(null);
  };

  useEffect(() => {
    if (teamListCode) {
      setFormInput((prevFormInput) => ({
        ...prevFormInput,
        code: teamListCode,
      }));
    }
  }, [teamListCode]);

  useEffect(() => {
    setFormInput((prevFormInput) => ({
      ...prevFormInput,
      picEmail: selectedPicTeam.email || '-',
      picTelephone: selectedPicTeam.phone || '-',
    }));
  }, [selectedPicTeam]);

  return (
    <form className="w-full" onSubmit={handleSubmit(handleOnSubmit)}>
      <div className="grid grid-flow-row-dense grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2">
        <Input
          type="text"
          label="Team Code"
          name="code"
          value={formInput.code}
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
        <div className="z-[35]">
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
        </div>
        <Input
          type="text"
          label="PIC Telephone"
          name="picTelephone"
          value={formInput.picTelephone}
          onChange={handleChangePhone}
          errValidation={errors}
          register={register}
        />
        <Input
          type="text"
          label="PIC Email"
          name="picEmail"
          value={formInput.picEmail}
          onChange={handleChange}
          errValidation={errors}
          register={register}
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
        {/* <Input
          type="text"
          label="PIC Team"
          name="picTeam"
          value={formInput.picTeam}
          onChange={handleChange}
          errServer={errServer?.data}
          errCodeServer="xxx030"
          errValidation={errors}
          register={register}
        /> */}

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
        />

        {selectedClub?.logo ? (
          <UpdateImage
            label="Team Logo"
            onChange={handleImageChange}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            dataImage={formInput.logo}
            height="h-32"
          />
        ) : (
          <UploadImage
            label="Team Logo"
            onChange={handleImageChange}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            height="h-32"
            errorImg={errorImg}
            setErrorImg={setErrorImg}
          />
        )}
        <div className="z-[9]">
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
          disabled={isLoading ? true : false}
        >
          {isLoading ? <LoaderButtonAction /> : 'Add'}
        </Button>
      </div>
    </form>
  );
};

export default FormAddTeamMaster;
