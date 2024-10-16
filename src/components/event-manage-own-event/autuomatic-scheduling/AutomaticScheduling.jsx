import { useState } from 'react';

import { Button, Modal } from '@/components';
import { DatePickerCustom, Input, RadioInput } from '@/components/form-input';
import useDebounce from '@/hooks/useDebounce';
import { useGetTeamMasterQuery } from '@/services/api/teamMasterApiSlice';
import TableAutomaticScheduling from './TableAutomaticScheduling';
import FormAutomaticScheduling from './FormAutomaticSheduling';
import FormAddManualScheduling from './FormAddManualScheduling';

const AutomaticScheduling = () => {
  const initialInputValue = {
    locationCompetition: '',
    dateCompetition: '',
    locationCompetition2: '',
    dateCompetition2: '',

    locationConstraint: '',
    dateConstraint: '',
    locationConstraint2: '',
    dateConstraint2: '',

    eventNameFixEvent: '',
    dateFixEvent: '',
    locationFixEvent: '',

    durationPerMatch: '',
    restBetweenMatch: '',
    ofClubsPoolAge: '',
  };
  const [formInput, setFormInput] = useState(initialInputValue);
  const [checkedRoundRobin, setCheckedRoundRobin] = useState(true);
  const [checkedDoubleRoundRobin, setCheckedDoubleRoundRobin] = useState(false);

  const [openModalManualScheduling, setOpenModalManualScheduling] =
    useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [getDetailData, setGetDetailData] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(10);
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const {
    data: dataListRequest,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetTeamMasterQuery({
    city: '',
    searchTerm: debouncedSearchValue,
    page: currentPage,
    limit: limitPerPage,
  });

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

  const handleChangeRoundRobin = () => {
    setCheckedRoundRobin(true);
    setCheckedDoubleRoundRobin(false);
  };

  const handleChangeDoubleRoundRobin = () => {
    setCheckedDoubleRoundRobin(true);
    setCheckedRoundRobin(false);
  };

  return (
    <>
      <section className="border-b-2 border-ftbrown pb-3 mb-4">
        <div className="flex sm:flex-row flex-col items-center justify-between mb-2">
          <h3 className="font-medium text-lg ">Automatic Scheduling v1.0</h3>

          <div className="flex items-center gap-2">
            <Button
              background="brown"
              onClick={() => setOpenModalManualScheduling(true)}
            >
              Manual Scheduling
            </Button>
            <Button background="black">Run Scheduling</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <div className="border-b pb-2 pr-0 sm:pb-0 sm:border-r sm:border-b-0 border-ftbrown sm:pr-2 flex flex-col gap-2">
            <h3 className="font-medium text-lg">Add All Competition Time</h3>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="text"
                label="Location"
                name="locationCompetition"
                value={formInput.locationCompetition}
                onChange={handleChange}
              />

              <DatePickerCustom
                label="From / To"
                name="dateCompetition"
                value={formInput.dateCompetition}
                onChange={(date) => handleDateChange('dateCompetition', date)}
                placeholder="Select Date"
                withPortal
                showMonthDropdown
                showYearDropdown
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="text"
                label="Location"
                name="locationCompetition2"
                value={formInput.locationCompetition2}
                onChange={handleChange}
              />

              <DatePickerCustom
                label="From / To"
                name="dateCompetition2"
                value={formInput.dateCompetition2}
                onChange={(date) => handleDateChange('dateCompetition2', date)}
                placeholder="Select Date"
                withPortal
                showMonthDropdown
                showYearDropdown
              />
            </div>
          </div>

          <div className="border-b pb-2 pr-0 sm:pb-0 lg:border-r sm:border-b-0 border-ftbrown lg:pr-2 flex flex-col gap-2">
            <h3 className="font-medium text-lg">Add All Time Constraint</h3>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="text"
                label="Location"
                name="locationConstraint"
                value={formInput.locationConstraint}
                onChange={handleChange}
              />

              <DatePickerCustom
                label="From / To"
                name="dateConstraint"
                value={formInput.dateConstraint}
                onChange={(date) => handleDateChange('dateConstraint', date)}
                placeholder="Select Date"
                withPortal
                showMonthDropdown
                showYearDropdown
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Input
                type="text"
                label="Location"
                name="locationConstraint2"
                value={formInput.locationConstraint2}
                onChange={handleChange}
              />

              <DatePickerCustom
                label="From / To"
                name="dateConstraint2"
                value={formInput.dateConstraint2}
                onChange={(date) => handleDateChange('dateConstraint2', date)}
                placeholder="Select Date"
                withPortal
                showMonthDropdown
                showYearDropdown
              />
            </div>
          </div>

          <div className="border-b pb-2 pr-0 sm:pb-0 sm:border-r sm:border-b-0 border-ftbrown sm:pr-2 flex flex-col gap-2">
            <h3 className="font-medium text-lg">Add Fix Event</h3>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="text"
                label="Event Name"
                name="eventNameFixEvent"
                value={formInput.eventNameFixEvent}
                onChange={handleChange}
              />

              <DatePickerCustom
                label="From / To"
                name="dateFixEvent"
                value={formInput.dateFixEvent}
                onChange={(date) => handleDateChange('dateFixEvent', date)}
                placeholder="Select Date"
                withPortal
                showMonthDropdown
                showYearDropdown
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Input
                type="text"
                label="Location"
                name="locationConstraint2"
                value={formInput.locationConstraint2}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 ">
            <div className="grid grid-cols-2 gap-2 sm:mt-9">
              <Input
                type="text"
                label="Duration per Match"
                name="durationPerMatch"
                value={formInput.durationPerMatch}
                onChange={handleChange}
              />
              <Input
                type="text"
                label="Rest Between Match"
                name="restBetweenMatch"
                value={formInput.restBetweenMatch}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-2">
                <RadioInput
                  label="Single Round Robin"
                  name="eventGroupExist"
                  id="eventGroupExist"
                  value="radio1"
                  checked={checkedRoundRobin}
                  onChange={handleChangeRoundRobin}
                  labelStyle="text-sm"
                />

                <RadioInput
                  label="Double Round Robin"
                  name="newSingleEvent"
                  id="newSingleEvent"
                  value="radio2"
                  checked={checkedDoubleRoundRobin}
                  onChange={handleChangeDoubleRoundRobin}
                  labelStyle="text-sm"
                />
              </div>
              <Input
                type="text"
                label="# of Clubs / Pool / Age Group"
                name="ofClubsPoolAge"
                value={formInput.ofClubsPoolAge}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex sm:flex-row flex-col items-center justify-between mb-2">
          <h3 className="font-medium text-lg ">Result Automatic Scheduling</h3>

          <div className="flex items-center gap-2">
            <Button background="brown">Edit Scheduling</Button>
            <Button background="black">Accept Scheduling</Button>
          </div>
        </div>

        <TableAutomaticScheduling
          openModal={openModal}
          setOpenModal={setOpenModal}
          setGetData={setGetDetailData}
          data={dataListRequest}
          isLoading={isLoading}
          isSuccess={isSuccess}
          isError={isError}
          error={error}
          limitPerPage={limitPerPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />

        {/* MODAL DETAIL */}
        <Modal
          title="Detail Automatic Scheduling"
          openModal={openModal}
          setOpenModal={setOpenModal}
        >
          <FormAutomaticScheduling
            data={getDetailData}
            setOpenModal={setOpenModal}
          />
        </Modal>
        {/* END MODAL DETAIL */}

        {/* MODAL Manual Scheduling */}
        <Modal
          title="Manual Scheduling"
          openModal={openModalManualScheduling}
          setOpenModal={setOpenModalManualScheduling}
        >
          <FormAddManualScheduling />
        </Modal>
        {/* END MODAL Manual Scheduling */}
      </section>
    </>
  );
};

export default AutomaticScheduling;
