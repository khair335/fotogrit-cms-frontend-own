import DataTable from 'react-data-table-component';

import { SkeletonTable } from '../../Skeleton';
import { ErrorFetchingData, NoDataMessage } from '@/components/Errors';
import { ButtonAction, Pagination } from '@/components';
import { customTableStyles } from '@/constants/tableStyle';

const TableTeamList = (props) => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    setOpenModal,
    setGetData,
    currentPage,
    setCurrentPage,
    metaPagination,
    limitPerPage,
    isTeamManager,
  } = props;

  const totalPages = metaPagination?.total_page;
  const totalRecords = metaPagination?.total_record;

  // Columns Table
  const columns = [
    {
      name: 'Group Code',
      selector: (row) => row.group_code,
      cell: (row) => (
        <div className="w-full h-full pt-[6px]">
          <span className="">{row.group_code}</span>
        </div>
      ),
      minWidth: '200px',
    },
    {
      name: 'Team Name',
      selector: (row) => row.teams.map((team) => team.name).join(', '),
      cell: (row) =>
        row.teams.length !== 0
          ? row.teams
              .map(
                (team) =>
                  `${team.code} ${team.name} ${
                    team?.age_group ? `- ${team?.age_group}` : ''
                  } ${team?.age_group_gender} ${team?.age_group_desc}`
              )
              .join(', ')
          : '-',
      wrap: true,
    },
  ];

  if (!isTeamManager) {
    columns.push({
      name: 'Action',
      center: true,
      width: '100px',
      cell: (props) => (
        <ButtonAction
          setGetData={setGetData}
          setOpenModal={setOpenModal}
          {...props}
        />
      ),
    });
  }

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
            noDataComponent={<NoDataMessage title="Teams" />}
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

export default TableTeamList;
