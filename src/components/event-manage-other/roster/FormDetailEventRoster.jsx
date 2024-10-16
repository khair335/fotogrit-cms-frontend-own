import React from 'react';

import { toast } from 'react-toastify';

import { Paragraph } from '@/components/typography';
import { Input, SelectInput } from '@/components/form-input';

import { Button } from '@/components';
import { useState, useEffect } from 'react';

const FormDetailEventRoster = (props) => {
  const { data, setIsOpenPopUpDelete } = props;

  const initialInputValue = {
    rosterId: '',
    role: '',
    positionOfPlayers: '',
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

  useEffect(() => {
    if (data) {
      setFormInput({
        rosterId: data?.rosterId,
        role: data?.role,
        positionOfPlayers: data?.positionOfPlayers,
        jerseyNumber: data?.jerseyNumber,
      });
    }
  }, [data, setFormInput]);

  const handleUpdate = (e) => {
    e.preventDefault();
    toast.success(`Event Group ${formInput.rosterId} has been updated!`, {
      position: 'top-right',
      theme: 'light',
    });
  };
  return (
    <>
      <div className="grid grid-cols-1 gap-4 mb-6 text-sm sm:grid-cols-3 lg:grid-cols-6">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Roster ID</h5>
          <Paragraph>{data?.rosterId}</Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">User ID</h5>
          <Paragraph>{data?.userId}</Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Role</h5>
          <Paragraph>{data?.role}</Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Position of Players</h5>
          <Paragraph>{data?.positionOfPlayers}</Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Jersey Number</h5>
          <Paragraph>{data?.jerseyNumber}</Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Status</h5>
          <Paragraph>{data?.status}</Paragraph>
        </div>
      </div>

      <form onSubmit={handleUpdate}>
        <div className="grid grid-flow-row-dense grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2">
          <div className="flex flex-col gap-0.5">
            <Input
              type="text"
              label="Role"
              name="role"
              value={formInput.role}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-0.5">
            <Input
              type="text"
              label="Position"
              name="position"
              value={formInput.positionOfPlayers}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-0.5">
            <Input
              type="text"
              label="Jersey/Number"
              name="jerseyNumber"
              value={formInput.jerseyNumber}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex justify-end w-full gap-4 py-2 mt-4">
          <Button
            background="red"
            className="w-32"
            onClick={() => setIsOpenPopUpDelete(true)}
          >
            Delete
          </Button>
          <Button type="submit" background="black" className="w-32">
            Save
          </Button>
        </div>
      </form>
    </>
  );
};

export default FormDetailEventRoster;
