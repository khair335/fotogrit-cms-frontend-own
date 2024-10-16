import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Button } from '@/components';

import { Paragraph } from '../typography';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';

// import { useUpdateReferralCodeMutation } from '@/services/api/referralCodeApiSlice';
import { formatDate } from '@/helpers/FormatDate';

const FormDetailApprovalWallet = (props) => {
  const { data, setOpenModal } = props;

  const initialInputValue = {
    id: '',
    code: '',
    expiredDate: '',
    amount: '',
    quota: '',
  };
  const [formInput, setFormInput] = useState(initialInputValue);

  // const [updatewalletBenefitsCode, { isLoading, error: errServer }] =
  //   useUpdateReferralCodeMutation();

  // const handleUpdate = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const updateData = {
  //       id: formInput.id,
  //       code: formInput.code,
  //       expired_date: formInput.expiredDate,
  //       amount: parseInt(formInput.amount),
  //       quota: parseInt(formInput.quota),
  //     };

  //     const response = await updatewalletBenefitsCode(updateData).unwrap();

  //     if (!response.error) {
  //       setGetDetailUpdated(updateData);

  //       toast.success(`"${formInput.code}" has been updated!`, {
  //         position: 'top-right',
  //         theme: 'light',
  //       });
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     toast.error(`Failed to update the data`, {
  //       position: 'top-right',
  //       theme: 'light',
  //     });
  //   }
  // };

  useEffect(() => {
    if (data) {
      setFormInput((prevFormInput) => ({
        ...prevFormInput,
        id: data?.id,
        code: data?.code,
        amount: data?.amount,
        price: data?.price,
      }));
    }
  }, [data, setFormInput]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-2 mb-6 text-sm sm:grid-cols-3 lg:grid-cols-5">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Name of Code</h5>
          <Paragraph>{data?.code}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Quota</h5>
          <Paragraph>{data?.quota}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Valid Until</h5>
          <Paragraph>{formatDate(data?.expired_date)}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Wallet</h5>
          <Paragraph>{CurrencyFormat(data?.amount)}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Status</h5>
          <p
            className={`font-medium ${
              data?.status === 1 ? 'text-ftgreen-600' : ' text-red-600'
            }`}
          >
            {data?.status === 1 ? 'Active' : 'Decline'}
          </p>
        </div>
      </div>

      <div className="flex justify-end w-full gap-4 py-2 mt-4">
        <Button
          background="gray"
          className="w-32"
          onClick={() => setOpenModal(false)}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default FormDetailApprovalWallet;
