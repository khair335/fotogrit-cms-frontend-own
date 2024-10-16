import { Paragraph } from '@/components/typography';
import { Button } from '@/components';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';
import { formatDate } from '@/helpers/FormatDate';
import { statusWorkCheck } from '@/helpers/StatusWorkCheck';

const FormDetailRequestOtherService = (props) => {
  const { data, setOpenModal, isClient, isAdmin, userID } = props;

  const status = statusWorkCheck(data, isClient, isAdmin, userID);

  return (
    <div>
      <div className="grid grid-cols-1 gap-2 mb-6 text-sm capitalize sm:grid-cols-3 lg:grid-cols-5">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Photographer ID</h5>
          <Paragraph>{data?.photographer_fsp_code}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Date Time</h5>
          <Paragraph>{`${formatDate(data.date)} | ${data.time_start} - ${
            data.time_finish
          }`}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Event Group</h5>
          <Paragraph>{data?.event_group_name}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Event Name</h5>
          <Paragraph>{data?.event_name}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Service Type</h5>
          <Paragraph>{data?.service_type}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Location</h5>
          <Paragraph>{data?.location}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Total Fees</h5>
          <Paragraph>
            {data?.photographer_ssp_code === data?.photographer_fsp_code
              ? CurrencyFormat(data.total_fee_fsp)
              : CurrencyFormat(data.total_fee_ssp)}
          </Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Work Status</h5>
          <Paragraph
            className={`font-medium capitalize ${
              data?.status_work_fsp === 'waiting for fsp approval' ||
              data?.status_work_fsp === 'waiting for ssp approval'
                ? 'text-[#A17F58]'
                : data?.status_work_fsp === 'decline' ||
                  data.status_work_fsp === 'decline from ssp'
                ? 'text-red-600'
                : data?.status_work_fsp === 'visiting'
                ? 'text-[#FAB246]'
                : data?.status_work_fsp === 'media has been uploaded'
                ? 'text-[#009EBA]'
                : data?.status_work_fsp === 'complete'
                ? 'text-[#59D282]'
                : 'text-black'
            }`}
          >
            {/* {isClient
              ? data?.status_tracking
              : data?.photographer_ssp_code === data?.photographer_fsp_code
              ? data?.status_work_fsp
              : data?.status_work_ssp} */}

            {status}
          </Paragraph>
        </div>
      </div>

      <div className="flex justify-end w-full gap-4 py-2 mt-4">
        <Button
          background="red"
          className="w-32"
          onClick={() => setOpenModal(false)}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default FormDetailRequestOtherService;
