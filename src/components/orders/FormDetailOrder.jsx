import { Button } from '@/components';
import { useGetDetailOrderQuery } from '@/services/api/orderApiSlice';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';
import { formatDate } from '@/helpers/FormatDate';

const FormDetailOrder = ({ data, setOpenModal }) => {
  const { data: detailOrder } = useGetDetailOrderQuery({
    id: data?.id,
  });

  const order = detailOrder?.data?.order;
  const orderItems = detailOrder?.data?.items;

  return (
    <div className="text-sm ">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-2">
          <p className="text-gray-500">Order Code</p>
          <p className="sm:col-span-2">{order?.invoice || '-'}</p>
        </div>
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-2">
          <p className="text-gray-500">Customer Name</p>
          <p className="capitalize sm:col-span-2">
            {order?.customer_name || '-'}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-2">
          <p className="text-gray-500">Order Date</p>
          <p className="sm:col-span-2">
            {order?.order_date ? formatDate(order?.order_date) : '-'}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-2">
          <p className="text-gray-500">Phone Number</p>
          <p className="sm:col-span-2">{order?.customer_phone || '-'}</p>
        </div>
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-2">
          <p className="text-gray-500">Payment Date</p>
          <p className="sm:col-span-2">
            {order?.date_purchase ? formatDate(order?.date_purchase) : '-'}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-2">
          <p className="text-gray-500">Purchase Type</p>
          <p className="capitalize sm:col-span-2">
            {order?.purchase_type || '-'}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-2">
          <p className="text-gray-500">Total Item</p>
          <p className="sm:col-span-2">{order?.total_item || '-'}</p>
        </div>
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-2">
          <p className="text-gray-500">Media Type</p>
          <p className="capitalize sm:col-span-2">
            {order?.media_type || '-.'}
          </p>
        </div>

        {orderItems?.map((item) => (
          <div
            className="grid grid-cols-1 gap-4 md:grid-cols-3 sm:gap-2"
            key={item?._id}
          >
            <div className="w-full h-[140px] sm:h-[100px] lg:h-[140px] bg-gray-100 rounded-md overflow-hidden">
              <img
                src={
                  item?.thumbnail
                    ? item?.thumbnail
                    : '/images/logo-fotogrit.png'
                }
                alt="img"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-col justify-between col-span-2">
              <h5 className="font-bold">{item?.event_name}</h5>
              <div className="mt-3 sm:mt-0">
                <div className="grid grid-cols-3 gap-2">
                  <p className="text-gray-500">Quantity</p>
                  <p className="col-span-2">{item?.quantity || '-'}</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <p className="text-gray-500">price</p>
                  {item?.price ? CurrencyFormat(item?.price) : '-'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="w-[50%] flex flex-col gap-4 mt-12">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 ">
          <p className="text-gray-500">Total Price</p>
          <p className="sm:col-span-2">
            {order?.total_price ? CurrencyFormat(order?.total_price) : '-'}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <p className="text-gray-500">Total Discount</p>
          <p className="sm:col-span-2">
            {order?.total_discount
              ? CurrencyFormat(order?.total_discount)
              : CurrencyFormat(0)}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <p className="font-bold text-gray-500">Total Payment</p>
          <p className="font-bold sm:col-span-2">
            {order?.total_payment ? CurrencyFormat(order?.total_payment) : '-'}
          </p>
        </div>
      </div>

      <div className="flex justify-center w-full gap-4 py-2 mt-4">
        <Button
          type="submit"
          background="black"
          className="w-52"
          onClick={() => setOpenModal(false)}
        >
          Done
        </Button>
      </div>
    </div>
  );
};

export default FormDetailOrder;
