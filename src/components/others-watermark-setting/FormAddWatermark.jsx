import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Input, UploadImage } from '@/components/form-input';
import { Button, LoaderButtonAction } from '@/components';
import { useAddNewUserDataMutation } from '@/services/api/userDataApiSlice';
import { Switch } from '@headlessui/react';

const validationSchema = yup
  .object({
    name: yup.string().required('Name is a required field').max(50),
  })
  .required();

const FormAddWatermark = ({ roles, userCode }) => {
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
    name: '',
    thumbnail: '',
    status: '',
  };
  const [formInput, setFormInput] = useState(initialInputValue);
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorImg, setErrorImg] = useState(null);
  const [enabled, setEnabled] = useState(false);

  const [addNewUserData, { isLoading, error: errServer }] =
    useAddNewUserDataMutation();

  const handleOnSubmit = async () => {
    try {
      const newData = {
        code: formInput.code,
        name: formInput.name,
      };

      const response = await addNewUserData(newData).unwrap();

      if (!response.error) {
        setFormInput(initialInputValue);
        reset();

        toast.success(`"${formInput.name}" has been added!`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to save the data`, {
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

  useEffect(() => {
    setFormInput((prevFormInput) => ({
      ...prevFormInput,
      status: enabled === false ? 0 : 1, // Update status when enabled changes
    }));
  }, [enabled]);

  useEffect(() => {
    if (userCode) {
      setFormInput((prevFormInput) => ({
        ...prevFormInput,
        code: userCode,
      }));
    }
  }, [userCode]);

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
        <Button
          background="red"
          className="w-40"
          // disabled={isLoading ? true : false}
          disabled
          onClick={handleCancel}
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
          {isLoading ? <LoaderButtonAction /> : 'Add'}
        </Button>
      </div>
    </form>
  );
};

export default FormAddWatermark;
