import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { FaTrashCan } from 'react-icons/fa6';

import { Input, SelectInput, TextArea } from '@/components/form-input';
import { Button, LoaderButtonAction } from '@/components';
import {
  useAddNewServicesMutation,
  useAddNewVariableFeeMutation,
} from '@/services/api/serviceRequestApiSlice';
import { removeCurrencyFormat } from '@/helpers/CurrencyFormat';
import {
  optionsEmpty,
  optionsSalesModelDocVerification,
  optionsSalesModelPhotoVideo,
  optionsSalesModelScoring,
  optionsSalesModelStreaming,
  optionsVariableUnits,
} from '@/constants';

const FormAddModifyService = ({
  setOpenColapse,
  optionsPaymenPeriod,
  optionsServiceTypes,
}) => {
  const initialInputValue = {
    name: '',
    fixedFee: 'Rp 0',
    description: '',
    certification: '',
    experience: '',
    price: 'Rp 0',
    percentToShared: '0 %',
  };
  const [formInput, setFormInput] = useState(initialInputValue);

  const [selectedPaymentPeriod, setSelectedPaymentPeriod] = useState(1);
  const [selectedServiceType, setSelectedServiceType] = useState(1);
  const [selectedSalesModel, setSelectedSalesModel] = useState(1);
  const [selectedVariableUnit, setSelectedVariableUnit] = useState(2);
  const [loading, setLoading] = useState(false);
  const [tiers, setTiers] = useState([{ min: '', max: '', amount: 'Rp 0' }]);

  const [errorsTiers, setErrorsTiers] = useState([]);
  const [errorsRequiredTiers, setErrorsRequiredTiers] = useState([]);
  const [errorsInput, setErrorsInput] = useState([]);

  const [addNewServices] = useAddNewServicesMutation();
  const [addNewVariableFee] = useAddNewVariableFeeMutation();

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

      if (index >= 1 && !fee.min) {
        feeErrors.min = 'Unit Min is a required field';
      }

      if (index >= 1 && !fee.max) {
        feeErrors.max = 'Unit Max is a required field';
      }

      if ((index >= 1 && !fee.amount) || (index >= 1 && fee.amount === 'Rp ')) {
        feeErrors.amount = 'Fees per unit is a required field';
      }

      return feeErrors;
    });

    return errors;
  };

  const transformDataInputFromTiers = (dataInput, serviceId) => {
    return dataInput?.map((data, index) => ({
      service_id: serviceId,
      tier: index + 1,
      min_unit: parseInt(data?.min || 1),
      max_unit: parseInt(data?.max || 999),
      fee_unit: removeCurrencyFormat(data?.amount),
    }));
  };

  const handleOnSubmit = async (e) => {
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

      let newData = {
        name: formInput.name,
        service_type: selectedServiceType,
        payment_period: parseInt(selectedPaymentPeriod),
        description: formInput.description,
        certification: formInput.certification,
        experience: formInput.experience,
        sales_model: parseInt(selectedSalesModel),
        variable_unit: parseInt(selectedVariableUnit),
        percent_to_shared: parseInt(formInput.percentToShared),
        basic_fixed_fee: removeCurrencyFormat(formInput.fixedFee),
      };

      if (selectedServiceType === 1) {
        newData.photo_price = removeCurrencyFormat(formInput.price);
      }
      if (selectedServiceType === 2) {
        newData.stream_price = removeCurrencyFormat(formInput.price);
      }
      if (
        selectedServiceType === 3 ||
        selectedServiceType === 6 ||
        selectedServiceType === 7 ||
        selectedServiceType === 8
      ) {
        newData.score_price = removeCurrencyFormat(formInput.price);
      }
      if (selectedServiceType === 4) {
        newData.video_price = removeCurrencyFormat(formInput.price);
      }

      // Add service
      const resAddedService = await addNewServices(newData).unwrap();

      if (!resAddedService.error) {
        const serviceID = resAddedService?.data?.id;
        const transformedData = transformDataInputFromTiers(tiers, serviceID);

        let resVariableFee;
        // Add variable fee
        for (const newDataVarFee of transformedData) {
          resVariableFee = await addNewVariableFee(newDataVarFee).unwrap();
        }

        setOpenColapse(false);
        if (!resVariableFee?.error) {
          setLoading(false);
          toast.success(`Service has been added!`, {
            position: 'top-right',
            theme: 'light',
          });
        }
      } else {
        setLoading(false);
        toast.error(`Failed: ${resAddedService?.data?.message}`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      toast.error(`Failed: ${err?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const handleTierChange = (index, field, value) => {
    const updatedtiers = [...tiers];
    updatedtiers[index][field] = value;

    // Format amount as desired (e.g., "Rp 10,000")
    if (field === 'amount') {
      // Remove characters other than digits (0-9)
      const numericValue = value.replace(/[^0-9]/g, '');

      const numberValue =
        numericValue.trim() === '' ? 0 : parseInt(numericValue, 10);

      // Format the price as desired, for example: "Rp 10,000"
      updatedtiers[index][field] = `Rp ${numberValue
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
    }

    setTiers(updatedtiers);

    // Validation Fixed Fee
    const errorMessage = validateTiers(updatedtiers, index);

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

  const handleCancel = () => {
    setOpenColapse(false);
  };

  useEffect(() => {
    if (selectedPaymentPeriod) {
      setErrorsInput({
        ...errorsInput,
        paymentPeriod: '',
      });
    }
  }, [selectedPaymentPeriod]);

  const handleAddTier = () => {
    setTiers([...tiers, { min: '', max: '', amount: '' }]);
  };

  const handleDeleteTier = (index) => {
    const updatedtiers = [...tiers];
    updatedtiers.splice(index, 1); // Delete Element
    setTiers(updatedtiers);
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

    const numberValue =
      numericValue.trim() === '' ? 0 : parseInt(numericValue, 10);

    // Format the price as desired, for example: "Rp 10,000"
    const formattedPrice = `Rp ${numberValue
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

  let optionsSalesModel;
  if ([1, 4].includes(selectedServiceType)) {
    optionsSalesModel = optionsSalesModelPhotoVideo;
  } else if (selectedServiceType === 2) {
    optionsSalesModel = optionsSalesModelStreaming;
  } else if ([3, 6, 7, 8].includes(selectedServiceType)) {
    optionsSalesModel = optionsSalesModelScoring;
  } else if (selectedServiceType === 9) {
    optionsSalesModel = optionsSalesModelDocVerification;
  } else {
    optionsSalesModel = optionsEmpty;
  }

  useEffect(() => {
    if (selectedServiceType) {
      let checkServiceType;
      if ([1, 4].includes(selectedServiceType)) {
        checkServiceType = 1;
      } else if (selectedServiceType === 2) {
        checkServiceType = 3;
      } else if ([3, 6, 7, 8].includes(selectedServiceType)) {
        checkServiceType = 4;
      } else if (selectedServiceType === 9) {
        checkServiceType = 6;
      } else {
        checkServiceType = '';
      }

      setSelectedSalesModel(checkServiceType);
    }
  }, [selectedServiceType]);

  useEffect(() => {
    if (selectedPaymentPeriod) {
      const checkPaymenPeriod = selectedPaymentPeriod === 3 ? 1 : 2;

      setSelectedVariableUnit(checkPaymenPeriod);
    }
  }, [selectedPaymentPeriod]);

  return (
    <>
      <form onSubmit={handleOnSubmit}>
        <div className="grid grid-flow-row-dense grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
          <div className="z-10 flex flex-col gap-2">
            <SelectInput
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
              <SelectInput
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

            <SelectInput
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
                placeholder="0 %"
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
          </div>

          <div className="flex flex-col gap-2">
            <SelectInput
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
                        onClick={() => handleDeleteTier(index)}
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
          <Button
            background="red"
            className="w-40"
            disabled={loading}
            onClick={handleCancel}
          >
            {loading ? <LoaderButtonAction /> : 'Cancel'}
          </Button>
          <Button
            type="submit"
            background="black"
            className="w-40"
            disabled={loading}
          >
            {loading ? <LoaderButtonAction /> : 'Add'}
          </Button>
        </div>
      </form>
    </>
  );
};

export default FormAddModifyService;
