import DataTable from 'react-data-table-component';

import { ButtonAction, Pagination } from '@/components';
import { ErrorFetchingData, NoDataMessage } from '@/components/Errors';
import { SkeletonTable } from '../../Skeleton';
import { customTableStyles } from '@/constants/tableStyle';
import { MdVerified } from 'react-icons/md';

const TableRosterList = (props) => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    setOpenModal,
    setGetData,
    setCurrentPage,
    metaPagination,
    limitPerPage,
    currentPage,
    eventGroupID,
  } = props;

  const totalPages = metaPagination?.total_page;
  const totalRecords = metaPagination?.total_record;

  const columns = [
    {
      name: 'Roster ID',
      selector: (row) => row.code,
      sortable: true,
      width: '120px',
    },
    {
      name: 'Event Group',
      selector: (row) => row.event_code || '-',
      sortable: true,
      wrap: true,
      minWidth: '200px',
    },
    {
      name: 'Team',
      selector: (row) => row.team,
      cell: (row) =>
        `${row?.team_code} ${row?.team} ${
          row?.age_group ? `- ${row?.age_group}` : ''
        } ${row?.age_group_gender} ${row?.age_group_desc}`,
      sortable: true,
      wrap: true,
      minWidth: '160px',
    },
    {
      name: 'No. Jersey',
      selector: (row) => row.jersey_number || '-',
      sortable: true,
      minWidth: '140px',
    },
    {
      name: 'User',
      selector: (row) => row.user,
      cell: (row) =>
        `${row.user_code ? `${row.user_code} -` : ''} ${
          row.user ? `${row.user}` : ''
        }`,
      sortable: true,
      wrap: true,
      minWidth: '140px',
    },
    // {
    //   name: 'Status',
    //   selector: (row) => row.doc_verified,
    //   cell: (row) =>
    //     row.doc_verified === 'verified' ? (
    //       <span className="flex items-center gap-0.5 bg-ftgreen-600 text-white py-1 px-2.5 font-medium rounded-full capitalize">
    //         <MdVerified className="text-lg" /> {row.doc_verified || '-'}
    //       </span>
    //     ) : (
    //       <span className="text-ftbrown font-medium capitalize">
    //         {row.doc_verified || '-'}
    //       </span>
    //     ),
    //   sortable: true,
    //   minWidth: '140px',
    // },
    {
      name: 'Action',
      center: true,
      width: '100px',
      cell: (props) => (
        <ButtonAction
          setGetData={setGetData}
          setOpenModal={setOpenModal}
          disabled={!eventGroupID}
          {...props}
        />
      ),
    },
  ];

  return (
    <div>
      {isError ? (
        <ErrorFetchingData error={error} />
      ) : isLoading ? (
        <SkeletonTable />
      ) : isSuccess ? (
        <div className="border-t border-gray-200">
          <DataTable
            columns={columns}
            data={data}
            fixedHeader
            fixedHeaderScrollHeight="50vh"
            customStyles={customTableStyles}
            persistTableHead
            noDataComponent={<NoDataMessage title="Rosters" />}
          />

          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            limitPerPage={limitPerPage}
          />
        </div>
      ) : null}
    </div>
  );
};

export default TableRosterList;
