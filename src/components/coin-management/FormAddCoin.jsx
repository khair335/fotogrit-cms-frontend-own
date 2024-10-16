import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Input } from '@/components/form-input';
import { Button, LoaderButtonAction } from '@/components';
import { useAddNewCoinMutation } from '@/services/api/coinsManagementApiSlice';
import { removeCurrencyFormat } from '@/helpers/CurrencyFormat';

const validationSchema = yup
  .object({
    coinValue: yup.string().required('Coin is a required field').max(50),
  })
  .required();

const FormAddCoin = ({ setOpenColapse }) => {
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
    coinValue: '',
  };
  const [formInput, setFormInput] = useState(initialInputValue);

  const [addNewCoin, { isLoading, error: errServer }] = useAddNewCoinMutation();

  // Removing required error when input is filled.
  useEffect(() => {
    const fieldsToCheck = ['coinValue'];

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
        price: removeCurrencyFormat(formInput.coinValue),
      };

      const response = await addNewCoin(newData).unwrap();

      if (!response.error) {
        setFormInput(initialInputValue);
        reset();
        setOpenColapse(false);

        toast.success(`Coin has been added!`, {
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

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)}>
      <div className="grid grid-flow-row-dense grid-cols-1 gap-4 sm:grid-cols-2 gap-y-2">
        <Input
          type="text"
          label="Coin Value"
          name="coinValue"
          value={formInput.coinValue}
          onChange={handleChangePrice}
          errServer={errServer?.data}
          // errCodeServer="x06062" // already exist
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

export default FormAddCoin;
