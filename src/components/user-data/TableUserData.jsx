import DataTable from 'react-data-table-component';

import { SkeletonTable } from '../Skeleton';
import { ButtonAction, Pagination } from '@/components';
import { customTableStyles } from '@/constants/tableStyle';
import { ErrorFetchingData, NoDataMessage } from '@/components/Errors';

const TableUserData = (props) => {
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

  const users = data?.data?.users;
  const meta = data?.meta;

  const totalPages = meta?.total_page;
  const totalRecords = meta?.total_record;

  const columns = [
    {
      name: 'Code',
      selector: (row) => row.code,
      sortable: true,
      minWidth: '100px',
    },
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: 'Email',
      selector: (row) => row.email,
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: 'Phone',
      selector: (row) => row.phone_number,
      sortable: true,
      minWidth: '150px',
    },
    {
      name: 'Role',
      selector: (row) => row.role_name,
      sortable: true,
      minWidth: '140px',
      wrap: true,
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
      minWidth: '120px',
      cell: (row) => (row.status === 1 ? 'Active' : 'Non Active'),
      conditionalCellStyles: [
        {
          when: (row) => row.status === 1,
          style: {
            color: '#03E079',
          },
        },
        {
          when: (row) => row.status === 0,
          style: {
            color: 'red',
          },
        },
      ],
    },

    {
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
            data={users}
            fixedHeader
            fixedHeaderScrollHeight="54vh"
            customStyles={customTableStyles}
            persistTableHead
            noDataComponent={<NoDataMessage title="Users" />}
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

export default TableUserData;
