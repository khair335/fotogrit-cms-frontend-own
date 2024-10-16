import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Checkbox, Input, SelectDropdown } from '@/components/form-input';
import { Button, LoaderButtonAction } from '@/components';

import { useAddNewReferralCodeMutation } from '@/services/api/referralCodeApiSlice';

export const optionsService = [
  {
    value: '121421423432dfs',
    label: 'Service 1',
  },
  {
    value: '42xd4f422453453',
    label: 'Service 2',
  },
];
export const optionsEquipment = [
  {
    value: '435cf43534cv3cf3',
    label: 'Equipment 1',
  },
  {
    value: 'fc34534f5c35cf3c',
    label: 'Equipment 2',
  },
];

const validationSchema = yup
  .object({
    code: yup.string().required('Name of Code is a required field').max(50),
    // expiredDate: yup
    //   .string()
    //   .required('Valid Until is a required field')
    //   .max(50),
    // quota: yup
    //   .number()
    //   .typeError('Quota must be greater than zero')
    //   .required('Quota is a required field')
    //   .nullable(),
    // amount: yup
    //   .number()
    //   .typeError('Amount must be greater than zero')
    //   .required('Amount is a required field')
    //   .nullable(),
  })
  .required();

const FormAddCodeBenefits = (props) => {
  const { setOpenColapse, optionsUsers } = props;

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
    status: '',
    discountService: '',
    discountEquipment: '',
  };
  const [formInput, setFormInput] = useState(initialInputValue);
  const [selectedUsers, setSelectedUsers] = useState('');
  const [selectedServices, setSelectedServices] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [checkStatus, setCheckStatus] = useState(false);

  const [addNewReferralCode, { isLoading, error: errServer }] =
    useAddNewReferralCodeMutation();

  const handleOnSubmit = async () => {
    try {
      const newData = {
        name: formInput.name,
      };
      const response = await addNewReferralCode(newData).unwrap();

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
      toast.error(`Failed: ${err?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  // Removing required error when input is filled.
  useEffect(() => {
    const fieldsToCheck = ['code', 'expiredDate', 'quota', 'amount'];

    fieldsToCheck.forEach((field) => {
      if (errors[field] && formInput[field] !== '') {
        clearErrors(field);
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

  const handleCancel = () => {
    setFormInput(initialInputValue);
    reset();
  };

  return (
    <>
      <form>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="z-10 flex flex-col gap-4">
            <Input
              type="text"
              label="Name of Code"
              name="name"
              value={formInput.name}
              onChange={handleChange}
              errServer={errServer?.data}
              errCodeServer="x09006"
              errValidation={errors}
              register={register}
            />

            <div className="flex items-center gap-4">
              <Checkbox
                name="status"
                checked={checkStatus}
                onChange={() => setCheckStatus(!checkStatus)}
              />

              <span
                className={`text-sm ${
                  checkStatus ? 'text-black font-bold' : 'text-gray-500'
                } `}
              >
                Active
              </span>
            </div>
          </div>

          <div className="">
            <h5 className="mb-2 font-bold">Service Benefits</h5>
            <div className="flex flex-col gap-4">
              <SelectDropdown
                // field={field}
                name="service"
                data={optionsService}
                label="Select All Service"
                placeholder="Select Service"
                selectedValue={selectedServices}
                setSelectedValue={setSelectedServices}
              />

              <Input
                type="number"
                label="Discount"
                name="discountService"
                value={formInput.discountService}
                onChange={handleChange}
                errValidation={errors}
                register={register}
              />
            </div>
          </div>

          <div className="">
            <h5 className="mb-2 font-bold">Equipment Benefits</h5>
            <div className="flex flex-col gap-4">
              <SelectDropdown
                // field={field}
                name="equipment"
                data={optionsEquipment}
                label="Select All Equipment"
                placeholder="Select Equipment"
                selectedValue={selectedEquipment}
                setSelectedValue={setSelectedEquipment}
              />

              <Input
                type="number"
                label="Discount"
                name="discountEquipment"
                value={formInput.discountEquipment}
                onChange={handleChange}
                errValidation={errors}
                register={register}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end w-full gap-4 py-2 mt-4">
          <Button
            background="red"
            className="w-40"
            disabled
            onClick={handleCancel}
          >
            {isLoading ? <LoaderButtonAction /> : 'Cancel'}
          </Button>
          <Button
            background="black"
            className="w-40"
            disabled
            // onClick={handleSubmit(handleOpenPopUP)}
          >
            {isLoading ? <LoaderButtonAction /> : 'Add'}
          </Button>
        </div>
      </form>
    </>
  );
};

export default FormAddCodeBenefits;
