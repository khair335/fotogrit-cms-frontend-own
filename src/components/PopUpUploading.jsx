import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowRightLong } from 'react-icons/fa6';
import { Transition } from '@headlessui/react';
import {
  BsFillCloudUploadFill,
  BsFileEarmarkImageFill,
  BsCheckCircleFill,
} from 'react-icons/bs';

import { Button } from '.';

import {
  getUploadProgress,
  setUploadProgress,
} from '@/services/state/globalSlice';
import { setEventListID } from '@/services/state/eventsSlice';

const PopUpUploading = ({
  setIsOpenPopUpUploading,
  isOpenPopUpUploading,
  setCurrentActiveTab,
  selectedEventId,
  isUploadCompleted,
  setIsUploadCompleted,
  disableBtnMedia,
}) => {
  const dispatch = useDispatch();

  const uploadProgress = useSelector(getUploadProgress);

  const handleClose = () => {
    dispatch(setUploadProgress(0));
    setIsOpenPopUpUploading(false);
    setIsUploadCompleted(false);
  };

  const handleToMedia = () => {
    dispatch(setUploadProgress(0));
    setIsOpenPopUpUploading(false);
    setCurrentActiveTab(3);
    dispatch(setEventListID(selectedEventId));
    setIsUploadCompleted(false);
  };

  return (
    <Transition appear as={Fragment} show={isOpenPopUpUploading}>
      <div className="absolute inset-0 top-0 z-50 flex items-center justify-center w-full h-full">
        <Transition.Child
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={` bg__backdrop absolute inset-0 `} />
        </Transition.Child>

        <div className=" w-[80%] sm:w-[50%]  h-[50%] sm:h-[30%] md:h-[40%] z-10">
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-50"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-50"
          >
            <div className="flex flex-col items-center justify-center w-full h-full gap-2 p-4 py-8 text-center bg-white rounded-lg">
              <div
                className={`flex items-center justify-center w-16 h-16 p-4 mx-auto mb-2 rounded-full  ${
                  uploadProgress === 100 && isUploadCompleted
                    ? 'bg-green-200/40'
                    : 'bg-cyan-200/40'
                }`}
              >
                <BsFillCloudUploadFill
                  className={`text-7xl text-cyan-500 animate-pulse ${
                    uploadProgress === 100 && isUploadCompleted
                      ? 'text-green-600'
                      : 'text-cyan-600'
                  }`}
                />
              </div>

              <p
                className={`text-xl font-bold transition-all duration-200 ${
                  uploadProgress === 100 && isUploadCompleted
                    ? 'text-green-600'
                    : 'text-cyan-600'
                }`}
              >
                {uploadProgress === 100 && isUploadCompleted
                  ? 'Completed!'
                  : 'Uploading...'}
              </p>

              <div
                className={`flex items-center w-full px-3 py-6 space-x-2 rounded-md  ${
                  uploadProgress === 100 && isUploadCompleted
                    ? 'bg-green-500/30'
                    : 'bg-cyan-500/30'
                }`}
              >
                <BsFileEarmarkImageFill
                  className={`text-5xl ${
                    uploadProgress === 100 && isUploadCompleted
                      ? 'text-green-600'
                      : 'text-cyan-600'
                  }`}
                />

                <p
                  className={`w-10 font-medium ${
                    uploadProgress === 100 && isUploadCompleted
                      ? 'text-green-800'
                      : 'text-cyan-800'
                  }`}
                >
                  {uploadProgress}%
                </p>

                <div className="relative flex-grow h-4 overflow-hidden bg-white rounded-md">
                  <div
                    className={`absolute top-0 left-0 h-full rounded-md ${
                      uploadProgress === 100 && isUploadCompleted
                        ? 'bg-green-600'
                        : 'bg-cyan-600'
                    }  animate-pulse`}
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>

                {uploadProgress === 100 && isUploadCompleted ? (
                  <BsCheckCircleFill className="text-2xl text-green-600" />
                ) : null}
              </div>

              {uploadProgress === 100 && isUploadCompleted ? (
                <div className="grid place-items-center">
                  <div className="flex w-full gap-2 mt-4">
                    <Button
                      background="red"
                      className="w-40"
                      onClick={handleClose}
                    >
                      Close
                    </Button>

                    {!disableBtnMedia && (
                      <Button
                        background="black"
                        className="flex items-center justify-center w-40 gap-2"
                        onClick={handleToMedia}
                      >
                        Go to Media <FaArrowRightLong />
                      </Button>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </Transition.Child>
        </div>
      </div>
    </Transition>
  );
};

export default PopUpUploading;
