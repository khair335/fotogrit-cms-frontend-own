import React from 'react';
import { Paragraph } from '@/components/typography';
import { Button } from '@/components';

const FormDetailChangeWallet = (props) => {
  const { data, setOpenModal } = props;
  return (
    <>
      <div className="grid grid-cols-1 gap-4 mb-6 text-sm sm:grid-cols-3 lg:grid-cols-4">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Date / Time</h5>
          <Paragraph>{data?.date || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">User ID - Name</h5>
          <Paragraph>{data?.input_code || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Amount Before</h5>
          <Paragraph>{data?.amount || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Amount After</h5>
          <Paragraph>{data?.amount || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Reduce from Wallet</h5>
          <Paragraph>{data?.source_payment || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Reason</h5>
          <Paragraph>{data?.status || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Approval Status</h5>
          <Paragraph>{data?.status || '-'}</Paragraph>
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

export default FormDetailChangeWallet;
