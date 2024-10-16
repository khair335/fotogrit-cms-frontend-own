import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { SelectCustom } from '@/components/form-input';
import { useUploadImagesMutation } from '@/services/api/uploadApiSlice';
import getApiUrl from '@/helpers/GetApiUrl';

const FormAddMediaList = (props) => {
  const {
    optionsEvents,
    setIsOpenPopUpUploading,
    setIsUploadCompleted,
    eventGroupID,
  } = props;

  const API_URL = getApiUrl;

  const fileInputRef = useRef();
  const [selectedEvent, setSelectedEvent] = useState('');

  const [uploadImages, { isLoading }] = useUploadImagesMutation();

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 0) {
      try {
        const allowedFormats = ['image/jpg', 'image/jpeg', 'video/mp4'];
        const invalidFiles = files.filter(
          (file) => !allowedFormats.includes(file.type)
        );

        if (invalidFiles.length > 0) {
          toast.error(
            `Invalid file format. Only images (JPEG, JPG) and videos (MP4) are allowed.`,
            {
              position: 'top-right',
              theme: 'light',
            }
          );
          return;
        }

        setIsOpenPopUpUploading(true);

        const formData = new FormData();
        formData.append('event_id', selectedEvent?.value);
        files.forEach((image) => {
          formData.append('images', image);
        });

        const response = await uploadImages({
          url: `${API_URL}/restricted/api/v1/event/media-list`,
          data: formData,
        }).unwrap();

        if (!response.error) {
          setSelectedEvent('');

          toast.success(`Media has been added!`, {
            position: 'top-right',
            theme: 'light',
          });
          setIsUploadCompleted(true);
        }
      } catch (err) {
        setIsOpenPopUpUploading(false);
        console.error(err);
        toast.error(`Failed to save the media`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    setSelectedEvent('');
  }, [eventGroupID]);

  return (
    <form>
      <div className="grid grid-flow-row-dense grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4 gap-y-2">
        <div className="z-10 sm:col-span-2 lg:col-span-3">
          <SelectCustom
            name="eventCode"
            data={optionsEvents}
            placeholder="Select Event"
            label="Event Code "
            selectedValue={selectedEvent}
            setSelectedValue={setSelectedEvent}
          />
        </div>

        <div className="mt-auto">
          <div className="cursor-pointer group">
            <div
              className={`px-4 py-2 text-center rounded-md group-hover:bg-opacity-80 transition-all duration-300 ${
                isLoading === true || selectedEvent === ''
                  ? 'bg-opacity-60 bg-gray-800'
                  : 'bg-black '
              }`}
              onClick={handleFileInputClick}
            >
              <span className="text-white ">Upload</span>
            </div>

            <input
              id="upload"
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/jpg,image/jpeg,video/mp4"
              className="hidden"
              onChange={handleFileChange}
              disabled={isLoading || selectedEvent === ''}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default FormAddMediaList;
