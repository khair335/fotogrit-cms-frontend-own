import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Input } from '@/components/form-input';
import { Button, LoaderButtonAction } from '@/components';
import { useAddNewMainPositionMutation } from '@/services/api/othersApiSlice';

const validationSchema = yup
  .object({
    name: yup.string().required('Name is a required field').max(50),
  })
  .required();

const FormAddMainPosition = ({ setOpenColapse }) => {
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
  };
  const [formInput, setFormInput] = useState(initialInputValue);

  const [addNewMainPosition, { isLoading, error: errServer }] =
    useAddNewMainPositionMutation();

  const handleOnSubmit = async () => {
    try {
      const newData = {
        main_position: formInput.name,
      };

      const response = await addNewMainPosition(newData).unwrap();

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
      <div className="grid grid-flow-row-dense grid-cols-1 gap-4 sm:grid-cols-2 gap-y-2">
        <Input
          type="text"
          label="Main Position Name"
          name="name"
          value={formInput.name}
          onChange={handleChange}
          errServer={errServer?.data}
          // errCodeServer="x06052" // already exist
          errValidation={errors}
          register={register}
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

export default FormAddMainPosition;
