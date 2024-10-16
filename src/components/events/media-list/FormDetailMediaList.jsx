import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';

import { Input } from '@/components/form-input';
import { Button, LoaderButtonAction } from '@/components';
import { Paragraph } from '@/components/typography';

import { CurrencyFormat, removeCurrencyFormat } from '@/helpers/CurrencyFormat';
import { useUpdateMediaListMutation } from '@/services/api/eventsApiSlice';

const FormDetailMediaList = (props) => {
  const { data, setIsOpenPopUpDelete, isAccess } = props;

  const initialInputValue = {
    id: '',
    mediaCode: '',
    eventName: '',
    price: '',
  };
  const [formInput, setFormInput] = useState(initialInputValue);
  const [getDetailUpdated, setGetDetailUpdated] = useState({});

  const [updateMediaList, { isLoading, error: errServer }] =
    useUpdateMediaListMutation();

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const updateData = {
        id: formInput.id,
        price: removeCurrencyFormat(formInput.price),
      };

      const response = await updateMediaList(updateData).unwrap();

      if (!response.error) {
        setGetDetailUpdated({
          price: formInput.price,
        });

        toast.success(`"${formInput?.eventName}" has been updated!`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to update data`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangePrice = (e) => {
    const { name, value } = e.target;

    // Remove characters other than digits (0-9)
    const numericValue = value.replace(/[^0-9]/g, '');
    // Format the price as desired, for example: "Rp 10,000"
    const formattedPrice = `Rp ${numericValue
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

    setFormInput((prevData) => ({
      ...prevData,
      [name]: formattedPrice,
    }));
  };

  useEffect(() => {
    if (data) {
      setFormInput((prevFormInput) => ({
        ...prevFormInput,
        id: data?.id,
        mediaCode: data?.code_media,
        eventName: data?.event_name,
        price: CurrencyFormat(data?.price),
      }));
    }
  }, [data, setFormInput]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3 lg:grid-cols-4 mb-7">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold ">Media Code</h5>
          <p className="font-medium text-gray-600">{data?.code_media}</p>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold ">Event Name</h5>
          <p className="font-medium text-gray-600">{data.event_name}</p>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold ">Media</h5>
          {data?.thumbnail ? (
            <div className="">
              {data?.type === 1 ? (
                <Link
                  to={data?.origin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative overflow-hidden rounded-md w-full max-h-[140px] group"
                >
                  <div className="absolute inset-0 z-20 items-center justify-center hidden rounded-md bg-black/40 group-hover:flex">
                    <div className="inline-block px-2 py-1 text-xs rounded-md bg-white/60 hover:text-blue-600">
                      <span>View Image</span>
                    </div>
                  </div>

                  <div className="w-full h-32 overflow-hidden rounded-md ">
                    <img
                      src={data?.thumbnail}
                      alt={data?.event_name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-all duration-300"
                    />
                  </div>
                </Link>
              ) : (
                <Link
                  to={data?.origin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative overflow-hidden rounded-md w-full max-h-[40px] group"
                >
                  <div className="absolute z-20 items-center justify-center hidden rounded-md top-2 right-2 bg-black/40 group-hover:flex">
                    <div className="inline-block px-2 py-1 text-xs rounded-md bg-white/60 hover:text-blue-600">
                      <FaArrowUpRightFromSquare />
                    </div>
                  </div>

                  <div className="w-full h-32 overflow-hidden rounded-md">
                    <video className="w-full h-full" controls>
                      <source src={data?.origin} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </Link>
              )}
            </div>
          ) : (
            <img
              src="/images/logo-fotogrit.png"
              alt="image placeholder"
              className="object-contain w-[98%] max-h-[100px]"
            />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold ">Price</h5>
          <Paragraph loading={isLoading}>
            {getDetailUpdated?.price
              ? getDetailUpdated?.price
              : CurrencyFormat(data?.price)}
          </Paragraph>
        </div>
      </div>

      <form onSubmit={handleUpdate}>
        <div className="grid grid-flow-row-dense grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4 gap-y-2">
          <Input
            type="text"
            label="Media Code"
            name="mediaCode"
            value={formInput.mediaCode}
            onChange={handleChange}
            disabled
          />

          <div className="sm:col-span-2">
            <Input
              type="text"
              label="Event Name"
              name="eventName"
              value={formInput.eventName}
              onChange={handleChange}
              disabled
            />
          </div>

          <Input
            type="text"
            label="Price"
            name="price"
            value={formInput.price}
            onChange={handleChangePrice}
            disabled={!isAccess?.can_edit}
          />
        </div>

        <div className="flex justify-end w-full gap-4 py-2 mt-4">
          {isAccess?.can_delete && (
            <Button
              background="red"
              className={`w-32 `}
              disabled={isLoading ? true : false}
              onClick={() => setIsOpenPopUpDelete(true)}
            >
              {isLoading ? <LoaderButtonAction /> : 'Delete'}
            </Button>
          )}

          {isAccess?.can_edit && (
            <Button
              type="submit"
              background="black"
              className={`w-32`}
              disabled={isLoading ? true : false}
            >
              {isLoading ? <LoaderButtonAction /> : 'Save'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormDetailMediaList;
