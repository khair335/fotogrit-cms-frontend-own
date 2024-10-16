import { useEffect, useState } from 'react';
import { Button } from '@/components';
import { Input, UploadImage, SelectDropdown } from '@/components/form-input';
import LoaderButtonAction from './../LoaderButtonAction';

import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useAddNewClubMasterMutation } from '@/services/api/clubMasterApiSlice';

const validationSchema = yup
  .object({
    clubName: yup.string().required('Club name is a required field'),
    clubShortName: yup.string().max(10),
    // clubEmail: yup.string().email('Email must be a valid email'),
  })
  .required();

const FormAddClubData = (props) => {
  const {
    cities,
    setOpenColapse,
    customerData,
    selectCustomerData,
    clubListCode,
    setPageOptionCity,
    setSearchQueryOptionCity,
    totalPageOptionCity,
    setPageOptionCustomerData,
    setSearchQueryOptionCustomerData,
    totalPageOptionCustomerData,
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

  const initialDropdownValue = { value: '', label: '' };
  const [selectedCityValue, setSelectedCityValue] =
    useState(initialDropdownValue);
  const [selectedCustomerValue, setSelectedCustomerValue] =
    useState(initialDropdownValue);

  const customerFilter = customerData?.data?.find(
    (data) => data?.id == selectedCustomerValue?.value
  );

  const initialInputValue = {
    clubCode: '',
    clubName: '',
    clubShortName: '',
    picUserId: '',
    legalDocumentNumber: '',
    picPhoneNumber: '',
    logo: null,
    instagram: '',
    location: '',
    city: '',
    clubWebsite: '',
    clubEmail: '',
  };
  const [formInput, setFormInput] = useState(initialInputValue);

  // Insert data
  const [addNewClubMaster, { isLoading, error: errServer }] =
    useAddNewClubMasterMutation();

  const handleOnSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('name', formInput.clubName);
      formData.append('short_name', formInput.clubShortName);
      formData.append('pic', selectedCustomerValue?.value);
      formData.append('legal_document_number', formInput.legalDocumentNumber);
      formData.append('location', formInput.location);
      formData.append('city', selectedCityValue?.value);
      formData.append('website', formInput?.clubWebsite);
      formData.append('instagram', formInput?.instagram);
      formData.append('logo', formInput?.logo);

      const response = await addNewClubMaster(formData).unwrap();

      if (!response.error) {
        setFormInput('');
        setSelectedCityValue('');
        setSelectedCustomerValue('');
        setSelectedImage(null);
        setFormInput(initialInputValue);
        reset();

        toast.success(`Club master "${formInput?.clubName}" has been added!`, {
          position: 'top-right',
          theme: 'light',
        });
        setOpenColapse(false);
      }
    } catch (err) {
      console.error('Faield to add club master!', err);
      toast.error(`Failed: ${err?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  // Handle image
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

  const handleCancel = () => {
    setFormInput(initialInputValue);

    setOpenColapse(false);
  };

  useEffect(() => {
    if (clubListCode) {
      setFormInput((prev) => ({
        ...prev,
        clubCode: clubListCode,
        clubShortName: clubListCode,
      }));
    }
  }, [clubListCode]);

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
      'clubWebsite',
      'clubEmail',
    ];

    fieldsToCheck.forEach((field) => {
      if (errors[field] && formInput[field] !== '') {
        if (errors[field].type === 'required') {
          clearErrors(field);
        }
      }
    });
  }, [formInput, clearErrors, errors]);

  useEffect(() => {
    if (selectedCustomerValue?.value === '') {
      setFormInput((prevState) => ({
        ...prevState,
        clubEmail: '',
        picPhoneNumber: '',
      }));
    } else {
      setFormInput((prevState) => ({
        ...prevState,
        clubEmail: customerFilter?.email,
        picPhoneNumber: customerFilter?.phone_number,
      }));
    }
  }, [selectedCustomerValue]);

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)}>
      <div className="grid grid-flow-row-dense grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
        <div className="flex flex-col gap-0.5">
          <Input
            type="text"
            label="Club Code"
            name="clubCode"
            value={clubListCode}
            onChange={handleChange}
            disabled
          />
        </div>

        <div className="flex flex-col gap-0.5 z-40">
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
                infiniteScroll
                setPageOption={setPageOptionCity}
                setSearchQueryOption={setSearchQueryOptionCity}
                totalPageOptions={totalPageOptionCity}
              />
            )}
          />
        </div>

        <div className="flex flex-col gap-0.5">
          <Input
            type="text"
            label="Instagram"
            name="instagram"
            onChange={handleChange}
            errValidation={errors}
            register={register}
          />
        </div>

        <div className="flex flex-col gap-0.5">
          <Input
            type="text"
            label="Club Name"
            name="clubName"
            onChange={handleChange}
            errServer={errServer?.data}
            errCodeServer="x15003"
            errValidation={errors}
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
            errServer={errServer?.data}
            errCodeServer="xxx414"
            errValidation={errors}
            register={register}
          />
        </div>

        <div className="flex flex-col gap-0.5">
          <Input
            type="text"
            label="Location"
            name="location"
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
            onChange={handleChange}
            errValidation={errors}
            register={register}
          />
        </div>

        <div className="flex flex-col gap-0.5 z-30">
          <Controller
            control={control}
            name="picUserId"
            render={({ field }) => (
              <SelectDropdown
                field={field}
                name="picUserId"
                data={selectCustomerData}
                label="PIC User Id"
                placeholder="Select PIC User Id"
                selectedValue={selectedCustomerValue}
                setSelectedValue={setSelectedCustomerValue}
                errServer={errServer?.data}
                errCodeServer="x01013"
                errValidation={errors}
                infiniteScroll
                setPageOption={setPageOptionCustomerData}
                setSearchQueryOption={setSearchQueryOptionCustomerData}
                totalPageOptions={totalPageOptionCustomerData}
              />
            )}
          />
        </div>

        <div className="flex flex-col gap-0.5 sm:row-span-2">
          <UploadImage
            label="Logo"
            name="logo"
            onChange={handleImageChange}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            height="h-28"
            errorImg={errorImg}
            setErrorImg={setErrorImg}
            errServer={errServer?.data}
            // errCodeServer="xxx025"
          />
        </div>

        <div className="flex flex-col gap-0.5">
          <Input
            type="text"
            label="Legal Document Number"
            name="legalDocumentNumber"
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
            value={formInput?.picPhoneNumber || ''}
            onChange={handleChange}
            errValidation={errors}
            register={register}
            disabled
          />
        </div>

        <div className="flex flex-col gap-0.5">
          <Input
            type="text"
            label="Email"
            name="clubEmail"
            value={formInput?.clubEmail || ''}
            onChange={handleChange}
            errValidation={errors}
            register={register}
            disabled
          />
        </div>

        {/* Fase 2 */}
        {/* <div className="flex flex-col items-start gap-2 lg:flex-row lg:items-center">
          <div className="flex w-full flex-col gap-1">
            <div className="flex-1 ">
              <Input
                type="text"
                label="Club email"
                name="clubEmail"
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div>
              <p className="text-ftgreen-200 italic">Validated</p>
            </div>
          </div>

          <div className="lg:mb-1">
            <Button background="black" className="w-30 text-xs sm:w-36 md:w-32">
              Kirim ulang email
            </Button>
          </div>
        </div> */}
      </div>

      <div className="flex justify-end w-full gap-4 py-2 mt-4">
        <Button background="red" className="w-40" onClick={handleCancel}>
          {isLoading ? <LoaderButtonAction /> : 'Cancel'}
        </Button>

        <Button type="submit" background="black" className="w-40">
          {isLoading ? <LoaderButtonAction /> : 'Add'}
        </Button>
      </div>
    </form>
  );
};

export default FormAddClubData;
