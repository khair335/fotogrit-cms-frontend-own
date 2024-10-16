import { useState } from 'react';

import { Button } from '@/components';
import { Checkbox } from '@/components/form-input';
import { Paragraph } from '@/components/typography';

const FormDetailCompleteReturn = (props) => {
  const { data, setOpenModal } = props;

  const [checkIDCard, setCheckIDCard] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 gap-2 mb-6 text-sm sm:grid-cols-3 lg:grid-cols-5">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Rent ID</h5>
          <Paragraph>{data?.code}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Event Group</h5>
          <Paragraph>{data?.event_group || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Equipment Name</h5>
          <Paragraph>{data?.equip_name || '-'}</Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Pickup Date</h5>
          <Paragraph>{data?.pickup_date || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Return Date</h5>
          <Paragraph>{data?.return_date || '-'}</Paragraph>
        </div>
      </div>

      <div>
        <h5 className="mb-2 text-sm font-bold">Rent Status</h5>

        <div className="grid grid-cols-1 gap-2 mb-6 text-sm sm:grid-cols-3 lg:grid-cols-4 ">
          <div className="flex flex-col items-center justify-center w-full gap-2">
            <div className="p-2 px-4 text-xs text-center text-white border-2 rounded-full bg-ftgreen-200 border-ftgreen-400">
              <p>Borrower has received Equipment</p>
            </div>
            <div className="p-3 px-5 text-center text-white bg-black rounded-xl">
              <p>I have given Equipments to Borrowers</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between w-full gap-2">
            <div className="p-2 px-6 text-xs text-center text-white border-2 rounded-full bg-ftgreen-200 border-ftgreen-400">
              <p>Paid</p>
            </div>

            <div className="flex flex-col gap-1 text-center">
              <p className="font-medium ">Additional Amount Due</p>
              <p className="font-medium text-gray-500">Rp 0-,</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-end w-full gap-2">
            <p className="font-medium text-center">Rental Requirement</p>

            <div className="flex items-center gap-4">
              <Checkbox
                name="ktp"
                checked={checkIDCard}
                onChange={() => setCheckIDCard(!checkIDCard)}
              />

              <span
                className={`text-sm ${
                  checkIDCard ? 'text-black font-bold' : 'text-gray-500'
                } `}
              >
                ID (KTP / SIM)
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center w-full gap-2">
            <div className="p-2 px-4 text-xs text-center text-white border-2 rounded-full bg-ftgreen-200 border-ftgreen-400">
              <p>Borrower has received Equipment</p>
            </div>
            <div className="p-3 text-white bg-black px-5text-center rounded-xl">
              <p>I have given Equipments to Borrowers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end w-full gap-4 py-2 mt-4">
        <Button
          background="red"
          className={`w-32`}
          onClick={() => setOpenModal(false)}
        >
          Close
        </Button>
      </div>
    </>
  );
};

export default FormDetailCompleteReturn;
