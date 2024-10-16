import React from 'react';
import { BiReset } from 'react-icons/bi';

import {
  TableBrowseDonation,
  FormBrowseDonation,
} from '@/components/donation-donate-others';
import { FilterSearch, FilterSelect } from '@/components/form-input';
import { Tooltip, Button, Modal } from '@/components';
import { useState } from 'react';

const BrowseDonation = (props) => {
  const { data, currentPage, setCurrentPage, limitPerPage, metaPagination } =
    props;

  const [openModal, setOpenModal] = useState(false);
  const [getData, setGetData] = useState('');

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-xl font-bold">Browse Donation</h1>

        <div className="flex gap-2 flex-col sm:flex-row sm:items-center sm:justify-between w-full sm:w-[60%]">
          <div className="w-full sm:w-[45%] z-20">
            <FilterSelect placeholder="Select Donation Type" />
          </div>

          <div className="w-full sm:w-[45%]">
            <FilterSearch />
          </div>

          <Tooltip text="Reset Filter" position="top">
            <Button
              background="black"
              // onClick={handleResetFilter}
              className="block w-full "
            >
              <BiReset className="mx-auto" />
            </Button>
          </Tooltip>
        </div>
      </div>

      <TableBrowseDonation
        setOpenModal={setOpenModal}
        setGetData={setGetData}
        data={data}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        limitPerPage={limitPerPage}
        metaPagination={metaPagination}
      />

      {/* MODAL */}
      <Modal
        title="Event Group Team Manager"
        openModal={openModal}
        setOpenModal={setOpenModal}
        className={`overflow-auto`}
        rounded="rounded-xl"
      >
        <FormBrowseDonation setOpenModal={setOpenModal} />
      </Modal>
      {/* END MODAL */}
    </div>
  );
};

export default BrowseDonation;
