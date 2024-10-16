import React from 'react';
import { Button, Progress } from '@/components';
import { FilterSearch } from '@/components/form-input';
import {
  ManageDonationHeader,
  TableDonations,
} from '@/components/donation-manage-my-donation';
import { useState } from 'react';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';

const Donations = (props) => {
  const { data } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(3);

  // Dummy Data
  const donations = [
    {
      id: 1,
      date: '23 May 2023',
      userId: 'Ben Gutama',
      donationAmount: 25000,
      message: 'Good Luck',
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 pb-5 border-b-2 border-ftbrown">
        <ManageDonationHeader data={data[0]} />

        <div className="flex flex-col gap-1 sm:w-3/4 md:w-1/2">
          <Progress value="30" background="brown" hideValue />

          <p className="text-ftbrown font-medium italic text-base">
            Terkumpul {CurrencyFormat(data[0].collectedAmount)}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex pb-3 sm:justify-end">
          <div className="flex w-full sm:w-[40%] lg:w-[30%]">
            <FilterSearch />
          </div>
        </div>

        <TableDonations
          data={donations}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          limitPerPage={limitPerPage}
        />
      </div>
    </div>
  );
};

export default Donations;
