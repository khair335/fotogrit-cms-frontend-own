import { Button } from '@/components';
import { Paragraph } from '@/components/typography';

const FormDetailTeamManager = (props) => {
  const { data, setOpenModal } = props;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 mb-6 text-sm sm:grid-cols-3 ">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Team Manager</h5>
          <Paragraph>{data?.team_manager || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Club</h5>
          <Paragraph>{data?.club || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Event Group Name</h5>
          <Paragraph>{data?.event_group_name || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Number of Roster</h5>
          <Paragraph>{data?.number_of_roster || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">{`Summary Requirement (%)`}</h5>
          <Paragraph>{data?.summary_requirement || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Status</h5>
          <Paragraph>{data?.status || '-'}</Paragraph>
        </div>
      </div>

      <div className="flex justify-end w-full gap-4 py-2 mt-4">
        <Button
          background="red"
          className={`w-32`}
          onClick={() => setOpenModal(false)}
        >
          Close
        </Button>
      </div>
    </>
  );
};

export default FormDetailTeamManager;
