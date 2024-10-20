import { useState } from 'react';

import {
  Input,
  TextArea,
  Checkbox,
  UploadImage,
} from '@/components/form-input';
import { FaTrashCan } from 'react-icons/fa6';
import { Button, LoaderButtonAction } from '@/components';
import { FaPlus } from 'react-icons/fa';
import { useAddNewEquipmentMutation } from '@/services/api/equipmentApiSlice';
import { toast } from 'react-toastify';

const FormAddEquipment = () => {
  const INITIAL_FORM_INPUT = {
    name: '',
    category: '',
    stock: '',
    location: '',
    value: 0,
    description: '',
    specification: '',
    req_ktp: false,
    req_deposit: false,
    deposit_amount: 0,
  };

  const [formInput, setFormInput] = useState(INITIAL_FORM_INPUT);

  const [fixedFees, setFixedFees] = useState([
    { min: '', max: '', amount: '' },
  ]);
  const [errorsRequiredFixedFees, setErrorsRequiredFixedFees] = useState([]);
  const [errorsFixedFees, setErrorsFixedFees] = useState([]);
  const [checkIDCard, setCheckIDCard] = useState(false);
  const [checkDeposit, setCheckDeposit] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorImg, setErrorImg] = useState(null);

  const [addNewEquipment, { isLoading: isLoadingAddData, error: errServer }] =
    useAddNewEquipmentMutation();

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      const newData = {
        name: formInput.name,
        category: formInput.category,
        stock: parseInt(formInput.stock),
        location: formInput.location,
        value: parseInt(formInput.value),
        description: formInput.description,
        specification: formInput.specification,
        req_ktp: formInput.req_ktp,
        req_deposit: formInput.req_deposit,
        deposit_amount: parseInt(formInput.deposit_amount),
      };

      const response = await addNewEquipment(newData).unwrap();

      if (!response.error) {
        setFormInput(INITIAL_FORM_INPUT);

        toast.success(`"${formInput.name}" has been added!`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed: ${err?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFixedFeeChange = (index, field, value) => {
    const updatedFixedFees = [...fixedFees];
    updatedFixedFees[index][field] = value;
    setFixedFees(updatedFixedFees);

    // Validation Fixed Fee
    const errorMessage = validateFixedFee(updatedFixedFees, index);

    setErrorsFixedFees((prevErrors) => {
      const newErrors = [...prevErrors];
      newErrors[index] = errorMessage;
      return newErrors;
    });

    if (value.trim() !== '') {
      setErrorsRequiredFixedFees((prevErrors) => {
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

  const handleAddFixedFee = () => {
    setFixedFees([...fixedFees, { min: '', max: '', amount: '' }]);
  };

  const handleDeleteFixedFee = (index) => {
    const updatedFixedFees = [...fixedFees];
    updatedFixedFees.splice(index, 1); // Delete Element
    setFixedFees(updatedFixedFees);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.type.startsWith('image/')) {
        setErrorImg(null);
        setSelectedImage(file);
        setImages(file);
      } else {
        setErrorImg('Invalid file type. Please select an image.');
        setSelectedImage(null);
      }
    }
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-2">
          <Input
            type="text"
            label="Equipment Name"
            name="name"
            value={formInput.name}
            onChange={handleChange}
          />
          <Input
            type="text"
            label="Category"
            name="category"
            value={formInput.category}
            onChange={handleChange}
          />
          <Input
            type="text"
            label="Stocks"
            name="stock"
            value={formInput.stock}
            onChange={handleChange}
          />
          <Input
            type="text"
            label="Location"
            name="location"
            value={formInput.location}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Input
            type="number"
            label="Replacement Value"
            name="value"
            value={formInput.value}
            onChange={handleChange}
          />

          <div className="col-span-1">
            <TextArea
              label="Description of Equipment"
              name="description"
              rows={3}
              value={formInput.description}
              onChange={handleChange}
            />
          </div>

          <div className="col-span-1">
            <TextArea
              label="Specification of Equipment"
              name="specification"
              rows={3}
              value={formInput.specification}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            {fixedFees.map((fixedFee, index) => (
              <div key={index}>
                <div className="flex items-center justify-between">
                  <h5 className="font-bold ">Fixed Fee - {index + 1}</h5>

                  {fixedFees.length > 1 && (
                    <button
                      type="button"
                      className="inline-block p-1 text-sm text-red-300 transition-all duration-300 rounded-sm hover:text-red-600"
                      onClick={() => handleDeleteFixedFee(index)}
                    >
                      <FaTrashCan />
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-2 sm:grid sm:grid-cols-3">
                  <Input
                    type="number"
                    label="Min"
                    name={`min${index}`}
                    value={fixedFee.min}
                    onChange={(e) =>
                      handleFixedFeeChange(index, 'min', e.target.value)
                    }
                  />
                  <Input
                    type="number"
                    label="Max"
                    name={`max${index}`}
                    value={fixedFee.max}
                    onChange={(e) =>
                      handleFixedFeeChange(index, 'max', e.target.value)
                    }
                  />
                  <Input
                    type="number"
                    label="Fee"
                    name={`amount${index}`}
                    value={fixedFee.amount}
                    onChange={(e) =>
                      handleFixedFeeChange(index, 'amount', e.target.value)
                    }
                  />
                </div>
                {/* Tampilkan pesan kesalahan jika ada */}
                <div className="flex flex-col">
                  {errorsFixedFees[index] && (
                    <span className="text-red-500 text-[10px] animate-pulse">
                      {errorsFixedFees[index]}
                    </span>
                  )}

                  {errorsRequiredFixedFees &&
                    errorsRequiredFixedFees[index] && (
                      <span className="text-red-500 text-[10px] animate-pulse ">
                        {errorsRequiredFixedFees[index].min &&
                        errorsRequiredFixedFees[index].max &&
                        errorsRequiredFixedFees[index].amount
                          ? 'Min, Max & Fee is a required field'
                          : errorsRequiredFixedFees[index].min
                          ? 'Min is a required field'
                          : errorsRequiredFixedFees[index].max
                          ? 'Max is a required field'
                          : errorsRequiredFixedFees[index].amount
                          ? 'Fee is a required field'
                          : null}
                      </span>
                    )}
                </div>
              </div>
            ))}

            <div className="-mt-2">
              {fixedFees.length < 3 && (
                <Button
                  background="black"
                  className="px-4 mt-2"
                  onClick={handleAddFixedFee}
                >
                  <span className="flex items-center gap-2">
                    <FaPlus /> Add Fixed Fee
                  </span>
                </Button>
              )}
            </div>
          </div>

          <h5 className="font-bold ">Rental Requirement</h5>
          <div className="flex items-center gap-4">
            <Checkbox
              name="ktp"
              checked={checkIDCard}
              onChange={() => setCheckIDCard(!checkIDCard)}
            />

            <span
              className={`text-sm ${
                checkIDCard ? 'text-black font-bold' : 'text-gray-500'
              } `}
            >
              ID (KTP / SIM)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Checkbox
              name="ktp"
              checked={checkDeposit}
              onChange={() => setCheckDeposit(!checkDeposit)}
            />

            <span
              className={`text-sm ${
                checkDeposit ? 'text-black font-bold' : 'text-gray-500'
              } `}
            >
              Deposit
            </span>

            <div className="">
              <Input
                type="text"
                name="deposit"
                value={formInput.deposit_amount}
                onChange={handleChange}
                disabled={!checkDeposit}
                placeholder="Deposit"
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 w-[75%] sm:w-full">
            <UploadImage
              // label="Event Group Photo"
              name="eventLogo"
              onChange={handleImageChange}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              height="h-20"
              setErrorImg={setErrorImg}
            />
            <UploadImage
              // label="Event Group Photo"
              name="eventLogo"
              onChange={handleImageChange}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              height="h-20"
              setErrorImg={setErrorImg}
            />
            <UploadImage
              // label="Event Group Photo"
              name="eventLogo"
              onChange={handleImageChange}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              height="h-20"
              setErrorImg={setErrorImg}
            />
            <UploadImage
              // label="Event Group Photo"
              name="eventLogo"
              onChange={handleImageChange}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              height="h-20"
              setErrorImg={setErrorImg}
            />
            <UploadImage
              // label="Event Group Photo"
              name="eventLogo"
              onChange={handleImageChange}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              height="h-20"
              setErrorImg={setErrorImg}
            />
            <UploadImage
              // label="Event Group Photo"
              name="eventLogo"
              onChange={handleImageChange}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              height="h-20"
              setErrorImg={setErrorImg}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end w-full gap-4 py-2 mt-4">
        <Button background="red" className="w-40" disabled>
          Cancel
        </Button>
        <Button type="submit" background="black" className="w-40" disabled>
          {isLoadingAddData ? <LoaderButtonAction /> : 'Add'}
        </Button>
      </div>
    </form>
  );
};

export default FormAddEquipment;
