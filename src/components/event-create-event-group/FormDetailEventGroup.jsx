import { Button } from '@/components';
import { Paragraph } from '../typography';

const FormDetailEventGroup = (props) => {
  const { data, setOpenModal } = props;

  const imageData = data?.logo_team || '/images/logo-fotogrit.png';

  return (
    <>
      <div className="grid grid-cols-1 gap-4 mb-6 text-sm sm:grid-cols-3 lg:grid-cols-5">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Logo</h5>

          <Paragraph>
            <img
              src={imageData}
              alt="image"
              className="object-contain w-[98%] max-h-[100px]"
            />
          </Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Group Code & Name</h5>
          <Paragraph>{`${data?.code} - ${data?.name}` || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">PIC Group</h5>
          <Paragraph>{data?.pic_group || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Star - End Group Date</h5>
          <Paragraph>{data?.date || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Location</h5>
          <Paragraph>{data?.location || '-'}</Paragraph>
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

export default FormDetailEventGroup;
