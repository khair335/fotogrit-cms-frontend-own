import { Button } from '@/components';
import { Paragraph } from '../typography';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';
import { formatDate } from '@/helpers/FormatDate';

const FormDetailWalletBenefitsCode = (props) => {
  const { data, isAccess, setIsOpenPopUpDelete } = props;

  return (
    <div>
      <div className="grid grid-cols-1 gap-2 mb-6 text-sm sm:grid-cols-3 lg:grid-cols-5">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Name of Code</h5>
          <Paragraph>{data?.code}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Quota</h5>
          <Paragraph>{data?.quota}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Valid Until</h5>
          <Paragraph>{formatDate(data?.expired_date)}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Wallet Amount</h5>
          <Paragraph>{CurrencyFormat(data?.amount)}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Status</h5>
          <p
            className={`font-medium capitalize ${
              data?.status === 'active'
                ? 'text-ftgreen-600'
                : data?.status === 'not active'
                ? ' text-red-600'
                : 'text-purple-600'
            }`}
          >
            {data?.status}
          </p>
        </div>
      </div>

      <div className="flex justify-end w-full gap-4 py-2 mt-4">
        {isAccess?.can_delete && (
          <Button
            background="red"
            className={`w-32`}
            onClick={() => setIsOpenPopUpDelete(true)}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default FormDetailWalletBenefitsCode;
