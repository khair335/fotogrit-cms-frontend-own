import React from 'react';
import {
  Breadcrumb,
  ButtonCollapse,
  Collapse,
  Layout,
  Modal,
  PopUpDelete,
  Button,
} from '@/components';

import { EventRoster, AdminRequirement } from '@/components/event-manage-other';

import { Card, CardBody, CardHeader } from '@/components/Card';
import { Input, FilterSelect } from '@/components/form-input';
import { Tabs, Tab, TabPanel } from '@/components/Tabs';
import { useState } from 'react';

const EventManageOther = () => {
  const [currentActiveTab, setCurrentActiveTab] = useState(0);
  const breadcrumbItems = [
    {
      label: 'Event Management',
      url: '/event-management/other-event/register-other  ',
    },
    { label: 'Other Event', url: '#' },
    { label: 'Manage Other Event' },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <Breadcrumb title="Manage Other Event" items={breadcrumbItems} />

          <div className="flex  items-center gap-2 sm:w-[40%] mt-4 sm:mt-0">
            {currentActiveTab == 1 && (
              <div className="flex sm:justify-end w-full">
                <Button background="red" className="w-full sm:w-fit sm:px-5">
                  Refund
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardBody>
          <Tabs
            defaultActiveTab={currentActiveTab}
            setDefaultActiveTab={setCurrentActiveTab}
          >
            <Tab label="Roster">
              <TabPanel>
                <EventRoster
                // data={myEventList}
                // currentPage={currentPageMyEventList}
                // setCurrentPage={setCurrentPageMyEventList}
                // limitPerPage={limitPerPageMyEventList}
                // metaPagination={metaPaginationMyEventList}
                />
              </TabPanel>
            </Tab>

            <Tab label="Admin Requirement">
              <TabPanel>
                <AdminRequirement />
              </TabPanel>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </>
  );
};

export default EventManageOther;
