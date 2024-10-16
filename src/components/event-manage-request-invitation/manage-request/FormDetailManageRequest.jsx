import { Button } from '@/components';
import { Paragraph } from '@/components/typography';

const FormDetailManageRequest = (props) => {
  const { data, setOpenModal } = props;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 mb-6 text-sm sm:grid-cols-3 ">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Date of Request / Invitation</h5>
          <Paragraph>{data?.date || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Team Code & Name</h5>
          <Paragraph>{`${data?.code} - ${data?.name}` || '-'}</Paragraph>
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

export default FormDetailManageRequest;
