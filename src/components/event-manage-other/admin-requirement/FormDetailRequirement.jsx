import React from 'react';

import { Paragraph } from '@/components/typography';
import { Input, SelectInput } from '@/components/form-input';

import { Button } from '@/components';
import { useState, useEffect, useRef } from 'react';

import { useUploadImagesMutation } from '@/services/api/uploadApiSlice';
import { toast } from 'react-toastify';

const FormDetailRequirement = (props) => {
  const {
    data,
    setIsOpenPopUpDelete,
    setIsOpenPopUpUploading,
    setIsUploadCompleted,
  } = props;

  const initialInputValue = {
    role: '',
    positionOfPlayers: '',
    jerseyNumber: '',
  };

  const [formInput, setFormInput] = useState(initialInputValue);

  const fileInputRef = useRef();

  const [uploadImages] = useUploadImagesMutation();

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 0) {
      try {
        // File format validation
        const allowedFormats = ['image/jpg', 'image/jpeg'];
        const invalidFiles = files.filter(
          (file) => !allowedFormats.includes(file.type)
        );

        if (invalidFiles.length > 0) {
          // Display an error message if the file is not in the image or video format
          toast.error(
            `Invalid file format. Only images (JPEG, JPG) and videos (MP4) are allowed.`,
            {
              position: 'top-right',
              theme: 'light',
            }
          );
          return; //  Stop if there is a file that doesn't match
        }

        // setIsOpenPopUpUploading(true);

        // const formData = new FormData();
        // formData.append('event_id', selectedEvent?.value);
        // files.forEach((image) => {
        //   formData.append('images', image);
        // });

        // const response = await uploadImages({
        //   url: `${API_URL}/restricted/api/v1/event/media-list`,
        //   data: formData,
        // }).unwrap();

        // NEW
        // const link = `http://4.194.136.130:4002/img_new_upload?event_id=${response?.data[0]?._event_id}`;
        // window.open(link, '_blank', 'noopener noreferrer');

        // OLD
        // const link = `http://4.194.136.130:8000/img_new_upload?event_id=${response?.data[0]?._event_id}`;

        // setSelectedEvent('');

        toast.success(`Photos has been uploaded!`, {
          position: 'top-right',
          theme: 'light',
        });
        setIsUploadCompleted(true);
      } catch (err) {
        setIsOpenPopUpUploading(false);
        console.error(err);
        toast.error(`Failed to save the photos`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (data) {
      setFormInput({
        role: data?.role,
        positionOfPlayers: data?.positionOfPlayers,
        jerseyNumber: data?.jerseyNumber,
      });
    }
  }, [data, setFormInput]);

  const handleUpdate = (e) => {
    e.preventDefault();
    toast.success(`Event Group ${formInput.rosterId} has been updated!`, {
      position: 'top-right',
      theme: 'light',
    });
  };
  return (
    <>
      <div className="grid grid-cols-1 gap-4 mb-6 text-sm sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Requirements</h5>
          <div className="h-12 text-gray-600 font-medium">
            <p>KTP ID</p>
          </div>

          <div className="h-12 text-gray-600 font-medium">
            <p>Photos</p>
          </div>
          <div className="h-12 text-gray-600 font-medium">
            <p>KK</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">User Status</h5>
          <div className="h-12 text-gray-600 font-medium">
            <p>{data?.statusAdministrative?.ktpId}</p>
          </div>
          <div className="h-12 text-gray-600 font-medium">
            <p>{data?.statusAdministrative?.photos}</p>
          </div>
          <div className="h-12 text-gray-600 font-medium">
            <p>{data?.statusAdministrative?.kk}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Validate</h5>
          <div className="h-12 text-gray-600 font-medium">
            {data?.statusAdministrative?.ktpId == 'Done' ? (
              <div className="w-full">
                <Button
                  background="green"
                  className="font-medium w-full lg:w-1/2"
                >
                  Validate
                </Button>
              </div>
            ) : (
              <form>
                <div className="flex items-center justify-between gap-2">
                  <div className="cursor-pointer group w-full lg:w-1/2">
                    <div
                      className="w-full px-4 py-2 text-center rounded-xl group-hover:bg-opacity-80 transition-all duration-300 bg-ftbrown"
                      onClick={handleFileInputClick}
                    >
                      <span className="text-white">Upload</span>
                    </div>

                    <input
                      id="upload"
                      type="file"
                      ref={fileInputRef}
                      multiple
                      accept="image/jpg,image/jpeg"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </form>
            )}
          </div>
          <div className=" h-12 text-gray-600 font-medium">
            {data?.statusAdministrative?.photos == 'Done' ? (
              <div className="w-full">
                <Button
                  background="green"
                  className="font-medium w-full lg:w-1/2"
                >
                  Validate
                </Button>
              </div>
            ) : (
              <form>
                <div className="flex items-center justify-between gap-2">
                  <div className="cursor-pointer group w-full">
                    <div
                      className="w-full lg:w-1/2 px-4 py-2 text-center rounded-xl group-hover:bg-opacity-80 transition-all duration-300 bg-ftbrown"
                      onClick={handleFileInputClick}
                    >
                      <span className="text-white">Upload</span>
                    </div>

                    <input
                      id="upload"
                      type="file"
                      ref={fileInputRef}
                      multiple
                      accept="image/jpg,image/jpeg"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </form>
            )}
          </div>

          <div className="h-12 text-ftgreen-600 italic">Validate</div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="text-xl font-bold">Manage Roster</h1>
        <form onSubmit={handleUpdate}>
          <div className="grid grid-flow-row-dense grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2">
            <div className="flex flex-col gap-0.5">
              <Input
                type="text"
                label="Role"
                name="role"
                value={formInput.role}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-0.5">
              <Input
                type="text"
                label="Position"
                name="position"
                value={formInput.positionOfPlayers}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-0.5">
              <Input
                type="text"
                label="Jersey/Number"
                name="jerseyNumber"
                value={formInput.jerseyNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end w-full gap-4 py-2 mt-4">
            <Button
              background="red"
              className="w-32"
              onClick={() => setIsOpenPopUpDelete(true)}
            >
              Delete
            </Button>
            <Button type="submit" background="black" className="w-32">
              Save
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default FormDetailRequirement;
