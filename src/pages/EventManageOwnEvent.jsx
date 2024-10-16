import { useState } from 'react';

import { Breadcrumb, Tooltip, Button } from '@/components';
import { Tabs, Tab, TabPanel } from '@/components/Tabs';
import { Card, CardHeader, CardBody } from '@/components/Card';
import {
  AutomaticScheduling,
  EditManageEvent,
} from '@/components/event-manage-own-event';
import { FilterSelect } from '@/components/form-input';
import { BiReset } from 'react-icons/bi';

const breadcrumbItems = [
  { label: 'Event Management', url: '#' },
  { label: 'My Own Event', url: '#' },
  { label: 'Manage Own Event' },
];

const EventManageOwnEvent = () => {
  const [currentActiveTab, setCurrentActiveTab] = useState(0);
  const [filterSelectedEventGroup, setFilterSelectedEventGroup] = useState('');

  return (
    <>
      <Card>
        <CardHeader className="">
          <Breadcrumb title="Manage Own Event" items={breadcrumbItems} />

          <div className="flex  items-center gap-2 sm:w-[40%] mt-4 sm:mt-0">
            <div className="z-50 flex-grow relative">
              <FilterSelect
                // dataOptions={optionsEventGroup}
                placeholder="Select Event Group"
                filterSelectedValue={filterSelectedEventGroup}
                setFilterSelectedValue={setFilterSelectedEventGroup}
              />
            </div>

            <Tooltip text="Reset Filter" position="bottom">
              <Button
                background="black"
                onClick={() => setFilterSelectedEventGroup('')}
                className="block w-full "
              >
                <BiReset className="mx-auto" />
              </Button>
            </Tooltip>
          </div>
        </CardHeader>

        <CardBody>
          <Tabs
            defaultActiveTab={currentActiveTab}
            setDefaultActiveTab={setCurrentActiveTab}
          >
            <Tab label="Automatic Scheduling">
              <TabPanel>
                <AutomaticScheduling />
              </TabPanel>
            </Tab>
            <Tab label="Edit / Manage Events">
              <TabPanel>
                <EditManageEvent />
              </TabPanel>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </>
  );
};

export default EventManageOwnEvent;
