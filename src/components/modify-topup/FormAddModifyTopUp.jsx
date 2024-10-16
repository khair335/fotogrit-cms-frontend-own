import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Input, SelectInput } from '@/components/form-input';
import { Button, LoaderButtonAction } from '@/components';

import { useAddNewWalletAmountMutation } from '@/services/api/walletApiSlice';
import { removeCurrencyFormat } from '@/helpers/CurrencyFormat';
import { optionsWalletType } from '@/constants';

const validationSchema = yup
  .object({
    amount: yup
      .string()
      .required('Topup amount is a required field')
      .nullable(),
    price: yup.string().required('Price is a required field').nullable(),
  })
  .required();

const FormAddModifyTopUp = ({ walletCode, setOpenColapse }) => {
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
    code: walletCode,
    amount: '',
    price: '',
  };
  const [formInput, setFormInput] = useState(initialInputValue);
  const [selectedWalletType, setSelectedWalletType] = useState('wallet');

  const [addNewWalletAmount, { isLoading, error: errServer }] =
    useAddNewWalletAmountMutation();

  useEffect(() => {
    if (walletCode) {
      setFormInput((prevFormInput) => ({
        ...prevFormInput,
        code: walletCode,
      }));
    }
  }, [walletCode]);

  const handleOnSubmit = async () => {
    try {
      const newData = {
        code: formInput.code,
        amount: removeCurrencyFormat(formInput.amount),
        price: removeCurrencyFormat(formInput.price),
        wallet_type: selectedWalletType,
      };

      const response = await addNewWalletAmount(newData).unwrap();

      if (!response.error) {
        setFormInput(initialInputValue);
        reset();
        setOpenColapse(false);

        toast.success(`"${formInput.code}" has been added!`, {
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

  const handleChangePrice = (e) => {
    const { name, value } = e.target;

    // Remove characters other than digits (0-9)
    const numericValue = value.replace(/[^0-9]/g, '');
    // Format the price as desired, for example: "Rp 10,000"
    const formattedPrice = `Rp ${numericValue
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

    setFormInput((prevData) => ({
      ...prevData,
      [name]: formattedPrice,
    }));
  };

  const handleCancel = () => {
    setFormInput(initialInputValue);
    setOpenColapse(false);
  };

  // Removing required error when input is filled.
  useEffect(() => {
    const fieldsToCheck = ['amount', 'price'];

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
      <div className="grid grid-flow-row-dense grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <Input
          type="text"
          label="Package Code"
          name="code"
          value={formInput.code}
          onChange={handleChange}
          disabled
        />

        <SelectInput
          data={optionsWalletType}
          label="Wallet Type"
          placeholder="Select Type"
          selectedValue={selectedWalletType}
          setSelectedValue={setSelectedWalletType}
        />

        <Input
          type="text"
          label="Top Up Amount"
          name="amount"
          value={formInput.amount}
          onChange={handleChangePrice}
          errServer={errServer?.data}
          errCodeServer="xxx026"
          errValidation={errors}
          register={register}
          placeholder="Rp 0"
        />

        <Input
          type="text"
          label="Price"
          name="price"
          value={formInput.price}
          onChange={handleChangePrice}
          errServer={errServer?.data}
          errCodeServer="xxx012"
          errValidation={errors}
          register={register}
          placeholder="Rp 0"
        />
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

export default FormAddModifyTopUp;
