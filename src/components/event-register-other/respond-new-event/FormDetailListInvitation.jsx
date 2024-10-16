import React, { useEffect, useState } from 'react';
import { Paragraph } from '@/components/typography';
import { Input, SelectInput } from '@/components/form-input';
import { Button } from '@/components';
import { Link } from 'react-router-dom';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';

const FormDetailListInvitation = (props) => {
  const { data } = props;

  const [isEventLogoChanged, setEventLogoChanged] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorImg, setErrorImg] = useState(null);

  const initialInputValue = {
    userId: '',
    email: '',
  };

  const [formInput, setFormInput] = useState(initialInputValue);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // useEffect(() => {
  //   if (data) {
  //     setFormInput({

  //     });
  //   }
  // }, [data, setFormInput]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.type.startsWith('image/')) {
        setErrorImg(null);
        setSelectedImage(file);
        setFormInput((prevState) => ({
          ...prevState,
          eventLogo: file,
        }));
      } else {
        setErrorImg('Invalid file type. Please select an image.');
        setSelectedImage(null);
      }

      setEventLogoChanged(true);
    }
  };
  return (
    <>
      <div className="grid grid-cols-1 gap-4 mb-6 text-sm sm:grid-cols-3 lg:grid-cols-8">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Event Group Name</h5>
          <div className="text-gray-600 font-medium">
            <p>{data?.eventGroupName}</p>
            <Link to={data?.link}>
              <p className="text-ftblue underline text-xs">{data?.link}</p>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Age Group</h5>
          <Paragraph>{data?.ageGroup}</Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Event Type</h5>
          <Paragraph>{data?.eventType}</Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Slots</h5>
          <Paragraph>{data?.slots}</Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Total Price</h5>
          <Paragraph>{CurrencyFormat(data?.totalPrice)}</Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Location</h5>
          <Paragraph>{data?.location}</Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Event Date</h5>
          <Paragraph>{data?.eventDate}</Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">PIC</h5>
          <Paragraph>{data?.pic}</Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Single Event</h5>
          <Paragraph
            className={`${
              data?.singleEvent == 'No' ? 'text-ftred' : 'text-ftgreen-600'
            }`}
          >
            {data?.singleEvent}
          </Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Club/Individual</h5>
          <Paragraph>{data?.clubIndividual}</Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Participant Fee</h5>
          <Paragraph>{CurrencyFormat(data?.participantFee)}</Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Created By</h5>
          <Paragraph>{data?.createdBy}</Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Price Per Photo</h5>
          <Paragraph>{CurrencyFormat(data?.pricePerPhoto)}</Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Price Per Movie</h5>
          <Paragraph>{CurrencyFormat(data?.pricePerMovie)}</Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Event Logo</h5>
          <Paragraph>
            <img
              src={data?.eventLogo}
              alt="image"
              className="object-contain w-[98%] max-h-[100px]"
            />
          </Paragraph>
        </div>
      </div>

      <form>
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          <div className="flex flex-col gap-3 md:flex-row md:basis-3/4">
            <div className="flex flex-col gap-0.5 w-full">
              <SelectInput
                name="userId"
                label="User ID"
                placeholder="Select user"
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-0.5 w-full">
              <Input
                type="text"
                label="Email"
                name="email"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Button type="submit" background="black" className="w-28 sm:w-32">
              Invite
            </Button>
          </div>
        </div>
      </form>

      <div className="flex justify-end mt-5">
        <Button background="black" className="w-28">
          Share
        </Button>
      </div>
    </>
  );
};

export default FormDetailListInvitation;
