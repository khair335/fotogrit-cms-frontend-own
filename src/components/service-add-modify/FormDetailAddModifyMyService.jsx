import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { FaTrashCan } from 'react-icons/fa6';
import { FaPlus } from 'react-icons/fa';

import {
  Input,
  MultiSelect,
  SelectCustom,
  TextArea,
} from '@/components/form-input';
import { Paragraph } from '@/components/typography';
import { Button, LoaderButtonAction } from '@/components';

import { CurrencyFormat, removeCurrencyFormat } from '@/helpers/CurrencyFormat';
import {
  useAddNewVariableFeeMutation,
  useDeleteVariableFeeMutation,
  useGetVariableFeesQuery,
  useUpdateServiceMutation,
  useUpdateVariableFeeMutation,
  useUpdateVisibilityMutation,
} from '@/services/api/serviceRequestApiSlice';
import {
  optionsEmpty,
  optionsSalesModelDocVerification,
  optionsSalesModelPhotoVideo,
  optionsSalesModelScoring,
  optionsSalesModelStreaming,
  optionsVariableUnits,
} from '@/constants';

const customStylesSelect = {
  control: (provided) => ({
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
    padding: '1px 5px',
  }),
};

const FormDetailAddModifyMyService = (props) => {
  const {
    data,
    setOpenModal,
    optionsClients,
    isAccessAddMyService,
    optionsPaymenPeriod,
    optionsServiceTypes,
    setIsOpenPopUpDelete,
    isAdmin,
  } = props;
  const initialInputValue = {
    id: '',
    name: '',
    fixedFee: '',
    description: '',
    certification: '',
    experience: '',
    price: '',
    percentToShared: '',
  };
  const [formInput, setFormInput] = useState(initialInputValue);
  const [selectedServiceType, setSelectedServiceType] = useState(0);
  const [selectedPaymentPeriod, setSelectedPaymentPeriod] = useState(0);
  const [selectedSalesModel, setSelectedSalesModel] = useState(0);
  const [selectedVariableUnit, setSelectedVariableUnit] = useState(0);
  const [tiers, setTiers] = useState([{ min: '', max: '', amount: '' }]);
  const [selectedVisibility, setSelectedVisibility] = useState([]);
  const [errorsTiers, setErrorsTiers] = useState([]);
  const [errorsRequiredTiers, setErrorsRequiredTiers] = useState([]);
  const [errorsInput, setErrorsInput] = useState([]);
  const [loading, setLoading] = useState(false);

  const [updateServices] = useUpdateServiceMutation();
  const [updateVariableFee] = useUpdateVariableFeeMutation();
  const [addNewVariableFee] = useAddNewVariableFeeMutation();
  const [deleteVariableFee] = useDeleteVariableFeeMutation();
  const [updateVisibility] = useUpdateVisibilityMutation();

  const { data: variableFee } = useGetVariableFeesQuery({
    id: data?.id,
  });
  const detailVariableFees = variableFee?.data;

  const validateTiers = (updatedTiers, index) => {
    const currentMin = parseInt(updatedTiers[index].min);
    const currentMax = parseInt(updatedTiers[index].max);

    if (index > 0 && currentMin <= parseInt(updatedTiers[index - 1].max)) {
      // If 'min' is less than or equal to the 'max' of the previous element
      const errorMessage = `'Min' value must be greater than the 'Max' value of Tier ${index}`;
      return errorMessage;
    } else if (currentMax < currentMin) {
      // If 'max' is less than 'min'
      const errorMessage = `'Max' value must be greater than 'Min' value for Tier ${
        index + 1
      }`;
      return errorMessage;
    }
    return '';
  };

  const validateRequiredFields = () => {
    const errors = {};

    if (!formInput.name) {
      errors.name = 'Name is a required field';
    }

    if (!selectedPaymentPeriod) {
      errors.paymentPeriod = 'Payment Period is a required field';
    }

    if (!formInput.fixedFee || formInput.fixedFee === 'Rp ') {
      errors.fixedFee = 'Fixed Fee is a required field';
    }

    if (
      (!formInput.price && selectedSalesModel === 1) ||
      (formInput.price === 'Rp ' && selectedSalesModel === 1)
    ) {
      errors.price = 'Price is a required field';
    }

    if (!formInput.percentToShared) {
      errors.percentToShared = '% paid is a required field';
    }

    return errors;
  };

  const validateRequiredTiers = () => {
    const errors = tiers.map((fee, index) => {
      const feeErrors = {};

      if (!fee.min) {
        feeErrors.min = 'Unit Min is a required field';
      }

      if (!fee.max) {
        feeErrors.max = 'Unit Max is a required field';
      }

      if (!fee.amount || fee.amount === 'Rp ') {
        feeErrors.amount = 'Fees per unit is a required field';
      }

      return feeErrors;
    });

    return errors;
  };

  const transformDataInputForUpdateTiers = (dataInput, serviceId) => {
    return dataInput
      ?.filter((data) => data?.id) // Filter out entries without 'id'
      ?.map((data, index) => ({
        id: data?.id,
        service_id: serviceId,
        tier: parseInt(index + 1),
        min_unit: parseInt(data?.min),
        max_unit: parseInt(data?.max),
        fee_unit: removeCurrencyFormat(data?.amount),
      }));
  };

  const transformDataForAddNewTiers = (dataInput, serviceId, lengthOfTier) => {
    return dataInput
      ?.filter((data) => !data?.id) // Filter out entries with 'id'
      ?.map((data, index) => ({
        service_id: serviceId,
        tier: lengthOfTier + index + 1,
        min_unit: parseInt(data?.min),
        max_unit: parseInt(data?.max),
        fee_unit: removeCurrencyFormat(data?.amount),
      }));
  };

  const visibilityCheck =
    data?.visibility[0] === 'waiting for admin to decide' ? true : false;

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Validation Required Input
    const requiredFieldErrors = validateRequiredFields();
    setErrorsInput(requiredFieldErrors);

    // Validasi required Tiers
    const tiersErrors = validateRequiredTiers();
    setErrorsRequiredTiers(tiersErrors);
    const hasTiersErrors = tiersErrors.some((errors) =>
      Object.values(errors).some((error) => error !== '')
    );

    if (
      Object.values(requiredFieldErrors).some((error) => error !== '') ||
      hasTiersErrors
    ) {
      toast.error(`Invalid Input. Please check and correct them!`, {
        position: 'top-right',
        theme: 'light',
      });
      return; // Stop execution
    }
    // End Validation Required

    // Validation Tiers max must be greater min
    const errors = tiers.map((fee, index) => validateTiers(tiers, index));
    if (errors.some((error) => error !== '')) {
      toast.error(`Invalid Tier values. Please check and correct them.`, {
        position: 'top-right',
        theme: 'light',
      });
      setErrorsTiers(errors);
      return;
    }
    // End Validation Tiers

    try {
      setLoading(true);

      const serviceID = formInput?.id;

      let newData = {
        id: serviceID,
        name: formInput.name,
        service_type: parseInt(selectedServiceType?.value),
        payment_period: parseInt(selectedPaymentPeriod?.value),
        description: formInput.description,
        certification: formInput.certification,
        experience: formInput.experience,
        sales_model: parseInt(selectedSalesModel?.value),
        variable_unit: parseInt(selectedVariableUnit?.value),
        percent_to_shared: parseInt(formInput.percentToShared),
        basic_fixed_fee: removeCurrencyFormat(formInput.fixedFee),
      };

      if (selectedServiceType?.value === 1) {
        newData.photo_price = removeCurrencyFormat(formInput.price);
      }
      if (selectedServiceType?.value === 2) {
        newData.stream_price = removeCurrencyFormat(formInput.price);
      }
      if (
        selectedServiceType?.value === 3 ||
        selectedServiceType?.value === 6 ||
        selectedServiceType?.value === 7 ||
        selectedServiceType?.value === 8
      ) {
        newData.score_price = removeCurrencyFormat(formInput.price);
      }
      if (selectedServiceType?.value === 4) {
        newData.video_price = removeCurrencyFormat(formInput.price);
      }

      // Update Service
      const resService = await updateServices(newData).unwrap();

      // Update Visibilty
      if (!visibilityCheck) {
        const modifiedOptions = selectedVisibility?.map(
          (option) => option?.value
        );
        const newDataVisibility = {
          id: serviceID,
          users: modifiedOptions[0] === 'public' ? [] : modifiedOptions,
        };

        const resVisibility = await updateVisibility(
          newDataVisibility
        ).unwrap();
      }

      if (!resService?.error) {
        const transformedData = transformDataInputForUpdateTiers(
          tiers,
          serviceID
        );
        const transformedAddNewData = transformDataForAddNewTiers(
          tiers,
          serviceID,
          transformedData?.length
        );

        // Update Variable Fee
        let resUpdateVariableFee;
        for (const updateDataVarFee of transformedData) {
          resUpdateVariableFee = await updateVariableFee(
            updateDataVarFee
          ).unwrap();
        }

        // Add new variable fee
        let resAddNewVariableFee;
        for (const newDataVarFee of transformedAddNewData) {
          resAddNewVariableFee = await addNewVariableFee(
            newDataVarFee
          ).unwrap();
        }

        if (!resUpdateVariableFee?.error) {
          setOpenModal(false);
          setLoading(false);
          toast.success(`Service has been Updated!`, {
            position: 'top-right',
            theme: 'light',
          });
        }
      } else {
        setLoading(false);
        toast.error(`Failed: ${resService?.data?.message}`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      toast.error(`Failed to update data : ${err?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const handleTierChange = (index, field, value) => {
    const updatedTiers = [...tiers];
    // updatedTiers[index][field] = value;

    // Format amount as desired (e.g., "Rp 10,000")
    if (field === 'amount') {
      // Remove characters other than digits (0-9)
      const numericValue = value.replace(/[^0-9]/g, '');

      // Format the price as desired, for example: "Rp 10,000"
      updatedTiers[index][field] = `Rp ${numericValue
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
    } else {
      updatedTiers[index][field] = value;
    }

    setTiers(updatedTiers);

    // Validation Fixed Fee
    const errorMessage = validateTiers(updatedTiers, index);

    setErrorsTiers((prevErrors) => {
      const newErrors = [...prevErrors];
      newErrors[index] = errorMessage;
      return newErrors;
    });

    if (value.trim() !== '') {
      setErrorsRequiredTiers((prevErrors) => {
        const newErrors = { ...prevErrors };

        // Pastikan ada objek di indeks yang dimaksud
        if (!newErrors[index]) {
          newErrors[index] = {};
        }

        newErrors[index][field] = '';
        return newErrors;
      });
    }
  };

  const visibilityData =
    data?.visibility.length !== 0
      ? data?.visibility?.map((item) => ({
          value: item,
          label: item,
        }))
      : data?.users?.map((item) => ({
          value: item.user_id,
          label: item.name,
        }));

  const checkPriceOf = useMemo(() => {
    let price;
    switch (data?.service_type?.toLowerCase()) {
      case 'photography':
        price = data?.photo_price;
        break;
      case 'streaming':
        price = data?.stream_price;
        break;
      case 'videography':
        price = data?.video_price;
        break;
      case 'scoring':
        price = data?.score_price;
        break;
      case 'stat reviewer':
        price = data?.score_price;
        break;
      case 'stat caller':
        price = data?.score_price;
        break;
      case 'stat scorer':
        price = data?.score_price;
        break;
      default:
        price = 0;
    }
    return price;
  }, [data]);

  let optionsSalesModel;
  if ([1, 4].includes(selectedServiceType?.value)) {
    optionsSalesModel = optionsSalesModelPhotoVideo;
  } else if (selectedServiceType?.value === 2) {
    optionsSalesModel = optionsSalesModelStreaming;
  } else if ([3, 6, 7, 8].includes(selectedServiceType?.value)) {
    optionsSalesModel = optionsSalesModelScoring;
  } else if (selectedServiceType?.value === 9) {
    optionsSalesModel = optionsSalesModelDocVerification;
  } else {
    optionsSalesModel = optionsEmpty;
  }

  useEffect(() => {
    if (data) {
      const priceOf = checkPriceOf;

      setFormInput({
        id: data?.id,
        name: data?.name,
        fixedFee: CurrencyFormat(data?.basic_fixed_fee),
        description: data?.description,
        certification: data?.certification,
        experience: data?.experience,
        price: CurrencyFormat(priceOf),
        percentToShared: `${data?.percent_to_shared} %`,
      });
      const foundServiceType = optionsServiceTypes?.find(
        (item) =>
          item?.label?.toLowerCase() === data?.service_type?.toLowerCase()
      );
      setSelectedServiceType(foundServiceType);

      const foundPaymentPeriod = optionsPaymenPeriod?.find(
        (item) => item?.label === data?.payment_period
      );
      setSelectedPaymentPeriod(foundPaymentPeriod);

      const foundVariableUnit = optionsVariableUnits?.find(
        (item) => item?.label.toLowerCase() === data?.variable_unit
      );
      setSelectedVariableUnit(foundVariableUnit);

      setSelectedVisibility(visibilityData);

      if (detailVariableFees && detailVariableFees?.length > 0) {
        setTiers(
          detailVariableFees?.map((fee) => ({
            id: fee?.id,
            tier: fee?.tier,
            min: fee?.min_unit || '',
            max: fee?.max_unit || '',
            amount: CurrencyFormat(fee?.fee_unit),
          }))
        );
      }
    }
  }, [data, setFormInput, checkPriceOf, detailVariableFees]);

  const handleAddTier = () => {
    setTiers([...tiers, { min: '', max: '', amount: '' }]);
  };

  const handleDeleteTier = async (item, index) => {
    if (item?.id) {
      try {
        const response = await deleteVariableFee({
          id: item?.id,
        }).unwrap();

        if (!response?.error) {
          const updatedTiers = [...tiers];
          updatedTiers.splice(index, 1); // Delete Element
          setTiers(updatedTiers);

          toast.success(`"Tier ${item?.tier}" has been deleted!`, {
            position: 'top-right',
            theme: 'light',
          });
        }
      } catch (err) {
        toast.error(`Failed: ${err?.data?.message}`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } else {
      const updatedTiers = [...tiers];
      updatedTiers.splice(index, 1); // Delete Element
      setTiers(updatedTiers);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Delete error message required
    if (value.trim() !== '') {
      setErrorsInput({
        ...errorsInput,
        [name]: '',
      });
    }
  };

  const handlePercentChange = (e) => {
    const { name, value } = e.target;

    const numericValue = value.replace(/[^0-9]/g, '');
    const percentValue = Math.min(Math.max(parseInt(numericValue, 10), 0), 100);
    const formattedPercent =
      isNaN(percentValue) || value.trim() === '' ? '0 %' : `${percentValue} %`;

    setFormInput((prevData) => ({
      ...prevData,
      [name]: formattedPercent,
    }));

    // Delete error message required
    if (value.trim() !== '') {
      setErrorsInput({
        ...errorsInput,
        [name]: '',
      });
    }
  };

  const handlePriceChange = (key, e) => {
    const inputValue = e.target.value;

    // Remove characters other than digits (0-9)
    const numericValue = inputValue.replace(/[^0-9]/g, '');

    // Format the price as desired, for example: "Rp 10,000"
    const formattedPrice = `Rp ${numericValue
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

    setFormInput((prevData) => ({
      ...prevData,
      [key]: formattedPrice,
    }));

    // Delete error message required
    if (inputValue.trim() !== '') {
      setErrorsInput({
        ...errorsInput,
        [key]: '',
      });
    }
  };

  useEffect(() => {
    if (selectedServiceType !== 0) {
      if (
        selectedServiceType?.label?.toLowerCase() !==
        data?.service_type?.toLowerCase()
      ) {
        const checkServiceType =
          selectedServiceType?.value === 1 || selectedServiceType?.value === 4
            ? { value: 1, label: 'Individual Media Sales' }
            : selectedServiceType?.value === 2
            ? { value: 3, label: 'Full Streaming' }
            : selectedServiceType?.value === 3 ||
              selectedServiceType?.value === 6 ||
              selectedServiceType?.value === 7 ||
              selectedServiceType?.value === 8
            ? { value: 4, label: 'Full Team Sales' }
            : selectedServiceType?.value === 9
            ? { value: 6, label: 'Per Verification' }
            : optionsEmpty;

        setSelectedSalesModel(checkServiceType);
      } else {
        const foundSalesModel = optionsSalesModel?.find(
          (item) =>
            item?.label?.toLowerCase() === data?.sales_model?.toLowerCase()
        );
        setSelectedSalesModel(foundSalesModel);
      }
    }
  }, [selectedServiceType, data]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-2 mb-6 text-sm capitalize sm:grid-cols-3 lg:grid-cols-7">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Service ID</h5>
          <Paragraph>{data?.code || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Service Name</h5>
          <Paragraph>{data?.name || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Service Type</h5>
          <Paragraph>{data?.service_type}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Sales Model</h5>
          <Paragraph>{data?.sales_model}</Paragraph>
        </div>
        <div className="flex flex-col gap-2 text-gray-500">
          <h5 className="font-bold text-black">Service Fees</h5>

          <div className="flex flex-col py-1">
            {data?.basic_fixed_fee !== 0 && (
              <p>
                Fixed Fee:{' '}
                <span className="text-black">
                  {CurrencyFormat(data?.basic_fixed_fee)}
                </span>
              </p>
            )}
            {data?.percent_to_shared !== 0 && (
              <p>
                % Paid to Other User:{' '}
                <span className="text-black">{data?.percent_to_shared}%</span>
              </p>
            )}
            {data?.photo_price !== 0 && (
              <p>
                Photo Price:{' '}
                <span className="text-black">
                  {CurrencyFormat(data?.photo_price)}
                </span>
              </p>
            )}
            {data?.video_price !== 0 && (
              <p>
                Video Price:{' '}
                <span className="text-black">
                  {CurrencyFormat(data?.video_price)}
                </span>
              </p>
            )}
            {data?.score_price !== 0 && (
              <p>
                Score Price:{' '}
                <span className="text-black">
                  {CurrencyFormat(data?.score_price)}
                </span>
              </p>
            )}
            {data?.stream_price !== 0 && (
              <p>
                Stream Price:{' '}
                <span className="text-black">
                  {CurrencyFormat(data?.stream_price)}
                </span>
              </p>
            )}

            {data?.variable_fees?.length === 0 ||
              (data?.variable_fees[0]?.amount !== 0 && (
                <>
                  <span className="text-black">Variable Fees</span>
                  {data?.variable_fees?.map((item, i) => {
                    let unit;
                    const price = item?.fee_unit;

                    unit = `${item?.min_unit}-${item?.max_unit}`;

                    return (
                      <p key={`fixed-fee-${i}`} className="font-medium">
                        {`${unit} units : `}
                        <span className="text-black">
                          {CurrencyFormat(price)}
                        </span>
                      </p>
                    );
                  })}
                </>
              ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Visibility</h5>
          <Paragraph>
            <span
              className={`break-words ${
                data?.visibility[0] === 'waiting for admin to decide'
                  ? 'text-ftbrown'
                  : 'text-black'
              }`}
            >
              {data?.visibility?.length !== 0
                ? data?.visibility[0]
                : data?.users?.map((item) => item?.name || 'noname').join(', ')}
            </span>
          </Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Status</h5>
          <Paragraph>
            <span
              className={`${
                data.status_approval === 'approved'
                  ? 'text-ftgreen-600'
                  : data.status_approval === 'waiting for approval'
                  ? 'text-ftbrown'
                  : 'text-red-600'
              }`}
            >
              {data?.status_approval}
            </span>
          </Paragraph>
        </div>
      </div>

      <form onSubmit={handleUpdate}>
        <div className="grid grid-flow-row-dense grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
          <div className="z-10 flex flex-col gap-2">
            <SelectCustom
              name="serviceType"
              data={optionsServiceTypes}
              label="Service Type"
              placeholder="Select Service"
              selectedValue={selectedServiceType}
              setSelectedValue={setSelectedServiceType}
            />

            <div className="flex flex-col gap-0.5">
              <Input
                type="text"
                label="Name of Service"
                name="name"
                value={formInput.name}
                onChange={handleChange}
              />
              {errorsInput.name && (
                <span className="text-[10px] animate-pulse text-red-600">
                  {errorsInput.name}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-0.5">
              <SelectCustom
                name="paymentPeriod"
                data={optionsPaymenPeriod}
                label="Payment Period"
                placeholder="Select Payment Period"
                selectedValue={selectedPaymentPeriod}
                setSelectedValue={setSelectedPaymentPeriod}
              />
              {errorsInput.paymentPeriod && (
                <span className="text-[10px] animate-pulse text-red-600">
                  {errorsInput.paymentPeriod}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-0.5">
              <Input
                type="text"
                label="Fixed Fee"
                name="fixedFee"
                value={formInput.fixedFee}
                onChange={(e) => handlePriceChange('fixedFee', e)}
                placeholder="Rp 0"
              />
              {errorsInput.fixedFee && (
                <span className="text-[10px] animate-pulse text-red-600 ">
                  {errorsInput.fixedFee}
                </span>
              )}
            </div>

            <TextArea
              label="Description of Service"
              name="description"
              rows={3}
              value={formInput.description}
              onChange={handleChange}
            />

            <TextArea
              label="Certification"
              name="certification"
              rows={3}
              value={formInput.certification}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <TextArea
              label="Award/Recognition/Experience"
              name="experience"
              rows={3}
              value={formInput.experience}
              onChange={handleChange}
            />

            <SelectCustom
              name="salesModel"
              data={optionsSalesModel}
              label="Sales Model"
              placeholder="Select Sales Model"
              selectedValue={selectedSalesModel}
              setSelectedValue={setSelectedSalesModel}
            />

            <div className="flex flex-col gap-0.5">
              <Input
                type="text"
                label="Price of (photo/video/stats)"
                name="price"
                value={formInput.price}
                onChange={(e) => handlePriceChange('price', e)}
                placeholder="Rp 0"
              />
              {errorsInput.price && (
                <span className="text-[10px] animate-pulse text-red-600">
                  {errorsInput.price}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-0.5">
              <Input
                type="text"
                label="% Paid to Other User"
                name="percentToShared"
                value={formInput.percentToShared}
                onChange={handlePercentChange}
              />
              {errorsInput.percentToShared && (
                <span className="text-[10px] animate-pulse text-red-600">
                  {errorsInput.percentToShared}
                </span>
              )}
            </div>

            {!visibilityCheck && (
              <div className="">
                <MultiSelect
                  label="Visibilty"
                  placeholder="Select Users"
                  options={optionsClients}
                  styles={customStylesSelect}
                  selectedOptions={selectedVisibility}
                  setSelectedOptions={setSelectedVisibility}
                />
              </div>
            )}
          </div>

          <div className="">
            <SelectCustom
              name="variableUnit"
              data={optionsVariableUnits}
              label="Variable Unit"
              placeholder="Select Variable Unit"
              selectedValue={selectedVariableUnit}
              setSelectedValue={setSelectedVariableUnit}
            />

            <div>
              {tiers.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mt-2 ">
                    <h5 className="font-bold ">Tier - {index + 1}</h5>

                    {tiers.length > 1 && (
                      <button
                        type="button"
                        className="inline-block p-1 text-sm text-red-300 transition-all duration-300 rounded-sm hover:text-red-600"
                        onClick={() => handleDeleteTier(item, index)}
                      >
                        <FaTrashCan />
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 sm:grid sm:grid-cols-3">
                    <Input
                      type="number"
                      label="Unit Min"
                      name={`min${index}`}
                      value={item.min}
                      onChange={(e) =>
                        handleTierChange(index, 'min', e.target.value)
                      }
                    />
                    <Input
                      type="number"
                      label="Unit Max"
                      name={`max${index}`}
                      value={item.max}
                      onChange={(e) =>
                        handleTierChange(index, 'max', e.target.value)
                      }
                    />
                    <Input
                      type="text"
                      label="Fees Per Unit"
                      name={`amount${index}`}
                      value={item.amount}
                      onChange={(e) =>
                        handleTierChange(index, 'amount', e.target.value)
                      }
                      placeholder="Rp 0"
                    />
                  </div>
                  {/* Tampilkan pesan kesalahan jika ada */}
                  <div className="flex flex-col gap-0.5">
                    {errorsTiers[index] && (
                      <span className="text-red-500 text-[10px] animate-pulse">
                        {errorsTiers[index]}
                      </span>
                    )}

                    {errorsRequiredTiers && errorsRequiredTiers[index] && (
                      <span className="text-red-500 text-[10px] animate-pulse ">
                        {errorsRequiredTiers[index].min &&
                        errorsRequiredTiers[index].max &&
                        errorsRequiredTiers[index].amount
                          ? 'Unit: Min, Max & Fee per unit is a required field'
                          : errorsRequiredTiers[index].min
                          ? errorsRequiredTiers[index]?.min
                          : errorsRequiredTiers[index].max
                          ? errorsRequiredTiers[index]?.max
                          : errorsRequiredTiers[index].amount
                          ? errorsRequiredTiers[index]?.amount
                          : null}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {tiers.length < 3 && (
                <Button
                  background="black"
                  className="px-4 mt-2"
                  onClick={handleAddTier}
                >
                  <span className="flex items-center gap-2">
                    <FaPlus /> Add Tier
                  </span>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end w-full gap-4 py-2 mt-4">
          {isAdmin || data?.status_approval === 'waiting for approval' ? (
            <Button
              background="red"
              className={`w-40`}
              disabled={loading}
              onClick={() => setIsOpenPopUpDelete(true)}
            >
              {loading ? <LoaderButtonAction /> : 'Delete'}
            </Button>
          ) : (
            <Button
              background="red"
              className="w-40"
              disabled={loading}
              onClick={() => setOpenModal(false)}
            >
              {loading ? <LoaderButtonAction /> : 'Close'}
            </Button>
          )}

          {isAccessAddMyService?.can_add && (
            <Button
              type="submit"
              background="black"
              className="w-40"
              disabled={loading}
            >
              {loading ? <LoaderButtonAction /> : 'Save'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormDetailAddModifyMyService;
