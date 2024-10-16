import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Button, LoaderButtonAction } from '@/components';
import { Input, MultiSelectCustom, SelectInput } from '@/components/form-input';
import { useUpdateRosterListMutation } from '@/services/api/eventsApiSlice';
import { toast } from 'react-toastify';
import { Paragraph } from '@/components/typography';
import { MdVerified } from 'react-icons/md';

const validationSchema = yup
  .object({
    jerseyNumber: yup
      .number()
      .typeError('Jersey is must be a number')
      .required('Jersey is a required field')
      .nullable(),
  })
  .required();

const FormDetailRosterList = (props) => {
  const {
    data,
    setOpenModal,
    optionsTeams,
    optionsCustomers,
    setIsOpenPopUpDelete,
    isAccess,
    isAdmin,
    disableRoster,
    eventGroupID,
  } = props;

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [getDetailUpdated, setGetDetailUpdated] = useState({});
  const [errorMessageJersey, setErrorMessageJersey] = useState('');

  const initialInputValue = {
    id: '',
    rosterCode: '',
    eventGroupID: '',
    teamID: '',
    jerseyNumber: 0,
    customerID: '',
  };
  const [formInput, setFormInput] = useState(initialInputValue);

  const [updateRosterList, { isLoading, error: errServer }] =
    useUpdateRosterListMutation();

  const handleUpdate = async () => {
    if (errorMessageJersey) {
      toast.error(`Failed: Jersey Number ${errorMessageJersey}`, {
        position: 'top-right',
        theme: 'light',
      });

      return;
    }

    try {
      let updateData = {
        id: formInput.id,
        event_group_id: data?.event_group_id,
        team_id: selectedTeam,
        jersey: formInput.jerseyNumber,
      };

      if (
        data?.user !== 'N/A' ||
        selectedCustomer !== 'd03a050e4841eb38d61da409dc82b35b'
      ) {
        updateData.customer_id = selectedCustomer;
      }

      const response = await updateRosterList(updateData).unwrap();

      if (!response.error) {
        setOpenModal(false);
        const matchedTeam = optionsTeams?.find(
          (item) => item.value === selectedTeam
        );
        const matchedCustomer = optionsCustomers?.find(
          (item) => item.value === selectedCustomer
        );
        setGetDetailUpdated({
          jerseyNumber: formInput.jerseyNumber,
          team: matchedTeam?.label,
          customer: matchedCustomer?.label,
        });

        toast.success(`Data has been updated!`, {
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

  useEffect(() => {
    if (data) {
      setFormInput((prevFormInput) => ({
        ...prevFormInput,
        id: data?.id,
        rosterCode: data?.code,
        eventGroupID: data?.event_code,
        jerseyNumber: data?.jersey_number,
      }));
      setSelectedTeam(data?.team_id);
      setSelectedCustomer(data?.user_id);
    }
  }, [data, setFormInput]);

  // Removing required error when input is filled.
  useEffect(() => {
    const fieldsToCheck = ['jerseyNumber'];

    fieldsToCheck.forEach((field) => {
      if (errors[field] && formInput[field] !== '') {
        clearErrors(field);
      }
    });
  }, [formInput, clearErrors, errors]);

  // Default Value for validation react hook form
  useEffect(() => {
    if (data) {
      setValue('jerseyNumber', data?.jersey_number);
    }
  }, [data, setFormInput]);

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

  const isEditDisabled =
    !isAccess?.can_edit || !isAdmin ? disableRoster : false;
  const isDeleteDisabled =
    isAccess?.can_delete && eventGroupID && (isAdmin || !disableRoster);

  return (
    <div className="w-full ">
      <div className="grid grid-cols-1 gap-2 mb-6 text-sm sm:grid-cols-3 lg:grid-cols-5">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Roster ID</h5>
          <Paragraph loading={isLoading}>{data?.code || '-'}</Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Group Code</h5>
          <Paragraph loading={isLoading}>{data?.event_code || '-'}</Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Team</h5>
          <Paragraph loading={isLoading}>
            {getDetailUpdated?.team || data?.team || '-'}
          </Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Jersey</h5>
          <Paragraph loading={isLoading}>
            {getDetailUpdated?.jerseyNumber || data?.jersey_number || '-'}
          </Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">User</h5>
          <Paragraph loading={isLoading}>
            {getDetailUpdated?.customer || data?.user || '-'}
          </Paragraph>
        </div>
        {/* <div className="flex flex-col gap-2 capitalize">
          <h5 className="font-bold">Status</h5>
          {data?.doc_verified === 'verified' ? (
            <span className="flex items-center gap-0.5 bg-ftgreen-600 text-white py-1 px-2.5 font-medium rounded-full max-w-min text-sm">
              <MdVerified className="text-lg" /> {data?.doc_verified || '-'}
            </span>
          ) : (
            <span className="text-ftbrown font-medium">
              {data?.doc_verified || '-'}
            </span>
          )}
        </div> */}
      </div>

      <form onSubmit={handleSubmit(handleUpdate)}>
        <div className="grid grid-flow-row-dense grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-2">
          <Input
            type="text"
            label="Roster ID"
            name="rosterCode"
            value={formInput.rosterCode}
            onChange={handleChange}
            disabled
          />

          <Input
            type="text"
            label="Group Code"
            name="groupCode"
            value={formInput.eventGroupID}
            onChange={handleChange}
            errCodeServer="x01000"
            errServer={errServer?.data}
            disabled
          />

          <SelectInput
            name="team"
            data={optionsTeams}
            placeholder="Select Team"
            label="Team"
            selectedValue={selectedTeam}
            setSelectedValue={setSelectedTeam}
            errServer={errServer?.data}
            errCodeServer="x08003"
            disabled={isEditDisabled}
          />

          <div className="w-full">
            <Input
              type="text"
              label="Jersey Number"
              name="jerseyNumber"
              value={formInput.jerseyNumber}
              onChange={handleChangeJerseyNumber}
              disabled={isEditDisabled}
              errValidation={errors}
              register={register}
            />
            {errorMessageJersey && (
              <p className="text-[10px] text-red-600 animate-pulse">
                {errorMessageJersey}
              </p>
            )}
          </div>

          <SelectInput
            name="customerID"
            data={optionsCustomers}
            placeholder="Select User"
            label="User"
            selectedValue={selectedCustomer}
            setSelectedValue={setSelectedCustomer}
            errServer={errServer?.data}
            errCodeServer="x08004"
            disabled={!isAccess?.can_edit}
          />
        </div>

        <div className="flex justify-end w-full gap-4 py-2 mt-4">
          {isDeleteDisabled && (
            <Button
              background="red"
              className="w-32"
              disabled={isLoading}
              onClick={() => setIsOpenPopUpDelete(true)}
            >
              {isLoading ? <LoaderButtonAction /> : 'Delete'}
            </Button>
          )}
          {isAccess?.can_edit && (
            <Button
              type="submit"
              background="black"
              className={`w-32 `}
              disabled={isLoading}
            >
              {isLoading ? <LoaderButtonAction /> : 'Save'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormDetailRosterList;
