import { useState } from 'react';
import { Breadcrumb } from '@/components';

import {
  ListMyDonation,
  BrowseDonation,
} from '@/components/donation-donate-others';
import { Card, CardBody } from '@/components/Card';
import { Tabs, Tab, TabPanel } from '@/components/Tabs';

const DonationDonateOthers = () => {
  const [currentActiveTab, setCurrentActiveTab] = useState(0);

  // List My Donation
  const [currentPageListMyDonation, setCurrentPageListMyDonation] = useState(1);
  const [limitPerPageListMyDonation] = useState(3);
  const metaPaginationListMyDonation = 5;

  // Browse Event
  const [currentPageBrowseEvent, setCurrentPageBrowseEvent] = useState(1);
  const [limitPerPageBrowseEvent] = useState(3);
  const metaPaginationBrowseEvent = 5;

  // Dummy Data
  const listMyDonation = [
    {
      id: 1,
      donationName: 'Cakra Sakti Cup 2023 For Ben',
      donationType: 'Donation Individual',
      whoRequested: 'Ben Salim',
      endingIn: '20',
      achievement: '5000000',
      target: '20000000',
      descriptionOfResult: 'Funds have been used to buy shirts and we won',
      disbursementPercentage: '100',
    },
  ];

  const breadcrumbItems = [
    { label: 'Donation Management', url: '#' },
    { label: 'Donate to Others' },
  ];

  return (
    <>
      <Card className="py-4 pb-0">
        <div className="px-4">
          <Breadcrumb title="Donate to Others" items={breadcrumbItems} />
        </div>

        <CardBody className="mt-4">
          <Tabs
            defaultActiveTab={currentActiveTab}
            setDefaultActiveTab={setCurrentActiveTab}
          >
            <Tab label="All My Donation to Other">
              <TabPanel>
                <ListMyDonation
                  data={listMyDonation}
                  currentPage={currentPageListMyDonation}
                  setCurrentPage={setCurrentPageListMyDonation}
                  limitPerPage={limitPerPageListMyDonation}
                  metaPagination={metaPaginationListMyDonation}
                />
              </TabPanel>
            </Tab>

            <Tab label="Browse Donation">
              <TabPanel>
                <BrowseDonation
                  data={listMyDonation}
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

export default DonationDonateOthers;
