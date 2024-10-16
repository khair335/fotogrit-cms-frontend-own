import { useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { FaDownload } from 'react-icons/fa6';

import { Paragraph } from '../typography';
import { Button, LoaderButtonAction, Tooltip } from '@/components';
import {
  DatePickerCustom,
  Input,
  MultiSelect,
  SelectInput,
  TextArea,
  UpdateImage,
} from '@/components/form-input';

import { selectGenderData } from '@/constants';

import {
  useAddCurrentClubMutation,
  useAddUserMainPositionMutation,
  useGetCurrentClubQuery,
  useGetUserMainPositionQuery,
  useUpdateCustomerDataMutation,
} from '@/services/api/customerDataApiSlice';

const validationSchema = yup
  .object({
    nickname: yup
      .string()
      .required('Nickname is a required field')
      .max(30, 'Nickname cannot exceed 30 characters'),
    name: yup.string().required('Name is a required field'),
    email: yup.string().email('Email must be a valid email'),
  })
  .required();

const FormDetailCustomerData = (props) => {
  const {
    data,
    setIsOpenPopUpDelete,
    isAccess,
    setOpenModal,
    optionsMainPositions,
    optionsClubs,
    optionsUserTypes,
  } = props;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const initialInputValue = {
    id: '',
    code: '',
    name: '',
    nickname: '',
    email: '',
    phoneNumber: '',
    birthPlace: '',
    birthDate: '',
    address: '',
    facebook: '',
    instagram: '',
    tiktok: '',
    mainTeam: '',
    status: 0,
    height: '',
    school: '',
    photo: '',
  };
  const [formInput, setFormInput] = useState(initialInputValue);
  const [getDetailUpdated, setGetDetailUpdated] = useState({});
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedMainPosition, setSelectedMainPosition] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  const [selectedUserType, setSelectedUserType] = useState('');
  const [enabled, setEnabled] = useState(data?.status === 0 ? false : true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const { data: detailMainPosition } = useGetUserMainPositionQuery({
    id: data?.id,
  });
  const { data: detailCurrentClub } = useGetCurrentClubQuery({
    id: data?.id,
  });

  const [updateCustomerData, { error: errServer }] =
    useUpdateCustomerDataMutation();
  const [addUserMainPosition] = useAddUserMainPositionMutation();
  const [addCurrentClub] = useAddCurrentClubMutation();

  const handleUpdate = async () => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append('id', formInput.id);
      formData.append('name', formInput.name);
      formData.append('short_name', formInput.nickname);
      formData.append('email', formInput.email);
      formData.append('phone_number', formInput.phoneNumber);
      formData.append('status', formInput.status);
      formData.append('gender', selectedGender);
      formData.append('birth_place', formInput.birthPlace);
      formData.append('birth_date', formInput.birthDate);
      formData.append('address', formInput.address);
      formData.append('instagram', formInput.instagram);
      formData.append('tiktok', formInput.tiktok);
      formData.append('facebook', formInput.facebook);
      formData.append('main_team', formInput.mainTeam);
      formData.append('height', parseInt(formInput.height));
      formData.append('school', formInput.school);
      formData.append('image', formInput?.photo);
      formData.append('user_type', selectedUserType);

      const response = await updateCustomerData({
        body: formData,
        id: formInput.id,
      }).unwrap();

      if (!response.error) {
        // Update Main Position
        const modifiedMainPosition = selectedMainPosition
          ? selectedMainPosition?.map((option) => option?.value)
          : '';
        const dataMainPosition = {
          user_id: formInput.id,
          main_positions: modifiedMainPosition,
        };
        const resMainPosition = await addUserMainPosition(
          dataMainPosition
        ).unwrap();

        // Update Current Club
        const modifiedClubs = selectedClub
          ? selectedClub?.map((option) => option?.value)
          : '';
        const dataCurrentClub = {
          user_id: formInput.id,
          clubs: modifiedClubs,
        };
        const resCurrentClub = await addCurrentClub(dataCurrentClub).unwrap();

        if (!resMainPosition.error || !resCurrentClub.error) {
          setIsLoading(false);
          setGetDetailUpdated({
            code: formInput.code,
            name: formInput.name,
            email: formInput.email,
            gender: selectedGender,
            status: formInput.status,
          });
          reset();
          setOpenModal(false);

          toast.success(`Customer "${formInput.code}" has been updated!`, {
            position: 'top-right',
            theme: 'light',
          });
        }
      }
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      toast.error(`Failed: ${err?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  useEffect(() => {
    if (data) {
      setFormInput((prevFormInput) => ({
        ...prevFormInput,
        id: data?.id,
        code: data?.code,
        name: data?.name,
        nickname: data?.short_name.replaceAll(' ', ''),
        email: data?.email,
        phoneNumber: data?.phone_number,
        birthPlace: data?.birth_place,
        birthDate: new Date(data?.birth_date),
        address: data?.address,
        facebook: data?.facebook,
        instagram: data?.instagram,
        tiktok: data?.tiktok,
        mainTeam: data?.main_team,
        status: data?.status,
        height: data?.height,
        school: data?.school,
        photo: data?.image_profile,
      }));

      setSelectedGender(data?.gender);

      const matchedMainPosition = detailMainPosition?.data?.map((item) => ({
        value: item?.main_position_id,
        label: item?.main_position,
      }));
      setSelectedMainPosition(matchedMainPosition);

      const matchedClubs = optionsClubs?.filter((item) =>
        detailCurrentClub?.data?.some((item2) => item2?.club_id === item?.value)
      );
      setSelectedClub(matchedClubs);

      const matchedUserType = optionsUserTypes?.find(
        (item) => item?.id === data?.user_type
      );
      setSelectedUserType(matchedUserType?.value);
    }
  }, [data, setFormInput, detailMainPosition, detailCurrentClub]);

  useEffect(() => {
    setFormInput((prevFormInput) => ({
      ...prevFormInput,
      status: enabled === false ? 0 : 1, // Update status when enabled changes
    }));
  }, [enabled]);

  // Default Value for validation react hook form
  useEffect(() => {
    if (data) {
      setValue('name', data?.name);
      setValue('nickname', data?.short_name);
    }
  }, [data, setFormInput]);

  // Removing required error when input is filled.
  useEffect(() => {
    const fieldsToCheck = ['name', 'nickname'];

    fieldsToCheck.forEach((field) => {
      if (errors[field] && formInput[field] !== '') {
        if (errors[field].type === 'required') {
          clearErrors(field);
        }
      }
    });
  }, [formInput, clearErrors, errors]);

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
      birthDate: date,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setFormInput((prevState) => ({
        ...prevState,
        photo: file,
      }));
    }
  };

  const handleChangeNickName = (e) => {
    const { name, value } = e.target;

    const inputValue = value.replace(' ', ''); // don't allow space in nickname

    setFormInput((prevState) => ({
      ...prevState,
      [name]: inputValue,
    }));
  };

  const handleChangePhone = (e) => {
    const { name, value } = e.target;

    const inputValue = value.replace(/[^0-9]/g, '');

    setFormInput((prevState) => ({
      ...prevState,
      [name]: inputValue,
    }));
  };

  const handleDownloadImage = async () => {
    try {
      const imageUrl = formInput.photo;
      const imgFormat = imageUrl.substring(imageUrl.lastIndexOf('.') + 1);
      const fileName = `${formInput.code}-${
        formInput.name || formInput.email
      }.${imgFormat || 'JPG'}`;

      await fetch(imageUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        })
        .catch((error) => console.error('Error downloading image:', error));
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-2 mb-3 text-sm sm:grid-cols-3 lg:grid-cols-5">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">User Code</h5>
          <Paragraph loading={isLoading}>
            {getDetailUpdated?.code || data?.code || '-'}
          </Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Name</h5>
          <Paragraph loading={isLoading}>
            {getDetailUpdated?.name || data?.name || '-'}
          </Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Email</h5>
          <Paragraph loading={isLoading} className="break-words">
            {getDetailUpdated?.email || data?.email || '-'}
          </Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Gender</h5>
          <Paragraph loading={isLoading}>
            {getDetailUpdated?.gender === 1
              ? 'Pria'
              : getDetailUpdated?.gender === 2
              ? 'Wanita'
              : data?.gender === 2
              ? 'Wanita'
              : data?.gender === 1
              ? 'Pria'
              : '-'}
          </Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Status</h5>
          <Paragraph loading={isLoading}>
            {getDetailUpdated?.name ? (
              <span
                className={`font-medium ${
                  getDetailUpdated?.status === 1
                    ? 'text-ftgreen-600'
                    : ' text-red-600'
                }`}
              >
                {getDetailUpdated?.status === 1 ? 'Active' : 'Non Active'}
              </span>
            ) : (
              <span
                className={`font-medium ${
                  data?.status === 1 ? 'text-ftgreen-600' : ' text-red-600'
                }`}
              >
                {data?.status === 1 ? 'Active' : 'Non Active'}
              </span>
            )}
          </Paragraph>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleUpdate)}>
        <div className="grid grid-flow-row-dense grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4 gap-y-2">
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              label="Nickname"
              name="nickname"
              value={formInput.nickname}
              onChange={handleChangeNickName}
              disabled={!isAccess?.can_edit}
              errValidation={errors}
              register={register}
            />
            <Input
              type="text"
              label="Phone Number"
              name="phoneNumber"
              value={formInput.phoneNumber}
              onChange={handleChangePhone}
              disabled={!isAccess?.can_edit}
              errServer={errServer?.data}
              errCodeServer="xxx053"
            />
            <Input
              type="number"
              label="Height (cm)"
              name="height"
              value={formInput.height}
              onChange={handleChange}
              disabled={!isAccess?.can_edit}
            />
            <Input
              type="text"
              label="Main Team"
              name="mainTeam"
              value={formInput.mainTeam}
              onChange={handleChange}
              disabled={!isAccess?.can_edit}
            />
            <div className="flex flex-col text-sm gap-2 lg:mt-5 lg:mb-4">
              <label className="text-gray-500">Status</label>
              <div className="flex items-center gap-2 text-xs">
                <span className={enabled ? 'text-gray-500' : 'text-red-600'}>
                  Non Active
                </span>
                <Switch
                  checked={enabled}
                  onChange={setEnabled}
                  disabled={!isAccess?.can_edit}
                  className={`${enabled ? ' bg-ftgreen-600' : 'bg-gray-300/70'}
          relative inline-flex h-[28px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 shadow__gear-2 disabled:opacity-60 disabled:cursor-default`}
                >
                  <span
                    aria-hidden="true"
                    className={`${enabled ? 'translate-x-11' : 'translate-x-0'}
            pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-xl ring-0 transition duration-200 ease-in-out`}
                  />
                </Switch>
                <span
                  className={enabled ? 'text-ftgreen-600' : 'text-gray-500'}
                >
                  Active
                </span>
              </div>
            </div>

            <div className="relative">
              <UpdateImage
                label="Photo Profile"
                onChange={handleImageChange}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                dataImage={formInput.photo}
                disabled={!isAccess?.can_edit}
                height="h-40"
                objectFit="object-contain"
              />

              {formInput.photo === data?.image_profile &&
                formInput.photo !== '' && (
                  <div className="absolute top-0 right-1">
                    <Tooltip text="download image" position="top">
                      <button
                        type="button"
                        className="text-ftbrown hover:text-black transition-all duration-300"
                        onClick={handleDownloadImage}
                      >
                        <FaDownload />
                      </button>
                    </Tooltip>
                  </div>
                )}
            </div>
          </div>

          <div className="flex flex-col gap-2 lg:col-span-2">
            <Input
              type="text"
              label="Name"
              name="name"
              value={formInput.name}
              onChange={handleChange}
              disabled={!isAccess?.can_edit}
              errValidation={errors}
              register={register}
            />

            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-x-4 gap-y-2">
              <div className="z-10">
                <SelectInput
                  data={selectGenderData}
                  label="Gender"
                  placeholder="Select Gender"
                  selectedValue={selectedGender}
                  setSelectedValue={setSelectedGender}
                  disabled={!isAccess?.can_edit}
                />
              </div>
              <Input
                type="text"
                label="Birth Place"
                name="birthPlace"
                value={formInput.birthPlace}
                onChange={handleChange}
                disabled={!isAccess?.can_edit}
              />
              <Input
                type="text"
                label="Facebook"
                name="facebook"
                value={formInput.facebook}
                onChange={handleChange}
                disabled={!isAccess?.can_edit}
              />
              <Input
                type="text"
                label="Instagram"
                name="instagram"
                value={formInput.instagram}
                onChange={handleChange}
                disabled={!isAccess?.can_edit}
              />
            </div>

            <TextArea
              label="Address"
              name="address"
              value={formInput.address}
              onChange={handleChange}
              disabled={!isAccess?.can_edit}
            />

            <MultiSelect
              label="Main Position"
              placeholder="Select Main Position"
              options={optionsMainPositions}
              selectedOptions={selectedMainPosition}
              setSelectedOptions={setSelectedMainPosition}
              disabled={!isAccess?.can_edit}
            />

            <SelectInput
              data={optionsUserTypes}
              label="User Type"
              placeholder="Select User Type"
              selectedValue={selectedUserType}
              setSelectedValue={setSelectedUserType}
              disabled={!isAccess?.can_edit}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Input
              type="text"
              label="Email"
              name="email"
              value={formInput.email}
              onChange={handleChange}
              disabled={!isAccess?.can_edit}
              errValidation={errors}
              register={register}
              errServer={errServer?.data}
              errCodeServer="xxx004"
            />

            <DatePickerCustom
              label="Birth Date"
              name="birthDate"
              value={formInput.birthDate}
              onChange={handleDateChange}
              placeholder="Select Start Date"
              showMonthDropdown
              showYearDropdown
              disabled={!isAccess?.can_edit}
            />

            <Input
              type="text"
              label="Tiktok"
              name="tiktok"
              value={formInput.tiktok}
              onChange={handleChange}
              disabled={!isAccess?.can_edit}
            />

            <TextArea
              label="School"
              name="school"
              value={formInput.school}
              onChange={handleChange}
              disabled={!isAccess?.can_edit}
            />

            <MultiSelect
              label="Current Club"
              placeholder="Select Club"
              options={optionsClubs}
              selectedOptions={selectedClub}
              setSelectedOptions={setSelectedClub}
              disabled={!isAccess?.can_edit}
            />
          </div>
        </div>

        <div className="flex justify-end w-full gap-2 py-2 mt-4">
          {isAccess?.can_delete && (
            <Button
              background="red"
              className={`w-32`}
              disabled={isLoading ? true : false}
              onClick={() => setIsOpenPopUpDelete(true)}
            >
              {isLoading ? <LoaderButtonAction /> : 'Delete'}
            </Button>
          )}

          {isAccess?.can_edit && (
            <Button
              type="submit"
              background="black"
              className={`w-32`}
              disabled={isLoading ? true : false}
            >
              {isLoading ? <LoaderButtonAction /> : 'Save'}
            </Button>
          )}
        </div>
      </form>
    </>
  );
};

export default FormDetailCustomerData;
