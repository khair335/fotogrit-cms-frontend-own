import { Button } from '@/components';
import { Paragraph } from '../typography';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';

const FormDetailUserBenefitsCode = (props) => {
  const { data, setOpenModal, isAccess } = props;

  return (
    <div>
      <div className="grid grid-cols-1 gap-2 mb-6 text-sm sm:grid-cols-3 lg:grid-cols-5">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Benefits ID</h5>
          <Paragraph>{data?.benefits_id || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Benefits Name</h5>
          <Paragraph>{data?.name || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">List of Benefits</h5>
          <Paragraph>{data?.name || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">User ID under Benefits</h5>
          <Paragraph>{data?.name || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Status of Benefits</h5>
          <Paragraph>{data?.name || '-'}</Paragraph>
        </div>
      </div>

      <div className="flex justify-end w-full gap-4 py-2 mt-4">
        <Button
          background="gray"
          className="w-32"
          onClick={() => setOpenModal(false)}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default FormDetailUserBenefitsCode;
