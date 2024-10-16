import React, { useState } from 'react';
import DataTable from 'react-data-table-component';

import { ErrorFetchingData, NoDataMessage } from '@/components/Errors';
import { SkeletonTable } from '@/components/Skeleton';
import {
  Button,
  ButtonAction,
  LoaderButtonAction,
  Pagination,
  PopUp,
} from '@/components';

import { CurrencyFormat } from '@/helpers/CurrencyFormat';
import { customTableStyles } from '@/constants/tableStyle';
import { useApproveReferralCodeMutation } from '@/services/api/referralCodeApiSlice';
import { toast } from 'react-toastify';
import { formatDate } from '@/helpers/FormatDate';

const TableApprovalWalletBenefits = (props) => {
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

  const [isOpenPopUpApprove, setIsOpenPopUpApprove] = useState(false);
  const [isOpenPopUpDecline, setIsOpenPopUpDecline] = useState(false);
  const [getDetailData, setGetDetailData] = useState({});

  const referralCode = data?.data;
  const meta = data?.meta;

  const totalPages = meta?.total_page;
  const totalRecords = meta?.total_record;

  const [approveReferralCode, { isLoading: isLoadingApproveOrDecline }] =
    useApproveReferralCodeMutation();

  const handleApprove = async (e) => {
    e.preventDefault();

    try {
      const approveData = {
        id: getDetailData?.id,
        status: 1,
      };

      const response = await approveReferralCode(approveData).unwrap();

      if (!response.error) {
        setIsOpenPopUpApprove(false);
        setGetDetailData({});
        toast.success(`"${getDetailData?.code}" has been approved.`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to approved the data`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const handleDecline = async (e) => {
    e.preventDefault();

    try {
      const approveData = {
        id: getDetailData?.id,
        status: 2,
      };

      const response = await approveReferralCode(approveData).unwrap();

      if (!response.error) {
        setIsOpenPopUpDecline(false);
        setGetDetailData({});
        toast.success(`"${getDetailData?.code}" has been Decline!`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to approve the data`, {
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

  const columns = [
    {
      name: 'Valid Until',
      selector: (row) => formatDate(row.expired_date),
      sortable: true,
      wrap: true,
      minWidth: '120px',
    },
    {
      name: 'User ID - Name',
      selector: (row) => row.user,
      sortable: true,
      wrap: true,
      minWidth: '160px',
    },
    {
      name: 'Name of Code',
      selector: (row) => row.code,
      sortable: true,
      minWidth: '140px',
    },
    {
      name: 'Wallet Amount',
      selector: (row) => row.amount,
      cell: (row) => CurrencyFormat(row.amount),
      sortable: true,
      width: '160px',
    },
    {
      name: 'Approval Status',
      minWidth: '190px',
      center: true,
      cell: (row) => (
        <div className="flex gap-2">
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
            Decline
          </Button>
        </div>
      ),
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
            data={referralCode}
            fixedHeader
            fixedHeaderScrollHeight="54vh"
            customStyles={customTableStyles}
            persistTableHead
            noDataComponent={<NoDataMessage title="Aproval Wallet Benefits" />}
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

      {/* POPUP APPROVE */}
      <PopUp
        setIsOpenPopUp={setIsOpenPopUpApprove}
        isOpenPopUp={isOpenPopUpApprove}
        title="Konfirmasi"
      >
        <h5 className="mb-4 font-bold text-left">
          Apakah anda yakin! ingin menyetujui Wallet Code dengan informasi
          sebagai berikut :
        </h5>

        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-3">
            <p className="text-gray-400">User ID</p>
            <p className="col-span-2">{getDetailData?.user}</p>
          </div>
          <div className="grid grid-cols-3">
            <p className="text-gray-400">Code</p>
            <p className="col-span-2">{getDetailData?.code}</p>
          </div>
          <div className="grid grid-cols-3">
            <p className="text-gray-400">Quota</p>
            <p className="col-span-2">{getDetailData?.quota}</p>
          </div>
          <div className="grid grid-cols-3">
            <p className="text-gray-400">Valid Until</p>
            <p className="col-span-2">
              {formatDate(getDetailData?.expired_date)}
            </p>
          </div>
          <div className="grid grid-cols-3">
            <p className="text-gray-400">Wallet Amount</p>
            <p className="col-span-2">
              {CurrencyFormat(getDetailData?.amount)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <div className="flex gap-2 mt-4">
            <Button
              background="red"
              className="w-28"
              onClick={handleCancelApprove}
              disabled={isLoadingApproveOrDecline}
            >
              {isLoadingApproveOrDecline ? <LoaderButtonAction /> : 'Cancel'}
            </Button>
            <Button
              background="black"
              className="w-28"
              onClick={handleApprove}
              disabled={isLoadingApproveOrDecline}
            >
              {isLoadingApproveOrDecline ? <LoaderButtonAction /> : 'Approve'}
            </Button>
          </div>
        </div>
      </PopUp>
      {/* END POPUP APPROVE */}

      {/* POPUP DECLINE */}
      <PopUp
        setIsOpenPopUp={setIsOpenPopUpDecline}
        isOpenPopUp={isOpenPopUpDecline}
        title="Konfirmasi"
      >
        <h5 className="mb-4 font-bold text-left">
          Apakah anda yakin! ingin menolak Wallet Code dengan informasi sebagai
          berikut :
        </h5>

        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-3">
            <p className="text-gray-400">User ID</p>
            <p className="col-span-2">{getDetailData?.user}</p>
          </div>
          <div className="grid grid-cols-3">
            <p className="text-gray-400">Code</p>
            <p className="col-span-2">{getDetailData?.code}</p>
          </div>
          <div className="grid grid-cols-3">
            <p className="text-gray-400">Quota</p>
            <p className="col-span-2">{getDetailData?.quota}</p>
          </div>
          <div className="grid grid-cols-3">
            <p className="text-gray-400">Valid Until</p>
            <p className="col-span-2">
              {formatDate(getDetailData?.expired_date)}
            </p>
          </div>
          <div className="grid grid-cols-3">
            <p className="text-gray-400">Wallet Amount</p>
            <p className="col-span-2">
              {CurrencyFormat(getDetailData?.amount)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <div className="flex gap-2 mt-4">
            <Button
              background="red"
              className="w-28"
              onClick={handleCancelDecline}
              disabled={isLoadingApproveOrDecline}
            >
              {isLoadingApproveOrDecline ? <LoaderButtonAction /> : 'Cancel'}
            </Button>
            <Button
              background="black"
              className="w-28"
              onClick={handleDecline}
              disabled={isLoadingApproveOrDecline}
            >
              {isLoadingApproveOrDecline ? <LoaderButtonAction /> : 'Decline'}
            </Button>
          </div>
        </div>
      </PopUp>
      {/* END POPUP DECLINE */}
    </div>
  );
};

export default TableApprovalWalletBenefits;
