import { Breadcrumb, ButtonCollapse, Collapse } from '@/components';

import {
  FormDonationRequest,
  TableListDonation,
} from '@/components/donation-new-request';
import { FilterSearch } from '@/components/form-input';
import { Card, CardBody } from '@/components/Card';
import { useState } from 'react';

const DonationNewRequest = () => {
  const [isOpenNewData, setIsOpenNewData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(3);

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
    {
      label: 'Donation Management',
      url: '/donation-management/donate-to-others',
    },
    { label: 'My Donation', url: '#' },
    { label: 'Add New Request' },
  ];

  return (
    <>
      <Card className="py-4 pb-0 px-6">
        <Breadcrumb title="Add New Request" items={breadcrumbItems} />

        <CardBody className="mt-2">
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
            <ButtonCollapse
              label="Add New Donation Request"
              isOpen={isOpenNewData}
              handleClick={() => setIsOpenNewData(!isOpenNewData)}
            />

            <div className="w-full sm:w-[50%] lg:w-[30%]">
              <FilterSearch
              //   searchValue={searchValue}
              //   setSearchValue={setSearchValue}
              />
            </div>
          </div>

          <Collapse isOpen={isOpenNewData}>
            <FormDonationRequest setOpenColapse={setIsOpenNewData} />
          </Collapse>

          <section className="mt-3">
            <TableListDonation
              //   openModal={openModal}
              //   setOpenModal={setOpenModal}
              //   setGetData={setGetDetailData}
              data={listMyDonation}
              limitPerPage={limitPerPage}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          </section>
        </CardBody>
      </Card>
    </>
  );
};

export default DonationNewRequest;
