import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { Input, SelectInput } from '@/components/form-input';
import { Button, LoaderButtonAction } from '@/components';

import { useAddNewReferralCodeMutation } from '@/services/api/referralCodeApiSlice';

const FormAddApprovalWallet = (props) => {
  const { optionsUsers, setPageOptionUser, setSearchQueryOptionUser } = props;

  const initialInputValue = {
    newAmount: '',
    oldAmount: '',
    reason: '',
  };
  const [formInput, setFormInput] = useState(initialInputValue);
  const [selectedUser, setSelectedUser] = useState('');

  const [addNewReferralCode, { isLoading }] = useAddNewReferralCodeMutation();

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    try {
      const newData = {
        code: formInput.code,
        expired_date: formInput.expiredDate,
        amount: parseInt(formInput.amount),
        quota: parseInt(formInput.quota),
      };

      const response = await addNewReferralCode(newData).unwrap();

      if (!response.error) {
        setFormInput(initialInputValue);
        reset();

        toast.success(`"${formInput.code}" has been added!`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to save the data`, {
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

  const handleCancel = () => {
    setFormInput(initialInputValue);
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <div className="grid grid-flow-row-dense grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <div className="z-10">
          <SelectInput
            name="userID"
            data={optionsUsers}
            placeholder="Select User"
            label="User"
            selectedValue={selectedUser}
            setSelectedValue={setSelectedUser}
            infiniteScroll
            setPageOption={setPageOptionUser}
            setSearchQueryOption={setSearchQueryOptionUser}
          />
        </div>

        <Input
          type="number"
          label="New Amount"
          name="quota"
          value={formInput.newAmount}
          onChange={handleChange}
        />

        <Input
          type="number"
          label="Before Change"
          name="amount"
          value={formInput.oldAmount}
          onChange={handleChange}
          disabled
        />

        <Input
          type="text"
          label="Reason"
          name="reason"
          value={formInput.reason}
          onChange={handleChange}
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
          // disabled={isLoading ? true : false}
          disabled
        >
          {isLoading ? <LoaderButtonAction /> : 'Ask For Approval'}
        </Button>
      </div>
    </form>
  );
};

export default FormAddApprovalWallet;
