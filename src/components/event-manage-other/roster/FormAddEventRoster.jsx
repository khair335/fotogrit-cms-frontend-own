import React, { useState } from 'react';
import { Button } from '@/components';
import {
  Input,
  RadioInput,
  SelectInput,
  TextArea,
} from '@/components/form-input';

const FormAddEventRoster = (props) => {
  const { setOpenColapse } = props;

  const initialInputValue = {
    rosterId: '',
    userId: '',
    email: '',
    jerseyNumber: '',
  };

  const [formInput, setFormInput] = useState(initialInputValue);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setFormInput(initialInputValue);

    setOpenColapse(false);
  };
  return (
    <form>
      <div className="grid grid-flow-row-dense grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2">
        <div className="flex flex-col gap-0.5">
          <Input
            type="text"
            label="Roster ID"
            name="rosterID"
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-0.5">
          <Input
            type="text"
            label="User ID"
            name="userID"
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-0.5">
          <Input
            type="text"
            label="Email"
            name="email"
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-0.5">
          <Input
            type="text"
            label="Jersey Number"
            name="jerseyNumber"
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex justify-end w-full gap-4 py-2 mt-4">
        <Button background="red" className="w-40" onClick={handleCancel}>
          Cancel
        </Button>

        <Button
          type="submit"
          background="black"
          className="w-45 px-5 text-xs sm:text-sm"
        >
          Invite User to Roster
        </Button>
      </div>
    </form>
  );
};

export default FormAddEventRoster;
