import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

import { Paragraph } from '../typography';
import { Button, LoaderButtonAction } from '@/components';
import { Input, SelectInput } from '@/components/form-input';

import { useUpdateUserDataMutation } from '@/services/api/userDataApiSlice';
import { Switch } from '@headlessui/react';

const validationSchema = yup
  .object({
    name: yup.string().required('Name is a required field').max(50),
    email: yup
      .string()
      .required('Email is a required field')
      .email('Email must be a valid email')
      .max(50),
    phoneNumber: yup.string().required('Phone is a required field').max(50),
    password: yup.string().max(20),
  })
  .required();

const FormDetailUserData = (props) => {
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

  const [showPassword, setShowPassword] = useState(true);
  const [selectedRole, setSelectedRole] = useState('');
  const [enabled, setEnabled] = useState(data?.status === 0 ? false : true);

  const initialInputValue = {
    id: '',
    userCode: '',
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: '',
    status: 0,
  };
  const [formInput, setFormInput] = useState(initialInputValue);
  const [getDetailUpdated, setGetDetailUpdated] = useState({});
  const [matchingSelectedRole, setMatchingSelectedRole] = useState('');

  const [updateUserData, { isLoading, error: errServer }] =
    useUpdateUserDataMutation();

  const handleUpdate = async () => {
    try {
      const updateData = {
        id: formInput.id,
        role: selectedRole,
        name: formInput.name,
        email: formInput.email,
        password: formInput.password,
        phone: formInput.phoneNumber,
        status: formInput.status,
      };

      const response = await updateUserData(updateData).unwrap();

      if (!response.error) {
        setGetDetailUpdated({
          id: formInput.id,
          role: matchingSelectedRole,
          name: formInput.name,
          email: formInput.email,
          phone: formInput.phoneNumber,
          status: formInput.status,
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
        userCode: data?.code,
        name: data?.name,
        email: data?.email,
        phoneNumber: data?.phone_number,
        role: data?.role,
        status: data?.status,
      }));
      setSelectedRole(data?.role);
    }
  }, [data, setFormInput]);

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

  // Default Value for validation react hook form
  useEffect(() => {
    if (data) {
      setValue('name', data?.name);
      setValue('email', data?.email);
      setValue('phoneNumber', data?.phone_number);
      setValue('password', data?.password);
    }
  }, [data, setFormInput, setValue]);

  useEffect(() => {
    setFormInput((prevFormInput) => ({
      ...prevFormInput,
      status: enabled === false ? 0 : 1, // Update status when enabled changes
    }));
  }, [enabled]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    // Matching the value of the role and displaying its label
    const matchedOption = roles.find((option) => option.value === selectedRole);
    if (matchedOption) {
      setMatchingSelectedRole(matchedOption.label);
    } else {
      setMatchingSelectedRole('');
    }
  }, [selectedRole, roles]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-2 mb-6 text-sm sm:grid-cols-3 lg:grid-cols-6">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">User Code</h5>
          <Paragraph loading={isLoading}>
            {getDetailUpdated?.code ? getDetailUpdated?.code : data?.code}
          </Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Name</h5>
          <Paragraph loading={isLoading} className="capitalize">
            {getDetailUpdated?.name ? getDetailUpdated?.name : data?.name}
          </Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Email</h5>
          <Paragraph loading={isLoading} className="break-words">
            {getDetailUpdated?.email ? getDetailUpdated?.email : data?.email}
          </Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Phone Number</h5>
          <Paragraph loading={isLoading}>
            {getDetailUpdated?.phone
              ? getDetailUpdated?.phone
              : data?.phone_number
              ? data?.phone_number
              : '-'}
          </Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Role</h5>
          <Paragraph loading={isLoading} className="capitalize">
            {getDetailUpdated?.role ? getDetailUpdated?.role : data?.role_name}
          </Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Status</h5>
          <Paragraph loading={isLoading}>
            {getDetailUpdated?.name ? (
              <span
                className={`font-medium ${
                  getDetailUpdated?.status === 1
                    ? 'text-ftgreen-600'
                    : ' text-red-600'
                }`}
              >
                {getDetailUpdated?.status === 1 ? 'Active' : 'Non Active'}
              </span>
            ) : (
              <span
                className={`font-medium ${
                  data?.status === 1 ? 'text-ftgreen-600' : ' text-red-600'
                }`}
              >
                {data?.status === 1 ? 'Active' : 'Non Active'}
              </span>
            )}
          </Paragraph>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleUpdate)}>
        <div className="grid grid-flow-row-dense grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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
            disabled={!isAccess?.can_edit}
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
            disabled={!isAccess?.can_edit}
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
            disabled={!isAccess?.can_edit}
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
              disabled={!isAccess?.can_edit}
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
              data={roles}
              label="Role"
              selectedValue={selectedRole}
              setSelectedValue={setSelectedRole}
              errServer={errServer?.data}
              errCodeServer="x03008"
              disabled={!isAccess?.can_edit}
            />
          </div>

          <div className="flex flex-col text-sm sm:col-span-2">
            <label className="text-gray-500 ">Status</label>
            <div className="flex items-center gap-2">
              <span className={enabled ? 'text-gray-500' : 'text-red-600'}>
                Non Active
              </span>
              <Switch
                checked={enabled}
                onChange={setEnabled}
                disabled={!isAccess?.can_edit}
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
              disabled={isLoading ? true : false}
            >
              {isLoading ? <LoaderButtonAction /> : 'Save'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormDetailUserData;
