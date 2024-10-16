import React from 'react';
import { TableListMyDonation } from '@/components/donation-donate-others';

const ListMyDonation = (props) => {
  const { data, currentPage, setCurrentPage, limitPerPage, metaPagination } =
    props;

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-xl font-bold">List of Donation</h1>

      <TableListMyDonation
        data={data}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        limitPerPage={limitPerPage}
        metaPagination={metaPagination}
      />
    </div>
  );
};

export default ListMyDonation;
