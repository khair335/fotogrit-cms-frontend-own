    import { useEffect, useState } from 'react';
    import { toast } from 'react-toastify';
    import { yupResolver } from '@hookform/resolvers/yup';
    import { useForm } from 'react-hook-form';
    import * as yup from 'yup';

    import { DatePickerCustom, Input, UploadImage } from '@/components/form-input';
    import { Button, LoaderButtonAction, Modal } from '@/components';
    import CustomModal from '@/components/CustomModal';

    import { useAddNewSponsorMutation } from '@/services/api/othersApiSlice';

    const validationSchema = yup
      .object({
        name: yup.string().required('Name is is a required field'),
        // startDate: yup.string().required('Start Date is is a required field'),
        // endDate: yup.string().required('End Date is is a required field'),
        // logo: yup.string().required('Upload News Image is is a required field'),
        // link: yup.string().required('External Link is is a required field'),
      })
      .required();

    const FormAddNews = ({ setOpenColapse, isAccess }) => {
      const {
        register,
        handleSubmit,
        reset,
        clearErrors,
        formState: { errors },
      } = useForm({
        resolver: yupResolver(validationSchema),
      });

      const initialInputValue = {
        name: '',
        logo: null,
        link: '',
        startDate: '',
        endDate: '',
      };
      const [formInput, setFormInput] = useState(initialInputValue);
      const [selectedImage, setSelectedImage] = useState(null);
      const [errorImg, setErrorImg] = useState(null);

      const [addNewSponsor, { isLoading, error: errServer }] =
        useAddNewSponsorMutation();

      const [actionType, setActionType] = useState('external');
      const [externalLink, setExternalLink] = useState('');
      const [internalPage, setInternalPage] = useState('');

      const [selectedInternalPage, setSelectedInternalPage] = useState('');
      const [selectedDropdownValue, setSelectedDropdownValue] = useState('');
      const [displaySelected, setDisplaySelected] = useState(''); // New state to display selected item

      const [selectedDropdownValues, setSelectedDropdownValues] = useState({});
      const [inputValues, setInputValues] = useState({});

      const [isModalOpen, setIsModalOpen] = useState(false); // New state for modal visibility

      const handleOnSubmit = async () => {
        console.log('Submit button clicked'); // Check if this logs

        if (!selectedImage) {
          setErrorImg('Please select an image');
          return;
        }
        try {
          const formData = new FormData();
          formData.append('name', formInput.name);
          formData.append('logo', formInput.logo);
          formData.append('startDate', formInput.startDate); // Add startDate
          formData.append('endDate', formInput.endDate);     // Add endDate
          formData.append('link', formInput.link);     // Add link

          // Log all selected values
          console.log('Form Submission Data:', {
            name: formInput.name,
            logo: formInput.logo,
            startDate: formInput.startDate, // Log startDate
            endDate: formInput.endDate,     // Log endDate
            actionType,
            externalLink,
            selectedInternalPage,
            selectedDropdownValues,
            inputValues,
          });

          // const response = await addNewSponsor(formData).unwrap();

          // if (!response.error) {
          //   setFormInput(initialInputValue);
          //   reset();
          //   setOpenColapse(false);

          //   toast.success(`"${formInput.name}" has been added!`, {
          //     position: 'top-right',
          //     theme: 'light',
          //   });
          // }
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
        const handleStartDateChange = (date) => {
    setFormInput((prevState) => ({
      ...prevState,
      startDate: date,
      endDate: '',
    }));
  };

  const handleEndDateChange = (date) => {
    setFormInput((prevState) => ({
      ...prevState,
      endDate: date,
    }));
  };
      const handleCancel = () => {
        setFormInput(initialInputValue);
        setOpenColapse(false);
      };

      const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          if (file.type.startsWith('image/')) {
            setErrorImg(null);
            setSelectedImage(file);
            setFormInput((prevState) => ({
              ...prevState,
              logo: file,
            }));
          } else {
            setErrorImg('Invalid file type. Please select an image.');
            setSelectedImage(null);
          }
        } else {
          setErrorImg('Please select an image.');
          setSelectedImage(null);
        }
      };

      const handleActionTypeChange = (e) => {
        const newActionType = e.target.value;
        setActionType(newActionType);

        // Open the modal if the internal action type is selected
        if (newActionType === 'internal') {
          setIsModalOpen(true);
        } else {
          setIsModalOpen(false);
        }
      };

      const handleExternalLinkChange = (e) => {
        setExternalLink(e.target.value);
      };

      const handleInternalPageChange = (e) => {
        const selectedPage = e.target.value;
        setSelectedInternalPage(selectedPage);
        setSelectedDropdownValue(''); // Reset dropdown value when changing the radio selection

        // Update displaySelected with the selected page and its value
        const selectedValue = selectedDropdownValues[selectedPage] || '';
        setDisplaySelected(`${selectedPage} | ${selectedValue}`);
      };

      const handleDropdownChange = (e, label) => {
        const value = e.target.value;
        setSelectedDropdownValues((prevValues) => ({
          ...prevValues,
          [label]: value,
        }));

        // Update displaySelected with the new dropdown value
        if (selectedInternalPage === label) {
          setDisplaySelected(`${label} | ${value}`);
        }
      };

      const handleInputChange = (e, label) => {
        setInputValues((prevValues) => ({
          ...prevValues,
          [label]: e.target.value,
        }));
      };

      // Removing required error when input is filled.
      useEffect(() => {
        const fieldsToCheck = ['name'];

        fieldsToCheck.forEach((field) => {
          if (errors[field] && formInput[field] !== '') {
            if (errors[field].type === 'required') {
              clearErrors(field);
            }
          }
        });
      }, [formInput, clearErrors, errors]);


      const dropdownData =
        ['EG0751', 'EG0752', 'EG0753'];

      const internalPageSelectData = [
        {
          label: 'Event Group Results & Standing Webpage',
          type: 'Dropdown',
          value: dropdownData,
        },
        {

          label: 'Event Group Schedule Webpage',
          type: 'Dropdown',
          value: dropdownData,
        },
        {
          label: 'Event Detail Media',
          type: 'Dropdown',
          value: dropdownData,
        },
        {
          label: 'Event Detail Boxscore',
          type: 'Dropdown',
          value: dropdownData,
        },
        {
          label: 'Event Detail Watch',
          type: 'Dropdown',
          value: dropdownData,
        },
        {
          label: 'Own Profile Page',
        },
        {
          label: 'Specific User Page',
          type: 'Input',
        },
        {
          label: 'Edit Profile | Home',

        },
        {
          label: 'Edit Profile | Edit profile visibility',

        },
        {
          label: 'Edit Profile | Upload own documents',

        },
        {
          label: 'Search all my photos using face recognition',

        }
      ];

      const handleSave = () => {
        // Log the data to the console
        console.log('Saving data:', {
          selectedInternalPage,
          selectedDropdownValues,
          inputValues,
        });

        // Close the modal after saving
        setIsModalOpen(false);
      };

      return (
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <div className="flex  gap-4 gap-y-2">
            <div className='max-w-[200px] w-full'>
              <Input
                type="text"
                label="Name"
                name="name"
                value={formInput.name}
                onChange={handleChange}
                errValidation={errors}
                register={register}
                // disabled
              />
            </div>
            <div className='max-w-[200px] w-full'>
              <DatePickerCustom
                label="Start Date"
                name="startDate"
                value={formInput.startDate}
                onChange={handleStartDateChange}
                placeholder="Select Start Date"
                showMonthDropdown
                showYearDropdown
              // disabled={!isAccess?.can_edit}
              />
            </div>
            <div className='max-w-[200px] w-full'>
              <DatePickerCustom
                label="End Date"
                name="endDate"
                value={formInput.endDate}
                onChange={handleEndDateChange}
                placeholder="Select End Date"
                showMonthDropdown
                showYearDropdown
              // disabled={!isAccess?.can_edit}
              />
            </div>
            <div className='max-w-[200px] w-full'>
              <UploadImage
                label="Upload News Image"
                onChange={handleImageChange}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                height="h-40"
                errorImg={errorImg}
                setErrorImg={setErrorImg}
                accept="image/jpg, image/jpeg"
              />
            </div>
            <div className='flex-1'>
              <div>Action When Clicked</div>
              <div>
                <input
                  type="radio"
                  id="external"
                  name="actionType"
                  value="external"
                  checked={actionType === 'external'}
                  onChange={handleActionTypeChange}
                />
                <label htmlFor="external" className='pl-2 cursor-pointer'>External Link</label>
                {actionType === 'external' && (
                  <input
                    type="text"
                    placeholder="Enter external link"
                    className="border border-gray-300 rounded p-1 block text-[10px] mt-1 max-w-[200px] w-full"
                    value={externalLink}
                    onChange={handleExternalLinkChange}
                  />
                )}
              </div>
              <div>
                <input
                  type="radio"
                  id="internal"
                  name="actionType"
                  value="internal"
                  checked={actionType === 'internal'}
                  onChange={handleActionTypeChange}
                />
                <label htmlFor="internal" className='pl-2 cursor-pointer'>Internal Page</label>
                <CustomModal
                  isOpen={isModalOpen} // Use the new state for modal visibility
                  onClose={() => setIsModalOpen(false)} // Close the modal when requested
                >
                  {internalPageSelectData.map((item, index) => (
                    <div key={index}>
                      <label className='text-[#595959] text-xs flex items-center gap-2 cursor-pointer'>
                        <input
                          type="radio"
                          name="internalPage"
                          value={item.label}
                          checked={selectedInternalPage === item.label}
                          onChange={handleInternalPageChange}
                        />
                        <p className='text-[10px] inline-block'> {item.label}</p>
                      </label>
                      {item.type === 'Dropdown' && item.value && Array.isArray(item.value) && (
                        <select
                          value={selectedDropdownValues[item.label] || ''}
                          onChange={(e) => handleDropdownChange(e, item.label)}
                          className="border border-gray-300 rounded p-1 block text-[10px] mt-1 w-full"
                          disabled={selectedInternalPage !== item.label} // Disable if not selected
                        >
                          <option value="" disabled>Select an option</option> {/* Placeholder option */}
                          {item.value.map((value, index) => (
                            <option key={index} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                      )}
                      {item.type === 'Input' && (
                        <input
                          type="text"
                          placeholder="Enter value"
                          className="border border-gray-300 rounded p-1 block text-[10px] mt-1 w-full"
                          value={inputValues[item.label] || ''}
                          onChange={(e) => handleInputChange(e, item.label)}
                          disabled={selectedInternalPage !== item.label} // Disable if not selected
                        />
                      )}
                    </div>
                  ))}
                  <div className="flex justify-end mt-4">
                    <Button
                      type="button"
                      background="blue"
                      className="w-40"
                      onClick={handleSave}
                    >
                      Save
                    </Button>
                  </div>
                </CustomModal>
              </div>
              {/* Display the selected internal page and value */}
              {actionType !== 'external' && displaySelected && (
                <div className="mt-2 text-sm text-gray-700">
                  Selected: {displaySelected}
                </div>
              )}
            </div>
            <div className='flex-1'>
              <div className="flex justify-end w-full gap-4 py-2 mt-4 ">
              <Button
                background="red"
                className="w-40"
                disabled={isLoading}
                onClick={handleCancel}
              >
                {isLoading ? <LoaderButtonAction /> : 'Cancel'}
              </Button>
              <Button
                type="submit"
                background="black"
                className="w-40"
                disabled={isLoading}
              >
                {isLoading ? <LoaderButtonAction /> : 'Add'}
              </Button>
            </div>
          </div>
          </div>


        </form>
      );
    };

    export default FormAddNews;
