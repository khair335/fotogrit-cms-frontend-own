import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import SkeletonTable from '../Skeleton/SkeletonTable';
import { ButtonAction, Pagination } from '@/components';
import { ErrorFetchingData, NoDataMessage } from '@/components/Errors';
import { formatDate } from '@/helpers/FormatDate';
import { customTableStyles } from '@/constants/tableStyle';
import {
  setEventGroupID,
  setTabEventActive,
} from '@/services/state/eventsSlice';
import { selectCurrentUser } from '@/services/state/authSlice';
import { userTypeAdminCheck } from '@/helpers/UserTypeCheck';

const TableEventGroup = (props) => {
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

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNextToEvent = (id) => {
    dispatch(setEventGroupID(id));
    dispatch(setTabEventActive(1));
    navigate('/event-master/events');
  };

  const eventGroup = data?.data?.event_groups;
  const metaEventGroup = data?.meta;

  const totalPages = metaEventGroup?.total_page;
  const totalRecords = metaEventGroup?.total_record;

  const userProfile = useSelector(selectCurrentUser);
  const isAdmin = userTypeAdminCheck(userProfile);
  const isUT014 = userProfile?.user_type === 'UT014';

  // Columns Table
  const columns = [
    {
      name: 'Group Code',
      selector: (row) => row.code,
      sortable: true,
      width: '140px',
    },
    {
      name: (
        <div className="flex flex-col gap-[2px] py-2 text-center">
          <p>Event Group</p>
          <p>Photo</p>
        </div>
      ),
      selector: (row) =>
        row.event_logo ? (
          <div className="p-2 ">
            <img
              src={row.event_logo}
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
      width: '160px',
      center: true,
    },
    {
      name: 'Group Name',
      selector: (row) => row.name,
      sortable: true,
      wrap: true,
      minWidth: '160px',
    },
    {
      name: 'Company Name',
      selector: (row) => row.organizer_name,
      sortable: true,
      minWidth: '180px',
      wrap: true,
    },
    {
      name: 'Organizer PIC',
      selector: (row) => row.pic_organizer,
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: 'Event Date',
      selector: (row) => formatDate(row.date_start),
      sortable: true,
      width: '160px',
    },
    {
      name: 'Location',
      selector: (row) => row.location,
      sortable: true,
      wrap: true,
      minWidth: '160px',
    },
    {
      name: 'City',
      selector: (row) => row.city,
      sortable: true,
      wrap: true,
      width: '160px',
    },
    {
      name: 'Action',
      center: true,
      width: '140px',
      cell: (props) => {
        return (
          <div className="flex gap-2">
            <button
              className="px-4 py-2 text-xs font-bold text-white transition-all duration-150 rounded-lg bg-secondary hover:bg-secondary/75 group"
              onClick={() => handleNextToEvent(props?.id)}
            >
              Next
            </button>
            {(isAdmin || isUT014) && (
              <ButtonAction
                setGetData={setGetData}
                setOpenModal={setOpenModal}
                {...props}
              />
            )}
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
            data={eventGroup}
            fixedHeader
            fixedHeaderScrollHeight="54vh"
            responsive={true}
            customStyles={customTableStyles}
            persistTableHead
            noDataComponent={<NoDataMessage title="Event Group" />}
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

export default TableEventGroup;
