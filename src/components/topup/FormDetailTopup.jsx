import { Paragraph } from '@/components/typography';
import { Button } from '@/components';

const FormDetailTopup = (props) => {
  const { data, setOpenModal } = props;
  return (
    <>
      <div className="grid grid-cols-1 gap-4 mb-6 text-sm sm:grid-cols-3 lg:grid-cols-5">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Date / Time</h5>
          <Paragraph>{data?.date || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Input Code (Yes/No)</h5>
          <Paragraph>{data?.input_code || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Amount</h5>
          <Paragraph>{data?.amount || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Source of Payment</h5>
          <Paragraph>{data?.source_payment || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Status</h5>
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

export default FormDetailTopup;
