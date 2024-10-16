import { Paragraph } from '@/components/typography';
import { Button } from '@/components';

const FormDetailReportUser = (props) => {
  const { data, setOpenModal } = props;
  return (
    <>
      <div className="grid grid-cols-1 gap-4 mb-6 text-sm sm:grid-cols-3 lg:grid-cols-4">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">ID</h5>
          <Paragraph>{data?.user_code || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Join Date</h5>
          <Paragraph>{data?.join_date || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Username</h5>
          <Paragraph>{data?.username || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Full Name</h5>
          <Paragraph>{data?.full_name || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Email & Phone</h5>
          <Paragraph>{data?.email || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Total Transaction</h5>
          <Paragraph>{data?.total_transaction || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Total Sales by User</h5>
          <Paragraph>{data?.total_sales || '-'}</Paragraph>
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

export default FormDetailReportUser;
