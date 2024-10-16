import { useState } from 'react';

import { Breadcrumb } from '@/components';
import { Tabs, Tab, TabPanel } from '@/components/Tabs';
import { Card, CardHeader, CardBody } from '@/components/Card';
import {
  ListRequest,
  ManageRequest,
  RequestRoster,
  RequestTeamManager,
  SendInvitation,
} from '@/components/event-manage-request-invitation';

const breadcrumbItems = [
  { label: 'Event Management', url: '#' },
  { label: 'My Own Event', url: '#' },
  { label: 'Manage Request/Invitation' },
];

const EventManageRequestInvitation = () => {
  const [currentActiveTab, setCurrentActiveTab] = useState(0);

  return (
    <>
      <Card>
        <CardHeader className="">
          <Breadcrumb
            title="Manage Request / Invitation"
            items={breadcrumbItems}
          />
        </CardHeader>

        <CardBody>
          <Tabs
            defaultActiveTab={currentActiveTab}
            setDefaultActiveTab={setCurrentActiveTab}
          >
            <Tab label="List of Request">
              <TabPanel>
                <ListRequest />
              </TabPanel>
            </Tab>
            <Tab label="Send Invitation">
              <TabPanel>
                <SendInvitation />
              </TabPanel>
            </Tab>
            <Tab label="Manage Request">
              <TabPanel>
                <ManageRequest />
              </TabPanel>
            </Tab>
            <Tab label="Request as Team Manager">
              <TabPanel>
                <RequestTeamManager />
              </TabPanel>
            </Tab>
            <Tab label="Request as Roster">
              <TabPanel>
                <RequestRoster />
              </TabPanel>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </>
  );
};

export default EventManageRequestInvitation;
