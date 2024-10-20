import DataTable from 'react-data-table-component';

import { ButtonAction, Pagination } from '@/components';
import { ErrorFetchingData, NoDataMessage } from '@/components/Errors';
import { SkeletonTable } from '../../Skeleton';
import { customTableStyles } from '@/constants/tableStyle';

const TableOffcialList = (props) => {
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
      name: 'Official ID',
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
      cell: (row) => `${row?.team_code} ${row?.team}`,
      sortable: true,
      wrap: true,
      minWidth: '160px',
    },
    {
      name: 'Officials',
      selector: (row) => row.officials,
      cell: (row) => {
        const officials = row?.officials
          ? row?.officials?.map((official) => official.official_name).join(', ')
          : '-';
        return officials;
      },
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
            noDataComponent={<NoDataMessage title="Official List" />}
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

export default TableOffcialList;
