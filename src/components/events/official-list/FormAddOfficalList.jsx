import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import { Input, SelectInput } from '@/components/form-input';
import { Button, LoaderButtonAction } from '@/components';
import { useAddNewOfficialListMutation } from '@/services/api/eventsApiSlice';
import {
  getIsRequiredGroupID,
  setIsRequiredFilterGroupEvent,
} from '@/services/state/eventsSlice';

const FormAddOfficialList = (props) => {
  const {
    optionsTeams,
    setIsOpenNewData,
    optionsCustomers,
    officialCode,
    eventGroupID,
    eventGroupData,
    optionsOfficials,
  } = props;

  const dispatch = useDispatch();
  const isRequiredGroupID = useSelector(getIsRequiredGroupID);

  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedOfficials, setSelectedOfficials] = useState('');
  console.log('officialCode', officialCode);
  const initialInputValue = {
    officialCode: '',
    eventGroupID: '',
    teamID: '',
    customerID: '',
  };
  const [formInput, setFormInput] = useState(initialInputValue);

  const [addNewOfficialList, { isLoading, error: errServer }] =
    useAddNewOfficialListMutation();

  const matchedEventGroupCode = eventGroupData?.find(
    (item) => item.id === eventGroupID
  );

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    try {
      let newData = {
        event_group_id: eventGroupID,
        team_id: selectedTeam,
        customer_id: selectedCustomer,
      };
      if (selectedOfficials) {
        newData.officials = [selectedOfficials];
      }

      const response = await addNewOfficialList(newData).unwrap();

      if (!response.error) {
        setSelectedTeam('');
        setSelectedCustomer('');
        setIsOpenNewData(false);

        toast.success(`Data has been added!`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed: ${err?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  // Handle the display of the required error for the event Group filter
  useEffect(() => {
    dispatch(setIsRequiredFilterGroupEvent(false));

    if (errServer?.data?.status === 'x01000') {
      dispatch(setIsRequiredFilterGroupEvent(true));
    }

    if (eventGroupID !== '') {
      dispatch(setIsRequiredFilterGroupEvent(false));
    }
  }, [errServer, eventGroupID]);

  useEffect(() => {
    if (officialCode) {
      setFormInput((prevFormInput) => ({
        ...prevFormInput,
        eventGroupID: matchedEventGroupCode?.code || '-',
        officialCode: officialCode || '',
      }));
    }
  }, [officialCode, eventGroupID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setSelectedTeam('');
    setSelectedCustomer('');
    setIsOpenNewData(false);
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <div className="grid grid-flow-row-dense grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2">
        <div className="flex flex-col gap-1">
          <Input
            type="text"
            label="Group Code"
            name="groupCode"
            value={formInput.eventGroupID}
            onChange={handleChange}
            disabled
          />
          {isRequiredGroupID && (
            <span className="text-[10px] animate-pulse text-red-600 ">
              Group Code is a required field
            </span>
          )}
        </div>

        <Input
          type="text"
          label="Official ID"
          name="officialCode"
          value={formInput.officialCode}
          onChange={handleChange}
          disabled
        />

        <div className="z-[12]">
          <SelectInput
            name="team"
            data={optionsTeams}
            placeholder="Select Team"
            label="Team"
            selectedValue={selectedTeam}
            setSelectedValue={setSelectedTeam}
            errServer={errServer?.data}
            errCodeServer="x08003"
          />
        </div>

        <div className="z-[11]">
          <SelectInput
            name="officials"
            data={optionsOfficials}
            label="Officials"
            placeholder="Select Officials"
            selectedValue={selectedOfficials}
            setSelectedValue={setSelectedOfficials}
          />
        </div>

        <div className="z-10">
          <SelectInput
            name="customerID"
            data={optionsCustomers}
            placeholder="Select User"
            label="User"
            selectedValue={selectedCustomer}
            setSelectedValue={setSelectedCustomer}
            errServer={errServer?.data}
            errCodeServer="x08004"
          />
        </div>
      </div>

      <div className="flex justify-end w-full gap-4 py-2 mt-4">
        <Button
          background="red"
          className="w-40"
          disabled={isLoading ? true : false}
          onClick={() => handleCancel()}
        >
          {isLoading ? <LoaderButtonAction /> : 'Cancel'}
        </Button>
        <Button
          type="submit"
          background="black"
          className="w-40"
          disabled={isLoading ? true : false}
        >
          {isLoading ? <LoaderButtonAction /> : 'Add'}
        </Button>
      </div>
    </form>
  );
};

export default FormAddOfficialList;
