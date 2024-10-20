import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Input, UploadImage } from '@/components/form-input';
import { Button, LoaderButtonAction } from '@/components';

import { useAddNewSponsorMutation } from '@/services/api/othersApiSlice';

const validationSchema = yup
  .object({
    name: yup.string().required('Name is is a required field'),
  })
  .required();

const FormAddSponsor = ({ setOpenColapse }) => {
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
    name: '',
    logo: null,
  };
  const [formInput, setFormInput] = useState(initialInputValue);
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorImg, setErrorImg] = useState(null);

  const [addNewSponsor, { isLoading, error: errServer }] =
    useAddNewSponsorMutation();

  const handleOnSubmit = async () => {
    if (!selectedImage) {
      setErrorImg('Please select an image');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('name', formInput.name);
      formData.append('logo', formInput.logo);

      const response = await addNewSponsor(formData).unwrap();

      if (!response.error) {
        setFormInput(initialInputValue);
        reset();
        setOpenColapse(false);

        toast.success(`"${formInput.name}" has been added!`, {
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
    } else {
      setErrorImg('Please select an image.');
      setSelectedImage(null);
    }
  };

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
    <form onSubmit={handleSubmit(handleOnSubmit)}>
      <div className="grid grid-flow-row-dense grid-cols-1 gap-4 sm:grid-cols-3 gap-y-2">
        <Input
          type="text"
          label="Name"
          name="name"
          value={formInput.name}
          onChange={handleChange}
          errValidation={errors}
          register={register}
        />

        <UploadImage
          label="Logo"
          onChange={handleImageChange}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          height="h-40"
          errorImg={errorImg}
          setErrorImg={setErrorImg}
          accept="image/jpg, image/jpeg"
        />
      </div>

      <div className="flex justify-end w-full gap-4 py-2 mt-4">
        <Button
          background="red"
          className="w-40"
          disabled={isLoading}
          onClick={handleCancel}
        >
          {isLoading ? <LoaderButtonAction /> : 'Cancel'}
        </Button>
        <Button
          type="submit"
          background="black"
          className="w-40"
          disabled={isLoading}
        >
          {isLoading ? <LoaderButtonAction /> : 'Add'}
        </Button>
      </div>
    </form>
  );
};

export default FormAddSponsor;
