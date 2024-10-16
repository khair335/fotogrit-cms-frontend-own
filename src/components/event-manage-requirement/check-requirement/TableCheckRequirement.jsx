import DataTable from 'react-data-table-component';

import { ButtonAction, Pagination } from '@/components';

import { customTableStyles } from '@/constants/tableStyle';
import { ErrorFetchingData } from '@/components/Errors';
import { SkeletonTable } from '@/components/Skeleton';

const TableCheckRequirement = (props) => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    setOpenModal,
    setGetData,
    limitPerPage,
    setCurrentPage,
    currentPage,
  } = props;

  const teams = data?.data?.teams;
  const meta = data?.meta;

  const totalPages = meta?.total_page;
  const totalRecords = meta?.total_record;

  // Columns Table
  const columns = [
    {
      name: 'Requirement ID',
      selector: (row) => row.code,
      cell: (row) => row.code || '-',
      sortable: true,
      minWidth: '100px',
    },
    {
      name: 'Event Group ID / Name',
      selector: (row) => row.group_code,
      cell: (row) => row.group_code || '-',
      sortable: true,
      minWidth: '160px',
    },
    {
      name: 'Age Groups (s)',
      selector: (row) => row.age_group,
      cell: (row) => row.age_group || '-',
      sortable: true,
      minWidth: '160px',
    },
    {
      name: 'Requirements',
      selector: (row) => row.requirments,
      cell: (row) => row.requirments || '-',
      sortable: true,
      minWidth: '160px',
    },
    {
      name: 'Action',
      center: true,
      width: '80px',
      cell: (props) => (
        <ButtonAction
          setGetData={setGetData}
          setOpenModal={setOpenModal}
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
            data={teams}
            fixedHeader
            fixedHeaderScrollHeight="50vh"
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
      ) : null}
    </div>
  );
};

export default TableCheckRequirement;
