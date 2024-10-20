import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Paragraph } from '../typography';
import { Button, LoaderButtonAction } from '@/components';
import { Input, UpdateImage } from '@/components/form-input';

import { useUpdateSponsorMutation } from '@/services/api/othersApiSlice';

const validationSchema = yup
  .object({
    name: yup.string().required('Name is a required field'),
  })
  .required();

const FormDetailNews = (props) => {
  const { data, isAccess, setOpenModal, setIsOpenPopUpDelete } = props;

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
    logo: null,
  };
  const [formInput, setFormInput] = useState(initialInputValue);
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorImg, setErrorImg] = useState(null);

  const [updateSponsor, { isLoading, error: errServer }] =
    useUpdateSponsorMutation();

  const handleUpdate = async () => {
    if (!data?.logo && !selectedImage) {
      setErrorImg('Please select an image');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('id', formInput.id);
      formData.append('name', formInput.name);
      formData.append('sponsor_code', formInput.code);
      formData.append('logo', formInput.logo);
      const response = await updateSponsor(formData).unwrap();

      if (!response.error) {
        setOpenModal(false);

        toast.success(`"${formInput.name}" has been updated!`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
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
        code: data?.sponsor_code,
        logo: data?.logo,
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
          logo: file,
        }));
      } else {
        setErrorImg('Invalid file type. Please select an image.');
        setSelectedImage(null);
      }
    }
  };

  const imageData = data?.logo || '/images/logo-fotogrit.png';

  return (
    <div>
      <div className="grid grid-cols-1 gap-2 mb-6 text-sm sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Code</h5>
          <Paragraph loading={isLoading} className="capitalize">
            {data?.sponsor_code || '-'}
          </Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Name</h5>
          <Paragraph loading={isLoading} className="capitalize">
            {data?.name || '-'}
          </Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Logo</h5>

          <div className="max-w-[70%] h-20 overflow-hidden rounded-md">
            <img
              src={imageData}
              alt={data?.name}
              className="object-contain w-full h-full"
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleUpdate)}>
        <div className="grid grid-flow-row-dense grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            type="text"
            label="Name"
            name="name"
            value={formInput.name}
            onChange={handleChange}
            errValidation={errors}
            register={register}
            disabled={!isAccess?.can_edit}
          />

          <UpdateImage
            label="Logo"
            onChange={handleImageChange}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            dataImage={formInput.logo}
            disabled={!isAccess?.can_edit}
            height="h-40"
            errorImg={errorImg}
            setErrorImg={setErrorImg}
            accept="image/jpg, image/jpeg"
          />
        </div>

        <div className="flex justify-end w-full gap-4 py-2 mt-4">
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
              disabled={isLoading}
            >
              {isLoading ? <LoaderButtonAction /> : 'Save'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormDetailNews;
