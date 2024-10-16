import { useEffect, useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { toast } from 'react-toastify';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Input, SelectInput } from '@/components/form-input';
import { Button, LoaderButtonAction } from '@/components';
import { useAddNewUserDataMutation } from '@/services/api/userDataApiSlice';

const validationSchema = yup
  .object({
    name: yup.string().required('Name is a required field').max(50),
    email: yup
      .string()
      .required('Email is a required field')
      .email('Email must be a valid email')
      .max(50),
    phoneNumber: yup.string().required('Phone is a required field').max(50),
    password: yup.string().required('Password is a required field').max(20),
  })
  .required();

const FormAddUserData = ({ roles, userCode }) => {
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [showPassword, setShowPassword] = useState(true);
  const [selectedRole, setSelectedRole] = useState('');

  const initialInputValue = {
    userCode: '',
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: '',
  };
  const [formInput, setFormInput] = useState(initialInputValue);

  const [addNewUserData, { isLoading, error: errServer }] =
    useAddNewUserDataMutation();

  useEffect(() => {
    if (userCode) {
      setFormInput((prevFormInput) => ({
        ...prevFormInput,
        userCode: userCode,
      }));
    }
  }, [userCode]);

  // Removing required error when input is filled.
  useEffect(() => {
    const fieldsToCheck = ['name', 'email', 'phoneNumber', 'password'];

    fieldsToCheck.forEach((field) => {
      if (errors[field] && formInput[field] !== '') {
        if (errors[field].type === 'required') {
          clearErrors(field);
        }
      }
    });
  }, [formInput, clearErrors, errors]);

  const handleOnSubmit = async () => {
    try {
      const newData = {
        role: selectedRole,
        name: formInput.name,
        email: formInput.email,
        password: formInput.password,
        phone: formInput.phoneNumber,
      };

      const response = await addNewUserData(newData).unwrap();

      if (!response.error) {
        setFormInput(initialInputValue);
        setSelectedRole('');
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

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)}>
      <div className="grid grid-flow-row-dense grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4 gap-y-2">
        <Input
          type="text"
          label="User Code"
          name="userCode"
          value={formInput.userCode}
          onChange={handleChange}
          disabled
        />

        <Input
          type="text"
          label="Name"
          name="name"
          value={formInput.name}
          onChange={handleChange}
          errServer={errServer?.data}
          errCodeServer="x03001"
          errValidation={errors}
          register={register}
        />
        <Input
          type="text"
          label="Email"
          name="email"
          value={formInput.email}
          onChange={handleChange}
          errServer={errServer?.data}
          errCodeServer="x03009"
          errValidation={errors}
          register={register}
        />
        <Input
          type="text"
          label="Phone Number"
          name="phoneNumber"
          value={formInput.phoneNumber}
          onChange={handleChange}
          errServer={errServer?.data}
          errCodeServer="x03012"
          errValidation={errors}
          register={register}
        />
        <div className="relative">
          <Input
            type={showPassword ? 'password' : 'text'}
            label="Password"
            name="password"
            className="pr-3"
            value={formInput.password}
            onChange={handleChange}
            errServer={errServer?.data}
            errCodeServer="x03005"
            errValidation={errors}
            register={register}
          />

          <button
            type="button"
            className="absolute p-1 text-2xl text-gray-700 transition-all duration-300 bg-transparent top-[22px] right-1 hover:text-gray-400"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
          </button>
        </div>

        <div className="z-10">
          <SelectInput
            name="role"
            data={roles}
            label="Role"
            selectedValue={selectedRole}
            setSelectedValue={setSelectedRole}
            errServer={errServer?.data}
            errCodeServer="x03008"
          />
        </div>
      </div>

      <div className="flex justify-end w-full gap-4 py-2 mt-4">
        <Button
          background="red"
          className="w-40"
          disabled={isLoading ? true : false}
          onClick={handleCancel}
        >
          {isLoading ? <LoaderButtonAction /> : 'Cancel'}
        </Button>
        <Button
          type="submit"
          background="black"
          className="w-40"
          disabled={isLoading ? true : false}
        >
          {isLoading ? <LoaderButtonAction /> : 'Add'}
        </Button>
      </div>
    </form>
  );
};

export default FormAddUserData;
