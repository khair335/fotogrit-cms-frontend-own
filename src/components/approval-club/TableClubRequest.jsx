import DataTable from 'react-data-table-component';

import {
  Button,
  ButtonAction,
  LoaderButtonAction,
  Pagination,
  PopUp,
} from '@/components';

import { customTableStyles } from '@/constants/tableStyle';
import { useState } from 'react';
import { formatDate } from '@/helpers/FormatDate';

const TableClubRequest = (props) => {
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

  const clubRequest = data;
  // const metaClubData = data?.meta;
  const totalPages = 3;
  const totalRecords = clubRequest?.length;

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

  const handleCancelApprove = () => {
    setGetDetailData({});
    setIsOpenPopUpApprove(false);
  };

  const handleCancelDecline = () => {
    setGetDetailData({});
    setIsOpenPopUpDecline(false);
  };

  const columns = [
    {
      name: 'Date',
      selector: (row) => row.date,
      sortable: true,
      wrap: true,
      width: '100px',
      minWidth: '100px',
    },
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
      width: '100px',
      center: true,
    },
    {
      name: 'Created By',
      selector: (row) => row.createdBy,
      sortable: true,
      wrap: true,
      minWidth: '100px',
    },
    {
      name: 'Club name',
      selector: (row) => row.clubName,
      sortable: true,
      minWidth: '130px',
      wrap: true,
    },
    {
      name: 'PIC User Id',
      selector: (row) => row.picUserId,
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: 'Legal Document Number',
      selector: (row) => row.legalDocumentNumber,
      sortable: true,
      wrap: true,
      minWidth: '250px',
    },
    {
      name: 'Action',
      center: true,
      width: '180px',
      cell: (row) => {
        return (
          <div className="flex gap-1">
            <Button
              background="green"
              className="text-xs"
              onClick={() => handleIsOpenPopupApprove(row)}
            >
              Approve
            </Button>
            <Button
              background="red"
              className="text-xs"
              onClick={() => handleIsOpenPopupDecline(row)}
            >
              Reject
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="border-t border-gray-200 ">
        <DataTable
          columns={columns}
          data={clubRequest}
          fixedHeader
          fixedHeaderScrollHeight="50vh"
          responsive={true}
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
          Apakah anda yakin menyetujui club dengan informasi sebagai berikut :
        </h5>

        <div className="flex flex-col gap-2 capitalize">
          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-400">Date</p>
            <p className="col-span-2">{getDetailData?.date}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-400">Created By</p>
            <p className="col-span-2">{getDetailData?.createdBy}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-400">Club name</p>
            <p className="col-span-2">{getDetailData?.clubName}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-400">PIC User Id</p>
            <p className="col-span-2">{getDetailData?.picUserId}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-400">Legal documentation Number</p>
            <p className="col-span-2">{getDetailData?.legalDocumentNumber}</p>
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
            <Button
              background="black"
              className="w-28"
              // onClick={handleApprove}
            >
              Approve
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
          Apakah anda yakin! ingin menolak club dengan informasi sebagai berikut
          :
        </h5>

        <div className="flex flex-col gap-2 capitalize">
          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-400">Date</p>
            <p className="col-span-2">{getDetailData?.date}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-400">Created By</p>
            <p className="col-span-2">{getDetailData?.createdBy}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-400">Club name</p>
            <p className="col-span-2">{getDetailData?.clubName}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-400">PIC User Id</p>
            <p className="col-span-2">{getDetailData?.picUserId}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-400">Legal documentation Number</p>
            <p className="col-span-2">{getDetailData?.legalDocumentNumber}</p>
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
            <Button
              background="black"
              className="w-28"
              //   onClick={handleReject}
            >
              Reject
            </Button>
          </div>
        </div>
      </PopUp>
      {/* END POPUP REJECT */}
    </div>
  );
};

export default TableClubRequest;
