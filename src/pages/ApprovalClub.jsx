import { useState } from 'react';

import { Breadcrumb } from '@/components';

import { TableClubRequest, TableListClub } from '@/components/approval-club';

import { Card, CardBody } from '@/components/Card';

const ApprovalClub = () => {
  const [currentPageClubRequest, setCurrentPageClubRequest] = useState(1);
  const [limitPerPageClubRequest] = useState(3);

  const [currentPageClubList, setCurrentPageClubList] = useState(1);
  const [limitPerPageClubList] = useState(3);

  const clubRequest = [
    {
      id: 1,
      date: '20/12/23',
      logo: '/images/logo-fotogrit.png',
      createdBy: 'Bambang - C0979',
      clubName: 'Air one',
      picUserId: 'Bambang - C0979',
      legalDocumentNumber: 231862697677,
      action: 'Approved',
    },
    {
      id: 2,
      date: '20/12/23',
      logo: '/images/logo-fotogrit.png',
      createdBy: 'Bambang - C0979',
      clubName: 'Air one',
      picUserId: 'Bambang - C0979',
      legalDocumentNumber: 231862697677,
      action: 'Approved',
    },
    {
      id: 3,
      date: '20/12/23',
      logo: '/images/logo-fotogrit.png',
      createdBy: 'Bambang - C0979',
      clubName: 'Air one',
      picUserId: 'Bambang - C0979',
      legalDocumentNumber: 231862697677,
      action: 'Rejected',
    },
    {
      id: 4,
      date: '20/12/23',
      logo: '/images/logo-fotogrit.png',
      createdBy: 'Bambang - C0979',
      clubName: 'Air one',
      picUserId: 'Bambang - C0979',
      legalDocumentNumber: 231862697677,
      action: 'Approved',
    },
    {
      id: 5,
      date: '20/12/23',
      logo: '/images/logo-fotogrit.png',
      createdBy: 'Bambang - C0979',
      clubName: 'Air one',
      picUserId: 'Bambang - C0979',
      legalDocumentNumber: 231862697677,
      action: 'Approved',
    },
  ];

  const breadcrumbItems = [
    { label: 'Club Management', url: '#' },
    { label: 'Approval of clubs' },
  ];
  return (
    <>
      <Card className="py-4 pb-0 px-6 h-3/4">
        <Breadcrumb title="Approval of clubs" items={breadcrumbItems} />

        <CardBody className="mt-2">
          <section className="mt-4">
            <h5 className="mb-2 text-xl font-bold">Manage Clubs Request</h5>

            <TableClubRequest
              data={clubRequest}
              limitPerPage={limitPerPageClubRequest}
              setCurrentPage={setCurrentPageClubRequest}
              currentPage={currentPageClubRequest}
            />
          </section>
        </CardBody>
      </Card>

      <Card className="py-4 pb-0 px-6 mt-4 h-[90%]">
        <CardBody className="mt-2">
          <section>
            <h5 className="mb-2 text-xl font-bold">Clubs List</h5>

            <TableListClub
              data={clubRequest}
              limitPerPage={limitPerPageClubList}
              setCurrentPage={setCurrentPageClubList}
              currentPage={currentPageClubList}
            />
          </section>
        </CardBody>
      </Card>
    </>
  );
};

export default ApprovalClub;
