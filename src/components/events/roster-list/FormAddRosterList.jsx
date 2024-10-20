import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Input, SelectInput } from '@/components/form-input';
import { Button, LoaderButtonAction } from '@/components';
import { useAddNewRosterListMutation } from '@/services/api/eventsApiSlice';
import {
  getIsRequiredGroupID,
  setIsRequiredFilterGroupEvent,
} from '@/services/state/eventsSlice';
import { useDispatch, useSelector } from 'react-redux';

const validationSchema = yup
  .object({
    jerseyNumber: yup
      .number()
      .typeError('Jersey is must be a number')
      .required('Jersey is a required field')
      .nullable(),
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
  const isRequiredGroupID = useSelector(getIsRequiredGroupID);

  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [errorMessageJersey, setErrorMessageJersey] = useState('');

  const initialInputValue = {
    rosterCode: '',
    eventGroupID: '',
    teamID: '',
    jerseyNumber: '',
    customerID: '',
  };
  const [formInput, setFormInput] = useState(initialInputValue);

  const [addNewRosterList, { isLoading, error: errServer }] =
    useAddNewRosterListMutation();

  const matchedEventGroupCode = eventGroupData?.find(
    (item) => item.id === eventGroupID
  );

  const handleOnSubmit = async () => {
    if (errorMessageJersey) {
      toast.error(`Failed: Jersey Number ${errorMessageJersey}`, {
        position: 'top-right',
        theme: 'light',
      });

      return;
    }

    try {
      let newData = {
        event_group_id: eventGroupID,
        team_id: selectedTeam,
        customer_id: selectedCustomer,
        jersey: formInput.jerseyNumber,
      };

      const response = await addNewRosterList(newData).unwrap();

      if (!response.error) {
        reset();
        setFormInput((prevFormInput) => ({
          ...prevFormInput,
          jerseyNumber: '',
        }));

        setSelectedTeam('');
        setSelectedCustomer('');
        reset();
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
    if (rosterCode) {
      setFormInput((prevFormInput) => ({
        ...prevFormInput,
        eventGroupID: matchedEventGroupCode?.code || '-',
        rosterCode: rosterCode || '',
      }));
    }
  }, [rosterCode, eventGroupID]);

  // Removing required error when input is filled.
  useEffect(() => {
    const fieldsToCheck = ['jerseyNumber'];

    fieldsToCheck.forEach((field) => {
      if (errors[field] && formInput[field] !== '') {
        clearErrors(field);
      }
    });
  }, [formInput, clearErrors, errors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
    setSelectedTeam('');
    setSelectedCustomer('');
    setIsOpenNewData(false);
  };

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)}>
      <div className="grid grid-flow-row-dense grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2">
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
          label="Roster ID"
          name="rosterCode"
          value={formInput.rosterCode}
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

        <div className="w-full">
          <Input
            type="text"
            label="Jersey Number"
            name="jerseyNumber"
            value={formInput.jerseyNumber}
            onChange={handleChangeJerseyNumber}
            errValidation={errors}
            register={register}
            inputMode="numeric"
          />

          {errorMessageJersey && (
            <p className="text-[10px] text-red-600 animate-pulse">
              {errorMessageJersey}
            </p>
          )}
        </div>

        <div className="z-[11]">
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

export default FormAddRosterList;
