import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Input, SelectInput } from '@/components/form-input';
import { Button, LoaderButtonAction } from '@/components';
import { useAddNewRosterListMutation } from '@/services/api/eventsApiSlice';
import { useDispatch } from 'react-redux';

const validationSchema = yup
  .object({
    jerseyNumber: yup
      .number()
      .typeError('must be a number')
      .required('Jersey number is required')
      .nullable(),
    captain: yup.string().required('Captain is required'),
    position: yup.string().required('Position is required'),
    customerID: yup.string().required('User is required'),
  })
  .required();

const FormAddRosterList = (props) => {
  const {
    optionsTeams,
    setIsOpenNewData,
    optionsCustomers,
    rosterCode,
    eventGroupID,
    eventGroupData,
    filterSelectedRosterTeam,
  } = props;

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const dispatch = useDispatch();
  const selectedTeamData = optionsTeams.find(item => item.value === filterSelectedRosterTeam);
  const [selectedCaptain, setSelectedCaptain] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [errorMessageJersey, setErrorMessageJersey] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const eventCode = eventGroupData?.find((item) => item?.id === eventGroupID)?.code;
  const teamCode = optionsTeams?.find((item) => item?.value === filterSelectedRosterTeam)?.label;

  const initialInputValue = {
    rosterCode: '',
    eventGroupID: '',
    teamID: '',
    jerseyNumber: '',
    customerID: '',
  };

  const [formInput, setFormInput] = useState(initialInputValue);

  const [addNewRosterList, { isLoading, error: errServer }] = useAddNewRosterListMutation();

  const handleOnSubmit = async () => {
    // Show error if jersey number validation fails
    if (errorMessageJersey) {
      toast.error(`Failed: Jersey Number ${errorMessageJersey}`, {
        position: 'top-right',
        theme: 'light',
      });
      return;
    }

    // Prepare the form data
    let jerseyNumber = formInput.jerseyNumber.toString().padStart(2, '0');

    try {
      const newData = {
        event_group_id: eventGroupID,
        team_id: selectedTeamData?.value,
        customer_id: selectedCustomer,
        jersey: jerseyNumber,
        position: selectedPosition,
        captain: selectedCaptain,
      };

      // Send data via mutation
      const response = await addNewRosterList(newData).unwrap();

      // Handle success response
      if (!response.error) {
        reset(); // Reset form after success
        setFormInput(initialInputValue); // Clear the form input
        setSelectedCaptain('');
        setSelectedCustomer('');
        setSelectedPosition('');
        setIsOpenNewData(false); // Close the modal or form section

        toast.success('Roster has been added successfully!', {
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

  const handleChangeJerseyNumber = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^0-9]/g, '');
    const limitedValue = numericValue.slice(0, 2);

    if (limitedValue.length === 1 && limitedValue !== '0') {
      setErrorMessageJersey(`Must be 2-digit number, e.g., '0${value}'`);
    } else if (limitedValue.length > 2) {
      setErrorMessageJersey('');
    } else {
      setErrorMessageJersey('');
    }

    setFormInput((prevData) => ({
      ...prevData,
      [name]: limitedValue,
    }));
  };

  const handleCancel = () => {
    reset();
    setSelectedCaptain('');
    setSelectedCustomer('');
    setIsOpenNewData(false);
  };

  return (
    <tr>
      {/* Form fields */}
      <td className="min-w-40 max-w-40 text-left px-6 py-4 text-gray-500 ">{eventCode}</td>
      <td className="text-left px-6 py-4 text-gray-500">{teamCode}</td>
      <td className="min-w-40 max-w-40  text-left px-6 py-4 text-gray-500">{rosterCode}</td>
      <td className="min-w-40 max-w-40  text-left px-6 py-4 text-gray-500">
        <div className="w-full">
          <Input
            type="text"
            label=""
            name="jerseyNumber"
            value={formInput.jerseyNumber}
            onChange={handleChangeJerseyNumber}
            errValidation={errors}
            register={register}
            placeholder="Jersey Number"
            inputMode="numeric"
          />


        </div>
      </td>

      {/* Captain Selection */}
      <td className="min-w-40 max-w-40  text-left px-6 py-4 text-gray-500">
        <div className="z-[12]">
          <SelectInput
            name="captain"
            data={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]}
            placeholder="Captain"
            label=""
            selectedValue={selectedCaptain}
            setSelectedValue={setSelectedCaptain}
            errValidation={errors}
            register={register}
          />
          {errors.captain && (
            <p className="text-[10px] text-red-600 animate-pulse">
              {errors.captain.message}
            </p>
          )}
        </div>
      </td>

      {/* Position Selection */}
      <td className="text-left px-6 py-4 text-gray-500">
        <div className="z-[12]">
          <SelectInput
            name="position"
            data={[
              { label: 'PG', value: 'pg' },
              { label: 'SG', value: 'sg' },
              { label: 'C', value: 'c' },
              { label: 'SF', value: 'sf' },
              { label: 'PF', value: 'pf' },
            ]}
            placeholder="Position"
            label=""
            selectedValue={selectedPosition}
            setSelectedValue={setSelectedPosition}
            errValidation={errors}
            register={register}
          />
          {errors.position && (
            <p className="text-[10px] text-red-600 animate-pulse">
              {errors.position.message}
            </p>
          )}
        </div>
      </td>

      {/* User Selection */}
      <td className="min-w-48 max-w-48 text-left px-6 py-4 text-gray-500">
        <div className="z-[11]">
          <SelectInput
            name="customerID"
            data={optionsCustomers}
            placeholder="User"
            label=""
            selectedValue={selectedCustomer}
            setSelectedValue={setSelectedCustomer}
            errValidation={errors}
            register={register}
          />
          {errors.customerID && (
            <p className="text-[10px] text-red-600 animate-pulse">
              {errors.customerID.message}
            </p>
          )}
        </div>
      </td>

      {/* Save & Cancel buttons */}
      <td className="text-left px-6 py-4 text-gray-500 flex gap-2">
        <Button background="red" disabled={isLoading ? true : false} onClick={handleCancel}>
          {isLoading ? <LoaderButtonAction /> : 'Cancel'}
        </Button>
        <Button type="submit"
          background="black" onClick={handleSubmit(handleOnSubmit)}>
          {isLoading ? <LoaderButtonAction /> : 'Save'}
        </Button>
      </td>
    </tr>
  );
};

export default FormAddRosterList;
