import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Button, LoaderButtonAction } from '@/components';
import { Card, CardBody } from '@/components/Card';
import {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
} from '@/services/api/profileSettingApiSlice';
import {
  DatePickerCustom,
  Input,
  SelectInput,
  TextArea,
} from '@/components/form-input';
import { formatDateYearToDay } from '@/helpers/FormatDateYearToDay';

const optionsGender = [
  {
    value: 1,
    label: 'Pria',
  },
  {
    value: 0,
    label: 'Wanita',
  },
];

const validationSchema = yup
  .object({
    name: yup.string().required('Name is a required field'),
  })
  .required();

const ProfileSetting = () => {
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const imageRef = useRef();

  const [formInput, setFormInput] = useState({
    image: null,
    email: '',
    name: '',
    nickname: '',
    phone: '',
    address: '',
    birthPlace: '',
    birthDate: '',
    instagram: '',
    facebook: '',
    tiktok: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorImg, setErrorImg] = useState(null);
  const [eventLogoChanged, setEventLogoChanged] = useState(false);
  const [selectedGender, setSelectedGender] = useState(0);

  const { data } = useGetMyProfileQuery();
  const dataProfile = data?.data;

  const [updateMyProfile, { isLoading }] = useUpdateMyProfileMutation();

  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append('name', formInput.name);
      formData.append('short_name', formInput.nickname);
      formData.append('birth_place', formInput.birthPlace);
      formData.append(
        'birth_date',
        formInput.birthDate ? formatDateYearToDay(formInput.birthDate) : ''
      );
      formData.append('address', formInput.address);
      formData.append('phone_number', formInput.phone);
      formData.append('instagram', formInput.instagram);
      formData.append('facebook', formInput.facebook);
      formData.append('tiktok', formInput.tiktok);
      formData.append('gender', selectedGender);
      formData.append('image', formInput.image);

      const response = await updateMyProfile(formData);

      if (!response.error) {
        setErrorImg(null);
        toast.success(`Profile has been updated!`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      console.error('Failed', err);
      toast.error(`Failed ${err?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (
        file.type.startsWith('image/jpeg') ||
        file.type.startsWith('image/jpg')
      ) {
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

      setEventLogoChanged(true);
    }
  };

  const HandleClickImage = () => {
    imageRef.current.click();
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
      birthDate: date,
    }));
  };

  useEffect(() => {
    if (dataProfile) {
      setFormInput((prevFormInput) => ({
        ...prevFormInput,
        image: dataProfile?.image_profile,
        email: dataProfile?.email,
        name: dataProfile?.name,
        nickname: dataProfile?.short_name,
        phone: dataProfile?.phone_number,
        address: dataProfile?.address,
        birthPlace: dataProfile?.birth_place,
        birthDate: new Date(dataProfile?.birth_date),
        instagram: dataProfile?.instagram,
        facebook: dataProfile?.facebook,
        tiktok: dataProfile?.tiktok,
      }));

      setSelectedGender(dataProfile?.gender);
    }
  }, [dataProfile, setFormInput]);

  // Default Value for validation react hook form
  useEffect(() => {
    if (dataProfile) {
      setValue('name', dataProfile?.name);
    }
  }, [dataProfile, setFormInput, setValue]);

  // Removing required error when input is filled.
  useEffect(() => {
    const fieldsToCheck = ['name'];

    fieldsToCheck.forEach((field) => {
      if (errors[field] && formInput[field] !== '') {
        if (errors[field].type === 'required') {
          clearErrors(field);
        }
      }
    });
  }, [formInput, clearErrors, errors]);

  return (
    <>
      <Card className="py-4 px-6">
        <CardBody className="">
          <h1 className="text-2xl font-medium mb-2">Profile Setting</h1>

          <form onSubmit={handleSubmit(handleUpdateProfile)}>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 p-2 relative flex items-center justify-center rounded-full overflow-hidden border-2 border-[#A17F58] bg-gray-100">
                {formInput?.image ? (
                  <div className="absolute w-full h-full bg-gray-200">
                    <img
                      src={formInput?.image}
                      alt={formInput?.email}
                      className="object-cover object-center w-full h-full "
                    />
                  </div>
                ) : (
                  <img
                    src="/public/images/logo-fotogrit.png"
                    alt="logo fotogrit"
                    className="w-full h-full object-cover object-center"
                  />
                )}

                {selectedImage && (
                  <div className="absolute w-full h-full bg-gray-200">
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Preview image"
                      className="object-cover object-center w-full h-full"
                    />
                  </div>
                )}
              </div>

              <div className="">
                <h5 className="font-bold max-w-[300px]">
                  {dataProfile?.name || 'noname'}
                </h5>
                <p className="text-xs text-gray-600 mb-3">
                  {dataProfile?.email}
                </p>

                <div className="">
                  <input
                    ref={imageRef}
                    accept="image/jpg, image/jpeg"
                    name="image"
                    type="file"
                    hidden
                    onChange={handleImageChange}
                  />

                  <button
                    type="button"
                    onClick={HandleClickImage}
                    className="text-white bg__btn-black py-1 px-3 rounded-md text-sm"
                  >
                    Change Photo
                  </button>
                </div>
              </div>
            </div>

            {errorImg && (
              <span className="text-[10px] animate-pulse text-red-600">
                {errorImg}
              </span>
            )}

            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col gap-2">
                <Input
                  type="text"
                  label="Email"
                  name="email"
                  value={formInput.email}
                  onChange={handleChange}
                  disabled
                />

                <Input
                  type="text"
                  label="Name"
                  name="name"
                  value={formInput.name}
                  onChange={handleChange}
                  errValidation={errors}
                  register={register}
                />

                <Input
                  type="text"
                  label="Nickname"
                  name="nickname"
                  value={formInput.nickname}
                  onChange={handleChange}
                />

                <Input
                  type="text"
                  label="Phone Number"
                  name="phone"
                  value={formInput.phone}
                  onChange={handleChange}
                />

                <div className="z-10">
                  <SelectInput
                    data={optionsGender}
                    label="Gender"
                    placeholder="Select Gender"
                    selectedValue={selectedGender}
                    setSelectedValue={setSelectedGender}
                  />
                </div>

                <TextArea
                  label="Address"
                  name="address"
                  rows={2}
                  value={formInput.address}
                  onChange={handleChange}
                  placeholder="Address"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Input
                  type="text"
                  label="Place of Birth"
                  name="birthPlace"
                  value={formInput.birthPlace}
                  onChange={handleChange}
                />

                <DatePickerCustom
                  label="Date of Birth"
                  name="birtDate"
                  value={formInput.birthDate}
                  onChange={handleDateChange}
                  placeholder="Select Date"
                  withPortal
                  showMonthDropdown
                  showYearDropdown
                />

                <Input
                  type="text"
                  label="Instagram"
                  name="instagram"
                  value={formInput.instagram}
                  onChange={handleChange}
                />

                <Input
                  type="text"
                  label="Facebook"
                  name="facebook"
                  value={formInput.facebook}
                  onChange={handleChange}
                />

                <Input
                  type="text"
                  label="Tiktok"
                  name="tiktok"
                  value={formInput.tiktok}
                  onChange={handleChange}
                />

                <div className="flex justify-end w-full gap-4 py-2 mt-4">
                  <Button
                    type="submit"
                    background="black"
                    className={`w-32 `}
                    disabled={isLoading || errorImg}
                  >
                    {isLoading ? <LoaderButtonAction /> : 'Save'}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>
    </>
  );
};

export default ProfileSetting;
