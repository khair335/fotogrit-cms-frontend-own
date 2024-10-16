import { Suspense, lazy, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { PiWarningBold } from 'react-icons/pi';

const LazyBreadcrumb = lazy(() => import('@/components/Breadcrumb'));
const LazyFilterSearch = lazy(() =>
  import('@/components/form-input/FilterSearch')
);
const LazyFilterSelect = lazy(() =>
  import('@/components/form-input/FilterSelect')
);
const LazyTablePaymentCart = lazy(() =>
  import('@/components/payment-cart/TablePaymentCart')
);

import {
  Button,
  LoaderButtonAction,
  Modal,
  PopUp,
  PopUpDelete,
} from '@/components';
import { Card, CardBody } from '@/components/Card';
import { TextArea } from '@/components/form-input';
import { FormDetailPaymentCart } from '@/components/payment-cart';
import {
  SkeletonBlock,
  SkeletonBreadcrumb,
  SkeletonTable,
} from '@/components/Skeleton';

import {
  useCartValidationMutation,
  useDeleteCartMediaMutation,
  useDeleteServiceRequestContractMutation,
  useDeleteServiceRequestMutation,
  useDeleteServiceSubcontractDetailMutation,
  useDeleteServiceSubcontractMutation,
  useEndContractRequestMutation,
  useGetPaymentCartQuery,
} from '@/services/api/paymentCartApiSlice';
import { optionsItems, optionsProviders } from '@/constants';
import { CapitalizeFirstLetter } from '@/helpers/CapitalizeFirstLetter';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/services/state/authSlice';
import getWebAppUrl from '@/helpers/GetWebAppUrl';

const breadcrumbItems = [
  { label: 'Payment / Cart', url: '#' },
  { label: 'Payment List' },
];

const PaymentCart = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [inputReason, setInputReason] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [getData, setGetData] = useState('');
  const [selectedRows, setSelectedRows] = useState(null);
  const [clearSelectedRows, setClearSelectedRows] = useState(false);
  const [selectedRowsSubItems, setSelectedRowsSubItems] = useState(null);
  const [isOpenPopUpConfirmationBuy, setIsOpenPopUpConfirmationBuy] =
    useState(false);
  const [isOpenPopUpTerminating, setIsOpenPopUpTerminating] = useState(false);
  const [isOpenPopUpEndContract, setIsOpenPopUpEndContract] = useState(false);
  const [isOpenPopUpExtraEvent, setIsOpenPopUpExtraEvent] = useState(false);
  const [isOpenPopUpDelete, setIsOpenPopUpDelete] = useState(false);
  const [isOpenPopUpCantDelete, setIsOpenPopUpCantDelete] = useState(false);
  const [isOpenPopUpAlert, setIsOpenPopUpAlert] = useState(false);
  const [msgAlert, setMsgAlert] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [filterSelectProvider, setFilterSelectProvider] = useState('');

  const userProfile = useSelector(selectCurrentUser);

  // Flatten nested arrays in 'selectedRowsSubItems' object
  const selectedRowsSubItemsArray = selectedRowsSubItems
    ? Object.values(selectedRowsSubItems).flat() || []
    : [];

  const combineSelectedRows = [
    ...(selectedRows || []),
    ...selectedRowsSubItemsArray,
  ];

  const {
    data: paymentCarts,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPaymentCartQuery({
    type: selectedItem,
    serviceType: filterSelectProvider,
  });

  const [endContractRequest, { isLoading: isLoadingEndContract }] =
    useEndContractRequestMutation();
  const [cartValidation, { isLoading: isLoadingValidate }] =
    useCartValidationMutation();

  const [deleteCartMedia, { isLoading: isLoadingDelete }] =
    useDeleteCartMediaMutation();
  const [deleteServiceRequestContract] =
    useDeleteServiceRequestContractMutation();
  const [deleteServiceRequest] = useDeleteServiceRequestMutation();
  useDeleteServiceRequestContractMutation();
  const [deleteServiceSubcontractDetail] =
    useDeleteServiceSubcontractDetailMutation();
  const [deleteServiceSubcontract] = useDeleteServiceSubcontractMutation();

  const handleBuy = async () => {
    try {
      const dataMedia = selectedRows
        ?.filter((item) => item?.cart_type === 1)
        .map?.((service) => service?.id);

      const dataServicesContract = selectedRows?.filter(
        (item) => item?.cart_type === 3 && item?.is_contract
      );
      const dataServices = selectedRowsSubItemsArray?.filter(
        (item) => item?.cart_type === 3 && !item?.is_contract
      );
      const dataSubContract = selectedRows?.filter(
        (item) => item?.cart_type === 4 && item?.is_contract
      );
      const dataSubContractDetail = selectedRowsSubItemsArray?.filter(
        (item) => item?.cart_type === 4 && !item?.is_contract
      );

      const validData = {
        media: dataMedia || [],
        contracts:
          dataServices?.length !== 0
            ? dataServices?.reduce((acc, service) => {
                const existingContract = acc.find(
                  (contract) => contract?.id === service?.service_contract_id
                );

                if (existingContract) {
                  existingContract?.item_id?.push(service.id);
                } else {
                  acc.push({
                    id: service?.service_contract_id,
                    item_id: [service.id],
                  });
                }

                return acc;
              }, [])
            : dataServicesContract?.map((contract) => ({
                id: contract?.id,
                item_id: [],
              })),
        subcontracts:
          dataSubContractDetail?.length !== 0
            ? dataSubContractDetail?.reduce((acc, service) => {
                const existingContract = acc.find(
                  (contract) => contract?.id === service?.subcontract_id
                );

                if (existingContract) {
                  existingContract?.item_id?.push(service.id);
                } else {
                  acc.push({
                    id: service?.subcontract_id,
                    item_id: [service.id],
                  });
                }

                return acc;
              }, [])
            : dataSubContract?.map((contract) => ({
                id: contract?.id,
                item_id: [],
              })),
      };

      const response = await cartValidation(validData).unwrap();

      if (!response.error) {
        const hasAnyServiceItem = combineSelectedRows?.some(
          (item) => item?.cart_type === 3 || item?.cart_type === 4
        );

        if (hasAnyServiceItem) {
          const hasAnyZeroRemainingAssignment = combineSelectedRows?.some(
            (item) => item?.remaining_assignment === 0
          );
          const isNotExtraEventBasedContractType = combineSelectedRows?.some(
            (row) => !['per day', 'per event'].includes(row?.contract_type)
          );

          if (
            hasAnyZeroRemainingAssignment &&
            isNotExtraEventBasedContractType
          ) {
            setIsOpenPopUpExtraEvent(true);
          } else {
            setIsOpenPopUpConfirmationBuy(true);
          }
        } else {
          setIsOpenPopUpConfirmationBuy(true);
        }
      }
    } catch (err) {
      console.error('Failed :', err);

      setMsgAlert(err?.data?.message);
      setIsOpenPopUpAlert(true);
    }
  };

  const handleEndContract = async (e) => {
    e.preventDefault();

    try {
      const response = await endContractRequest({
        service_contract_id: getData?.id,
        reason: inputReason,
      }).unwrap();

      if (!response.error) {
        toast.success(`End contract has been success!`, {
          position: 'top-right',
          theme: 'light',
        });
        setIsOpenPopUpEndContract(false);
        setIsOpenPopUpTerminating(false);
        setOpenModal(false);
        setInputReason('');
        setClearSelectedRows(true);
      }
    } catch (err) {
      setIsOpenPopUpEndContract(false);
      setIsOpenPopUpTerminating(false);
      setInputReason('');
      console.error('Failed :', err);
      toast.error(`Failed: ${err?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const URL_WEB_APP = getWebAppUrl;

  // Find events from a contract service
  const findEventsFromContractService = (contractId) => {
    const contractEvents = Array.isArray(selectedRowsSubItemsArray)
      ? selectedRowsSubItemsArray?.filter(
          (item) =>
            item?.service_contract_id === contractId ||
            item?.subcontract_id === contractId
        )
      : [];

    return contractEvents;
  };

  // Function to generate contract service result
  const generateContractService = () => {
    if (!Array.isArray(selectedRows) || selectedRows?.length === 0) {
      // If selectedRows empty
      if (
        Array.isArray(selectedRowsSubItemsArray) &&
        selectedRowsSubItemsArray?.length > 0
      ) {
        // If selectedRowsSubItemsArray has data
        const contractIdToEventsMap = {};

        selectedRowsSubItemsArray
          ?.filter((item) => item?.cart_type === 3)
          ?.forEach((subItem) => {
            const contractId = subItem?.service_contract_id;
            const contractEvents = findEventsFromContractService(contractId);

            // Update contractIdToEventsMap with events for each contractId
            if (!contractIdToEventsMap[contractId]) {
              contractIdToEventsMap[contractId] = new Set(
                contractEvents?.map((event) => event?.id)
              );
            } else {
              contractEvents?.forEach((event) => {
                contractIdToEventsMap[contractId].add(event?.id);
              });
            }
          });

        // Map contractIdToEventsMap to result array
        const result = Object.keys(contractIdToEventsMap)?.map((contractId) => {
          const contractEvents = Array.from(contractIdToEventsMap[contractId]);

          return `${contractId}@-${contractEvents?.join('@-')}`;
        });

        return result?.join('*-');
      }
    } else {
      // if selectedRows has data
      const result = selectedRows
        ?.filter((item) => item?.cart_type === 3)
        ?.map((contract) => {
          const contractId = contract?.id;
          const contractEvents = findEventsFromContractService(contractId);

          // Construct contractString based on contractEvents
          const contractString =
            contractEvents?.length !== 0
              ? `${contractId}@-${contractEvents
                  ?.map((event) => event.id)
                  ?.join('@-')}`
              : `${contractId}`;

          return contractString;
        });

      return result?.join('*-');
    }
  };

  // Function to generate contract service result
  const generateSubcontractService = () => {
    if (!Array.isArray(selectedRows) || selectedRows?.length === 0) {
      // If selectedRows empty
      if (
        Array.isArray(selectedRowsSubItemsArray) &&
        selectedRowsSubItemsArray?.length > 0
      ) {
        // If selectedRowsSubItemsArray has data
        const contractIdToEventsMap = {};

        selectedRowsSubItemsArray
          ?.filter((item) => item?.cart_type === 4)
          ?.forEach((subItem) => {
            const contractId = subItem?.subcontract_id;
            const contractEvents = findEventsFromContractService(contractId);

            // Update contractIdToEventsMap with events for each contractId
            if (!contractIdToEventsMap[contractId]) {
              contractIdToEventsMap[contractId] = new Set(
                contractEvents?.map((event) => event?.id)
              );
            } else {
              contractEvents?.forEach((event) => {
                contractIdToEventsMap[contractId].add(event?.id);
              });
            }
          });

        // Map contractIdToEventsMap to result array
        const result = Object.keys(contractIdToEventsMap)?.map((contractId) => {
          const contractEvents = Array.from(contractIdToEventsMap[contractId]);

          return `${contractId}@-${contractEvents?.join('@-')}`;
        });

        return result?.join('*-');
      }
    } else {
      // if selectedRows has data
      const result = selectedRows
        ?.filter((item) => item?.cart_type === 4)
        ?.map((contract) => {
          const contractId = contract?.id;
          const contractEvents = findEventsFromContractService(contractId);

          // Construct contractString based on contractEvents
          const contractString =
            contractEvents?.length !== 0
              ? `${contractId}@-${contractEvents
                  ?.map((event) => event.id)
                  ?.join('@-')}`
              : `${contractId}`;

          return contractString;
        });

      return result?.join('*-');
    }
  };

  const handleOkConfirmation = () => {
    setIsOpenPopUpConfirmationBuy(false);
    setIsOpenPopUpExtraEvent(false);

    if (combineSelectedRows) {
      const generateMedia = combineSelectedRows
        ?.filter((item) => item?.cart_type === 1)
        ?.map?.((item) => item?.id)
        .join('*-');

      const dataContracts = generateContractService();
      const dataSubcontracts = generateSubcontractService();
      const dataUserID = userProfile?.id;

      const link = `${URL_WEB_APP}/#/cart/detail_order?media=${generateMedia}&contracts=${dataContracts}&subcontracts=${dataSubcontracts}&user=${dataUserID}`;

      window.open(link, '_blank', 'noopener noreferrer');

      window.location.reload();
    }
  };

  const handleDelete = useMemo(() => {
    const handleDelete = async () => {
      try {
        const filterAndMapMedia = combineSelectedRows
          ?.filter?.((item) => item?.cart_type === 1)
          ?.map?.((item) => item?.id);
        const filterAndMapService = combineSelectedRows
          ?.filter?.((item) => item?.cart_type === 3 && !item?.is_contract)
          ?.map?.((item) => item?.id);
        const filterAndMapContract = combineSelectedRows
          ?.filter?.((item) => item?.cart_type === 3 && item?.is_contract)
          ?.map?.((item) => item?.id);
        const filterAndMapSubcontractDetail = combineSelectedRows
          ?.filter?.((item) => item?.cart_type === 4 && !item?.is_contract)
          ?.map?.((item) => item?.id);
        const filterAndMapSubcontract = combineSelectedRows
          ?.filter?.((item) => item?.cart_type === 4 && item?.is_contract)
          ?.map?.((item) => item?.id);

        const deleteMedia = { id: filterAndMapMedia };
        const deleteService = { id: filterAndMapService };
        const deleteContract = { id: filterAndMapContract };
        const deleteSubcontractDetail = { id: filterAndMapSubcontractDetail };
        const deleteSubcontract = { id: filterAndMapSubcontract };

        let response;
        if (filterAndMapMedia?.length > 0) {
          response = await deleteCartMedia(deleteMedia).unwrap();
        }

        if (filterAndMapService?.length > 0) {
          response = await deleteServiceRequest(deleteService).unwrap();
        }
        if (filterAndMapContract?.length > 0) {
          response = await deleteServiceRequestContract(
            deleteContract
          ).unwrap();
        }

        if (filterAndMapSubcontractDetail?.length > 0) {
          response = await deleteServiceSubcontractDetail(
            deleteSubcontractDetail
          ).unwrap();
        }
        if (filterAndMapSubcontract?.length > 0) {
          response = await deleteServiceSubcontract(deleteSubcontract).unwrap();
        }

        if (!response.error) {
          setClearSelectedRows(!clearSelectedRows);
          setSelectedRows([]);
          setSelectedRowsSubItems([]);
          setIsOpenPopUpDelete(false);
          toast.success(`Item has been remove from the cart.`, {
            position: 'top-right',
            theme: 'light',
          });
        }
      } catch (err) {
        setClearSelectedRows(!clearSelectedRows);
        setSelectedRows([]);
        setSelectedRowsSubItems([]);
        setIsOpenPopUpDelete(false);
        console.error('Failed to delete data', err);
        toast.error(`Failed: ${err?.data?.message}`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    };
    return handleDelete;
  }, [combineSelectedRows, clearSelectedRows, setClearSelectedRows]);

  const hasUnpaidItems = combineSelectedRows?.some((item) =>
    item?.is_contract ? !item?._is_paid : true
  );

  const hasPaidItems = combineSelectedRows?.some((item) =>
    item?.is_contract ? item?._is_paid : false
  );

  const handleOpenDelete = () => {
    if (hasPaidItems) {
      setIsOpenPopUpCantDelete(true);
    } else {
      setIsOpenPopUpDelete(true);
    }
  };

  const handleCancelConfirmation = () => {
    setIsOpenPopUpConfirmationBuy(false);
  };

  const handleOkTerminating = () => {
    setIsOpenPopUpEndContract(true);
    setIsOpenPopUpTerminating(false);
  };

  return (
    <>
      <Card className="p-4">
        <Suspense fallback={<SkeletonBreadcrumb />}>
          <LazyBreadcrumb title="Payment / Cart" items={breadcrumbItems} />
        </Suspense>

        <CardBody className="mt-3">
          <div className="flex flex-col w-full gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2 flex-col sm:flex-row sm:items-center sm:justify-between w-full sm:w-[40%] lg:w-[34%]">
              <div className="z-20 w-full sm:w-[50%]">
                <Suspense fallback={<SkeletonBlock width="w-full" />}>
                  <LazyFilterSelect
                    dataOptions={optionsItems}
                    placeholder="Select Item"
                    filterSelectedValue={selectedItem}
                    setFilterSelectedValue={setSelectedItem}
                  />
                </Suspense>
              </div>

              <div className="w-full sm:w-[50%] z-10">
                <Suspense fallback={<SkeletonBlock width="w-full" />}>
                  <LazyFilterSelect
                    dataOptions={optionsProviders}
                    placeholder="Select Provider"
                    filterSelectedValue={filterSelectProvider}
                    setFilterSelectedValue={setFilterSelectProvider}
                  />
                </Suspense>
              </div>
            </div>

            <div className="w-full sm:w-[35%] lg:w-[25%]">
              <Suspense fallback={<SkeletonBlock width="w-full" />}>
                <LazyFilterSearch
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  noPagination
                />
              </Suspense>
            </div>
          </div>

          <section className="mt-3">
            <Suspense fallback={<SkeletonTable />}>
              <LazyTablePaymentCart
                openModal={openModal}
                setOpenModal={setOpenModal}
                setGetData={setGetData}
                data={paymentCarts}
                isLoading={isLoading}
                isSuccess={isSuccess}
                isError={isError}
                error={error}
                selectedRows={selectedRows}
                clearSelectedRows={clearSelectedRows}
                setSelectedRows={setSelectedRows}
                selectedRowsSubItems={selectedRowsSubItems}
                setSelectedRowsSubItems={setSelectedRowsSubItems}
                searchValue={searchValue}
                setFilterData={setFilterData}
              />
            </Suspense>

            {filterData?.length !== 0 ? (
              <div className="flex justify-end gap-4 mt-4">
                {combineSelectedRows?.length !== 0 && hasUnpaidItems ? (
                  <Button
                    type="button"
                    background="red"
                    className="w-40 "
                    onClick={handleOpenDelete}
                  >
                    Delete
                  </Button>
                ) : null}
                <Button
                  type="button"
                  background="green"
                  className="w-40"
                  onClick={handleBuy}
                  disabled={
                    combineSelectedRows?.length === 0 || isLoadingValidate
                  }
                >
                  {isLoadingValidate ? <LoaderButtonAction /> : 'Buy'}
                </Button>
              </div>
            ) : null}

            {/* MODAL */}
            <Modal
              title="Detail Item"
              openModal={openModal}
              setOpenModal={setOpenModal}
            >
              <FormDetailPaymentCart
                data={getData}
                setOpenModal={setOpenModal}
                setIsOpenPopUpTerminating={setIsOpenPopUpTerminating}
              />
            </Modal>
            {/* END MODAL */}
          </section>
        </CardBody>
      </Card>

      {/* POPUP Confirmation Buy */}
      <PopUp
        setIsOpenPopUp={setIsOpenPopUpConfirmationBuy}
        isOpenPopUp={isOpenPopUpConfirmationBuy}
        headerButton="false"
      >
        <h5 className="text-lg font-bold text-center ">Confirmation</h5>

        <p className="max-w-md mb-4 font-medium text-center">
          You will be directed to the web application in a new tab. <br />
          Please select &apos;Yes&apos; if you want to proceed with the payment.
        </p>

        <div className="flex items-center justify-center">
          <div className="flex gap-2">
            <Button
              background="red"
              className="w-20"
              onClick={handleCancelConfirmation}
            >
              No
            </Button>
            <Button
              background="black"
              className="w-20"
              onClick={handleOkConfirmation}
            >
              Yes
            </Button>
          </div>
        </div>
      </PopUp>
      {/* END POPUP Confirmation Buy */}

      {/* POPUP terminating the contract */}
      <PopUp
        isOpenPopUp={isOpenPopUpTerminating}
        setIsOpenPopUp={setIsOpenPopUpTerminating}
        headerButton="false"
      >
        <h5 className="text-lg font-bold text-center ">Confirmation</h5>

        <p className="max-w-md mb-4 font-medium text-center">
          Are you sure wanna terminating the contract?
        </p>

        <div className="flex items-center justify-center">
          <div className="flex gap-2">
            <Button
              background="red"
              className="w-20"
              onClick={() => setIsOpenPopUpTerminating(false)}
            >
              No
            </Button>
            <Button
              background="black"
              className="w-20"
              onClick={handleOkTerminating}
            >
              Yes
            </Button>
          </div>
        </div>
      </PopUp>
      {/* END POPUP terminating the contract */}

      {/* POPUP End Contract */}
      <PopUp
        setIsOpenPopUp={setIsOpenPopUpEndContract}
        isOpenPopUp={isOpenPopUpEndContract}
        title="Reason"
      >
        <form onSubmit={handleEndContract}>
          <p className="max-w-md mb-1 font-medium text-center">
            Please explain why you are terminating the contract
          </p>

          <TextArea
            name="description"
            rows={4}
            value={inputReason}
            onChange={(e) => setInputReason(e.target.value)}
            placeholder="Enter your reasons"
          />

          <div className="flex items-center justify-end mt-2">
            <Button
              type="submit"
              background="black"
              className="w-28"
              disabled={isLoadingEndContract}
            >
              {isLoadingEndContract ? <LoaderButtonAction /> : 'Submit'}
            </Button>
          </div>
        </form>
      </PopUp>
      {/* END POPUP POPUP End Contract */}

      {/* POPUP Alert */}
      <PopUp
        isOpenPopUp={isOpenPopUpAlert}
        setIsOpenPopUp={setIsOpenPopUpAlert}
        headerButton="false"
      >
        <div className="">
          <div className="flex items-center justify-center w-16 h-16 p-2 mx-auto mb-2 rounded-full bg-red-200/50">
            <PiWarningBold className="text-red-500 text-7xl animate-pulse" />
          </div>
          <p className="max-w-md mb-1 font-medium text-center">
            {CapitalizeFirstLetter(msgAlert || 'Unknown Error')}
          </p>

          <div className="flex items-center justify-center mt-4">
            <Button
              background="black"
              className="w-20"
              onClick={() => setIsOpenPopUpAlert(false)}
            >
              Ok
            </Button>
          </div>
        </div>
      </PopUp>
      {/* END Pupup Alert */}

      {/* POPUP Extra Event */}
      <PopUp
        isOpenPopUp={isOpenPopUpExtraEvent}
        setIsOpenPopUp={setIsOpenPopUpExtraEvent}
        headerButton="false"
      >
        <h5 className="text-lg font-bold text-center ">Announcement!</h5>

        <p className="max-w-md mb-4 font-medium text-center">
          Your assignment this time has entered the Extra Event. Event Extra is
          the excess number of assignments that you give to the service
          photographer. You will be charged additional fees for excess
          assignments.
        </p>

        <div className="flex items-center justify-center">
          <div className="flex gap-2">
            <Button
              background="red"
              className="w-20"
              onClick={() => setIsOpenPopUpExtraEvent(false)}
            >
              No
            </Button>
            <Button
              background="black"
              className="w-20"
              onClick={handleOkConfirmation}
            >
              Ok
            </Button>
          </div>
        </div>
      </PopUp>
      {/* END Extra Event */}

      {/* Pop Up Delete */}
      <PopUpDelete
        handleDelete={handleDelete}
        isLoading={isLoadingDelete}
        isOpenPopUpDelete={isOpenPopUpDelete}
        setIsOpenPopUpDelete={setIsOpenPopUpDelete}
      />
      {/* End Pop Up Delete */}

      {/* POPUP CAN'T DELETE */}
      <PopUp
        isOpenPopUp={isOpenPopUpCantDelete}
        setIsOpenPopUp={setIsOpenPopUpCantDelete}
        headerButton="false"
      >
        <div className="">
          <div className="flex items-center justify-center w-16 h-16 p-2 mx-auto mb-2 rounded-full bg-red-200/50">
            <PiWarningBold className="text-red-500 text-7xl animate-pulse" />
          </div>
          <p className="max-w-md mb-1 font-medium text-center">
            You can&apos;t delete service have been paid
          </p>

          <div className="flex items-center justify-center mt-4">
            <Button
              background="black"
              className="w-20"
              onClick={() => setIsOpenPopUpCantDelete(false)}
            >
              Ok
            </Button>
          </div>
        </div>
      </PopUp>
      {/* END POPUP CAN'T DELETE */}
    </>
  );
};

export default PaymentCart;
