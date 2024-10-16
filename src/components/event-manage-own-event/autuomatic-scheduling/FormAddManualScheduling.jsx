import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Button, LoaderButtonAction } from '@/components';
import { DatePickerCustom, Input, SelectInput } from '@/components/form-input';

const FormAddManualScheduling = () => {
  const initialInputValue = {
    location: '',
  };
  const [formInput, setFormInput] = useState(initialInputValue);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedEventCategory, setSelectedEventCategory] = useState('');
  const [selectedTeamA, setSelectedTeamA] = useState('');
  const [selectedTeamB, setSelectedTeamB] = useState('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('');
  const [selectedPool, setSelectedPool] = useState('');

  const handleOnSubmit = (e) => {
    e.preventDefault();
  };

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
    <form className="w-full" onSubmit={handleOnSubmit}>
      <div className="grid grid-flow-row-dense grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2">
        <div className="z-50">
          <SelectInput
            // data={options}
            name="events"
            label="Event"
            placeholder="Select Event"
            selectedValue={selectedEvent}
            setSelectedValue={setSelectedEvent}
          />
        </div>
        <div className="z-40">
          <SelectInput
            // data={options}
            name="eventCategories"
            label="Event Category"
            placeholder="Select Event Category"
            selectedValue={selectedEventCategory}
            setSelectedValue={setSelectedEventCategory}
          />
        </div>

        <DatePickerCustom
          label="Date / Time"
          name="dateTime"
          value={formInput.dateTime}
          onChange={(date) => handleDateChange('dateTime', date)}
          placeholder="Select Date"
          withPortal
          showMonthDropdown
          showYearDropdown
        />

        <div className="z-30">
          <SelectInput
            // data={options}
            name="teamA"
            label="Team A"
            placeholder="Select Team A"
            selectedValue={selectedTeamA}
            setSelectedValue={setSelectedTeamA}
          />
        </div>

        <div className="z-20">
          <SelectInput
            name="ageGroup"
            // data={optionsAgeGroup}
            label="Age Group"
            placeholder="Select the age"
            selectedValue={selectedAgeGroup}
            setSelectedValue={setSelectedAgeGroup}
          />
        </div>

        <div className="z-10">
          <SelectInput
            name="poll"
            // data={optionsAgeGroup}
            label="Pool"
            placeholder="Select Pool"
            selectedValue={selectedPool}
            setSelectedValue={setSelectedPool}
          />
        </div>

        <Input
          type="text"
          label="Location"
          name="location"
          value={formInput.location}
          onChange={handleChange}
        />

        <div className="">
          <SelectInput
            // data={options}
            name="teamB"
            label="Team B"
            placeholder="Select Team B"
            selectedValue={selectedTeamB}
            setSelectedValue={setSelectedTeamB}
          />
        </div>
      </div>

      <div className="flex justify-end w-full gap-4 py-2 mt-4">
        {/* <Button
          background="red"
          className="w-40"
          onClick={handleCancel}
          disabled={isLoading ? true : false}
        >
          {isLoading ? <LoaderButtonAction /> : 'Cancel'}
        </Button> */}
        <Button
          type="submit"
          background="black"
          className="w-40"
          // disabled={isLoading ? true : false}
          disabled
        >
          Add Scheduling
        </Button>
      </div>
    </form>
  );
};

export default FormAddManualScheduling;
