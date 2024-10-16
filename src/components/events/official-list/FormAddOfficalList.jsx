import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import { SelectInput } from '@/components/form-input';
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
    filterSelectedOfficialTeam,
  } = props;

  const dispatch = useDispatch();
  const isRequiredGroupID = useSelector(getIsRequiredGroupID);

  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedOfficials, setSelectedOfficials] = useState('');

  // Validation error states
  const [customerError, setCustomerError] = useState('');
  const [officialsError, setOfficialsError] = useState('');

  const selectedTeamData = optionsTeams.find(
    (item) => item.value === filterSelectedOfficialTeam
  );

  const [addNewOfficialList, { isLoading, error: errServer }] =
    useAddNewOfficialListMutation();

  const eventGroupCode = eventGroupData?.find(
    (item) => item.id === eventGroupID
  );

  const handleOnSubmit = async () => {
    let isValid = true;

    // Validate User (Customer)
    if (!selectedCustomer) {
      setCustomerError('User is required');
      isValid = false;
    } else {
      setCustomerError('');
    }

    // Validate Officials
    if (!selectedOfficials) {
      setOfficialsError('Officials Role is required');
      isValid = false;
    } else {
      setOfficialsError('');
    }

    if (!isValid) return; // Prevent submission if there are validation errors

    try {
      let newData = {
        event_group_id: eventGroupID,
        team_id: selectedTeamData?.value,
        customer_id: selectedCustomer,
        officials: [selectedOfficials],
      };

      const response = await addNewOfficialList(newData).unwrap();

      if (!response.error) {
        setSelectedTeam('');
        setSelectedCustomer('');
        setIsOpenNewData(false);

        toast.success('Data has been added!', {
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

  const handleCancel = () => {
    setSelectedTeam('');
    setSelectedCustomer('');
    setIsOpenNewData(false);
  };

  return (
    <tr>
      <td className="px-6 py-4 text-left text-gray-500">
        {eventGroupCode?.code} - {eventGroupCode?.name}
      </td>
      <td className="px-6 py-4 text-left text-gray-500">
        {selectedTeamData?.label}
      </td>
      <td className="px-6 py-4 text-left text-gray-500">
        {officialCode}
      </td>

      {/* Select Official Role */}
      <td className="px-6 py-4 text-left text-gray-500">
        <SelectInput
          name="officials"
          data={optionsOfficials}
          label=""
          placeholder="Select Officials"
          selectedValue={selectedOfficials}
          setSelectedValue={setSelectedOfficials}
        />
        {officialsError && (
          <p className="text-[10px] text-red-600 animate-pulse mt-1">
            {officialsError}
          </p>
        )}
      </td>

      {/* Select User (Customer) */}
      <td className="px-6 py-4 text-left text-gray-500">
        <SelectInput
          name="customerID"
          data={optionsCustomers}
          placeholder="Select User"
          label=""
          selectedValue={selectedCustomer}
          setSelectedValue={setSelectedCustomer}
          errServer={errServer?.data}
          errCodeServer="x08004"
        />
        {customerError && (
          <p className="text-[10px] text-red-600 animate-pulse mt-1">
            {customerError}
          </p>
        )}
      </td>

      {/* Save and Cancel buttons */}
      <td className="text-left px-6 py-4 text-gray-500 flex gap-2 justify-center">
        <Button
          background="red"
          disabled={isLoading}
          onClick={handleCancel}
        >
          {isLoading ? <LoaderButtonAction /> : 'Cancel'}
        </Button>
        <Button
          background="black"
          onClick={handleOnSubmit}
          disabled={isLoading}
        >
          {isLoading ? <LoaderButtonAction /> : 'Save'}
        </Button>
      </td>
    </tr>
  );
};

export default FormAddOfficialList;
