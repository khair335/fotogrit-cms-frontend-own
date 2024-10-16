import { useEffect, useState } from 'react';
import { Paragraph } from '@/components/typography';
import { Button } from '@/components';
import { Input } from '../form-input';
import { formatDate } from '@/helpers/FormatDate';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';

const FormDetailManageServiceRequest = (props) => {
  const { data, setOpenModal } = props;

  const initialInputValue = {
    date: '',
    eventGroup: '',
    eventType: '',
    event: '',
    serviceName: '',
    status: '',
    fixedFee: '',
    variableFee: '',
    totalFees: '',
  };
  const [formInput, setFormInput] = useState(initialInputValue);

  let status = '';
  if (
    data?.status_work === 'assigned' ||
    data?.status_work === 'waiting for ssp approval'
  ) {
    status = data?.status_work;
  } else if (data?.status_work === 'decline') {
    status = data?.status_work;
  } else if (data?.status_work_scoring) {
    status =
      data?.status_work_scoring === 'NoScoreInfo'
        ? 'Waiting for event'
        : data?.status_work_scoring || '-';
  } else {
    status = data?.status_work;
  }

  useEffect(() => {
    if (data) {
      setFormInput((prevFormInput) => ({
        ...prevFormInput,
        date: data?.date
          ? `${formatDate(data?.date)} | ${data?.time_start ?? ''} - ${
              data?.time_finish ?? ''
            }`
          : '',
        eventGroup: data?.event_group_name || '',
        eventType: data?.event_type || '',
        event: data?.event_name || '',
        serviceName: data?.service_name || '',
        status: status || '',
        fixedFee: CurrencyFormat(data?.fixed_fee || 0),
        variableFee: CurrencyFormat(data?.variable_fee || 0),
        totalFees: CurrencyFormat(data?.total_fee || 0),
      }));
    }
  }, [data, setFormInput]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-2 mb-6 text-sm capitalize sm:grid-cols-3 lg:grid-cols-6">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Date / Time</h5>
          <Paragraph>
            {`${formatDate(data?.date)} | ${data?.time_start} - ${
              data?.time_finish
            }`}
          </Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Event Group</h5>
          <Paragraph>{data?.event_group_name || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Event Type</h5>
          <Paragraph>{data?.event_type}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Event Name</h5>
          <Paragraph>{data?.event_name}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Service Name</h5>
          <Paragraph>{data?.service_name || '-'}</Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Work Status</h5>
          <Paragraph>
            <span
              className={`font-medium capitalize ${
                status === 'assigned'
                  ? 'text-[#A17F58]'
                  : status === 'decline' || status === 'decline from ssp'
                  ? 'text-red-600'
                  : status === 'visiting'
                  ? 'text-[#FAB246]'
                  : status === 'media has been uploaded'
                  ? 'text-[#009EBA]'
                  : status === 'complete'
                  ? 'text-[#59D282]'
                  : ''
              }`}
            >
              {status}
            </span>
          </Paragraph>
        </div>
      </div>

      <form>
        <div className="grid grid-flow-row-dense grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              label="Date / Time"
              name="date"
              value={formInput?.date}
              disabled
              onChange={handleChange}
            />
            <Input
              type="text"
              label="Event Group"
              name="eventGroup"
              value={formInput?.eventGroup}
              disabled
              onChange={handleChange}
            />
            <Input
              type="text"
              label="Event Type"
              name="eventType"
              value={formInput?.eventType}
              disabled
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              label="Event Name"
              name="event"
              value={formInput?.event}
              disabled
              onChange={handleChange}
            />
            <Input
              type="text"
              label="Service Name"
              name="serviceName"
              value={formInput?.serviceName}
              disabled
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="relative">
              <Input
                type="text"
                label="Fixed Fee"
                name="fixedFee"
                value={formInput?.fixedFee}
                disabled
                onChange={handleChange}
              />

              <span className="absolute px-5 py-1 text-xs font-medium text-white border border-green-600 rounded-full bottom-1 right-2 bg-ftgreen-600">
                Paid
              </span>
            </div>

            <div className="relative">
              <Input
                type="text"
                label="Variable Fee"
                name="variableFee"
                value={formInput?.variableFee}
                disabled
                onChange={handleChange}
              />

              <span className="absolute px-5 py-1 text-xs font-medium text-white border border-green-600 rounded-full bottom-1 right-2 bg-ftgreen-600">
                Paid
              </span>
            </div>

            <div className="relative">
              <Input
                type="text"
                label="Total Fees"
                name="fixedFee"
                value={formInput?.totalFees}
                disabled
                onChange={handleChange}
              />

              <span className="absolute px-5 py-1 text-xs font-medium text-white border border-green-600 rounded-full bottom-1 right-2 bg-ftgreen-600">
                Paid
              </span>
            </div>
          </div>

          <div className="">
            <Input
              type="text"
              label="Work Status"
              name="status"
              value={formInput?.status}
              disabled
              onChange={handleChange}
            />
          </div>
        </div>
      </form>

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

export default FormDetailManageServiceRequest;
