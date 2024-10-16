import React from 'react';
import { Paragraph } from '@/components/typography';
import { Button } from '@/components';
import { formatDateTime } from '@/helpers/FormatDateTime';

const FormDetailEventChecking = (props) => {
  const { data, setOpenModal } = props;

  return (
    <div>
      <div className="grid grid-cols-1 gap-2 mb-6 text-sm sm:grid-cols-3 lg:grid-cols-7 capitalize">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Date Time</h5>
          <Paragraph>{formatDateTime(data?.date)}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Event Group</h5>
          <Paragraph>{data?.event_group_name}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Event Type</h5>
          <Paragraph>{data?.event_type}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Event Name</h5>
          <Paragraph>{data?.event_name}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Service Type</h5>
          <Paragraph>
            {data?._service_id === 1 ? 'Team Pose' : 'Match'}
          </Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Location</h5>
          <Paragraph>{data?.location}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Status</h5>
          <Paragraph
            className={`font-medium capitalize ${
              data?.status === 'already input' ? 'text-[#8F815E] ' : ''
            }`}
          >
            {data?.status || 'Waiting'}
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
    </div>
  );
};

export default FormDetailEventChecking;
