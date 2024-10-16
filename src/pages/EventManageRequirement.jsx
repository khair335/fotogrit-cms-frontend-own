import { useState } from 'react';

import { Breadcrumb } from '@/components';
import { Tabs, Tab, TabPanel } from '@/components/Tabs';
import { Card, CardHeader, CardBody } from '@/components/Card';
import {
  CheckRequirement,
  CreateRequirement,
} from '@/components/event-manage-requirement';

const breadcrumbItems = [
  { label: 'Event Management', url: '#' },
  { label: 'My Own Event', url: '#' },
  { label: 'Manage Own Event' },
];

const EventManageRequirement = () => {
  const [currentActiveTab, setCurrentActiveTab] = useState(0);

  return (
    <>
      <Card>
        <CardHeader className="">
          <Breadcrumb title="Manage Own Event" items={breadcrumbItems} />
        </CardHeader>

        <CardBody>
          <Tabs
            defaultActiveTab={currentActiveTab}
            setDefaultActiveTab={setCurrentActiveTab}
          >
            <Tab label="Create Requirement">
              <TabPanel>
                <CreateRequirement />
              </TabPanel>
            </Tab>
            <Tab label="Check Requirement">
              <TabPanel>
                <CheckRequirement />
              </TabPanel>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </>
  );
};

export default EventManageRequirement;
