import React, { Suspense, useState } from 'react';
import { Breadcrumb } from '@/components';
import { Card, CardBody, CardHeader } from '@/components/Card';
import { SkeletonTab } from '@/components/Skeleton';
import { Tab, TabPanel, Tabs } from '@/components/Tabs';
import ReportPerWeek from '@/components/reports/week/ReportPerWeek';

const breadcrumbItems = [
  { label: 'Reports', url: '#' },
  { label: 'Dashboard' },
];

const ReportDashboard = () => {
  const [currentActiveTab, setCurrentActiveTab] = useState(0);

  return (
    <>
      <Card>
        <CardHeader className="relative">
          <Breadcrumb title="Dashboard" items={breadcrumbItems} />
        </CardHeader>

        <CardBody>
          <Suspense fallback={<SkeletonTab />}>
            <Tabs
              defaultActiveTab={currentActiveTab}
              setDefaultActiveTab={setCurrentActiveTab}
            >
              <Tab label="Week">
                <TabPanel>
                  <ReportPerWeek />
                </TabPanel>
              </Tab>

              <Tab label="Month">
                <TabPanel>
                  <div className="">Month</div>
                </TabPanel>
              </Tab>

              <Tab label="Years">
                <TabPanel>
                  <div className="">Years</div>
                </TabPanel>
              </Tab>
            </Tabs>
          </Suspense>
        </CardBody>
      </Card>
    </>
  );
};

export default ReportDashboard;
