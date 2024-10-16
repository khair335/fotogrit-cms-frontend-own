import React, { useState } from 'react';
import { Button } from '@/components';
import { Input } from '@/components/form-input';
import { ManageDonationHeader } from '@/components/donation-manage-my-donation';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';

const WithdrawDonation = (props) => {
  const { data } = props;

  const initialInputValue = {
    nameOfAccount: '',
    bankName: '',
    accountNumber: '',
    bankLocation: '',
  };
  const [formInput, setFormInput] = useState(initialInputValue);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 pb-5 border-b-2 border-ftbrown">
        <ManageDonationHeader data={data[0]} />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 ">
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <h1 className="text-base font-bold sm:text-lg">Total Donasi</h1>
            <p className="text-lg text-ftbrown font-bold sm:text-xl">
              {CurrencyFormat(250000000)}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between">
            <h1 className="text-sm font-bold sm:text-base">
              Remaining Balance
            </h1>
            <p className="text-base font-bold sm:text-lg">
              {CurrencyFormat(100000000)}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-xl font-bold">New Transfer</h1>
          <form>
            <div className="grid grid-flow-row-dense grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex flex-col gap-0.5">
                <Input
                  type="text"
                  label="Name of Account"
                  name="nameOfAccount"
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-0.5">
                <Input
                  type="text"
                  label="Bank Name"
                  name="bankName"
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-0.5">
                <Input
                  type="text"
                  label="Account Number"
                  name="accountNumber"
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-0.5">
                <Input
                  type="text"
                  label="Bank Location"
                  name="bankLocation"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-end items-center sm:justify-between w-full gap-4 py-2 mt-4">
              <p className="text-sm italic">Transfer will take 3-4 days</p>
              <Button type="submit" background="brown" className="w-40">
                Request Transfer
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WithdrawDonation;
