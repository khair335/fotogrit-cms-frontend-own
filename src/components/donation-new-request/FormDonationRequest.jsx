import React from 'react';
import { Button } from '@/components';
import {
  Checkbox,
  Input,
  SelectInput,
  TextArea,
  UploadImage,
  DatePickerCustom,
} from '@/components/form-input';
import { useState } from 'react';

const FormDonationRequest = (props) => {
  const { setOpenColapse } = props;

  const [selectedFirstImage, setSelectedFirstImage] = useState(null);
  const [selectedSecondImage, setSelectedSecondImage] = useState(null);
  const [selectedThirdImage, setSelectedThirdImage] = useState(null);
  const [errorImg, setErrorImg] = useState(null);
  const [responsibleCheck, setResponsibleCheck] = useState(false);

  const initialInputValue = {
    donationType: '',
    totalAmountNeed: '',
    descriptionUsageOfDonor: '',
    firstImage: '',
    secondImage: '',
    thirdImage: '',
    lastDateofFundsCollection: '',
    responsibleCheck: responsibleCheck,
  };

  const [formInput, setFormInput] = useState(initialInputValue);

  const handleFirstImageChange = (e) => {
    handleImageChange(e, setSelectedFirstImage);
  };

  const handleSecondImageChange = (e) => {
    handleImageChange(e, setSelectedSecondImage);
  };

  const handleThirdImageChange = (e) => {
    handleImageChange(e, setSelectedThirdImage);
  };

  const handleImageChange = (e, setImage) => {
    const file = e.target.files[0];

    if (file) {
      if (file.type.startsWith('image/')) {
        setErrorImg(null);
        setImage(file);
        // setFormEventGroup((prevState) => ({
        //   ...prevState,
        //   eventLogo: file,
        // }));
      } else {
        setErrorImg('Invalid file type. Please select an image.');
        setImage(null);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormInput((prevState) => ({
      ...prevState,
      lastDateofFundsCollection: date,
    }));
  };

  const handleCancel = () => {
    setOpenColapse(false);
  };
  return (
    <form>
      <div className="flex flex-col gap-x-4 gap-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <div className="flex flex-col gap-3 w-full sm:w-2/5 sm:gap-6 lg:w-1/2">
            <div className="flex flex-col gap-0.5 z-30">
              <SelectInput
                name="donationType"
                label="Donation Type"
                placeholder="Select Donation Type"
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <Input
                type="text"
                label="Total Amount Need"
                name="totalAmountNeed"
                placeholder="Input Amount"
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-0.5">
              <TextArea
                label="Description Usage of Donor"
                name="clubName"
                onChange={handleChange}
                placeholder="Input Description"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:w-[60%] lg:w-1/2">
            <div className="flex flex-col gap-1">
              <p className="font-bold">
                Add Photo of Usage
                <span className="font-normal italic">
                  (e.g. shoes to buy, shirts to buy)
                </span>
              </p>

              <div className="flex flex-col justify-between gap-3 md:flex-row">
                <div className="md:w-[30%] w-full">
                  <UploadImage
                    name="imageFirst"
                    onChange={handleFirstImageChange}
                    selectedImage={selectedFirstImage}
                    setSelectedImage={setSelectedFirstImage}
                    height="h-28"
                    errorImg={errorImg}
                    setErrorImg={setErrorImg}
                    //   errServer={errServer?.data}
                    //   errCodeServer="xxx025"
                  />
                </div>
                <div className="md:w-[30%] w-full">
                  <UploadImage
                    name="imageSecond"
                    onChange={handleSecondImageChange}
                    selectedImage={selectedSecondImage}
                    setSelectedImage={setSelectedSecondImage}
                    height="h-28"
                    errorImg={errorImg}
                    setErrorImg={setErrorImg}
                    //   errServer={errServer?.data}
                    //   errCodeServer="xxx025"
                  />
                </div>
                <div className="md:w-[30%] w-full">
                  <UploadImage
                    name="imageThird"
                    onChange={handleThirdImageChange}
                    selectedImage={selectedThirdImage}
                    setSelectedImage={setSelectedThirdImage}
                    height="h-28"
                    errorImg={errorImg}
                    setErrorImg={setErrorImg}
                    //   errServer={errServer?.data}
                    //   errCodeServer="xxx025"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-0.5">
              <DatePickerCustom
                label="Last Date of Funds Collection"
                name="lastDateOfFundsCollection"
                value={formInput.lastDateofFundsCollection}
                onChange={handleDateChange}
                placeholder="Select Date/Time"
                // errServer={errServer?.data}
                // errCodeServer="x10007"
                withPortal
                showMonthDropdown
                showYearDropdown
              />
            </div>

            <div className="flex flex-row items-center gap-3 mt-1 hover:opacity-70 cursor-pointer">
              <Checkbox
                className="w-6 h-6"
                checked={responsibleCheck}
                onChange={() => {
                  setResponsibleCheck(!responsibleCheck);
                }}
              />

              <span
                className="text-xs font-medium italic sm:text-base"
                onClick={() => {
                  setResponsibleCheck(!responsibleCheck);
                }}
              >
                I am responsible for the use of the donation
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-medium">
            To ask for donation, the user status must be{' '}
            <span className="text-ftgreen-200 font-bold italic">
              “Verified”
            </span>
          </p>

          <div className="bg-[#F1F1F1] px-5 py-3 rounded-md border border-[#E7DED3] max-w-md">
            <ul className="list-disc list-inside font-medium break-keep">
              <li>Original ID / KTP</li>
              <li>Social Media Verification</li>
            </ul>
          </div>

          <div className="flex w-full">
            <Button background="black" className="w-48 py-3">
              Ask to be Verified
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end w-full gap-2 py-2 mt-4 sm:gap-4">
        <Button
          background="red"
          className="w-40 text-xs sm:text-sm"
          onClick={handleCancel}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          background="brown"
          className="w-52 text-xs sm:text-sm"
        >
          Create Donation Request
        </Button>
      </div>
    </form>
  );
};

export default FormDonationRequest;
