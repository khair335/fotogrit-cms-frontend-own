import React from 'react';

import { Button } from '@/components';
import { Paragraph } from '@/components/typography';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';

const FormDetailBrowseEvent = (props) => {
  const { data, setOpenModal } = props;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 mb-6 text-sm sm:grid-cols-3 lg:grid-cols-8">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Event Group Name</h5>
          <Paragraph>{data?.eventGroupName}</Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Age Group</h5>
          <Paragraph>{data?.ageGroup}</Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Event Type</h5>
          <Paragraph>{data?.eventType}</Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Slots</h5>
          <Paragraph>{data?.slots}</Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Total Price</h5>
          <Paragraph>{CurrencyFormat(data?.totalPrice)}</Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Location</h5>
          <Paragraph>{data?.location}</Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Event Date</h5>
          <Paragraph>{data?.eventDate}</Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Deadline</h5>
          <Paragraph className="!text-ftbrown !font-bold italic">
            {data?.deadline}
          </Paragraph>
        </div>
      </div>

      <div className="flex justify-end w-full gap-4 py-2 mt-4">
        <Button
          background="red"
          className="w-32"
          onClick={() => setOpenModal(false)}
        >
          Close
        </Button>
      </div>
    </>
  );
};

export default FormDetailBrowseEvent;
