import {
  MyEventList,
  RespondNewEvent,
  BrowseEvent,
} from '@/components/event-register-other';

import { Breadcrumb } from '@/components';

import { Card, CardBody, CardHeader } from '@/components/Card';
import { Tabs, Tab, TabPanel } from '@/components/Tabs';
import { useState } from 'react';

const EventRegisterOther = () => {
  const [currentActiveTab, setCurrentActiveTab] = useState(0);

  // My Event List Page
  const [currentPageMyEventList, setCurrentPageMyEventList] = useState(1);
  const [limitPerPageMyEventList] = useState(10);
  const metaPaginationMyEventList = 5;

  // My Event List Page
  const [currentPageBrowseEvent, setCurrentPageBrowseEvent] = useState(1);
  const [limitPerPageBrowseEvent] = useState(10);
  const metaPaginationBrowseEvent = 5;

  // Dummy Data
  const myEventList = [
    {
      id: 1,
      eventGroupName: 'Cakra Sakti Last Dance',
      link: 'https://fotogrit-cms.lumoshive.net/',
      ageGroup: 'KU-14',
      eventType: 'Basketball',
      slots: '2/4',
      totalPrice: '5000000',
      location: 'Our location',
      eventDate: '27/05/2023 - 04/06/2023',
      status: 'Waiting Payment',
    },
    {
      id: 2,
      eventGroupName: 'Cakra Sakti Last Dance',
      link: 'https://fotogrit-cms.lumoshive.net/',
      ageGroup: 'KU-14',
      eventType: 'Basketball',
      slots: '2/4',
      totalPrice: '5000000',
      location: 'Our location',
      eventDate: '27/05/2023 - 04/06/2023',
      status: 'Waiting for Finalization',
    },
    {
      id: 3,
      eventGroupName: 'Cakra Sakti Last Dance',
      link: 'https://fotogrit-cms.lumoshive.net/',
      ageGroup: 'KU-14',
      eventType: 'Basketball',
      slots: '2/4',
      totalPrice: '5000000',
      location: 'Our location',
      eventDate: '27/05/2023 - 04/06/2023',
      status: 'On Going',
    },
  ];

  const respondNewEvent = [
    {
      id: 1,
      eventGroupName: 'Cakra Sakti Last Dance',
      link: 'https://fotogrit-cms.lumoshive.net/',
      ageGroup: 'KU-14',
      eventType: 'Basketball',
      slots: '2/4',
      totalPrice: '5000000',
      location: 'Our location',
      eventDate: '27/05/2023 - 04/06/2023',
      deadline: '30 May 2023',
      pic: '12345',
      singleEvent: 'No',
      clubIndividual: 'Club',
      participantFee: '2000000',
      createdBy: '12345',
      pricePerPhoto: '25000',
      pricePerMovie: '25000',
      eventLogo: '/images/logo-fotogrit.png',
      action: 'Register',
      isApproved: false,
    },
    {
      id: 2,
      eventGroupName: 'Cakra Sakti Last Dance1',
      link: 'https://fotogrit-cms.lumoshive.net/',
      ageGroup: 'KU-14',
      eventType: 'Basketball',
      slots: '2/4',
      totalPrice: '5000000',
      location: 'Our location',
      eventDate: '27/05/2023 - 04/06/2023',
      deadline: '30 May 2023',
      pic: '12345',
      singleEvent: 'No',
      clubIndividual: 'Club',
      participantFee: '2000000',
      createdBy: '12345',
      pricePerPhoto: '25000',
      pricePerMovie: '25000',
      eventLogo: '/images/logo-fotogrit.png',
      action: 'Register',
      isApproved: false,
    },
  ];

  const breadcrumbItems = [
    {
      label: 'Event Management',
      url: '/event-management/other-event/register-other',
    },
    { label: 'Other Event', url: '#' },
    { label: 'Register Other Event' },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <Breadcrumb title="Register Other Event" items={breadcrumbItems} />
        </CardHeader>

        <CardBody>
          <Tabs
            defaultActiveTab={currentActiveTab}
            setDefaultActiveTab={setCurrentActiveTab}
          >
            <Tab label="Lists of All My Events">
              <TabPanel>
                <MyEventList
                  data={myEventList}
                  currentPage={currentPageMyEventList}
                  setCurrentPage={setCurrentPageMyEventList}
                  limitPerPage={limitPerPageMyEventList}
                  metaPagination={metaPaginationMyEventList}
                />
              </TabPanel>
            </Tab>

            <Tab label="Respond to New Event Invitation">
              <TabPanel>
                <RespondNewEvent data={respondNewEvent} />
              </TabPanel>
            </Tab>

            <Tab label="Browse Available Events">
              <TabPanel>
                <BrowseEvent
                  data={respondNewEvent}
                  currentPage={currentPageBrowseEvent}
                  setCurrentPage={setCurrentPageBrowseEvent}
                  limitPerPage={limitPerPageBrowseEvent}
                  metaPagination={metaPaginationBrowseEvent}
                />
              </TabPanel>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </>
  );
};

export default EventRegisterOther;
