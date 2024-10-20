import { Button } from '@/components';
import { Paragraph } from '@/components/typography';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';

const FormDetailList = (props) => {
  const { data, setOpenModal } = props;

  return (
    <>
      <div className="grid grid-cols-1 gap-2 mb-6 text-sm sm:grid-cols-3 lg:grid-cols-5">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Equipment ID</h5>
          <Paragraph>{data?.code}</Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Equipment Name</h5>
          <Paragraph>{data?.equip_name}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Categories</h5>
          <Paragraph>{data?.category || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Availability / Stocks</h5>
          <Paragraph>{`${data?.value}/${data?.stock}`}</Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Replacement Value</h5>
          <Paragraph>{CurrencyFormat(data?.deposit_amount)}</Paragraph>
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

export default FormDetailList;
