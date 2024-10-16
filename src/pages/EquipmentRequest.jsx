import { useState } from 'react';

import { Breadcrumb } from '@/components';
import { Card, CardBody, CardHeader } from '@/components/Card';
import { Tabs, Tab, TabPanel } from '@/components/Tabs';
import {
  CompleteReturn,
  List,
  RentalPickup,
} from '@/components/equipment-request';

const breadcrumbItems = [
  { label: 'Equipment Management', url: '#' },
  { label: 'Request Equipment' },
];

const EquipmentRequest = () => {
  const [currentActiveTab, setCurrentActiveTab] = useState(0);

  return (
    <>
      <Card>
        <CardHeader className="relative ">
          <Breadcrumb title="Request Equipment" items={breadcrumbItems} />
        </CardHeader>

        <CardBody>
          <Tabs
            defaultActiveTab={currentActiveTab}
            setDefaultActiveTab={setCurrentActiveTab}
          >
            <Tab label="Request Equipment List">
              <TabPanel>
                <List />
              </TabPanel>
            </Tab>
            <Tab label="Rental / Pickup">
              <TabPanel>
                <RentalPickup />
              </TabPanel>
            </Tab>
            <Tab label="Complete / Return">
              <TabPanel>
                <CompleteReturn />
              </TabPanel>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </>
  );
};

export default EquipmentRequest;
