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
import { toast } from 'react-toastify';
import { MultiSelect } from '@/components/form-input';
import {
  useApprovalServiceMutation,
  useUpdateVisibilityMutation,
} from '@/services/api/serviceRequestApiSlice';

const customStylesSelect = {
  control: (provided, state) => ({
    ...provided,
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxShadow: 'inset 3px 3px 5px rgba(0, 0, 0, 0.15)',
    backgroundColor: 'rgb(209 213 219 / 0.5)',
    padding: '6px 3px',
    '&:hover': {
      border: '1px solid #aaa',
    },
  }),
  multiValue: (provided, state) => ({
    ...provided,
    backgroundColor: 'white',
    // borderRadius: '12px',
    padding: '1px 5px',
  }),
};

const TableListNewService = (props) => {
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
    optionsClients,
  } = props;

  const [isOpenPopUpApprove, setIsOpenPopUpApprove] = useState(false);
  const [isOpenPopUpDecline, setIsOpenPopUpDecline] = useState(false);
  const [isOpenPopUpVisibility, setIsOpenPopUpVisibility] = useState(false);
  const [getDetailData, setGetDetailData] = useState({});
  const [getDetailVisibility, setGetDetailVisibility] = useState({});
  const [selectedVisibility, setSelectedVisibility] = useState([]);

  const dataTable = data?.data;
  const meta = data?.meta;

  const totalPages = meta?.total_page;
  const totalRecords = meta?.total_record;

  const [approvalService, { isLoading: isLoadingApproveOrDecline }] =
    useApprovalServiceMutation();
  const [updateVisibility, { isLoading: isLoadingVisibility }] =
    useUpdateVisibilityMutation();

  const handleVisibility = async (e) => {
    e.preventDefault();

    try {
      const modifiedOptions = selectedVisibility.map((option) => option.value);

      const updateData = {
        id: getDetailVisibility?.id,
        users: modifiedOptions[0] === 'public' ? [] : modifiedOptions,
      };

      const response = await updateVisibility(updateData).unwrap();

      if (!response.error) {
        setIsOpenPopUpVisibility(false);
        setSelectedVisibility([]);
        setGetDetailVisibility({});
        toast.success(`Visibility has been update!`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      console.error(err);
      setIsOpenPopUpVisibility(false);
      toast.error(`Failed to update visibility`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const handleApprove = async (e) => {
    e.preventDefault();

    try {
      const approveData = {
        id: getDetailData?.id,
        status: 1,
      };

      const response = await approvalService(approveData).unwrap();

      if (!response.error) {
        setIsOpenPopUpApprove(false);
        setGetDetailData({});
        toast.success(`"${getDetailData?.name}" has been approve!`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to approve the service`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();

    try {
      const approveData = {
        id: getDetailData?.id,
        status: 2,
      };

      const response = await approvalService(approveData).unwrap();

      if (!response.error) {
        setIsOpenPopUpDecline(false);
        setGetDetailData({});
        toast.success(`"${getDetailData?.name}" has been Reject!`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to approve the service`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const handleIsOpenPopupVisibility = (data) => {
    setGetDetailVisibility(data);
    setIsOpenPopUpVisibility(true);
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
      name: 'Service ID',
      selector: (row) => row.code,
      sortable: true,
      wrap: true,
      minWidth: '120px',
    },
    {
      name: 'User ID',
      selector: (row) => row.created_by_code,
      cell: (row) =>
        `${row.created_by_code} - ${row.created_by_name || 'noname'}`,
      sortable: true,
      wrap: true,
      minWidth: '140px',
    },
    {
      name: 'Service Name',
      selector: (row) => row.name || '-',
      sortable: true,
      wrap: true,
      minWidth: '160px',
    },
    {
      name: 'Service Type',
      selector: (row) => row.service_type || '-',
      sortable: true,
      wrap: true,
      minWidth: '140px',
    },

    {
      name: 'Service Fees',
      selector: (row) => row.basic_fixed_fee || '-',
      cell: (row) => (
        <>
          <div className="flex flex-col py-1">
            {row.basic_fixed_fee !== 0 && (
              <span>Fixed Fee: {CurrencyFormat(row.basic_fixed_fee)}</span>
            )}
            {row.percent_to_shared !== 0 && (
              <span>% Paid to Other User: {row.percent_to_shared}%</span>
            )}
            {row.photo_price !== 0 && (
              <span>Photo Price: {CurrencyFormat(row.photo_price)}</span>
            )}
            {row.video_price !== 0 && (
              <span>Video Price: {CurrencyFormat(row.video_price)}</span>
            )}
            {row.score_price !== 0 && (
              <span>Score Price: {CurrencyFormat(row.score_price)}</span>
            )}
            {row.stream_price !== 0 && (
              <span>Stream Price: {CurrencyFormat(row.stream_price)}</span>
            )}

            {row?.variable_fees?.length === 0 ||
              (row?.variable_fees[0]?.amount !== 0 && (
                <>
                  <span className="text-gray-400">Variable Fees</span>
                  {row?.variable_fees?.map((item, i) => {
                    let unit;
                    const price = item?.fee_unit;

                    unit = `${item?.min_unit}-${item?.max_unit}`;

                    return (
                      <span key={`fixed-fee-${i}`} className="font-medium">
                        {`${unit} unit : ${CurrencyFormat(price)}`}
                      </span>
                    );
                  })}
                </>
              ))}
          </div>
        </>
      ),
      sortable: true,
      wrap: true,
      minWidth: '190px',
    },

    {
      name: 'Visibilty',
      selector: (row) => row.visibility || '-',
      cell: (row) => (
        <div className="w-full">
          {row?.status_approval !== 'rejected' &&
          row?.visibility[0] === 'waiting for admin to decide' ? (
            <Button
              background="none"
              className="text-xs bg-ftbrown hover:bg-opacity-90"
              onClick={() => handleIsOpenPopupVisibility(row)}
            >
              Set Visibility
            </Button>
          ) : row.visibility.length !== 0 ? (
            <span className="font-medium capitalize">
              {row?.visibility[0] === 'waiting for admin to decide'
                ? '-'
                : row.visibility.join(', ')}
            </span>
          ) : (
            <ul className={`font-medium capitalize`}>
              {row?.users?.map((user, i) => (
                <li key={`${user?.id || i}-${user?.name}`}>{user?.name}</li>
              ))}
            </ul>
          )}
        </div>
      ),
      minWidth: '160px',
    },

    {
      name: 'Approval Status',
      selector: (row) => row.status_approval || '-',
      sortable: true,
      minWidth: '180px',
      center: true,
      cell: (row) => (
        <>
          {row.status_approval === 'waiting for approval' ? (
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
          ) : (
            <span
              className={`capitalize font-medium ${
                row.status_approval === 'approved'
                  ? 'text-ftgreen-600'
                  : 'text-red-600'
              }`}
            >
              {row.status_approval}
            </span>
          )}
        </>
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
            data={dataTable}
            fixedHeader
            fixedHeaderScrollHeight="40vh"
            customStyles={customTableStyles}
            persistTableHead
            noDataComponent={<NoDataMessage title="New Service" />}
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

      {/* POPUP VISIBILITY */}
      <PopUp
        setIsOpenPopUp={setIsOpenPopUpVisibility}
        isOpenPopUp={isOpenPopUpVisibility}
        title="Update Visibility"
        className="max-w-[90%]"
      >
        <form>
          <div className="">
            <MultiSelect
              label="Users"
              placeholder="Select Users"
              options={optionsClients}
              styles={customStylesSelect}
              selectedOptions={selectedVisibility}
              setSelectedOptions={setSelectedVisibility}
            />
          </div>

          <div className="flex items-center justify-end">
            <div className="flex gap-2 mt-4">
              <Button
                background="red"
                className="w-28"
                onClick={() => setIsOpenPopUpVisibility(false)}
                disabled={isLoadingVisibility}
              >
                {isLoadingVisibility ? <LoaderButtonAction /> : 'Cancel'}
              </Button>
              <Button
                background="black"
                className="w-28"
                onClick={handleVisibility}
                disabled={isLoadingVisibility}
              >
                {isLoadingVisibility ? <LoaderButtonAction /> : 'Ok'}
              </Button>
            </div>
          </div>
        </form>
      </PopUp>
      {/* END POPUP VISIBILITY */}

      {/* POPUP APPROVE */}
      <PopUp
        setIsOpenPopUp={setIsOpenPopUpApprove}
        isOpenPopUp={isOpenPopUpApprove}
        title="Konfirmasi"
      >
        <h5 className="mb-4 font-bold text-left">
          Apakah anda yakin! ingin menyetujui Service dengan informasi sebagai
          berikut :
        </h5>

        <div className="flex flex-col gap-2 capitalize">
          <div className="grid grid-cols-3">
            <p className="text-gray-400">Service ID</p>
            <p className="col-span-2">{getDetailData?.code}</p>
          </div>
          <div className="grid grid-cols-3">
            <p className="text-gray-400">Service Name</p>
            <p className="col-span-2">{getDetailData?.name}</p>
          </div>
          <div className="grid grid-cols-3">
            <p className="text-gray-400">Service Type</p>
            <p className="col-span-2">{getDetailData?.service_type}</p>
          </div>
          <div className="grid grid-cols-3">
            <p className="text-gray-400">Visibility</p>
            <p className="col-span-2">{getDetailData?.visibility}</p>
          </div>
          <div className="grid grid-cols-3">
            <p className="text-gray-400">Service Fees</p>
            <p className="flex flex-col col-span-2">
              {getDetailData.fixed_fee?.map((item, i) => {
                let time;
                const price = item.amount;

                if (i === 0) {
                  time = `${item.min}-${item.max}`;
                } else {
                  time = `<${item.max}`;
                }

                return (
                  <span key={`fixed-fee-${i}`} className="font-medium">
                    {`${time} hours : ${CurrencyFormat(price)}`}
                  </span>
                );
              })}
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

      {/* POPUP REJECT */}
      <PopUp
        setIsOpenPopUp={setIsOpenPopUpDecline}
        isOpenPopUp={isOpenPopUpDecline}
        title="Konfirmasi"
      >
        <h5 className="mb-4 font-bold text-left">
          Apakah anda yakin! ingin menolak Service dengan informasi sebagai
          berikut :
        </h5>

        <div className="flex flex-col gap-2 capitalize">
          <div className="grid grid-cols-3">
            <p className="text-gray-400">Service ID</p>
            <p className="col-span-2">{getDetailData?.code}</p>
          </div>
          <div className="grid grid-cols-3">
            <p className="text-gray-400">Service Name</p>
            <p className="col-span-2">{getDetailData?.name}</p>
          </div>
          <div className="grid grid-cols-3">
            <p className="text-gray-400">Service Type</p>
            <p className="col-span-2">{getDetailData?.service_type}</p>
          </div>
          <div className="grid grid-cols-3">
            <p className="text-gray-400">Visibility</p>
            <p className="col-span-2">{getDetailData?.visibility}</p>
          </div>
          <div className="grid grid-cols-3">
            <p className="text-gray-400">Service Fees</p>
            <p className="flex flex-col col-span-2">
              {getDetailData.fixed_fee?.map((item, i) => {
                let time;
                const price = item.amount;

                if (i === 0) {
                  time = `${item.min}-${item.max}`;
                } else {
                  time = `<${item.max}`;
                }

                return (
                  <span key={`fixed-fee-${i}`} className="font-medium">
                    {`${time} hours : ${CurrencyFormat(price)}`}
                  </span>
                );
              })}
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
              onClick={handleReject}
              disabled={isLoadingApproveOrDecline}
            >
              {isLoadingApproveOrDecline ? <LoaderButtonAction /> : 'Reject'}
            </Button>
          </div>
        </div>
      </PopUp>
      {/* END POPUP REJECT */}
    </div>
  );
};

export default TableListNewService;
