import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Switch } from '@headlessui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Button, LoaderButtonAction } from '@/components';
import { Checkbox, Input } from '../form-input';
import { useAddNewUserRoleMutation } from '@/services/api/userRoleApiSlice';

const validationSchema = yup
  .object({
    role: yup.string().required('Role is a required field').max(30),
  })
  .required();

const FormAddUserRole = ({ setOpenColapse }) => {
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [enabled, setEnabled] = useState(false);
  const INITIAL_FORM_INPUT = {
    role: '',
    description: '',
    status: 0,
    permissions: [
      {
        module_name: 'Add/Modify Top Up',
        module_code: 'wallet_amount',
        menu: false,
        add: false,
        edit: false,
        delete: false,
      },
      {
        module_name: 'Add/Modify Wallet Benefits Code',
        module_code: 'referral',
        menu: false,
        add: false,
        edit: false,
        delete: false,
      },
      {
        module_name: 'App Setting',
        module_code: 'app_settings',
        menu: false,
        add: false,
        edit: false,
        delete: false,
      },
      {
        module_name: 'General Setting',
        module_code: 'general_setting',
        menu: false,
        add: false,
        edit: false,
        delete: false,
      },
      {
        module_name: 'Add/Modify Team',
        module_code: 'team_master',
        menu: false,
        add: false,
        edit: false,
        delete: false,
      },
      {
        module_name: 'User Role',
        module_code: 'user_role',
        menu: false,
        add: false,
        edit: false,
        delete: false,
      },
      {
        module_name: 'User Data',
        module_code: 'user_data',
        menu: false,
        add: false,
        edit: false,
        delete: false,
      },
      {
        module_name: 'Order',
        module_code: 'order',
        menu: false,
        add: false,
        edit: false,
        delete: false,
      },
      // {
      //   module_name: 'Cart',
      //   module_code: 'cart',
      //   menu: false,
      //   add: false,
      //   edit: false,
      //   delete: false,
      // },
      {
        module_name: 'Add/Modify My Service',
        module_code: 'add_modify_service',
        menu: false,
        add: false,
        edit: false,
        delete: false,
      },
      {
        module_name: 'Event Checking',
        module_code: 'event_checking',
        menu: false,
        add: false,
        edit: false,
        delete: false,
      },
      {
        module_name: 'Manage Service Request',
        module_code: 'manage_service_request',
        menu: false,
        add: false,
        edit: false,
        delete: false,
      },
      // {
      //   module_name: 'Equipment',
      //   module_code: 'equipment',
      //   menu: false,
      //   add: false,
      //   edit: false,
      //   delete: false,
      // },
      {
        module_name: 'Group Event',
        module_code: 'group_event',
        menu: false,
        add: false,
        edit: false,
        delete: false,
      },
      {
        module_name: 'Event',
        module_code: 'event',
        menu: false,
        add: false,
        edit: false,
        delete: false,
      },
      {
        module_name: 'Wallet Transaction',
        module_code: 'wallet_transaction',
        menu: false,
        add: false,
        edit: false,
        delete: false,
      },
      {
        module_name: 'Top Up',
        module_code: 'top_up',
        menu: false,
        add: false,
        edit: false,
        delete: false,
      },
      {
        module_name: 'Withdraw Wallet',
        module_code: 'withdraw_wallet',
        menu: false,
        add: false,
        edit: false,
        delete: false,
      },
      {
        module_name: 'Change Wallet Amount',
        module_code: 'change_wallet',
        menu: false,
        add: false,
        edit: false,
        delete: false,
      },
      {
        module_name: 'Approval Visibility Service',
        module_code: 'approval_visibility_service',
        menu: false,
        add: false,
        edit: false,
        delete: false,
      },
      {
        module_name: 'Report Transaction',
        module_code: 'report_transaction',
        menu: false,
        add: false,
        edit: false,
        delete: false,
      },
      {
        module_name: 'Report User',
        module_code: 'report_user',
        menu: false,
        add: false,
        edit: false,
        delete: false,
      },

      {
        module_name: 'Customer Data',
        module_code: 'customer_data',
        menu: false,
        add: false,
        edit: false,
        delete: false,
      },
      {
        module_name: 'Request Other Service',
        module_code: 'request_other_service',
        menu: false,
        add: false,
        edit: false,
        delete: false,
      },
      {
        module_name: 'Approval Wallet Benefit',
        module_code: 'approval_wallet_benefit',
        menu: false,
        add: false,
        edit: false,
        delete: false,
      },
      {
        module_name: 'Age Group',
        module_code: 'age_group',
        menu: false,
        add: false,
        edit: false,
        delete: false,
      },
      {
        module_name: 'Club',
        module_code: 'club',
        menu: false,
        add: false,
        edit: false,
        delete: false,
      },
      {
        module_name: 'Event Match Category',
        module_code: 'event_match_category',
        menu: false,
        add: false,
        edit: false,
        delete: false,
      },
      {
        module_name: 'Event Match Pool',
        module_code: 'event_match_pool',
        menu: false,
        add: false,
        edit: false,
        delete: false,
      },
      {
        module_name: 'Event Type',
        module_code: 'event_type',
        menu: false,
        add: false,
        edit: false,
        delete: false,
      },
      {
        module_name: 'Main Position',
        module_code: 'main_position',
        menu: false,
        add: false,
        edit: false,
        delete: false,
      },
      {
        module_name: 'Service Transaction',
        module_code: 'service_transaction',
        menu: false,
        add: false,
        edit: false,
        delete: false,
      },
    ],
  };
  const [formInput, setFormInput] = useState(INITIAL_FORM_INPUT);

  useEffect(() => {
    setFormInput((prevFormInput) => ({
      ...prevFormInput,
      status: enabled === false ? 0 : 1, // Update status when enabled changes
    }));
  }, [enabled]);

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

  const [addNewUserRole, { isLoading, error: errServer }] =
    useAddNewUserRoleMutation();

  const handleOnSubmit = async () => {
    try {
      const lowercasedRole = formInput.role.toLowerCase();
      const dataFormInput = {
        ...formInput,
        role: lowercasedRole,
      };

      const response = await addNewUserRole(dataFormInput).unwrap();

      if (!response.error) {
        setFormInput(INITIAL_FORM_INPUT);
        setOpenColapse(false);

        toast.success(`Role "${formInput.role}" has been added!`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to save the role`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevFormInput) => ({
      ...prevFormInput,
      [name]: value,
    }));
  };

  const handlePermissionChange = (moduleCode, field) => {
    setFormInput((prevFormInput) => {
      const updatedPermissions = prevFormInput?.permissions?.map(
        (permission) => {
          if (permission.module_code === moduleCode) {
            return {
              ...permission,
              [field]: !permission[field],
            };
          }
          return permission;
        }
      );

      return {
        ...prevFormInput,
        permissions: updatedPermissions,
      };
    });
  };

  const sortedPermissions = formInput?.permissions?.sort((a, b) => {
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
    <form onSubmit={handleSubmit(handleOnSubmit)}>
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
          />
          <Input
            type="text"
            label="Description"
            name="description"
            value={formInput.description}
            onChange={handleChange}
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
                className={`${enabled ? ' bg-ftgreen-600' : 'bg-gray-300/70'}
          relative inline-flex h-[28px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 shadow__gear-2`}
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
              <tr key={`${permission.module_code}-${index}`}>
                <td className="px-6 py-2 capitalize whitespace-nowrap">
                  {permission.module_name}
                </td>
                <td className="px-6 py-2 text-center whitespace-nowrap">
                  <Checkbox
                    checked={permission.menu}
                    onChange={() =>
                      handlePermissionChange(permission.module_code, 'menu')
                    }
                  />
                </td>
                <td className="px-6 py-2 text-center whitespace-nowrap">
                  <Checkbox
                    checked={permission.add}
                    onChange={() =>
                      handlePermissionChange(permission.module_code, 'add')
                    }
                  />
                </td>
                <td className="px-6 py-2 text-center whitespace-nowrap">
                  <Checkbox
                    checked={permission.edit}
                    onChange={() =>
                      handlePermissionChange(permission.module_code, 'edit')
                    }
                  />
                </td>
                <td className="px-6 py-2 text-center whitespace-nowrap">
                  <Checkbox
                    checked={permission.delete}
                    onChange={() =>
                      handlePermissionChange(permission.module_code, 'delete')
                    }
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
          className="w-40"
          disabled={isLoading ? true : false}
          // onClick={handleCancel}
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

export default FormAddUserRole;
