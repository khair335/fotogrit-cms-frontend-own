import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Input } from '@/components/form-input';
import { Button, LoaderButtonAction, PopUp } from '@/components';

import { useAddNewReferralCodeMutation } from '@/services/api/referralCodeApiSlice';
import { formatDate } from '@/helpers/FormatDate';
import { CurrencyFormat, removeCurrencyFormat } from '@/helpers/CurrencyFormat';

const validationSchema = yup
  .object({
    code: yup.string().required('Name of Code is a required field'),
    expiredDate: yup
      .string()
      .required('Valid Until is a required field')
      .max(50),
    quota: yup
      .number()
      .typeError('Quota must be greater than zero')
      .required('Quota is a required field')
      .nullable(),
    amount: yup.string().required('Amount is a required field'),
  })
  .required();

const FormAddWalletBenefitsCode = () => {
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
    code: '',
    expiredDate: '',
    amount: '',
    quota: '',
  };
  const [formInput, setFormInput] = useState(initialInputValue);
  const [isOpenPopUp, setIsOpenPopUp] = useState(false);
  const [data, setData] = useState({});

  const [addNewReferralCode, { isLoading, error: errServer }] =
    useAddNewReferralCodeMutation();

  const handleOpenPopUP = () => {
    const newData = {
      code: formInput.code,
      expired_date: formInput.expiredDate,
      amount: removeCurrencyFormat(formInput.amount),
      quota: parseInt(formInput.quota),
    };

    if (newData) {
      setData(newData);
      setIsOpenPopUp(true);
    }
  };

  const handleOnSubmit = async () => {
    try {
      const response = await addNewReferralCode(data).unwrap();

      if (!response.error) {
        setFormInput(initialInputValue);
        reset();
        setIsOpenPopUp(false);

        toast.success(`"${formInput.code}" has been added!`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      setIsOpenPopUp(false);
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
    reset();
  };

  return (
    <>
      <form>
        <div className="grid grid-flow-row-dense grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <Input
            type="text"
            label="Name of Code"
            name="code"
            value={formInput.code}
            onChange={handleChange}
            errServer={errServer?.data}
            errCodeServer="x09006"
            errValidation={errors}
            register={register}
          />

          <Input
            type="number"
            label="Quota"
            name="quota"
            value={formInput.quota}
            onChange={handleChange}
            errValidation={errors}
            register={register}
          />

          <Input
            type="date"
            label="Valid Until"
            name="expiredDate"
            value={formInput.expiredDate}
            onChange={handleChange}
            errValidation={errors}
            register={register}
          />

          <Input
            type="text"
            label="Wallet Amount"
            name="amount"
            value={formInput.amount}
            onChange={handleChangePrice}
            errValidation={errors}
            register={register}
            placeholder="Rp 0"
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
            background="black"
            className="w-40"
            disabled={isLoading}
            onClick={handleSubmit(handleOpenPopUP)}
          >
            {isLoading ? <LoaderButtonAction /> : 'Ask Approval'}
          </Button>
        </div>
      </form>

      <PopUp
        setIsOpenPopUp={setIsOpenPopUp}
        isOpenPopUp={isOpenPopUp}
        title="Konfirmasi"
      >
        <h5 className="mb-4 font-bold text-left">
          Apakah anda yakin ingin menambahkan Wallet Code dengan informasi
          sebagai berikut :
        </h5>

        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-3">
            <p className="text-gray-400">Code</p>
            <p className="col-span-2">{data?.code}</p>
          </div>
          <div className="grid grid-cols-3">
            <p className="text-gray-400">Quota</p>
            <p className="col-span-2">{data?.quota}</p>
          </div>
          <div className="grid grid-cols-3">
            <p className="text-gray-400">Valid Until</p>
            <p className="col-span-2">{formatDate(data?.expired_date)}</p>
          </div>
          <div className="grid grid-cols-3">
            <p className="text-gray-400">Wallet Amount</p>
            <p className="col-span-2">{CurrencyFormat(data?.amount)}</p>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <div className="flex gap-2 mt-4">
            <Button
              background="red"
              className="w-28"
              onClick={() => setIsOpenPopUp(false)}
              disabled={isLoading}
            >
              {isLoading ? <LoaderButtonAction /> : 'Cancel'}
            </Button>
            <Button
              background="black"
              className="w-28"
              onClick={handleOnSubmit}
              disabled={isLoading}
            >
              {isLoading ? <LoaderButtonAction /> : 'Ok'}
            </Button>
          </div>
        </div>
      </PopUp>
    </>
  );
};

export default FormAddWalletBenefitsCode;
