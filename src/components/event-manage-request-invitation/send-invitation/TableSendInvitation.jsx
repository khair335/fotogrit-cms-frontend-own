import { useState } from 'react';
import DataTable from 'react-data-table-component';

import { Button, ButtonAction, Pagination, PopUp } from '@/components';

import { customTableStyles } from '@/constants/tableStyle';
import { ErrorFetchingData } from '@/components/Errors';
import { SkeletonTable } from '@/components/Skeleton';

const TableSendInvitation = (props) => {
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

  const [isOpenPopUpSendInvitation, setIsOpenPopUpSendInvitation] =
    useState(false);
  const [isOpenPopUpRefund, setIsOpenPopUpRefund] = useState(false);

  const teams = data?.data?.teams;
  const meta = data?.meta;

  const totalPages = meta?.total_page;
  const totalRecords = meta?.total_record;

  // Columns Table
  const columns = [
    {
      name: 'Event Group ID / Name',
      selector: (row) => row.name,
      cell: (row) => row.name || '-',
      sortable: true,
      minWidth: '160px',
    },
    {
      name: 'Age Group',
      selector: (row) => row.age_group,
      cell: (row) => row.age_group || '-',
      sortable: true,
      minWidth: '160px',
    },
    {
      name: 'Invitees',
      selector: (row) => row.Invitees,
      cell: (row) => row.Invitees || '-',
      sortable: true,
      minWidth: '160px',
    },
    {
      name: 'Action',
      center: true,
      width: '200px',
      cell: (props) => (
        <div className="flex items-center gap-2">
          <Button
            background="brown"
            className="text-xs"
            onClick={() => setIsOpenPopUpSendInvitation(true)}
          >
            Send Invitation
          </Button>

          <ButtonAction
            setGetData={setGetData}
            setOpenModal={setOpenModal}
            {...props}
          />
        </div>
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

      {/* POPUP SEND INVITATION */}
      <PopUp
        setIsOpenPopUp={setIsOpenPopUpSendInvitation}
        isOpenPopUp={isOpenPopUpSendInvitation}
        title="Confirmation"
      >
        <h5 className="mb-4 font-bold text-left">
          Are you sure you want to send invitation?
        </h5>

        <div className="flex items-center justify-center">
          <div className="flex gap-2 mt-2">
            <Button
              background="red"
              className="w-28"
              onClick={() => setIsOpenPopUpSendInvitation(false)}
            >
              Cancel
            </Button>
            <Button
              background="black"
              className="w-28"
              // onClick={handleSend}
              disabled
            >
              Send
            </Button>
          </div>
        </div>
      </PopUp>
      {/* END POPUP SEND INVITATION */}
    </div>
  );
};

export default TableSendInvitation;
