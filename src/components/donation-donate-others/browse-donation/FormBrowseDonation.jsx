import React, { useState } from 'react';
import { SelectInput, Input, TextArea } from '@/components/form-input';
import { Button } from '@/components';

const FormBrowseDonation = () => {
  const initialInputValue = {
    donationAmount: '',
    message: '',
  };
  const [formInput, setFormInput] = useState(initialInputValue);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <form>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-0.5 w-full">
            <Input
              type="text"
              label="Donation Amount"
              name="donationAmount"
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-0.5 w-full">
            <TextArea
              type="text"
              label="Message"
              name="message"
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <Button type="submit" background="black" className="w-28 sm:w-32">
            Donate
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FormBrowseDonation;
