import { BiReset } from 'react-icons/bi';
import { Breadcrumb, Tooltip, Button } from '@/components';

import {
  Donations,
  OutcomesOfDonation,
  WithdrawDonation,
} from '@/components/donation-manage-my-donation';
import { FilterSearch, FilterSelect } from '@/components/form-input';
import { Card, CardBody, CardHeader } from '@/components/Card';
import { Tabs, Tab, TabPanel } from '@/components/Tabs';
import { useState } from 'react';

const DonationManageMyDonation = () => {
  const [currentActiveTab, setCurrentActiveTab] = useState(0);

  const donationEvent = [
    {
      id: 1,
      donationType: 'Individual',
      eventName: 'Cakra Sakti Cup 2023',
      ku: '12',
      endDate: '20 June 2023',
      collectedAmount: 2000000,
      status: 'Active',
    },
  ];

  const breadcrumbItems = [
    {
      label: 'Donation Management',
      url: '/donation-management/donate-to-others',
    },
    { label: 'My Donation', url: '#' },
    { label: 'Manage My Donation' },
  ];
  return (
    <>
      <Card>
        <CardHeader className="relative ">
          <Breadcrumb title="Manage My Donation" items={breadcrumbItems} />

          <div className="flex  items-center gap-2 sm:w-[40%] mt-4 sm:mt-0">
            <div className="z-50 flex-grow relative">
              <FilterSelect placeholder="Select Donation Request ID" />
            </div>

            <Tooltip text="Reset Filter" position="bottom">
              <Button
                background="black"
                // onClick={handleResetFilter}
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
            <Tab label="Donations">
              <TabPanel>
                <Donations data={donationEvent} />
              </TabPanel>
            </Tab>

            <Tab label="Outcome of Donations">
              <TabPanel>
                <OutcomesOfDonation data={donationEvent} />
              </TabPanel>
            </Tab>

            <Tab label="Withdraw Donation">
              <TabPanel>
                <WithdrawDonation data={donationEvent} />
              </TabPanel>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </>
  );
};

export default DonationManageMyDonation;
