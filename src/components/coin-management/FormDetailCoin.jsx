import { Paragraph } from '../typography';
import { formatDateTime } from '@/helpers/FormatDateTime';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';

const FormDetailCoin = (props) => {
  const { data } = props;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 mb-6 text-sm sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Code</h5>
          <Paragraph>{data?.code || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Date</h5>
          <Paragraph>
            {data?.created_at ? formatDateTime(data?.created_at) : '-'}
          </Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Coin Value</h5>
          <Paragraph>{CurrencyFormat(data?.price || 0) || '-'}</Paragraph>
        </div>
      </div>
    </>
  );
};

export default FormDetailCoin;
