import React from 'react';
import DataTable from 'react-data-table-component';
import { ButtonAction, Pagination } from '@/components';
import { customTableStyles } from '@/constants/tableStyle';
import { IoMdTrophy } from 'react-icons/io';

const TableResultStanding = (props) => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    setOpenModal,
    setGetData,
    setCurrentPage,
    limitPerPage,
    currentPage,
  } = props;

  const resultStanding = data;

  // const metaClubData = data?.meta;
  const totalPages = 3;
  const totalRecords = resultStanding?.length;
  // Columns Table
  const columns = [
    {
      name: 'Team',
      selector: (row) => row.team,
      cell: (row) =>
        row.team ? (
          <div className="p-2 ">
            <img
              src={row.team}
              // alt={row.name}
              className="object-cover w-full h-14"
            />
          </div>
        ) : (
          <div className="p-2">
            <img
              src="/images/logo-fotogrit.png"
              alt="image placeholder"
              className="object-fill w-full h-14"
            />
          </div>
        ),
      wrap: true,
      minWidth: '100px',
      center: true,
    },
    {
      name: 'Total Plays',
      selector: (row) => row.totalPlays,
      sortable: true,
      wrap: true,
      minWidth: '130px',
    },
    {
      name: 'Total Wins',
      selector: (row) => row.totalWins,
      sortable: true,
      wrap: true,
      minWidth: '130px',
    },
    {
      name: 'Total Lose',
      selector: (row) => row.totalLose,
      sortable: true,
      wrap: true,
      minWidth: '130px',
    },
    {
      name: 'Points For',
      selector: (row) => row.pointsFor,
      sortable: true,
      wrap: true,
      minWidth: '130px',
    },
    {
      name: 'Points Points Against',
      selector: (row) => row.pointsPointsAgainst,
      sortable: true,
      wrap: true,
      minWidth: '200px',
    },
    {
      name: 'PointsDifferences',
      selector: (row) => row.pointsDifferences,
      sortable: true,
      wrap: true,
      minWidth: '200px',
    },
    {
      name: 'Final Standings',
      selector: (row) => row.finalStandings,
      cell: (row) => {
        return (
          <div className="flex items-center gap-2">
            <IoMdTrophy className="text-xl text-ftbrown" />
            <p className="text-base text-ftgreen-600 italic">
              {row.finalStandings}
            </p>
          </div>
        );
      },
      sortable: true,
      wrap: true,
      minWidth: '200px',
    },
  ];
  return (
    <div>
      <div className="border-t border-gray-200 ">
        <DataTable
          columns={columns}
          data={data}
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

export default TableResultStanding;
