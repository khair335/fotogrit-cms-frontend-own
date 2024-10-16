import React, { useState } from 'react';
import { Button } from '@/components';
import { UploadImage, TextArea } from '@/components/form-input';
import { ManageDonationHeader } from '@/components/donation-manage-my-donation';

const OutcomesOfDonation = (props) => {
  const { data } = props;

  const [selectedFirstImage, setSelectedFirstImage] = useState(null);
  const [selectedSecondImage, setSelectedSecondImage] = useState(null);
  const [selectedThirdImage, setSelectedThirdImage] = useState(null);
  const [errorImg, setErrorImg] = useState(null);

  const initialInputValue = {
    firstImage: '',
    secondImage: '',
    thirdImage: '',
    description: '',
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

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 pb-5 border-b-2 border-ftbrown">
        <ManageDonationHeader data={data[0]} />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex flex-col p-3 shadow-md sm:w-[60%] ">
            <h1 className="text-lg font-bold">Picture of Donation Usage</h1>

            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              <div className="flex flex-col justify-between gap-1 sm:flex-row">
                <div className="md:w-[30%] w-full">
                  <UploadImage
                    name="firstImage"
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
                    name="secondImage"
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
                    name="thirdImage"
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

              <div>
                <Button type="submit" background="brown">
                  Upload Photos
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 p-3 shadow-xl rounded-md sm:w-2/5">
            <h1 className="text-xl font-bold">Result of Event</h1>

            <div className="flex flex-wrap gap-16 sm:gap-12 lg:gap-3">
              <div>
                <h1 className="font-medium text-lg italic">Club</h1>

                <div className="flex flex-wrap gap-2 items-center h-20">
                  <img
                    src="/images/logo-fotogrit.png"
                    alt="Club Logo"
                    className="w-20"
                  />
                  <p>Bogor Raya Club</p>
                </div>
              </div>

              <div>
                <h1 className="font-medium text-lg italic">Win - Lose</h1>

                <div className="flex items-center h-20">
                  <p>10 - 0</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-col gap-2 sm:w-[60%]">
            <h1 className="text-xl font-bold">Description</h1>
            <TextArea
              placeholder="Input Description"
              name="description"
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutcomesOfDonation;
