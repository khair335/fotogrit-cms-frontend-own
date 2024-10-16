import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import {
  DatePickerCustom,
  FilterSearch,
  Input,
  SelectCustom,
} from '@/components/form-input';
import { Button, LoaderButtonAction, PopUp, PopUpConflict } from '@/components';
import TableSubcontract from './TableSubcontract';

import {
  useCreateSubcontractAssignmentMutation,
  useCreateSubcontractMutation,
  useGetActiveContractsQuery,
  useGetActiveSubcontractQuery,
  useGetListPhotographerQuery,
  useGetServiceByPhotographerQuery,
  useGetServiceMySubcontractQuery,
} from '@/services/api/serviceRequestApiSlice';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';
import { formatDateYearToDay } from '@/helpers/FormatDateYearToDay';
import { useNavigate } from 'react-router-dom';
import { PiWarningBold } from 'react-icons/pi';
import { setIsSubcontract } from '@/services/state/cartSlice';
import { useDispatch } from 'react-redux';

const customStylesSelect = {
  option: (provided, state) => {
    return {
      ...provided,
      color: state.isSelected
        ? 'white'
        : state.data.is_contract === true
        ? 'green'
        : 'black',
      textTransform: 'capitalize',
    };
  },
  control: (provided) => ({
    ...provided,
    border: 'none',
    outline: 'none',
    borderRadius: '4px',
    backgroundColor: 'white',
    boxShadow: '0 4px 3px rgb(0 0 0 / 0.07)',
    padding: '0px 3px 0px 0px',
    '&:hover': {
      border: 'none',
    },
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    backgroundColor: 'black',
    padding: '1px',
    margin: '0px 3px',
    borderRadius: '6px',
  }),
};

const FormSubcontractMyService = ({
  setOpenColapse,
  isAccessSubcontract,
  setIsOpenRequestNewService,
  selectedProvider,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialInputValue = {
    salesModel: '',
    fixedFee: '',
    paymentPeriod: '',
    percentShared: '',
    startContract: '',
    endContract: '',
    eventGroupName: '',
    contractDate: '',
  };
  const [formInput, setFormInput] = useState(initialInputValue);
  const [selectedPhotographer, setSelectedPhotographer] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [selectedRows, setSelectedRows] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [isOpenPopUpConflict, setIsOpenPopUpConflict] = useState(false);
  const [listConflict, setListConflict] = useState([]);
  const [disableBtnIfConflict, setDisableBtnIfConflict] = useState(false);
  const [isOpenPopUpNoContractYet, setisOpenPopUpNoContractYet] =
    useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const { data, isLoading, isSuccess, isError, error } =
    useGetServiceMySubcontractQuery({
      serviceType: selectedProvider,
    });

  const [createSubcontract] = useCreateSubcontractMutation();
  const [createSubcontractAssignment] =
    useCreateSubcontractAssignmentMutation();

  // Get Active Subcontract
  const { data: activeSubcontracts } = useGetActiveSubcontractQuery();
  const activeSubcontractList = activeSubcontracts?.data;
  const getSubcontract = activeSubcontractList?.find(
    (item) => item?.service_id === selectedServiceType?.value
  );

  // For Options Photographers
  const { data: photographers } = useGetListPhotographerQuery();
  const updateOptionsPhotographer = photographers?.data?.map((item) => {
    const isContracted = activeSubcontractList
      ?.filter((item) => item?.contract_type !== 'per event')
      ?.some((contracted) => contracted?.photographer_ssp_id === item?.id);

    return {
      value: item?.id,
      label: `${item.name || item.email} ${
        isContracted ? '(in contract)' : ''
      }`,
      event_assigned: item?.event_assigned,
      is_contract: isContracted,
    };
  });
  const optionsPhotographer = updateOptionsPhotographer?.sort((a, b) => {
    return b.is_contract - a.is_contract;
  });

  // For Options Services by Photographers
  const { data: serviceByPhotographer } = useGetServiceByPhotographerQuery({
    photographerID: selectedPhotographer?.value,
  });
  const dataServices = serviceByPhotographer?.data;

  const updateOptionsServiceName = dataServices
    ?.filter((item) => item.payment_period !== 'per group event')
    ?.map((item) => {
      const isContracted = activeSubcontractList
        ?.filter((item) => item?.contract_type !== 'per event')
        ?.some((contracted) => contracted?.service_id === item?.id);

      const matchedSubcontract = activeSubcontractList?.find(
        (contracted) => contracted?.service_id === item?.id
      );

      return {
        value: item?.id,
        label: `${item?.service_type} - ${item?.name} ${
          isContracted ? '(in contract)' : ''
        }`,
        fixed_fee: item?.basic_fixed_fee,
        sales_model: item?.sales_model,
        percent_to_shared: item?.percent_to_shared,
        payment_period: item?.payment_period,
        is_contract:
          item?.payment_period === 'per event' ? false : isContracted,
        subcontract_period: matchedSubcontract?.periods,
      };
    });
  const optionsServiceModelByPhotographer = updateOptionsServiceName?.sort(
    (a, b) => {
      return b.is_contract - a.is_contract;
    }
  );

  const findMatchingPeriodIDs = (events, periods) => {
    const matchingPeriodIDs = events?.map((event) => {
      const matchingPeriodID = periods?.find((period) => {
        const startDate = new Date(period?.start_date);
        const endDate = new Date(period?.end_date);
        const isActive = period?._is_active === 1;
        const dateToCheck = new Date(event.date);

        const result =
          dateToCheck >= startDate && dateToCheck <= endDate && isActive;

        return result;
      });

      return matchingPeriodID?.id || null;
    });

    return matchingPeriodIDs;
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if (
      selectedServiceType &&
      !selectedServiceType?.is_contract &&
      selectedServiceType?.payment_period !== 'per event'
    ) {
      setisOpenPopUpNoContractYet(true);

      return;
    }

    try {
      setIsLoadingSubmit(true);

      // Check if payment periode not per event
      if (selectedServiceType?.payment_period !== 'per event') {
        // Payment periode per month, week, day
        if (getSubcontract) {
          // If has subcontract
          const serviceRequestID = selectedRows?.map(
            (event) => event?.service_request_id
          );
          const matchingPeriodIDs = findMatchingPeriodIDs(
            selectedRows,
            selectedServiceType?.subcontract_period
          );
          const subContractID = getSubcontract?.id;
          const periodID = matchingPeriodIDs ? matchingPeriodIDs[0] : '';

          const dataAssignment = [
            {
              service_subcontract_id: subContractID,
              service_subcontract_period_id: periodID,
              service_request_id: serviceRequestID,
            },
          ];

          const resAssignment = await createSubcontractAssignment(
            dataAssignment
          ).unwrap();

          if (!resAssignment?.error) {
            setOpenColapse(false);

            toast.success(`Subcontract added to cart.`, {
              position: 'top-right',
              theme: 'light',
            });

            navigate('/payment-and-cart');
          }
        } else {
          // If has not subcontract
          setisOpenPopUpNoContractYet(true);
        }
      } else {
        // Payment periode per event
        for (const rows of selectedRows) {
          const newDataPerEvent = {
            user_to_share: '',
            event_group_id: formInput.eventGroupName,
            service_id: selectedServiceType?.value,
            start_subcontract: rows?.date
              ? formatDateYearToDay(rows?.date)
              : '',
            end_subcontract: rows?.date ? formatDateYearToDay(rows?.date) : '',
          };

          const resSubcontract = await createSubcontract(
            newDataPerEvent
          ).unwrap();

          if (!resSubcontract?.error) {
            const serviceRequestID = [rows?.service_request_id];
            const newSubContractID = resSubcontract?.data?.id;
            const newPeriodID = resSubcontract?.data?.periods[0]?.id;

            const dataAssignment = [
              {
                service_subcontract_id: newSubContractID,
                service_subcontract_period_id: newPeriodID,
                service_request_id: serviceRequestID,
              },
            ];

            const resAssignment = await createSubcontractAssignment(
              dataAssignment
            ).unwrap();

            if (!resAssignment?.error) {
              setOpenColapse(false);

              toast.success(`Subcontract added to cart.`, {
                position: 'top-right',
                theme: 'light',
              });

              navigate('/payment-and-cart');
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed: ${err?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
      setIsLoadingSubmit(false);
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleStartContractChange = (date) => {
    if (date) {
      setFormInput((prevState) => ({
        ...prevState,
        startContract: date,
        endContract: '',
      }));

      const minDate = new Date(date);
      if (selectedServiceType?.payment_period === 'per week') {
        minDate.setDate(minDate.getDate() + 6);
      }
      if (selectedServiceType?.payment_period === 'per month') {
        minDate.setMonth(minDate.getMonth() + 1);
      }
    }
  };
  const handleEndContractChange = (date) => {
    setFormInput((prevState) => ({
      ...prevState,
      endContract: date,
    }));
  };

  // Check conflits event list and assigned photographer
  const eventAssignedAsPhotographer = selectedPhotographer?.event_assigned;
  const listEventsRows = selectedRows;

  const checkScheduleConflict = () => {
    const conflicts = [];

    if (eventAssignedAsPhotographer) {
      eventAssignedAsPhotographer.forEach((event1) => {
        listEventsRows.forEach((event2) => {
          if (
            event1.date === event2.date &&
            ((event1.time_start >= event2.time_start &&
              event1.time_start < event2.time_finish) ||
              (event1.time_finish > event2.time_start &&
                event1.time_finish <= event2.time_finish) ||
              (event1.time_start <= event2.time_start &&
                event1.time_finish >= event2.time_finish))
          ) {
            conflicts.push({
              event1,
              event2,
            });
          }
        });
      });
    }

    return conflicts;
  };

  const handleCloseConflict = () => {
    setListConflict([]);

    setIsOpenPopUpConflict(false);
  };

  const handleToCreateContract = () => {
    setOpenColapse(false);
    setIsOpenRequestNewService(true);
    dispatch(setIsSubcontract(true));
  };

  useEffect(() => {
    if (
      selectedServiceType &&
      !selectedServiceType?.is_contract &&
      selectedServiceType.payment_period !== 'per event'
    ) {
      setisOpenPopUpNoContractYet(true);
    }
  }, [selectedServiceType]);

  useEffect(() => {
    if (selectedPhotographer && selectedRows) {
      const scheduleConflicts = checkScheduleConflict();

      setListConflict(scheduleConflicts);

      // disable button if there is conflict
      // if (scheduleConflicts.length > 0) {
      //   setIsOpenPopUpConflict(true);
      //   setDisableBtnIfConflict(true);
      // } else {
      //   setDisableBtnIfConflict(false);
      // }
    }
  }, [selectedPhotographer, selectedRows]);

  useEffect(() => {
    setSelectedServiceType('');
  }, [selectedPhotographer]);

  useEffect(() => {
    if (selectedServiceType) {
      setFormInput((prevFormInput) => ({
        ...prevFormInput,
        salesModel: `${selectedServiceType?.sales_model}`,
        fixedFee: CurrencyFormat(selectedServiceType?.fixed_fee),
        paymentPeriod: selectedServiceType?.payment_period,
        percentShared: selectedServiceType?.percent_to_shared,
        eventGroupName: getSubcontract ? getSubcontract?.event_group_name : '',
        startContract: getSubcontract
          ? new Date(getSubcontract?.start_contract)
          : '',
        endContract: getSubcontract
          ? new Date(getSubcontract?.end_contract)
          : '',
        contractDate: getSubcontract
          ? new Date(getSubcontract?.start_contract)
          : '',
      }));
    } else {
      setFormInput((prevFormInput) => ({
        ...prevFormInput,
        salesModel: '-',
        fixedFee: '-',
        paymentPeriod: '-',
        percentShared: '-',
        eventGroupName: '',
        startContract: '',
        endContract: '',
        contractDate: '',
      }));
    }
  }, [selectedRows, selectedPhotographer, selectedServiceType]);

  return (
    <div className="">
      <div className="p-4 bg-gray-100 rounded-md">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:w-[60%] ml-auto">
          <div className="w-full sm:w-[40%] z-30 drop-shadow-md">
            <SelectCustom
              data={optionsPhotographer}
              selectedValue={selectedPhotographer}
              setSelectedValue={setSelectedPhotographer}
              customStyle={customStylesSelect}
              placeholder="Select Service Provider"
            />
          </div>

          <div className="w-full sm:w-[60%] z-20">
            <SelectCustom
              data={optionsServiceModelByPhotographer}
              selectedValue={selectedServiceType}
              setSelectedValue={setSelectedServiceType}
              customStyle={customStylesSelect}
              placeholder="Select Service Type"
            />
          </div>
        </div>

        <form className="w-full mt-6" onSubmit={handleOnSubmit}>
          <div className="grid grid-flow-row-dense grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2">
            <Input
              type="text"
              label="Payment Period"
              name="paymentPeriod"
              value={formInput.paymentPeriod}
              onChange={handleChange}
              disabled
              className="font-bold disabled:text-black"
              placeholder="-"
            />

            {selectedServiceType?.payment_period === 'per group event' && (
              <Input
                type="text"
                label="Event Group Name"
                name="eventGroupName"
                value={formInput.eventGroupName}
                onChange={handleChange}
                disabled
                className="font-bold disabled:text-black"
                placeholder="-"
              />
            )}

            {['per month', 'per week'].includes(
              selectedServiceType?.payment_period
            ) && (
              <DatePickerCustom
                label="Start Contract"
                name="startContract"
                value={formInput.startContract}
                onChange={handleStartContractChange}
                placeholder="-"
                disabled
              />
            )}

            {['per month', 'per week'].includes(
              selectedServiceType?.payment_period
            ) && (
              <DatePickerCustom
                label="End Contract"
                name="endContract"
                value={formInput.endContract}
                onChange={handleEndContractChange}
                placeholder="-"
                disabled
              />
            )}

            {selectedServiceType?.payment_period === 'per day' && (
              <DatePickerCustom
                label="Contract Date"
                name="contractDate"
                value={formInput.contractDate}
                onChange={handleStartContractChange}
                placeholder="-"
                disabled
              />
            )}

            <Input
              type="text"
              label="Sales Model"
              name="salesModel"
              value={formInput.salesModel}
              onChange={handleChange}
              disabled
              className="font-bold disabled:text-black"
              placeholder="-"
            />

            <Input
              type="text"
              label="Fixed Fee"
              name="fixedFee"
              value={formInput.fixedFee}
              onChange={handleChange}
              disabled
              className="font-bold disabled:text-black"
              placeholder="-"
            />

            <Input
              type="text"
              label="% of sharing"
              name="percentShared"
              value={formInput.percentShared}
              onChange={handleChange}
              disabled
              className="font-bold disabled:text-black"
              placeholder="-"
            />
          </div>

          <div className="flex justify-end w-full gap-4 py-2 mt-4">
            <Button
              background="red"
              className="w-40"
              onClick={() => setOpenColapse(false)}
              disabled={isLoadingSubmit ? true : false}
            >
              {isLoadingSubmit ? <LoaderButtonAction /> : 'Cancel'}
            </Button>

            {isAccessSubcontract?.can_add && (
              <Button
                type="submit"
                background="black"
                className="w-40"
                disabled={
                  isLoadingSubmit ||
                  disableBtnIfConflict ||
                  !selectedPhotographer ||
                  !selectedServiceType ||
                  selectedRows?.length === 0
                    ? true
                    : false
                }
              >
                {isLoadingSubmit ? <LoaderButtonAction /> : 'Add to Cart'}
              </Button>
            )}
          </div>
        </form>
      </div>

      <div className="my-4">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-2">
          <h5 className="text-lg font-bold">List of My Subcontract</h5>
          <div className="w-full sm:w-[50%] lg:w-[30%] mb-2 ml-auto">
            <FilterSearch
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              noPagination
            />
          </div>
        </div>

        <TableSubcontract
          data={data}
          isLoading={isLoading}
          isSuccess={isSuccess}
          isError={isError}
          error={error}
          setSelectedRows={setSelectedRows}
          selectedRows={selectedRows}
          searchValue={searchValue}
        />
      </div>

      {/* Pop Up Conflict */}
      <PopUpConflict
        handleClose={handleCloseConflict}
        isOpenPopUp={isOpenPopUpConflict}
        // dataConflicts={listConflict}
      />
      {/* End Pop Up Conflict */}

      {/* POPUP Create Contract */}
      <PopUp
        isOpenPopUp={isOpenPopUpNoContractYet}
        setIsOpenPopUp={setisOpenPopUpNoContractYet}
        headerButton="false"
      >
        <div className="flex items-center justify-center w-16 h-16 p-2 mx-auto mb-2 rounded-full bg-red-200/50">
          <PiWarningBold className="text-red-500 text-7xl animate-pulse" />
        </div>

        <p className="max-w-md mb-4 font-medium text-center">
          You need to create a contract first before subcontracting an event to
          your SSP. To create a new contract, you need to click the button
          below.
        </p>

        <div className="flex items-center justify-center">
          <div className="flex gap-2">
            <Button
              background="red"
              className="w-36"
              onClick={() => setisOpenPopUpNoContractYet(false)}
            >
              Cancel
            </Button>
            <Button
              background="black"
              className="w-36"
              onClick={handleToCreateContract}
            >
              Create Contract
            </Button>
          </div>
        </div>
      </PopUp>
      {/* END Create Contract */}
    </div>
  );
};

export default FormSubcontractMyService;
