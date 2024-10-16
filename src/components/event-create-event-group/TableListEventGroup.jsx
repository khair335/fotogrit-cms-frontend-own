import DataTable from 'react-data-table-component';

import { SkeletonTable } from '../Skeleton';
import { ButtonAction, Pagination } from '@/components';

import { customTableStyles } from '@/constants/tableStyle';
import { ErrorFetchingData } from '@/components/Errors';

const TableListEventGroup = (props) => {
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
      name: 'Group Code',
      selector: (row) => row.code,
      cell: (row) => row.code || '-',
      sortable: true,
      minWidth: '100px',
    },
    {
      name: 'Group Logo',
      selector: (row) => row.logo_team,
      cell: (row) =>
        row.logo_team ? (
          <div className="p-2 ">
            <img
              src={row.logo_team}
              alt={row.name}
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
      minWidth: '160px',
      center: true,
    },
    {
      name: 'Group Name',
      selector: (row) => row.name,
      cell: (row) => row.name || '-',
      sortable: true,
      minWidth: '160px',
    },
    {
      name: 'PIC Group',
      selector: (row) => row.pic_group,
      cell: (row) => row.pic_group || '-',
      sortable: true,
      minWidth: '140px',
    },
    {
      name: <span>Start - End Group Date</span>,
      selector: (row) => row.group_date,
      cell: (row) => row.group_date || '-',
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: 'Location',
      selector: (row) => row.location,
      cell: (row) => row.location || '-',
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

export default TableListEventGroup;
