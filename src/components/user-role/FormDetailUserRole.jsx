import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Switch } from '@headlessui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Button, LoaderButtonAction } from '@/components';
import { Checkbox, Input } from '../form-input';

import { useUpdateUserRoleMutation } from '@/services/api/userRoleApiSlice';

const validationSchema = yup
  .object({
    role: yup.string().required('Role is a required field').max(30),
  })
  .required();

const FormDetailUserRole = (props) => {
  const { data, setOpenModal, setIsOpenPopUpDelete, isAccess } = props;

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [enabled, setEnabled] = useState(
    data?.status_role === 0 ? false : true
  );

  const [formInput, setFormInput] = useState(data);

  useEffect(() => {
    setFormInput((prevFormInput) => ({
      ...prevFormInput,
      status: enabled === false ? 0 : 1, // Update status when enabled changes
    }));
  }, [enabled]);

  const [updateUserRole, { isLoading, error: errServer }] =
    useUpdateUserRoleMutation();

  const handleUpdate = async () => {
    try {
      const lowercasedRole = formInput?.role?.toLowerCase();
      const dataFormInput = {
        ...formInput,
        role: lowercasedRole,
      };

      const response = await updateUserRole(dataFormInput).unwrap();

      if (!response.error) {
        setOpenModal(false);

        toast.success(`Role "${formInput.role}" has been updated!`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to update the role`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  // Removing required error when input is filled.
  useEffect(() => {
    const fieldsToCheck = ['role'];

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
    setFormInput((prevFormInput) => ({
      ...prevFormInput,
      [name]: value,
    }));
  };

  const handlePermissionChange = (moduleCode, field) => {
    setFormInput((prevFormInput) => {
      const updatedPermissions = prevFormInput.permissions.map((permission) => {
        if (permission.module_code === moduleCode) {
          return {
            ...permission,
            [field]: !permission[field],
          };
        }
        return permission;
      });

      return {
        ...prevFormInput,
        permissions: updatedPermissions,
      };
    });
  };

  const updatedPermissions = formInput?.permissions?.map((permission) => {
    if (permission?.module_name === 'Referral') {
      return {
        ...permission,
        module_name: 'Add/Modify Wallet Benefits Code',
      };
    } else if (permission?.module_name === 'Wallet Amount') {
      return {
        ...permission,
        module_name: 'Add/Modify Top Up',
      };
    }

    return permission;
  });

  const sortedPermissions = updatedPermissions
    ?.filter((item) => item?.module_type === 1)
    ?.sort((a, b) => {
      const nameA = a?.module_name.toUpperCase();
      const nameB = b?.module_name.toUpperCase();

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

  return (
    <div className="w-full ">
      <div className="grid grid-cols-1 gap-2 mb-6 text-sm sm:grid-cols-2 ">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Group Code</h5>
          <p className="font-medium text-gray-600">{data?.role}</p>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Status</h5>
          <p
            className={`font-medium ${
              data?.status_role === 1 ? 'text-ftgreen-600' : ' text-red-600'
            }`}
          >
            {data?.status_role === 1 ? 'Active' : 'Non Active'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleUpdate)}>
        <div className="">
          <div className="grid grid-flow-row-dense grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2">
            <Input
              type="text"
              label="Role Name"
              name="role"
              value={formInput.role}
              onChange={handleChange}
              errServer={errServer?.data}
              errCodeServer="x04003" // role already exist
              errValidation={errors}
              register={register}
              disabled={!isAccess?.can_edit}
            />
            <Input
              type="text"
              label="Description"
              name="description"
              value={formInput.description}
              onChange={handleChange}
              disabled={!isAccess?.can_edit}
            />

            <div className="flex flex-col text-sm">
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
                <span
                  className={enabled ? 'text-ftgreen-600' : 'text-gray-500'}
                >
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-auto h-[300px] scroll-black">
          <table className="min-w-full border-b border-gray-200 divide-y divide-gray-200 ">
            <thead className="sticky top-0 bg-white shadow-sm">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-2 font-medium tracking-wider text-left capitalize"
                >
                  {''}
                </th>
                <th
                  scope="col"
                  className="flex-1 px-6 pt-2 font-bold tracking-wider text-center capitalize"
                  colSpan="4"
                >
                  Role
                </th>
              </tr>
              <tr>
                <th
                  scope="col"
                  className="px-6 py-2 font-bold tracking-wider text-left capitalize"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-2 font-bold tracking-wider text-center capitalize"
                >
                  Access
                </th>
                <th
                  scope="col"
                  className="px-6 py-2 font-bold tracking-wider text-center capitalize"
                >
                  Add
                </th>
                <th
                  scope="col"
                  className="px-6 py-2 font-bold tracking-wider text-center capitalize"
                >
                  Edit
                </th>
                <th
                  scope="col"
                  className="px-6 py-2 font-bold tracking-wider text-center capitalize"
                >
                  Delete
                </th>
              </tr>
            </thead>

            <tbody className="bg-white border-b divide-y divide-gray-200">
              {sortedPermissions?.map((permission, index) => (
                <tr key={`${permission.module_name}-${index}`}>
                  <td className="px-6 py-2 capitalize whitespace-nowrap">
                    {permission?.module_name === 'Referral'
                      ? 'Add/Modify Wallet Benefits Code'
                      : permission.module_name === 'Wallet Amount'
                      ? 'Add/Modify Top Up'
                      : permission?.module_name}
                  </td>
                  <td className="px-6 py-2 text-center whitespace-nowrap">
                    <Checkbox
                      checked={permission.menu}
                      onChange={() =>
                        handlePermissionChange(permission?.module_code, 'menu')
                      }
                      disabled={!isAccess?.can_edit}
                    />
                  </td>
                  <td className="px-6 py-2 text-center whitespace-nowrap">
                    <Checkbox
                      checked={permission.add}
                      onChange={() =>
                        handlePermissionChange(permission?.module_code, 'add')
                      }
                      disabled={!isAccess?.can_edit}
                    />
                  </td>
                  <td className="px-6 py-2 text-center whitespace-nowrap">
                    <Checkbox
                      checked={permission.edit}
                      onChange={() =>
                        handlePermissionChange(permission?.module_code, 'edit')
                      }
                      disabled={!isAccess?.can_edit}
                    />
                  </td>
                  <td className="px-6 py-2 text-center whitespace-nowrap">
                    <Checkbox
                      checked={permission.delete}
                      onChange={() =>
                        handlePermissionChange(
                          permission?.module_code,
                          'delete'
                        )
                      }
                      disabled={!isAccess?.can_edit}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end w-full gap-4 py-2 mt-4">
          <Button
            background="red"
            className={`w-32 ${isAccess?.can_delete ? '' : 'hidden'}`}
            onClick={() => setIsOpenPopUpDelete(true)}
            disabled={isLoading ? true : false}
          >
            {isLoading ? <LoaderButtonAction /> : 'Delete'}
          </Button>
          <Button
            type="submit"
            background="black"
            className={`w-32 ${isAccess?.can_edit ? '' : 'hidden'}`}
            disabled={isLoading ? true : false}
          >
            {isLoading ? <LoaderButtonAction /> : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FormDetailUserRole;
