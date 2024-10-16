import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Input, SelectInput } from '@/components/form-input';
import { Button, LoaderButtonAction } from '@/components';

import { useUpdateWalletAmountMutation } from '@/services/api/walletApiSlice';
import { Paragraph } from '../typography';
import { CurrencyFormat, removeCurrencyFormat } from '@/helpers/CurrencyFormat';
import { optionsWalletType } from '@/constants';

const validationSchema = yup
  .object({
    amount: yup.string().required('Topup amount is a required field'),
    price: yup.string().required('Price is a required field'),
  })
  .required();

const FormDetailModifyTopUp = (props) => {
  const { data, setIsOpenPopUpDelete, isAccess, setOpenModal } = props;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const initialInputValue = {
    id: '',
    code: '',
    amount: '',
    price: '',
  };
  const [formInput, setFormInput] = useState(initialInputValue);
  const [getDetailUpdated, setGetDetailUpdated] = useState({});
  const [selectedTypeValue, setSelectedTypeValue] = useState('');

  const [updateWalletAmount, { isLoading, error: errServer }] =
    useUpdateWalletAmountMutation();

  const handleUpdate = async () => {
    try {
      const updateData = {
        id: formInput.id,
        code: formInput.code,
        amount: removeCurrencyFormat(formInput.amount),
        price: removeCurrencyFormat(formInput.price),
        wallet_type: selectedTypeValue,
      };

      const response = await updateWalletAmount(updateData).unwrap();

      if (!response.error) {
        setGetDetailUpdated(updateData);
        setOpenModal(false);

        toast.success(`"${formInput.code}" has been updated!`, {
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

  useEffect(() => {
    if (data) {
      setFormInput((prevFormInput) => ({
        ...prevFormInput,
        id: data?.id,
        code: data?.code,
        amount: CurrencyFormat(data?.amount),
        price: CurrencyFormat(data?.price),
      }));
      setSelectedTypeValue(data?.wallet_type);
    }
  }, [data, setFormInput]);

  // Default Value for validation react hook form
  useEffect(() => {
    if (data) {
      setValue('amount', CurrencyFormat(data?.amount));
      setValue('price', CurrencyFormat(data?.price));
    }
  }, [data, setFormInput]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-2 mb-6 text-sm sm:grid-cols-3 lg:grid-cols-4">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Package Code</h5>
          <Paragraph loading={isLoading}>
            {getDetailUpdated?.code || data?.code}
          </Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Wallet Type</h5>
          <Paragraph loading={isLoading}>
            {getDetailUpdated?.wallet_type || data?.wallet_type}
          </Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Top Up Amount</h5>
          <Paragraph loading={isLoading}>
            {getDetailUpdated?.amount
              ? CurrencyFormat(getDetailUpdated?.amount)
              : CurrencyFormat(data?.amount)}
          </Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Price</h5>
          <Paragraph loading={isLoading}>
            {getDetailUpdated?.price
              ? CurrencyFormat(getDetailUpdated?.price)
              : CurrencyFormat(data?.price)}
          </Paragraph>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleUpdate)}>
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
            selectedValue={selectedTypeValue}
            setSelectedValue={setSelectedTypeValue}
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
            disabled={!isAccess?.can_edit}
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
            disabled={!isAccess?.can_edit}
            placeholder="Rp 0"
          />
        </div>

        <div className="flex justify-end w-full gap-4 py-2 my-4">
          {isAccess?.can_delete && (
            <Button
              background="red"
              className="w-32"
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
              className="w-32"
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

export default FormDetailModifyTopUp;
