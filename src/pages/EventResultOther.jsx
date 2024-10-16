import { useState } from 'react';

import { BiReset } from 'react-icons/bi';
import { Breadcrumb, Button, Tooltip } from '@/components';

import { Card, CardBody, CardHeader } from '@/components/Card';

import {
  ResultStanding,
  EventInfoNews,
  ClubPlayers,
  Schedule,
  HalfOfDonors,
} from '@/components/event-result-other';

import { Tabs, Tab, TabPanel } from '@/components/Tabs';
import { FilterSelect } from '@/components/form-input';
import { FaPhoneAlt, FaShareAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const EventResultOther = () => {
  const [currentActiveTab, setCurrentActiveTab] = useState(0);

  // Result Standing Page
  const [currentPageResultStanding, setCurrentPageResultStanding] = useState(1);
  const [limitPerPageResultStanding] = useState(10);
  const metaPaginationResultStanding = 5;

  // Schedule Page
  const [currentPageSchedule, setCurrentPageSchedule] = useState(1);
  const [limitPerPageSchedule] = useState(10);
  const metaPaginationSchedule = 5;

  const breadcrumbItems = [
    {
      label: 'Event Management',
      url: '/event-management/other-event/register-other',
    },
    { label: 'Other Event', url: '#' },
    { label: 'Result of Other Event' },
  ];

  return (
    <>
      <Card>
        <CardHeader className="sm:flex-col">
          <div className="flex flex-col sm:flex-row sm:justify-between w-full">
            <Breadcrumb title="Result of Other Event" items={breadcrumbItems} />

            <div className="flex  items-center gap-2 sm:w-[40%] mt-4 sm:mt-0">
              <div className="z-50 flex-grow relative">
                <FilterSelect placeholder="Select Event Group" />
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
          </div>

          <div className="w-full">
            {/* <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
              <Breadcrumb
                title="Result of Other Event"
                items={breadcrumbItems}
              />

              <div className="flex flex-col gap-2 w-full sm:flex-row sm:items-center sm:w-[40%] z-50">
                <div className="w-full">
                  <FilterSelect placeholder="Select Event Group" />
                </div>

                <Tooltip text="Refresh" position="bottom">
                  <Button
                    background="black"
                    // onClick={handleResetFilter}
                    className="block w-full"
                  >
                    <BiReset className="mx-auto" />
                  </Button>
                </Tooltip>
              </div>
            </div> */}

            <div className="flex flex-col gap-3 mt-3">
              <div className="flex flex-col gap-5 sm:flex-row sm:justify-between">
                <div className="flex flex-wrap gap-5 w-fit sm:flex-row sm:items-center">
                  <div>
                    <img
                      src="https://source.unsplash.com/pZRX3qGeets"
                      alt="Group Image"
                      className="rounded-xl object-cover max-h-36 sm:w-40"
                    />
                  </div>

                  <div>
                    <h1 className="font-bold text-base sm:text-xl">
                      Chakra Sakti Cup 2023
                    </h1>

                    <Link
                      to="https://fotogrit.id/Cakra_Sakti_Cup_2023"
                      target="_blank"
                      className="text-sm break-all"
                    >
                      <p className="text-ftblue underline italic">
                        https://fotogrit.id/Cakra_Sakti_Cup_2023
                      </p>
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                  <Button
                    background="black"
                    className="px-5 sm:px-8 text-base order-2"
                  >
                    Register
                  </Button>

                  <Link className="text-xl order-1">
                    <FaPhoneAlt />
                  </Link>

                  <Link className="text-xl order-3">
                    <FaShareAlt />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <section>
            <Tabs
              defaultActiveTab={currentActiveTab}
              setDefaultActiveTab={setCurrentActiveTab}
            >
              <Tab label="Results & Standing">
                <TabPanel>
                  <ResultStanding
                    currentPage={currentPageResultStanding}
                    setCurrentPage={setCurrentPageResultStanding}
                    limitPerPage={limitPerPageResultStanding}
                    metaPagination={metaPaginationResultStanding}
                  />
                </TabPanel>
              </Tab>

              <Tab label="Event Info & News">
                <TabPanel>
                  <EventInfoNews />
                </TabPanel>
              </Tab>

              <Tab label="Club & Players">
                <TabPanel>
                  <ClubPlayers />
                </TabPanel>
              </Tab>

              <Tab label="Schedule">
                <TabPanel>
                  <Schedule
                    currentPage={currentPageSchedule}
                    setCurrentPage={setCurrentPageSchedule}
                    limitPerPage={limitPerPageSchedule}
                    metaPagination={metaPaginationSchedule}
                  />
                </TabPanel>
              </Tab>

              <Tab label="Half of Donors">
                <TabPanel>
                  <HalfOfDonors />
                </TabPanel>
              </Tab>
            </Tabs>
          </section>
        </CardBody>
      </Card>
    </>
  );
};

export default EventResultOther;
