import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Paragraph } from '../typography';
import { Button, LoaderButtonAction } from '@/components';
import { Input, SelectInput } from '@/components/form-input';

import { useUpdateAgeGroupMutation } from '@/services/api/othersApiSlice';

const validationSchema = yup
  .object({
    name: yup.string().required('Age group name is a required field'),
  })
  .required();

const FormDetailAgeGroup = (props) => {
  const { data, isAccess, optionsGender, setOpenModal, setIsOpenPopUpDelete } =
    props;

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
    description: '',
  };
  const [formInput, setFormInput] = useState(initialInputValue);
  const [selectedGender, setSelectedGender] = useState('');
  const [getDetailUpdated, setGetDetailUpdated] = useState({});

  const [updateAgeGroup, { isLoading, error: errServer }] =
    useUpdateAgeGroupMutation();

  const handleUpdate = async () => {
    try {
      const updateData = {
        id: formInput.id,
        age_group: formInput.name,
        gender: selectedGender,
        description: formInput.description,
      };

      const response = await updateAgeGroup(updateData).unwrap();

      if (!response.error) {
        setGetDetailUpdated(response?.data);
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
        description: data?.description,
        name: data?.age_group,
      }));
      setSelectedGender(
        data?.gender === 'Putri'
          ? 1
          : data?.gender === 'Putra'
          ? 2
          : data?.gender === 'Mix'
          ? 3
          : -1
      );
    }
  }, [data, setFormInput]);

  // Default Value for validation react hook form
  useEffect(() => {
    if (data) {
      setValue('name', data?.age_group);
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
      <div className="grid grid-cols-1 gap-2 mb-6 text-sm sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Age Group Name</h5>
          <Paragraph loading={isLoading} className="capitalize">
            {getDetailUpdated?.age_group
              ? getDetailUpdated?.age_group
              : data?.age_group}
          </Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Gender</h5>
          <Paragraph loading={isLoading} className="capitalize">
            {getDetailUpdated?.gender
              ? getDetailUpdated?.gender
              : data?.gender || '-'}
          </Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Description</h5>
          <Paragraph loading={isLoading} className="capitalize">
            {getDetailUpdated?.description
              ? getDetailUpdated?.description
              : data?.description || '-'}
          </Paragraph>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleUpdate)}>
        <div className="grid grid-flow-row-dense grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            type="text"
            label="Age Group Name"
            name="name"
            value={formInput.name}
            onChange={handleChange}
            errServer={errServer?.data}
            errCodeServer="x07022"
            errValidation={errors}
            register={register}
            disabled={!isAccess?.can_edit}
          />

          <div className="z-10">
            <SelectInput
              data={optionsGender}
              label="Gender"
              placeholder="Select Gender"
              selectedValue={selectedGender}
              setSelectedValue={setSelectedGender}
              disabled={!isAccess?.can_edit}
            />
          </div>
          <Input
            type="text"
            label="Description"
            name="description"
            value={formInput.description}
            onChange={handleChange}
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

export default FormDetailAgeGroup;
