import { Button } from '@/components';
import { formatDate } from '@/helpers/FormatDate';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';

const GridItem = ({ label, value, labelStyle, valueStyle }) => (
  <div className={`grid grid-cols-2 gap-2 font-medium`}>
    <div className="text-gray-600">
      <p className={`${labelStyle}`}>{label}</p>
    </div>
    <div className="flex gap-1">
      <p>:</p>
      <p className={`${valueStyle}`}>{value}</p>
    </div>
  </div>
);

const FormDetailPaymentCart = (props) => {
  const { data, setIsOpenPopUpTerminating } = props;

  const itemType = data?.cart_type;
  const contractType = data?.contract_type;
  const isCutContract =
    data?.cut_contract === '0001-01-01T07:07:12+07:07' ||
    data?.cut_contract === '0001-01-01T00:00:00Z';
  const hasMadePayment = data?._is_paid;

  const showRemainingAssignment =
    (itemType === 3 || itemType === 4) &&
    !['per group event', 'per day', 'per event'].includes(contractType);

  const showTotalExtraEvent = showRemainingAssignment;

  const showStartContract =
    (itemType === 3 || itemType === 4) &&
    ['per week', 'per month'].includes(contractType);

  const showEndContract =
    (itemType === 3 || itemType === 4) &&
    ['per week', 'per month'].includes(contractType);

  const showBtnEndContract =
    hasMadePayment && (itemType === 3 || itemType === 4);

  const isCartTypeNotService = data?.cart_type !== 3;
  const isCompensationBasedOnEvent = [
    'per group event',
    'per day',
    'per event',
  ].includes(contractType);
  const defaultDate = data?.due_date === '0001-01-01T07:07:12+07:07';

  const formatDueDate = (date) => {
    return isCartTypeNotService || isCompensationBasedOnEvent || defaultDate
      ? '-'
      : formatDate(date);
  };

  return (
    <>
      <div className="sm:grid sm:grid-cols-2 sm:gap-4">
        <div className="flex flex-col gap-4">
          <GridItem
            label="Item"
            value={
              itemType === 1
                ? 'Media'
                : itemType === 3
                ? 'Service'
                : itemType === 4
                ? 'Service (subcontract)'
                : '-'
            }
          />

          {(itemType === 3 || itemType === 4) && (
            <GridItem label="Due Date" value={formatDueDate(data?.due_date)} />
          )}

          <GridItem label="Event Name" value={data?.event_name || '-'} />

          {itemType === 1 && (
            <GridItem label="Event Type" value={data?.event_type} />
          )}

          {itemType === 1 && (
            <div className="grid grid-cols-2 gap-2">
              <div className="">
                <p>Image</p>
              </div>
              <div className="flex gap-1">
                <p>:</p>
                <div className="w-full h-[140px] sm:h-[100px] lg:h-[160px] bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={
                      data?.thumbnail
                        ? data?.thumbnail
                        : '/images/logo-fotogrit.png'
                    }
                    alt="img"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          )}

          {(itemType === 3 || itemType === 4) && (
            <GridItem
              label="Service Name"
              value={`${data?.service_type} - ${data?.contract_type}`}
            />
          )}

          {showRemainingAssignment && (
            <GridItem
              label="Remaining Assignment"
              value={data?.remaining_assignment}
            />
          )}
        </div>

        <div className="flex flex-col gap-4 mt-4 sm:mt-0">
          {showTotalExtraEvent && (
            <GridItem
              label="Extra Variable Usage"
              value={data?.extra_assignment}
            />
          )}

          {(itemType === 3 || itemType === 4) && (
            <GridItem
              label="Fix Payment"
              value={CurrencyFormat(data?.renewal_fee)}
            />
          )}

          {showStartContract && (
            <GridItem
              label="Start Contract Date"
              value={formatDate(data?.start_contract)}
            />
          )}

          {showEndContract && (
            <GridItem
              label="End Contract Date"
              value={formatDate(data?.end_contract)}
            />
          )}

          <GridItem
            label="Active Period"
            value={`${formatDate(data?.start_date_active || '')} - ${formatDate(
              data?.end_date_active || ''
            )}`}
          />

          <GridItem
            label="Total Payment"
            value={
              itemType !== 1
                ? CurrencyFormat(data?.renewal_fee)
                : CurrencyFormat(data?.price)
            }
            labelStyle="font-bold text-black"
            valueStyle="font-bold text-ftgreen-600"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        {showBtnEndContract && isCutContract ? (
          <Button
            type="button"
            background="black"
            className="w-40"
            onClick={() => setIsOpenPopUpTerminating(true)}
          >
            End Contract
          </Button>
        ) : null}
      </div>
    </>
  );
};

export default FormDetailPaymentCart;
