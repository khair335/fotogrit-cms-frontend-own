import React from 'react';

import DataTable from 'react-data-table-component';

import { SkeletonTable } from '../../Skeleton';

import { Button, ButtonAction, Pagination, PopUp } from '@/components';
import { customTableStyles } from '@/constants/tableStyle';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';

const TableListInvitation = (props) => {
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
  } = props;

  const totalPages = 3;
  const totalRecords = 12;

  const [isOpenPopUpApprove, setIsOpenPopUpApprove] = useState(false);
  const [isOpenPopUpDecline, setIsOpenPopUpDecline] = useState(false);
  const [getDetailData, setGetDetailData] = useState({});

  const handleIsOpenPopupApprove = (data) => {
    setGetDetailData(data);
    setIsOpenPopUpApprove(true);
  };

  const handleIsOpenPopupDecline = (data) => {
    setGetDetailData(data);
    setIsOpenPopUpDecline(true);
  };

  const handleApprove = () => {
    setIsOpenPopUpApprove(false);
    setGetDetailData((getDetailData.isApproved = true));
  };

  const handleCancelApprove = () => {
    setGetDetailData({});
    setIsOpenPopUpApprove(false);
  };

  const handleCancelDecline = () => {
    setGetDetailData({});
    setIsOpenPopUpDecline(false);
  };

  // Columns Table
  const columns = [
    {
      name: 'Event Group Name',
      selector: (row) => row.eventGroupName,
      cell: (row) => (
        <div className="flex flex-col gap-3 w-full h-full py-3">
          <p>{row.eventGroupName}</p>
          <Link to={row.link}>
            <p className="text-ftblue underline italic">{row.link}</p>
          </Link>
        </div>
      ),
      width: '200px',
    },
    {
      name: 'Age Group',
      selector: (row) => row.ageGroup,
      sortable: true,
      wrap: true,
      minWidth: '130px',
    },
    {
      name: 'Event Type',
      selector: (row) => row.eventType,
      sortable: true,
      wrap: true,
      minWidth: '130px',
    },
    {
      name: 'Slots',
      selector: (row) => row.slots,
      sortable: true,
      wrap: true,
      minWidth: '80px',
    },
    {
      name: 'Total Price',
      selector: (row) => CurrencyFormat(row.totalPrice),
      sortable: true,
      wrap: true,
      minWidth: '130px',
    },
    {
      name: 'Location',
      selector: (row) => row.location,
      sortable: true,
      wrap: true,
      minWidth: '130px',
    },
    {
      name: 'Event Date',
      selector: (row) => row.eventDate,
      sortable: true,
      wrap: true,
      minWidth: '180px',
    },
    {
      name: 'Action',
      center: true,
      width: '240px',
      cell: (props) => (
        <div className="flex flex-row-reverse items-center gap-2 py-2 flex-1">
          {!props.isApproved && (
            <ButtonAction
              setGetData={setGetData}
              setOpenModal={setOpenModal}
              {...props}
            />
          )}

          {!props.isApproved && (
            <div className="flex gap-2 flex-1">
              <Button
                background="green"
                onClick={() => {
                  handleIsOpenPopupApprove(props);
                }}
              >
                Approve
              </Button>

              <Button
                background="red"
                onClick={() => {
                  handleIsOpenPopupDecline(props);
                }}
              >
                Decline
              </Button>
            </div>
          )}

          {props.isApproved && (
            <Button background="brown" className="w-full">
              Add to Cart
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="border-t border-gray-200">
        <DataTable
          columns={columns}
          data={data}
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

      {/* POPUP APPROVE */}
      <PopUp
        setIsOpenPopUp={setIsOpenPopUpApprove}
        isOpenPopUp={isOpenPopUpApprove}
        title="Konfirmasi"
      >
        <h5 className="mb-4 font-bold text-left">
          Apakah anda yakin menyetujui invitation dengan informasi sebagai
          berikut :
        </h5>

        <div className="flex flex-col gap-2 capitalize">
          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-400">Event Group Name</p>
            <p className="col-span-2">{getDetailData?.eventGroupName}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-400">Age Group</p>
            <p className="col-span-2">{getDetailData?.ageGroup}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-400">Event Type</p>
            <p className="col-span-2">{getDetailData?.eventType}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-400">Slots</p>
            <p className="col-span-2">{getDetailData?.slots}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-400">Total Price</p>
            <p className="col-span-2">{getDetailData?.totalPrice}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-400">Location</p>
            <p className="col-span-2">{getDetailData?.location}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-400">Event Date</p>
            <p className="col-span-2">{getDetailData?.eventDate}</p>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <div className="flex gap-2 mt-4">
            <Button
              background="red"
              className="w-28"
              onClick={handleCancelApprove}
            >
              Cancel
            </Button>
            <Button background="black" className="w-28" onClick={handleApprove}>
              Approve
            </Button>
          </div>
        </div>
      </PopUp>
      {/* END POPUP APPROVE */}

      {/* POPUP APPROVE */}
      <PopUp
        setIsOpenPopUp={setIsOpenPopUpDecline}
        isOpenPopUp={isOpenPopUpDecline}
        title="Konfirmasi"
      >
        <h5 className="mb-4 font-bold text-left">
          Apakah anda yakin menolak invitation dengan informasi sebagai berikut
          :
        </h5>

        <div className="flex flex-col gap-2 capitalize">
          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-400">Event Group Name</p>
            <p className="col-span-2">{getDetailData?.eventGroupName}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-400">Age Group</p>
            <p className="col-span-2">{getDetailData?.ageGroup}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-400">Event Type</p>
            <p className="col-span-2">{getDetailData?.eventType}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-400">Slots</p>
            <p className="col-span-2">{getDetailData?.slots}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-400">Total Price</p>
            <p className="col-span-2">{getDetailData?.totalPrice}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-400">Location</p>
            <p className="col-span-2">{getDetailData?.location}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-400">Event Date</p>
            <p className="col-span-2">{getDetailData?.eventDate}</p>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <div className="flex gap-2 mt-4">
            <Button
              background="red"
              className="w-28"
              onClick={handleCancelDecline}
            >
              Cancel
            </Button>
            <Button background="black" className="w-28">
              Reject
            </Button>
          </div>
        </div>
      </PopUp>
      {/* END POPUP APPROVE */}
    </div>
  );
};

export default TableListInvitation;
