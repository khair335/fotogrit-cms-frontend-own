import { useEffect, useState } from 'react';
import { Input, SelectCustom } from '@/components/form-input';

import { Button } from '@/components';

const FormAddWithdrawWallet = ({
  optionsCustomers,
  setOpenColapse,
  setPageCustomerData,
  setSearchQueryCustomerData,
}) => {
  const [formInput, setFormInput] = useState({
    userID: 0,
    withdrawAmount: '',
    bankName: '',
    bankAccountNumber: '',
  });
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

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
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="z-10">
          <SelectCustom
            data={optionsCustomers}
            label="User Id"
            selectedValue={selectedCustomer}
            setSelectedValue={setSelectedCustomer}
            placeholder="Select User ID"
            infiniteScroll
            setPageOption={setPageCustomerData}
            setSearchQueryOption={setSearchQueryCustomerData}
          />
        </div>

        <Input
          type="text"
          label="Withdraw Amount"
          name="withdrawAmount"
          value={formInput.withdrawAmount}
          onChange={handleChange}
          // errServer={errServer?.data}
          // errCodeServer="xxx029"
          // errValidation={errors}
          // register={register}
        />
        <Input
          type="text"
          label="Bank Name"
          name="bankName"
          value={formInput.bankName}
          onChange={handleChange}
          // errServer={errServer?.data}
          // errCodeServer="xxx029"
          // errValidation={errors}
          // register={register}
        />
        <Input
          type="text"
          label="Bank Account Number"
          name="bankAccountNumber"
          value={formInput.bankAccountNumber}
          onChange={handleChange}
          // errServer={errServer?.data}
          // errCodeServer="xxx029"
          // errValidation={errors}
          // register={register}
        />
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
          Reduce Wallet
        </Button>
      </div>
    </form>
  );
};

export default FormAddWithdrawWallet;
