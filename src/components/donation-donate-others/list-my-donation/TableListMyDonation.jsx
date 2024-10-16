import React from 'react';
import DataTable from 'react-data-table-component';
import { Pagination } from '@/components';
import { customTableStyles } from '@/constants/tableStyle';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';

const TableListMyDonation = (props) => {
  const { data, currentPage, setCurrentPage, limitPerPage, metaPagination } =
    props;

  const listMyDonation = data;
  // const metaClubData = data?.meta;
  const totalPages = 3;
  const totalRecords = listMyDonation?.length;

  const columns = [
    {
      name: 'Donation Name',
      selector: (row) => row.donationName,
      sortable: true,
      wrap: true,
      width: '230px',
    },
    {
      name: 'Donation Type',
      selector: (row) => row.donationType,
      sortable: true,
      wrap: true,
      minWidth: '150px',
    },
    {
      name: 'Who Requested',
      selector: (row) => row.whoRequested,
      sortable: true,
      minWidth: '180px',
      wrap: true,
    },
    {
      name: 'Ending In',
      selector: (row) => row.endingIn,
      cell: (row) => <div>{row.endingIn} days</div>,
      sortable: true,
      wrap: true,
      minWidth: '130px',
    },
    {
      name: 'Achievement from Targets',
      selector: (row) => row.achievement,
      cell: (row) => (
        <div>
          Terkumpul {`${CurrencyFormat(row.achievement)} `}
          dari {`${CurrencyFormat(row.target)} `}(
          {(row.achievement / row.target) * 100}%)
        </div>
      ),
      sortable: true,
      wrap: true,
      minWidth: '250px',
    },
    {
      name: 'Description of Result',
      selector: (row) => row.descriptionOfResult,
      sortable: true,
      wrap: true,
      minWidth: '250px',
    },
    {
      name: 'Disbursement Percentage',
      selector: (row) => row.disbursementPercentage,
      cell: (row) => <div>{row.disbursementPercentage}%</div>,
      sortable: true,
      wrap: true,
      minWidth: '230px',
    },
  ];

  return (
    <div>
      <div className="border-t border-gray-200 ">
        <DataTable
          columns={columns}
          data={listMyDonation}
          fixedHeader
          fixedHeaderScrollHeight="50vh"
          responsive={true}
          customStyles={customTableStyles}
        />

        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          limitPerPage={limitPerPage}
        />
      </div>
    </div>
  );
};

export default TableListMyDonation;
