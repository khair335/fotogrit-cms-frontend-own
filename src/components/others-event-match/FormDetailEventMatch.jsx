import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Paragraph } from '../typography';
import { Button, LoaderButtonAction } from '@/components';
import { Input } from '@/components/form-input';
import { useUpdateEventMatchMutation } from '@/services/api/othersApiSlice';

const validationSchema = yup
  .object({
    name: yup.string().required('Name is a required field').max(50),
  })
  .required();

const FormDetailEventMatch = (props) => {
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
    name: '',
  };
  const [formInput, setFormInput] = useState(initialInputValue);
  const [getDetailUpdated, setGetDetailUpdated] = useState({});

  const [updateEventMatch, { isLoading, error: errServer }] =
    useUpdateEventMatchMutation();

  const handleUpdate = async () => {
    try {
      const updateData = {
        id: formInput.id,
        name: formInput.name,
      };

      const response = await updateEventMatch(updateData).unwrap();

      if (!response.error) {
        setOpenModal(false);
        setGetDetailUpdated({
          id: formInput.id,
          name: formInput.name,
        });

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

  return (
    <div>
      <div className="grid grid-cols-1 gap-2 mb-6 text-sm sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Event Match Categories Name</h5>
          <Paragraph loading={isLoading} className="capitalize">
            {getDetailUpdated?.name ? getDetailUpdated?.name : data?.name}
          </Paragraph>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleUpdate)}>
        <div className="grid grid-flow-row-dense grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            type="text"
            label="Event Match Categories Name"
            name="name"
            value={formInput.name}
            onChange={handleChange}
            errServer={errServer?.data}
            errCodeServer="x06052"
            errValidation={errors}
            register={register}
            disabled={!isAccess?.can_edit}
          />
        </div>

        <div className="flex justify-end w-full gap-4 py-2 mt-4">
          {isAccess?.can_delete && (
            <Button
              background="red"
              className={`w-32`}
              disabled={isLoading}
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

export default FormDetailEventMatch;
