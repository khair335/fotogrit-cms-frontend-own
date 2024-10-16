import { Button } from '@/components';
import { Checkbox, DatePickerCustom, Input } from '@/components/form-input';
import { useState } from 'react';

const FormAddNewRequirement = () => {
  const initialInputValue = {
    photos: '',
    deadlineDate: '',
  };
  const [formInput, setFormInput] = useState(initialInputValue);
  const [checkIDCard, setCheckIDCard] = useState(false);
  const [checkPhotos, setCheckPhotos] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (name, date) => {
    if (date) {
      setFormInput((prevState) => ({
        ...prevState,
        [name]: date,
      }));
    }
  };

  return (
    <form>
      <div className="flex gap-2 flex-col sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold ">
            For each roster, please provide the following
          </h5>

          <div className="flex items-center gap-4 mt-2">
            <Checkbox
              name="idCard"
              checked={checkIDCard}
              onChange={() => setCheckIDCard(!checkIDCard)}
            />

            <span
              className={`text-sm ${
                checkIDCard ? 'text-black font-medium' : 'text-gray-500'
              } `}
            >
              Scan photo of ID (KTP/ SIM/ Kartu Pelajar)
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <div className="flex items-center gap-4">
              <Checkbox
                name="photos"
                checked={checkPhotos}
                onChange={() => setCheckPhotos(!checkPhotos)}
              />

              <span
                className={`text-sm ${
                  checkPhotos ? 'text-black font-medium' : 'text-gray-500'
                } `}
              >
                Photos # of Photos :
              </span>
            </div>

            <div className="">
              <Input
                type="text"
                name="photos"
                value={formInput.photos}
                onChange={handleChange}
                disabled={!checkPhotos}
                placeholder="Enter # of Photos"
                className="w-full"
              />
            </div>
          </div>

          <div className="">
            <h5 className="font-bold ">Description of photos request :</h5>
            <p className="text-ftgreen-600 font-medium max-w-sm text-sm italic">
              3 photos facing front, 3 photos facing left, 3 photos facing
              right, Green screen for all
            </p>
          </div>
        </div>

        <div className="">
          <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-center">
            <label htmlFor="" className="font-medium">
              Deadline Date :
            </label>

            <DatePickerCustom
              name="deadlineDate"
              value={formInput.deadlineDate}
              onChange={(date) => handleDateChange('deadlineDate', date)}
              placeholder="Select Date"
              withPortal
              showMonthDropdown
              showYearDropdown
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 mt-5 sm:mt-2">
        <Button background="brown">Add Requirement</Button>
        <Button background="green">Send Requirement</Button>
      </div>
    </form>
  );
};

export default FormAddNewRequirement;
