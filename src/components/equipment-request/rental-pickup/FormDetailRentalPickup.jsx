import { useState } from 'react';

import { Button } from '@/components';
import { Checkbox } from '@/components/form-input';
import { Paragraph } from '@/components/typography';

const FormDetailRentalPickup = (props) => {
  const { data, setOpenModal } = props;

  const [checkIDCard, setCheckIDCard] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 gap-2 mb-6 text-sm sm:grid-cols-3 lg:grid-cols-4">
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
          <h5 className="font-bold">Date / Time</h5>
          <Paragraph>{data?.date || '-'}</Paragraph>
        </div>
      </div>

      <div>
        <h5 className="mb-2 text-sm font-bold">Rent Status</h5>

        <div className="grid grid-cols-1 gap-2 mb-6 text-sm sm:grid-cols-3 ">
          <div className="flex flex-col items-center justify-center w-full gap-2">
            <div className="p-2 px-4 text-xs text-center text-white border-2 rounded-full bg-ftgreen-200 border-ftgreen-400">
              <p>Borrower has received Equipment</p>
            </div>
            <div className="p-3 px-5 text-center text-white bg-black rounded-xl">
              <p>I have given Equipments to Borrowers</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center w-full gap-2">
            <div className="p-2 px-4 text-xs text-center text-white border-2 rounded-full bg-ftgreen-200 border-ftgreen-400">
              <p>Borrower has received Equipment</p>
            </div>
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
            <div className="p-3 px-5 text-center text-white bg-black rounded-xl">
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

export default FormDetailRentalPickup;
