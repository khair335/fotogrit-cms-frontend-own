import { useEffect, useState } from 'react';

import Button from '@/components/Button';
import { Input, MultiSelect } from '@/components/form-input';
import { toast } from 'react-toastify';
import { useUpdateTeamListMutation } from '@/services/api/eventsApiSlice';
import { LoaderButtonAction } from '@/components';
import { Paragraph } from '@/components/typography';

const FormDetailTeamList = (props) => {
  const { data, eventGroupID, optionsTeams, isAccess, setOpenModal } = props;

  const [getDetailUpdated, setGetDetailUpdated] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [formInput, setFormInput] = useState({
    id: '',
    code: '',
    teams: [],
  });

  const [updateTeamList, { isLoading }] = useUpdateTeamListMutation();

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const modifiedOptions = selectedOptions?.map((option) => option?.value);

      const updateData = {
        event_group_id: formInput.id,
        teams: modifiedOptions,
      };

      const response = await updateTeamList(updateData).unwrap();

      if (!response.error) {
        setOpenModal(false);

        setGetDetailUpdated({
          id: formInput.id,
          teams: selectedOptions,
          code: formInput.code,
        });

        toast.success(`Team List has been updated!`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to update team list`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const teamData = data?.teams?.map((item) => ({
    value: item?.team_id,
    label: `${item.code} ${item.name} ${
      item?.age_group ? `- ${item?.age_group}` : ''
    } ${item?.age_group_gender} ${item?.age_group_desc}`,
  }));

  useEffect(() => {
    if (data) {
      setFormInput({
        id: data?.event_group_id,
        code: data?.group_code,
      });

      if (data?.group_code !== 'SGC0001') {
        setSelectedOptions(teamData);
      }
    }
  }, [data, setFormInput, eventGroupID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <form className="text-sm " onSubmit={handleUpdate}>
      <div className="grid grid-flow-row-dense grid-cols-1 mb-4 sm:grid-cols-3 gap-x-4">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Group Code</h5>
          <p className="font-medium text-gray-600">{data?.group_code}</p>
        </div>

        <div className="flex flex-col col-span-2 gap-2">
          <h5 className="font-bold">Team Name</h5>
          <Paragraph loading={isLoading}>
            {getDetailUpdated?.teams
              ? getDetailUpdated?.teams?.map((item, i) => (
                  <span key={`updated-${item?.value}-${i}`}>
                    {item?.label},{' '}
                  </span>
                ))
              : data?.teams?.length !== 0
              ? data?.teams
                  ?.map((item, i) => (
                    <span key={`original-${i}-${item.id}`}>
                      {`${item.code} ${item.name} ${
                        item?.age_group ? ` - ${item?.age_group}` : ''
                      } ${item?.age_group_gender} ${item?.age_group_desc}`}
                    </span>
                  ))
                  .map((span) => span.props.children)
                  .join(', ')
              : '-'}
          </Paragraph>
        </div>
      </div>

      <div className="grid grid-flow-row-dense grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2">
        <Input
          type="text"
          label="Group Code"
          name="code"
          value={formInput?.code}
          onChange={handleChange}
          disabled
        />

        <div className="sm:col-span-2">
          <MultiSelect
            label="Team Name"
            placeholder="Select Team"
            options={optionsTeams}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            disabled={!isAccess?.can_edit}
          />
        </div>
      </div>

      <div className="flex justify-end w-full gap-4 py-2 mt-4">
        <Button
          type="submit"
          background="black"
          className={`w-32 ${isAccess?.can_edit ? '' : 'hidden'}`}
          disabled={isLoading ? true : false}
        >
          {isLoading ? <LoaderButtonAction /> : 'Save'}
        </Button>
      </div>
    </form>
  );
};

export default FormDetailTeamList;
