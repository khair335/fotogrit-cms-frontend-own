import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component';
import { PiWarningBold } from 'react-icons/pi';
import { IoIosArrowForward } from 'react-icons/io';

import { ButtonAction, Button, PopUp, LoaderButtonAction } from '@/components';
import { ErrorFetchingData } from '@/components/Errors';
import { SkeletonTable } from '../Skeleton';

import { customTableStyles } from '@/constants/tableStyle';
import { formatDate } from '@/helpers/FormatDate';

import {
  useUpdateStatusServiceFSPMutation,
  useUpdateStatusServiceSSPMutation,
} from '@/services/api/serviceRequestApiSlice';
import { selectCurrentUser } from '@/services/state/authSlice';
import { CapitalizeFirstLetter } from '@/helpers/CapitalizeFirstLetter';
import { userTypeAdminCheck } from '@/helpers/UserTypeCheck';

const TableManageServiceRequest = (props) => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    openModal,
    setOpenModal,
    setOpenCompleteService,
    setGetData,
    setCurrentPage,
    currentPage,
    isAccessManageService,
    searchValue,
  } = props;

  const userProfile = useSelector(selectCurrentUser);
  const isAdmin = userTypeAdminCheck(userProfile);

  const [isOpenPopUpApprove, setIsOpenPopUpApprove] = useState(false);
  const [isOpenPopUpDecline, setIsOpenPopUpDecline] = useState(false);
  const [isOpenPopUpExpiredDate, setIsOpenPopUpExpiredDate] = useState(false);
  const [getDetailData, setGetDetailData] = useState({});
  const [clickedRowID, setClickedRowID] = useState(null);

  const dataTable = data;

  const filteredItems = searchValue
    ? dataTable?.filter((item) => {
        return (
          (item.date &&
            formatDate(item.date)
              .toLowerCase()
              .includes(searchValue.toLowerCase())) ||
          (item.time_start &&
            item.time_finish &&
            `${formatDate(item.date)} | ${item.time_start} - ${
              item.time_finish
            }`
              .toLowerCase()
              .includes(searchValue.toLowerCase())) ||
          (item.date &&
            item.time_start &&
            item.time_finish &&
            `${item.time_start} - ${item.time_finish}`
              .toLowerCase()
              .includes(searchValue.toLowerCase())) ||
          (item.event_group_name &&
            item.event_group_name
              .toLowerCase()
              .includes(searchValue.toLowerCase())) ||
          (item.event_type &&
            item.event_type
              .toLowerCase()
              .includes(searchValue.toLowerCase())) ||
          (item.event_name &&
            item.event_name
              .toLowerCase()
              .includes(searchValue.toLowerCase())) ||
          (item.service_name &&
            item.service_name
              .toUpperCase()
              .includes(searchValue.toUpperCase())) ||
          (item.status_work &&
            item.status_work.toUpperCase().includes(searchValue.toUpperCase()))
        );
      })
    : dataTable;

  const [updateStatusServiceFSP, { isLoading: isLoadingStatusFSP }] =
    useUpdateStatusServiceFSPMutation();
  const [updateStatusServiceSSP, { isLoading: isLoadingStatusSSP }] =
    useUpdateStatusServiceSSPMutation();

  const determinePhotographerID = () => {
    const photographerID = getDetailData?.photographer_id;
    const currentUserID = userProfile?.id;

    if (isAdmin) {
      return photographerID;
    } else {
      return currentUserID;
    }
  };

  const handleApprove = async (e) => {
    e.preventDefault();

    try {
      const sendPhotographerID = determinePhotographerID();

      const approveData = {
        id: getDetailData?.id,
        photographer_id: sendPhotographerID,
        status_work: 1,
      };

      let response;

      if (getDetailData?.photographer_type === 'fsp') {
        response = await updateStatusServiceFSP(approveData).unwrap();
      } else {
        response = await updateStatusServiceSSP(approveData).unwrap();
      }

      if (!response?.error) {
        setIsOpenPopUpApprove(false);
        setGetDetailData({});
        toast.success(`Service has been Accept!`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to accept the service`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();

    try {
      const sendPhotographerID = determinePhotographerID();

      let response;

      if (getDetailData?.photographer_type === 'fsp') {
        response = await updateStatusServiceFSP({
          id: getDetailData?.id,
          photographer_id: sendPhotographerID,
          status_work: 2,
        }).unwrap();
      } else {
        response = await updateStatusServiceSSP({
          id: getDetailData?.id,
          photographer_id: sendPhotographerID,
          status_work: 8,
        }).unwrap();
      }

      if (!response.error) {
        setIsOpenPopUpDecline(false);
        setGetDetailData({});
        toast.success(`Sevice has been Decline!`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to decline the service`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const handleIsOpenPopupApprove = (data) => {
    setGetDetailData(data);
    setIsOpenPopUpApprove(true);
  };

  const handleIsOpenPopupDecline = (data) => {
    setGetDetailData(data);
    setIsOpenPopUpDecline(true);
  };

  const handleCancelApprove = () => {
    setGetDetailData({});
    setIsOpenPopUpApprove(false);
  };

  const handleCancelDecline = () => {
    setGetDetailData({});
    setIsOpenPopUpDecline(false);
  };

  const handleOpenExpiredDate = () => {
    setIsOpenPopUpExpiredDate(true);
  };
  const handleCloseExpiredDate = () => {
    setIsOpenPopUpExpiredDate(false);
  };

  const handleClickCompleteService = (props) => {
    if (props?.id === clickedRowID) {
      // If the same row is clicked again, reset the state
      setOpenCompleteService(false);
      setGetData('');
      setClickedRowID('');
    } else {
      // Otherwise, set the clicked row index
      setOpenCompleteService(true);
      setGetData(props);
      setClickedRowID(props?.id);
    }
  };

  // reset value clickedID if page change & open modal
  useEffect(() => {
    setClickedRowID(null);
  }, [currentPage, openModal]);

  // Columns Table
  const columns = [
    {
      name: 'Date / Time',
      selector: (row) => formatDate(row?.date) || '-',
      cell: (row) => (
        <span>{`${formatDate(row?.date)} | ${row?.time_start} - ${
          row?.time_finish
        }`}</span>
      ),
      sortable: true,
      wrap: true,
      minWidth: '140px',
    },
    {
      name: 'Event Group',
      selector: (row) => row?.event_group_name,
      sortable: true,
      wrap: true,
      minWidth: '160px',
    },
    {
      name: 'Event Type',
      selector: (row) => row?.event_type,
      sortable: true,
      minWidth: '160px',
    },
    {
      name: 'Event Name',
      selector: (row) => row?.event_name,
      sortable: true,
      wrap: true,
      minWidth: '160px',
    },
    {
      name: 'Service Name',
      selector: (row) => row?.service_name || '-',
      sortable: true,
      wrap: true,
      minWidth: '160px',
    },
    {
      name: 'Work Status',
      selector: (row) => row?.status_work || '-',
      sortable: true,
      minWidth: '190px',
      center: true,
      cell: (row) => {
        const rowDate = new Date(row?.date);
        const todayDate = new Date();
        todayDate.setDate(todayDate.getDate() - 1);

        const isWaitingForApproval =
          (row?.photographer_type === 'ssp' &&
            row?.status_work === 'waiting for ssp approval') ||
          (row?.photographer_type === 'fsp' &&
            row?.status_work === 'assigned') ||
          (isAdmin && row?.status_work === 'waiting for ssp approval') ||
          (isAdmin && row?.status_work === 'assigned');

        let status;
        if (row?.status_work === 'decline') {
          status = row?.status_work;
        } else if (row?.status_work_scoring) {
          status =
            row?.status_work_scoring === 'NoScoreInfo'
              ? 'Waiting for event'
              : row?.status_work_scoring || '-';
        } else {
          status = row?.status_work;
        }

        return (
          <>
            {isWaitingForApproval ? (
              <div className="flex gap-1">
                <Button
                  background="green"
                  className="text-xs"
                  onClick={() => {
                    if (rowDate < todayDate && !isAdmin) {
                      handleOpenExpiredDate();
                    } else {
                      handleIsOpenPopupApprove(row);
                    }
                  }}
                  disabled={
                    !isAccessManageService?.can_edit &&
                    !isAccessManageService?.can_add
                  }
                >
                  Approve
                </Button>
                <Button
                  background="red"
                  className="text-xs"
                  onClick={() => {
                    if (rowDate < todayDate && !isAdmin) {
                      handleOpenExpiredDate();
                    } else {
                      handleIsOpenPopupDecline(row);
                    }
                  }}
                  disabled={
                    !isAccessManageService?.can_edit &&
                    !isAccessManageService?.can_add
                  }
                >
                  Decline
                </Button>
              </div>
            ) : (
              <span>{CapitalizeFirstLetter(status || '-')}</span>
            )}
          </>
        );
      },
      style: { fontWeight: '500' },
      conditionalCellStyles: [
        {
          when: (row) =>
            row.service_type !== 'scoring' &&
            (row.status_work === 'waiting for ssp approval' ||
              row.status_work === 'assigned'),
          style: {
            color: '#A17F58', // brown
          },
        },
        {
          when: (row) =>
            row.status_work?.includes('decline', 'decline from ssp'),
          style: {
            color: 'red',
          },
        },
        {
          when: (row) =>
            row.service_type !== 'scoring' && row.status_work === 'visiting',
          style: {
            color: '#FAB246', // orange
          },
        },
        {
          when: (row) =>
            row.service_type !== 'scoring' &&
            (row.status_work === 'media has been uploaded' ||
              row.status_work === 'uploading media'),
          style: {
            color: '#4895ef', // blue
          },
        },
        {
          when: (row) =>
            row.service_type !== 'scoring' &&
            row.status_work === 'media has been recognized',
          style: {
            color: '#c77dff', // purple
          },
        },
        {
          when: (row) =>
            row.service_type !== 'scoring' &&
            row.status_work?.includes(
              'complete',
              'completed by fsp',
              'completed by ssp'
            ),
          style: {
            color: '#59D282', // green
          },
        },
      ],
    },
    {
      name: 'Action',
      center: true,
      width: '100px',
      cell: (props) => {
        const isWaitingForApproval =
          props?.service_type === 'scoring' ||
          props?.status_work === 'waiting for ssp approval' ||
          props?.status_work === 'assigned' ||
          props?.status_work === 'decline from ssp' ||
          props?.status_work === 'decline' ||
          (isAdmin && props?.status_work === 'waiting for ssp approval') ||
          (isAdmin && props?.status_work === 'assigned');

        return (
          <>
            {isWaitingForApproval ? (
              <ButtonAction
                setGetData={setGetData}
                setOpenModal={setOpenModal}
                {...props}
              />
            ) : (
              <button
                className={`p-2 font-bold text-white transition-all duration-150 bg-black rounded-lg hover:bg-opacity-80 group disabled:bg-opacity-50 ${
                  props.id === clickedRowID ? 'bg-ftbrown' : ''
                }`}
                onClick={() => handleClickCompleteService(props)}
                disabled={
                  !isAccessManageService?.can_edit &&
                  !isAccessManageService?.can_add
                }
              >
                <IoIosArrowForward
                  className={`transition-all duration-300 ${
                    props.id === clickedRowID ? 'transform rotate-90' : ''
                  }`}
                />
              </button>
            )}
          </>
        );
      },
    },
  ];

  const getDataServiceFTP = JSON.parse(localStorage.getItem('FT-MSFTP'));

  const conditionalRowStyles = [
    {
      when: (props) => {
        const rowDate = new Date(props.date);
        const todayDate = new Date();
        todayDate.setDate(todayDate.getDate() - 1);
        return (
          rowDate < todayDate &&
          props.status_work_fsp === 'waiting for approval' &&
          !isAdmin
        );
      },
      style: {
        backgroundColor: 'FF6969', // red
        color: 'black',
      },
    },
    {
      when: (props) => props?.id === clickedRowID,
      style: {
        backgroundColor: '#beae85e5',
        color: 'white',
      },
    },
    {
      when: (props) => props?.id === getDataServiceFTP?.id,
      style: {
        backgroundColor: '#a8dadc', // cyan
        color: 'white',
      },
    },
  ];

  const customPaginationOptions = {
    noRowsPerPage: true,
  };

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
            data={filteredItems}
            fixedHeader
            fixedHeaderScrollHeight="30vh"
            customStyles={customTableStyles}
            conditionalRowStyles={conditionalRowStyles}
            pagination
            paginationComponentOptions={customPaginationOptions}
            onChangePage={(page) => setCurrentPage(page)}
          />
        </div>
      ) : null}

      {/* POPUP APPROVE */}
      <PopUp
        setIsOpenPopUp={setIsOpenPopUpApprove}
        isOpenPopUp={isOpenPopUpApprove}
        title="Konfirmasi"
      >
        <h5 className="mb-4 font-bold text-left">
          Apakah anda yakin! ingin menyetujui Service Request dengan informasi
          sebagai berikut :
        </h5>

        <div className="flex flex-col gap-2 capitalize">
          <div className="grid grid-cols-3">
            <p className="text-gray-400">Date / Time</p>
            <p className="col-span-2">
              {`${formatDate(getDetailData?.date)} | ${
                getDetailData?.time_start
              } - ${getDetailData?.time_finish}`}
            </p>
          </div>
          <div className="grid grid-cols-3">
            <p className="text-gray-400">Event Group</p>
            <p className="col-span-2">{getDetailData?.event_group_name}</p>
          </div>
          <div className="grid grid-cols-3">
            <p className="text-gray-400">Event Type</p>
            <p className="col-span-2">{getDetailData?.event_type}</p>
          </div>
          <div className="grid grid-cols-3">
            <p className="text-gray-400">Event Name</p>
            <p className="col-span-2">{getDetailData?.event_name}</p>
          </div>
          <div className="grid grid-cols-3">
            <p className="text-gray-400">Service Name</p>
            <p className="col-span-2">{getDetailData?.service_name}</p>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <div className="flex gap-2 mt-4">
            <Button
              background="red"
              className="w-28"
              onClick={handleCancelApprove}
              disabled={isLoadingStatusFSP || isLoadingStatusSSP}
            >
              {isLoadingStatusFSP || isLoadingStatusSSP ? (
                <LoaderButtonAction />
              ) : (
                'Cancel'
              )}
            </Button>
            <Button
              background="black"
              className="w-28"
              onClick={handleApprove}
              disabled={isLoadingStatusFSP || isLoadingStatusSSP}
            >
              {isLoadingStatusFSP || isLoadingStatusSSP ? (
                <LoaderButtonAction />
              ) : (
                'Approve'
              )}
            </Button>
          </div>
        </div>
      </PopUp>
      {/* END POPUP APPROVE */}

      {/* POPUP REJECT */}
      <PopUp
        setIsOpenPopUp={setIsOpenPopUpDecline}
        isOpenPopUp={isOpenPopUpDecline}
        title="Konfirmasi"
      >
        <h5 className="mb-4 font-bold text-left">
          Apakah anda yakin! ingin menolak Request Service dengan informasi
          sebagai berikut :
        </h5>

        <div className="flex flex-col gap-2 capitalize">
          <div className="grid grid-cols-3">
            <p className="text-gray-400">Date / Time</p>
            <p className="col-span-2">
              {`${formatDate(getDetailData?.date)} | ${
                getDetailData?.time_start
              } - ${getDetailData?.time_finish}`}
            </p>
          </div>
          <div className="grid grid-cols-3">
            <p className="text-gray-400">Event Group</p>
            <p className="col-span-2">{getDetailData?.event_group_name}</p>
          </div>
          <div className="grid grid-cols-3">
            <p className="text-gray-400">Event Type</p>
            <p className="col-span-2">{getDetailData?.event_type}</p>
          </div>
          <div className="grid grid-cols-3">
            <p className="text-gray-400">Event Name</p>
            <p className="col-span-2">{getDetailData?.event_name}</p>
          </div>
          <div className="grid grid-cols-3">
            <p className="text-gray-400">Service Name</p>
            <p className="col-span-2">{getDetailData?.service_name}</p>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <div className="flex gap-2 mt-4">
            <Button
              background="red"
              className="w-28"
              onClick={handleCancelDecline}
              disabled={isLoadingStatusFSP || isLoadingStatusSSP}
            >
              {isLoadingStatusFSP || isLoadingStatusSSP ? (
                <LoaderButtonAction />
              ) : (
                'Cancel'
              )}
            </Button>
            <Button
              background="black"
              className="w-28"
              onClick={handleReject}
              disabled={isLoadingStatusFSP || isLoadingStatusSSP}
            >
              {isLoadingStatusFSP || isLoadingStatusSSP ? (
                <LoaderButtonAction />
              ) : (
                'Decline'
              )}
            </Button>
          </div>
        </div>
      </PopUp>
      {/* END POPUP REJECT */}

      {/* POPUP Expired Date */}
      <PopUp
        setIsOpenPopUp={setIsOpenPopUpExpiredDate}
        isOpenPopUp={isOpenPopUpExpiredDate}
        headerButton="false"
      >
        <div className="flex items-center justify-center w-16 h-16 p-2 mx-auto my-2 rounded-full bg-red-200/50">
          <PiWarningBold className="text-red-500 text-7xl animate-pulse" />
        </div>

        <h5 className="text-lg font-bold text-center ">Maaf!</h5>

        <p className="max-w-md mb-4 font-medium text-center">
          Penugasan ini sudah tidak berlaku dikarenakan event sudah berlalu,
          sehingga saat ini anda sudah tidak bisa melakukan{' '}
          <span className="text-ftgreen-600">Approval</span> or{' '}
          <span className="text-red-600">Decline</span> .
          <br />
          Pastikan memeriksa halaman penugasan agar tidak ada penugasan yang
          terlewatkan kembali. Terima kasih.
        </p>

        <div className="flex items-center justify-center">
          <div className="flex gap-2 mt-4">
            <Button
              background="black"
              className="w-28"
              onClick={handleCloseExpiredDate}
            >
              Ok
            </Button>
          </div>
        </div>
      </PopUp>
      {/* END POPUP Expired Date */}
    </div>
  );
};

export default TableManageServiceRequest;
