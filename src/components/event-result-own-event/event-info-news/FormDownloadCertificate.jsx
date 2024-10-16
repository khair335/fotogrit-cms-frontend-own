import React, { useState } from 'react';
import { Button } from '@/components';
import {
  Input,
  RadioInput,
  SelectInput,
  TextArea,
} from '@/components/form-input';

const FormDownloadCertificate = () => {
  const initialInputValue = {
    ageGroup: '',
    clubId: '',
    rosterId: '',
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
      <div className="grid grid-flow-row-dense grid-cols-1 items-center sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2">
        <div className="flex flex-col gap-0.5 z-30">
          <SelectInput
            name="ageGorup"
            label="Age Group"
            placeholder="Select Age Group"
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-0.5">
          <Input
            type="text"
            label="Club Id"
            name="clubId"
            value="12345"
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-0.5 z-30">
          <SelectInput
            name="rosterId"
            label="Roster Id"
            placeholder="Select Roster Id"
            onChange={handleChange}
          />
        </div>

        <div className="flex w-full gap-4 py-2 mt-4">
          <Button type="submit" background="black" className="w-40">
            Download
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FormDownloadCertificate;
