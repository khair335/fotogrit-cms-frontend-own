import { Button } from '@/components';
import { Paragraph } from '@/components/typography';

const FormDetailCheckRequirement = (props) => {
  const { data, setOpenModal } = props;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 mb-6 text-sm sm:grid-cols-3 lg:grid-cols-4">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Requirement ID</h5>
          <Paragraph>{data?.data || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Event Group ID / Name</h5>
          <Paragraph>{data?.data || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Age Groups</h5>
          <Paragraph>{data?.data || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Requirements</h5>
          <Paragraph>{data?.data || '-'}</Paragraph>
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

export default FormDetailCheckRequirement;
