import React from 'react';

import { Button } from '@/components';
import {
  Input,
  RadioInput,
  SelectInput,
  TextArea,
} from '@/components/form-input';
import { Paragraph } from '@/components/typography';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';

const FormDetailMyEventList = (props) => {
  const { data } = props;

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
          <h5 className="font-bold">Status</h5>
          <div className="text-gray-600 font-medium">
            <p
              className={`${
                data?.status == 'Waiting for Finalization'
                  ? 'text-ftbrown'
                  : data?.status == 'On Going'
                  ? 'text-ftgreen-600'
                  : 'text-black'
              } font-bold italic`}
            >
              {data?.status}
            </p>
          </div>
        </div>
      </div>

      <form>
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          <div className="flex flex-col gap-3 md:flex-row md:basis-3/4">
            <div className="flex flex-col gap-0.5 w-full">
              <SelectInput
                name="userId"
                label="User ID"
                placeholder="Select user"
              />
            </div>

            <div className="flex flex-col gap-0.5 w-full">
              <Input
                type="text"
                label="Email"
                name="email"
                // onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Button type="submit" background="black" className="w-28 sm:w-32">
              Invite
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default FormDetailMyEventList;
