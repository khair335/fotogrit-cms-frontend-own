import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Paragraph } from '@/components/typography';
import { Input, SelectInput, UpdateImage } from '@/components/form-input';

import { Button, LoaderButtonAction } from '@/components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { useUpdateClubMasterMutation } from '@/services/api/clubMasterApiSlice';

const validationSchema = yup
  .object({
    clubName: yup.string().required('Club name is a required field'),
    clubShortName: yup.string().max(10),
  })
  .required();

const FormDetailClubData = (props) => {
  const {
    data,
    cities,
    setIsOpenPopUpDelete,
    setOpenModal,
    customerData,
    selectCustomerData,
    setPageOptionCity,
    setSearchQueryOptionCity,
    totalPageOptionCity,
    setPageOptionCustomerData,
    setSearchQueryOptionCustomerData,
    totalPageOptionCustomerData,
    isAccess,
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

  const [selectedCityValue, setSelectedCityValue] = useState('');
  const [selectedCustomerValue, setSelectedCustomerValue] = useState('');
  const [getNewData, setGetNewData] = useState({});

  const customerFilter = customerData?.data?.find(
    (data) => data?.id == selectedCustomerValue
  );

  const [formInput, setFormInput] = useState({
    id: '',
    clubCode: '',
    clubName: '',
    clubShortName: '',
    picUserId: '',
    picTelephone: '',
    legalDocumentNumber: '',
    logo: null,
    instagram: '',
    location: '',
    city: '',
    clubWebsite: '',
    clubEmail: '',
  });
  const [isLogoChanged, setIsLogoChanged] = useState(false);

  const [updateClubMaster, { isLoading: isLoadingUpdate, error: errServer }] =
    useUpdateClubMasterMutation();

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('code', formInput.clubCode);
      formData.append('id', formInput?.id);
      formData.append('name', formInput?.clubName);
      formData.append('short_name', formInput?.clubShortName);
      formData.append('pic', selectedCustomerValue || '');
      formData.append('legal_document_number', formInput?.legalDocumentNumber);
      formData.append('location', formInput?.location);
      formData.append('city', selectedCityValue || '');
      formData.append('website', formInput?.clubWebsite);
      formData.append('instagram', formInput?.instagram);
      formData.append('logo', formInput?.logo);

      const response = await updateClubMaster(formData).unwrap();

      if (!response.error) {
        const newData = {
          clubName: formInput?.clubName,
          picName: customerFilter?.name,
          picTelephone: formInput?.picTelephone,
          location: formInput?.location,
        };

        if (isLogoChanged) {
          newData.image = formInput?.logo;
        }

        toast.success(
          `Club master "${formInput?.clubName}" has been updated!`,
          {
            position: 'top-right',
            theme: 'light',
          }
        );

        setGetNewData(newData);
        setOpenModal(false);
      }
    } catch (err) {
      console.error('Failed to update club master!', err);
      toast.error(`Failed: ${err?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const [selectedImage, setSelectedImage] = useState(null);
  const [errorImg, setErrorImg] = useState(null);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (selectedCustomerValue === '') {
      setFormInput((prevState) => ({
        ...prevState,
        picTelephone: '',
        clubEmail: '',
      }));
    } else {
      setFormInput((prevState) => ({
        ...prevState,
        picTelephone: customerFilter?.phone_number,
        clubEmail: customerFilter?.email,
      }));
    }
  }, [selectedCustomerValue]);

  useEffect(() => {
    if (data) {
      setFormInput({
        id: data?.id,
        clubCode: data?.code,
        clubName: data?.name,
        clubShortName: data?.short_name,
        picUserId: data?.pic_name,
        picTelephone: data?.pic_telephone,
        legalDocumentNumber: data?.legal_document_number,
        logo: data?.logo,
        instagram: data?.instagram,
        location: data?.location,
        city: data?.city,
        clubWebsite: data?.website,
        clubEmail: data?.club_email,
      });

      setSelectedCityValue(data?.city);
      setSearchQueryOptionCity(data?.city);
      setSelectedCustomerValue(
        data?.pic_id === 'd03a050e4841eb38d61da409dc82b35b' ? '' : data?.pic_id
      );
      setSearchQueryOptionCustomerData(data?.pic_name);
    }
  }, [data, setFormInput, setSelectedCityValue, setSelectedCustomerValue]);

  // Default Value for validation react hook form
  useEffect(() => {
    if (data) {
      setValue('clubName', data?.name);
      setValue('location', data?.location);
    }
  }, [data, setFormInput]);

  // Removing required error when input is filled.
  useEffect(() => {
    const fieldsToCheck = [
      'clubName',
      'clubShortName',
      'picUserId',
      'legalDocumentNumber',
      'picPhoneNumber',
      'dateFinish',
      'instagram',
      'location',
      'city',
    ];

    fieldsToCheck.forEach((field) => {
      if (errors[field] && formInput[field] !== '') {
        if (errors[field].type === 'required') {
          clearErrors(field);
        }
      }
    });
  }, [formInput, clearErrors, errors]);

  const imageData =
    getNewData?.image || data?.logo || '/images/logo-fotogrit.png';

  return (
    <>
      <div className="grid grid-cols-1 gap-4 mb-6 text-sm sm:grid-cols-3 lg:grid-cols-5">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Logo</h5>
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
          <h5 className="font-bold">Club Name</h5>
          <Paragraph loading={isLoadingUpdate}>
            {getNewData?.clubName ? getNewData?.clubName : data?.name}
          </Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">PIC Club</h5>
          <Paragraph loading={isLoadingUpdate}>
            {getNewData?.picName ? getNewData?.picName : data?.pic_name}
          </Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">PIC Telephone</h5>
          <Paragraph loading={isLoadingUpdate}>
            {getNewData?.picTelephone
              ? getNewData?.picTelephone
              : data?.pic_telephone}
          </Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Location</h5>
          <Paragraph loading={isLoadingUpdate}>
            {getNewData?.location ? getNewData?.location : data?.location}
          </Paragraph>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleUpdate)}>
        <div className="grid grid-flow-row-dense grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2">
          <div className="flex flex-col gap-0.5">
            <Input
              type="text"
              label="Club Code"
              name="clubCode"
              value={formInput.clubCode}
              onChange={handleChange}
              disabled
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <SelectInput
              name="city"
              data={cities}
              label="City"
              placeholder="Select City"
              selectedValue={selectedCityValue}
              setSelectedValue={setSelectedCityValue}
              errServer={errServer?.data}
              errCodeServer="x01013"
              errValidation={errors}
              infiniteScroll
              setPageOption={setPageOptionCity}
              setSearchQueryOption={setSearchQueryOptionCity}
              totalPageOptions={totalPageOptionCity}
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <Input
              type="text"
              label="Instagram"
              name="instagram"
              value={formInput.instagram}
              onChange={handleChange}
              errServer={errServer?.data}
              errValidation={errors}
              register={register}
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <Input
              type="text"
              label="Club Name"
              name="clubName"
              value={formInput.clubName}
              onChange={handleChange}
              errServer={errServer?.data}
              errValidation={errors}
              errCodeServer="x15002"
              register={register}
            />
          </div>

          <div className="flex flex-col gap-0.5">
            <Input
              type="text"
              label="Short Name"
              name="clubShortName"
              value={formInput.clubShortName}
              onChange={handleChange}
              errValidation={errors}
              register={register}
              errServer={errServer?.data}
              errCodeServer="xxx414"
            />
          </div>

          <div className="flex flex-col gap-0.5">
            <Input
              type="text"
              label="Location"
              name="location"
              value={formInput.location}
              onChange={handleChange}
              errValidation={errors}
              register={register}
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <Input
              type="text"
              label="Club Website"
              name="clubWebsite"
              value={formInput.clubWebsite}
              onChange={handleChange}
              errValidation={errors}
              register={register}
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <SelectInput
              name="picUserId"
              data={selectCustomerData}
              label="PIC User Id"
              placeholder="Select PIC User Id"
              selectedValue={selectedCustomerValue}
              setSelectedValue={setSelectedCustomerValue}
              errServer={errServer?.data}
              // errCodeServer="x 01013"
              errValidation={errors}
              infiniteScroll
              setPageOption={setPageOptionCustomerData}
              setSearchQueryOption={setSearchQueryOptionCustomerData}
              totalPageOptions={totalPageOptionCustomerData}
            />
          </div>
          <div className="sm:row-span-2">
            <UpdateImage
              label="Logo"
              name="logo"
              onChange={handleImageChange}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              dataImage={formInput.logo}
              disabled={!isAccess?.can_edit}
              errServer={errServer?.data}
              errorImg={errorImg}
              setErrorImg={setErrorImg}
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <Input
              type="text"
              label="Legal Document Number"
              name="legalDocumentNumber"
              value={formInput.legalDocumentNumber}
              onChange={handleChange}
              errValidation={errors}
              register={register}
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <Input
              type="text"
              label="PIC Phone Number"
              name="picPhoneNumber"
              value={formInput.picTelephone}
              onChange={handleChange}
              disabled
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <Input
              type="text"
              label="Email"
              name="clubEmail"
              value={formInput.clubEmail}
              onChange={handleChange}
              errValidation={errors}
              register={register}
              disabled
            />
          </div>

          {/* Fase 2 */}
          {/* <div className="flex flex-col items-start gap-3 lg:flex-row lg:items-end">
            <div className="flex w-full flex-col gap-3">
              <Input
                type="text"
                label="Club email"
                name="clubEmail"
                value={formInput.clubEmail}
                onChange={handleChange}
              />
            </div>

            <div>
              <Button background="black" className="w-30 text-xs sm:w-36">
                Kirim ulang email
              </Button>
            </div>
          </div> */}
        </div>

        <div className="flex justify-end w-full gap-4 py-2 mt-4">
          {isAccess?.can_delete && (
            <Button
              background="red"
              className="w-32"
              onClick={() => setIsOpenPopUpDelete(true)}
              isLoading={isLoadingUpdate}
            >
              {isLoadingUpdate ? <LoaderButtonAction /> : 'Delete'}
            </Button>
          )}
          {isAccess?.can_edit && (
            <Button
              type="submit"
              background="black"
              className="w-32"
              isLoading={isLoadingUpdate}
            >
              {isLoadingUpdate ? <LoaderButtonAction /> : 'Save'}
            </Button>
          )}
        </div>
      </form>
    </>
  );
};

export default FormDetailClubData;
