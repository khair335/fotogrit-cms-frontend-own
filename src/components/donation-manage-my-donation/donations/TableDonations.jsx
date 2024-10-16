import React from 'react';
import DataTable from 'react-data-table-component';
import { Pagination } from '@/components';
import { customTableStyles } from '@/constants/tableStyle';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';

const TableDonations = (props) => {
  const { data, currentPage, setCurrentPage, limitPerPage } = props;

  const donations = data;
  // const metaClubData = data?.meta;
  const totalPages = 3;
  const totalRecords = donations?.length;

  const columns = [
    {
      name: 'Date',
      selector: (row) => row.date,
      sortable: true,
      wrap: true,
      width: '230px',
    },
    {
      name: 'User ID/Name',
      selector: (row) => row.userId,
      sortable: true,
      wrap: true,
      minWidth: '150px',
    },
    {
      name: 'Donation Amount',
      selector: (row) => CurrencyFormat(row.donationAmount),
      sortable: true,
      minWidth: '180px',
      wrap: true,
    },
    {
      name: 'Message',
      selector: (row) => row.message,
      cell: (row) => (
        <div>
          <p>"{row.message}"</p>
        </div>
      ),
      sortable: true,
      wrap: true,
      minWidth: '250px',
    },
  ];

  return (
    <div>
      <div className="border-t border-gray-200 ">
        <DataTable
          columns={columns}
          data={donations}
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

export default TableDonations;
