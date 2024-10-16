import React from 'react';
import { Button } from '@/components';

const ManageDonationHeader = (props) => {
  const { data } = props;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
        <div
          className={`flex justify-center items-center text-xs w-1/3 h-fit px-6 py-1 ${
            data?.status == 'Active'
              ? 'bg-ftgreen-200'
              : data?.status == 'Deadactive'
              ? 'bg-ftred'
              : ''
          } rounded-xl sm:text-sm sm:w-1/5 md:w-[15%]`}
        >
          <h1 className="text-white">{data?.status}</h1>
        </div>

        <div className="font-medium italic text-sm sm:text-right">
          <p>Ending in {data?.endDate}</p>
          <p>(20 days)</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex flex-col">
          <p className="font-bold text-sm md:text-base">
            Donation - {data?.donationType}
          </p>
          <h1 className="font-bold text-xl md:text-3xl">{data?.eventName}</h1>
          <p className="font-medium">KU {data?.ku}</p>
        </div>

        <div>
          <Button background="red" className="px-5">
            End Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManageDonationHeader;
