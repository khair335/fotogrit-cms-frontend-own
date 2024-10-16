import React, { useEffect, useState } from 'react';
import { Input } from '@/components/form-input';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';

import { Button } from '@/components';

const topupAmounts = [
  {
    id: 'TA-1',
    value: 5000,
  },
  {
    id: 'TA-2',
    value: 10000,
  },
  {
    id: 'TA-3',
    value: 15000,
  },
  {
    id: 'TA-4',
    value: 25000,
  },
  {
    id: 'TA-5',
    value: 50000,
  },
  {
    id: 'TA-6',
    value: 100000,
  },
];

const FormAddTopup = () => {
  const [formInput, setFormInput] = useState({
    amount: 0,
    code: '',
  });
  const [selectedAmount, setSelectedAmount] = useState(null);

  const handleAmountClick = (value) => {
    setSelectedAmount(value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setSelectedAmount(null);
  };

  useEffect(() => {
    if (selectedAmount) {
      setFormInput((prevData) => ({
        ...prevData,
        amount: selectedAmount,
      }));
    }
  }, [selectedAmount]);

  return (
    <form>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Input
            type="number"
            label="Top Up Amount"
            name="amount"
            value={formInput.amount}
            onChange={handleChange}
            // errServer={errServer?.data}
            // errCodeServer="xxx029"
            // errValidation={errors}
            // register={register}
          />
          <Input
            type="text"
            label="Input Code"
            name="code"
            value={formInput.code}
            onChange={handleChange}
            // errServer={errServer?.data}
            // errCodeServer="xxx029"
            // errValidation={errors}
            // register={register}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {topupAmounts?.map((item) => (
            <div
              key={item?.id}
              className={`rounded-md p-4 text-center flex items-center justify-center cursor-pointer ${
                item?.value === selectedAmount
                  ? 'bg-black text-white'
                  : 'bg-[#C8C8C8]'
              }`}
              onClick={() => handleAmountClick(item.value)}
            >
              <span>{CurrencyFormat(item?.value)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end w-full gap-4 py-2 mt-2">
        <Button
          background="red"
          className="w-40"
          // onClick={handleCancel}
          // disabled={isLoading ? true : false}
        >
          {/* {isLoading ? <LoaderButtonAction /> : 'Cancel'} */}
          Cancel
        </Button>
        <Button
          type="submit"
          background="black"
          className="w-40"
          // disabled={isLoading ? true : false}
        >
          {/* {isLoading ? <LoaderButtonAction /> : 'Add'} */}
          Add to Cart
        </Button>
      </div>
    </form>
  );
};

export default FormAddTopup;
