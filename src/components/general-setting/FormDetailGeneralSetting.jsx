import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Button, LoaderButtonAction } from '@/components';
import { Input } from '../form-input';
import { Paragraph } from '../typography';

import { CurrencyFormat, removeCurrencyFormat } from '@/helpers/CurrencyFormat';

import { useUpdateGeneralSettingMutation } from '@/services/api/generalSettingApiSlice';

const validationSchema = yup
  .object({
    price: yup.string().required('Price price is a required field'),
  })
  .required();

const FormDetailGeneralSetting = ({ data, isAccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [formInput, setFormInput] = useState({
    id: data?.id,
    code: data?.code,
    name: data?.name,
    price: data?.price,
  });

  const [getDetail, setGetDetail] = useState({
    price: 0,
  });

  const [updateGeneralSetting, { isLoading, error: errServer }] =
    useUpdateGeneralSettingMutation();

  const handleUpdate = async () => {
    try {
      const response = await updateGeneralSetting({
        id: formInput?.id,
        price: removeCurrencyFormat(formInput?.price),
      }).unwrap();

      if (!response.error) {
        setGetDetail({
          price: formInput?.price,
        });

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
      setFormInput({
        id: data?.id,
        code: data?.code,
        name: data?.name,
        price: CurrencyFormat(data?.price),
      });
    }
  }, [data, setFormInput]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 mb-6 text-sm sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Code</h5>
          <Paragraph loading={isLoading}>{data?.code}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Price Name</h5>
          <Paragraph loading={isLoading}>{data?.name}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Price</h5>
          <Paragraph loading={isLoading}>
            {getDetail?.price ? getDetail?.price : CurrencyFormat(data?.price)}
          </Paragraph>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleUpdate)}>
        <div className="grid grid-cols-1 gap-4 mb-6 text-sm sm:grid-cols-3">
          <Input
            type="text"
            label="Code"
            name="code"
            value={formInput.code}
            onChange={handleChange}
            disabled
          />

          <Input
            type="text"
            label="Price Name"
            name="name"
            value={formInput.name}
            onChange={handleChange}
            disabled
          />

          <Input
            type="text"
            label="Price"
            name="price"
            value={formInput.price}
            onChange={handleChangePrice}
            errValidation={errors}
            register={register}
            disabled={!isAccess?.can_edit}
          />
        </div>

        <div className="flex justify-end w-full gap-4 py-2 mt-4">
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

export default FormDetailGeneralSetting;
