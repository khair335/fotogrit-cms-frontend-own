import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Button, LoaderButtonAction } from '@/components';
import { Input, SelectInput } from '@/components/form-input';
import { useUpdateOfficialListMutation } from '@/services/api/eventsApiSlice';
import { Paragraph } from '@/components/typography';

const FormDetailOfficialList = (props) => {
  const {
    data,
    setOpenModal,
    optionsTeams,
    optionsCustomers,
    setIsOpenPopUpDelete,
    isAccess,
    optionsOfficials,
    isAdmin,
    disableOfficial,
    eventGroupID,
  } = props;

  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedOfficials, setSelectedOfficials] = useState('');
  const [getDetailUpdated, setGetDetailUpdated] = useState({});

  const initialInputValue = {
    id: '',
    officialCode: '',
    eventGroupID: '',
    teamID: '',
    customerID: '',
  };
  const [formInput, setFormInput] = useState(initialInputValue);

  const [updateOfficialList, { isLoading, error: errServer }] =
    useUpdateOfficialListMutation();

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      let updateData = {
        id: formInput.id,
        event_group_id: data?.event_group_id,
        team_id: selectedTeam,
      };

      if (
        data?.user !== 'N/A' ||
        selectedCustomer !== 'd03a050e4841eb38d61da409dc82b35b'
      ) {
        updateData.customer_id = selectedCustomer;
      }

      if (selectedOfficials) {
        updateData.officials = [selectedOfficials];
      }

      const response = await updateOfficialList(updateData).unwrap();

      if (!response.error) {
        setOpenModal(false);
        const matchedTeam = optionsTeams?.find(
          (item) => item.value === selectedTeam
        );
        const matchedCustomer = optionsCustomers?.find(
          (item) => item.value === selectedCustomer
        );
        setGetDetailUpdated({
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
        officialCode: data?.code,
        eventGroupID: data?.event_code,
      }));
      setSelectedTeam(data?.team_id);
      setSelectedCustomer(data?.user_id);

      if (data?.officials) {
        const matchedOptions = optionsOfficials?.filter((option) =>
          data?.officials?.find((official) => official?.id === option?.value)
        );

        if (matchedOptions?.length > 0) {
          setSelectedOfficials(matchedOptions[0].value);
        }
      }
    }
  }, [data, setFormInput]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const isEditDisabled =
    !isAccess?.can_edit || !isAdmin ? disableOfficial : false;
  const isDeleteDisabled =
    isAccess?.can_delete && eventGroupID && (isAdmin || !disableOfficial);

  return (
    <div className="w-full ">
      <div className="grid grid-cols-1 gap-2 mb-6 text-sm sm:grid-cols-3 lg:grid-cols-5">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Official ID</h5>
          <Paragraph loading={isLoading}>{data?.code || '-'}</Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Event Group</h5>
          <Paragraph loading={isLoading}>{data?.event_code || '-'}</Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Team</h5>
          <Paragraph loading={isLoading}>
            {getDetailUpdated?.team || data?.team || '-'}
          </Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Officials</h5>
          <Paragraph loading={isLoading}>
            {data?.officials
              ? data?.officials
                  ?.map((official) => official.official_name)
                  .join(', ')
              : '-'}
          </Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">User</h5>
          <Paragraph loading={isLoading}>
            {getDetailUpdated?.customer || data?.user || '-'}
          </Paragraph>
        </div>
      </div>

      <form onSubmit={handleUpdate}>
        <div className="grid grid-flow-row-dense grid-cols-1 gap-2 sm:grid-cols-3 gap-y-2">
          <Input
            type="text"
            label="Official ID"
            name="officialCode"
            value={formInput.officialCode}
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

          <SelectInput
            name="officials"
            data={optionsOfficials}
            label="Officials"
            placeholder="Select Officials"
            selectedValue={selectedOfficials}
            setSelectedValue={setSelectedOfficials}
          />

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
              className={`w-32 `}
              disabled={isLoading ? true : false}
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
              disabled={isLoading ? true : false}
            >
              {isLoading ? <LoaderButtonAction /> : 'Save'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormDetailOfficialList;
