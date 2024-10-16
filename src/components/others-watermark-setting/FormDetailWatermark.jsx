import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Paragraph } from '../typography';
import { Button, LoaderButtonAction } from '@/components';
import { Input, UploadImage } from '@/components/form-input';

import { useUpdateUserDataMutation } from '@/services/api/userDataApiSlice';
import { Switch } from '@headlessui/react';

const validationSchema = yup
  .object({
    name: yup.string().required('Name is a required field').max(50),
  })
  .required();

const FormDetailWatermark = (props) => {
  const { data, setIsOpenPopUpDelete, roles, isAccess } = props;

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
    code: '',
    name: '',
    thumbnail: '',
    status: '',
  };
  const [formInput, setFormInput] = useState(initialInputValue);
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorImg, setErrorImg] = useState(null);
  const [enabled, setEnabled] = useState(false);
  const [getDetailUpdated, setGetDetailUpdated] = useState({});

  const [updateUserData, { isLoading, error: errServer }] =
    useUpdateUserDataMutation();

  const handleUpdate = async () => {
    try {
      const updateData = {
        id: formInput.id,
        code: formInput.code,
        name: formInput.name,
      };

      const response = await updateUserData(updateData).unwrap();

      if (!response.error) {
        setGetDetailUpdated({
          id: formInput.id,
          code: formInput.code,
          name: formInput.name,
        });

        toast.success(`User "${formInput.name}" has been updated!`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to update the user`, {
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
      }));
    }
  }, [data, setFormInput]);

  // Default Value for validation react hook form
  useEffect(() => {
    if (data) {
      setValue('name', data?.name);
    }
  }, [data, setFormInput]);

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
          thumbnail: file,
        }));
      } else {
        setErrorImg('Invalid file type. Please select an image.');
        setSelectedImage(null);
      }
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-2 mb-6 text-sm sm:grid-cols-4">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Code</h5>
          <Paragraph loading={isLoading}>
            {getDetailUpdated?.code ? getDetailUpdated?.code : data?.code}
          </Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Watermark Type</h5>
          <Paragraph loading={isLoading} className="capitalize">
            {getDetailUpdated?.name ? getDetailUpdated?.name : data?.name}
          </Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Thumbnail</h5>
          <Paragraph loading={isLoading} className="capitalize">
            {/* {getDetailUpdated?.name ? getDetailUpdated?.name : data?.name} */}
            No Selected Photo
          </Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Status</h5>
          <Paragraph loading={isLoading} className="capitalize">
            {/* {getDetailUpdated?.name ? getDetailUpdated?.name : data?.name} */}
            -
          </Paragraph>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleUpdate)}>
        <div className="grid grid-flow-row-dense grid-cols-1 gap-4 sm:grid-cols-3 gap-y-2">
          <Input
            type="text"
            label="Code"
            name="code"
            value={formInput.code}
            onChange={handleChange}
            disabled
          />

          <Input
            type="text"
            label="Tool Type"
            name="name"
            value={formInput.name}
            onChange={handleChange}
            errServer={errServer?.data}
            errCodeServer="x03001"
            errValidation={errors}
            register={register}
          />

          <div className="flex flex-col text-sm ">
            <label className="text-gray-500 ">Status</label>
            <div className="flex items-center gap-2">
              <span className={enabled ? 'text-gray-500' : 'text-red-600'}>
                Non Active
              </span>
              <Switch
                checked={enabled}
                onChange={setEnabled}
                className={`${enabled ? ' bg-ftgreen-600' : 'bg-gray-300/70'}
          relative inline-flex h-[28px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 shadow__gear-2 disabled:opacity-60 disabled:cursor-default`}
              >
                <span
                  aria-hidden="true"
                  className={`${enabled ? 'translate-x-11' : 'translate-x-0'}
            pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-xl ring-0 transition duration-200 ease-in-out`}
                />
              </Switch>
              <span className={enabled ? 'text-ftgreen-600' : 'text-gray-500'}>
                Active
              </span>
            </div>
          </div>

          <UploadImage
            label="Thumbnail"
            name="thumbnail"
            onChange={handleImageChange}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            height="h-32"
            errorImg={errorImg}
            setErrorImg={setErrorImg}
            // errServer={errServer?.data}
            // errCodeServer="xxx025"
          />
        </div>

        <div className="flex justify-end w-full gap-4 py-2 mt-4">
          {isAccess?.can_delete && (
            <Button
              background="red"
              className={`w-32`}
              // disabled={isLoading ? true : false}
              onClick={() => setIsOpenPopUpDelete(true)}
              disabled
            >
              {isLoading ? <LoaderButtonAction /> : 'Delete'}
            </Button>
          )}
          {isAccess?.can_edit && (
            <Button
              type="submit"
              background="black"
              className={`w-32`}
              // disabled={isLoading ? true : false}
              disabled
            >
              {isLoading ? <LoaderButtonAction /> : 'Save'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormDetailWatermark;
