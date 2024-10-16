import { useState } from 'react';

import { Breadcrumb } from '@/components';
import { Card, CardBody, CardHeader } from '@/components/Card';
import { Tabs, Tab, TabPanel } from '@/components/Tabs';
import {
  CompleteReturn,
  List,
  RentalPickup,
} from '@/components/equipment-manage-request';

const breadcrumbItems = [
  { label: 'Equipment Management', url: '#' },
  { label: 'Manage Rental Request' },
];

const EquipmentManageRequest = () => {
  const [currentActiveTab, setCurrentActiveTab] = useState(0);

  return (
    <>
      <Card>
        <CardHeader className="relative ">
          <Breadcrumb title="Manage Rental Request" items={breadcrumbItems} />
        </CardHeader>

        <CardBody>
          <Tabs
            defaultActiveTab={currentActiveTab}
            setDefaultActiveTab={setCurrentActiveTab}
          >
            <Tab label="Manage Rental Request List">
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

export default EquipmentManageRequest;
