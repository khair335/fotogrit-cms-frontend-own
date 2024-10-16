import DataTable from 'react-data-table-component';

import { ErrorFetchingData, NoDataMessage } from '@/components/Errors';
import { SkeletonTable } from '../Skeleton';
import { ButtonAction, Pagination } from '@/components';
import { customTableStyles } from '@/constants/tableStyle';

const TableClubData = (props) => {
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

  const club = data?.data?.clubs;

  const metaClubData = data?.meta;
  const totalPages = metaClubData?.total_page;
  const totalRecords = metaClubData?.total_record;

  const columns = [
    {
      name: 'Logo',
      selector: (row) => row.logo,
      cell: (row) =>
        row.logo ? (
          <div className="p-2 ">
            <img
              src={row.logo}
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
      width: '160px',
      center: true,
    },
    {
      name: 'Club Name',
      selector: (row) => row.name,
      sortable: true,
      wrap: true,
      minWidth: '160px',
    },
    {
      name: 'PIC Club',
      selector: (row) => row.pic_name,
      cell: (row) => row.pic_name || '-',
      sortable: true,
      minWidth: '180px',
      wrap: true,
    },
    {
      name: 'PIC Telephone',
      selector: (row) => row.pic_telephone,
      cell: (row) => row.pic_telephone || '-',
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: 'Location',
      selector: (row) => row.location,
      cell: (row) => row.location || '-',
      sortable: true,
      wrap: true,
      minWidth: '160px',
    },
    {
      name: 'Action',
      center: true,
      width: '140px',
      cell: (props) => {
        return (
          <div>
            <ButtonAction
              setGetData={setGetData}
              setOpenModal={setOpenModal}
              {...props}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div>
      {isError ? (
        <ErrorFetchingData error={error} />
      ) : isLoading ? (
        <SkeletonTable />
      ) : isSuccess ? (
        <div className="border-t border-gray-200 ">
          <DataTable
            columns={columns}
            data={club}
            fixedHeader
            fixedHeaderScrollHeight="54vh"
            responsive={true}
            customStyles={customTableStyles}
            persistTableHead
            noDataComponent={<NoDataMessage title="Clubs" />}
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

export default TableClubData;
