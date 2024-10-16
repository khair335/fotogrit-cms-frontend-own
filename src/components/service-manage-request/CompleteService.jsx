import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { PiWarningBold } from 'react-icons/pi';

import { RadioInput, CopyableText, Checkbox } from '@/components/form-input';
import { Button, LoaderButtonAction, PopUp } from '@/components';

import { useUploadImagesMutation } from '@/services/api/uploadApiSlice';
import {
  useUpdateActiveEventMutation,
  useUpdateStatusServiceFSPMutation,
  useUpdateStatusServiceSSPMutation,
  useUpdateValidateFromFSPMutation,
} from '@/services/api/serviceRequestApiSlice';
import { selectCurrentUser } from '@/services/state/authSlice';
import { FetchData } from '@/helpers/FetchData';
import { userTypeAdminCheck } from '@/helpers/UserTypeCheck';
import getApiUrl from '@/helpers/GetApiUrl';

const CompleteService = (props) => {
  const { data, dataTable, setIsOpenPopUpUploading, setIsUploadCompleted } =
    props;

  const API_URL = getApiUrl;

  const fileInputRef = useRef();

  const [uploadImgToFTP, setUploadImgToFTP] = useState(false);
  const [uploadImgToFotogrit, setUploadImgToFotogrit] = useState(true);
  const [isOpenPopUpConfirmation, setIsOpenPopUpConfirmation] = useState(false);
  const [isOpenPopUpWarning, setIsOpenPopUpWarning] = useState(false);
  const [isOpenPopUpCompleteTask, setIsOpenPopUpCompleteTask] = useState(false);
  const [isOpenPopUpCompletedBySSP, setIsOpenPopUpCompletedBySSP] =
    useState(false);
  const [isStatusMediaUploaded, setIsStatusMediaUploaded] = useState(false);
  const [isStatusComplete, setIsStatusComplete] = useState(false);
  const [isStatusRecognition, setIsStatusRecognition] = useState(false);
  const [isCheckedCompletedBySSP, setIsCheckedCompletedBySSP] = useState(true);
  const [dataFaceRecognition, setDataFaceRecognition] = useState('');

  const urlFTP = import.meta.env.VITE_URL_FTP;
  const [formInput] = useState({
    url: urlFTP,
    port: '2121',
  });

  const userProfile = useSelector(selectCurrentUser);
  const isAdmin = userTypeAdminCheck(userProfile);

  const getDataServiceFTP = JSON.parse(localStorage.getItem('FT-MSFTP'));

  const [uploadImages, { isLoading: isLoadingUpload }] =
    useUploadImagesMutation();

  const [updateStatusServiceFSP, { isLoading: isLoadingStatusFSP }] =
    useUpdateStatusServiceFSPMutation();
  const [updateStatusServiceSSP, { isLoading: isLoadingStatusSSP }] =
    useUpdateStatusServiceSSPMutation();

  const [updateActiveEvent, { isLoading: isLoadingActiveEvent }] =
    useUpdateActiveEventMutation();

  const [updateValidateFromFSP, { isLoading: isLoadingValidateFSP }] =
    useUpdateValidateFromFSPMutation();

  const determinePhotographerID = () => {
    const photographerID = data?.photographer_id;
    const currentUserID = userProfile?.id;

    if (isAdmin) {
      return photographerID;
    } else {
      return currentUserID;
    }
  };
  const sendPhotographerID = determinePhotographerID();

  const handleUploadingFotogrit = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 0) {
      try {
        // File format validation
        const allowedFormats = ['image/jpg', 'image/jpeg', 'video/mp4'];
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

        setIsOpenPopUpUploading(true);

        const formData = new FormData();
        formData.append('service_request_id', data?.id);
        formData.append('type', data?._type);
        files.forEach((image) => {
          formData.append('images', image);
        });

        const response = await uploadImages({
          url: `${API_URL}/restricted/api/v1/services/upload`,
          data: formData,
        }).unwrap();

        if (!response.error) {
          // Update status media has been uploaded
          const statusData = {
            id: data?.id,
            photographer_id: sendPhotographerID,
            status_work: 7, // MEDIA_HAS_BEEN_UPLOADED
          };

          let resStatusUploaded;
          if (data?.photographer_type === 'fsp') {
            resStatusUploaded = await updateStatusServiceFSP(
              statusData
            ).unwrap();
          } else {
            resStatusUploaded = await updateStatusServiceSSP(
              statusData
            ).unwrap();
          }

          const apiCallRecognition = response?.data?.api_call_id;

          if (apiCallRecognition) {
            const statusData = {
              id: data?.id,
              photographer_id: sendPhotographerID,
              status_work: 11, // MEDIA_HAS_BEEN_RECOGNIZED
            };

            let resStatusRecognition;
            if (data?.photographer_type === 'fsp') {
              resStatusRecognition = await updateStatusServiceFSP(
                statusData
              ).unwrap();
            } else {
              resStatusRecognition = await updateStatusServiceSSP(
                statusData
              ).unwrap();
            }
          }

          toast.success(`Media has been uploaded!`, {
            position: 'top-right',
            theme: 'light',
          });
          setIsUploadCompleted(true);
        }
      } catch (err) {
        console.error(err);
        setIsOpenPopUpUploading(false);
        toast.error(`Failed to save the media: ${err?.data?.message}`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleToggleUploadImgToFTP = () => {
    setUploadImgToFTP(true);
    setUploadImgToFotogrit(false);

    if (!getDataServiceFTP) {
      setIsOpenPopUpConfirmation(true);
    } else if (getDataServiceFTP?.id !== data?.id) {
      setIsOpenPopUpWarning(true);
    }
  };

  const handleToggleUploadImgToFotogrit = () => {
    setUploadImgToFTP(false);
    setUploadImgToFotogrit(true);
  };

  const handleOkConfirmationFTP = async () => {
    try {
      let updateData = {
        user_id: userProfile?.id,
        event_id: data?.event_id,
      };

      const response = await updateActiveEvent(updateData).unwrap();

      if (!response.error) {
        // Update status uploading media
        const statusData = {
          id: data?.id,
          photographer_id: sendPhotographerID,
          status_work: 4, // UPLOADING_MEDIA
        };

        let resStatus;
        if (data?.photographer_type === 'fsp') {
          resStatus = await updateStatusServiceFSP(statusData).unwrap();
        } else {
          resStatus = await updateStatusServiceSSP(statusData).unwrap();
        }

        toast.success(`Image upload to FTP has been successfully activated`, {
          position: 'top-right',
          theme: 'light',
        });

        setIsOpenPopUpConfirmation(false);

        localStorage.setItem('FT-MSFTP', JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      setIsOpenPopUpConfirmation(false);
      setUploadImgToFTP(false);
      setUploadImgToFotogrit(true);
      toast.error(`Failed to activate FTP: ${err?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const autoRecognition = async (data) => {
    try {
      const url = `/restricted/api/v1/recog/image-upload?event_id=${data?.id}`;
      const response = await FetchData(url);
      if (!response?.error) {
        const statusData = {
          id: data?.id,
          photographer_id: sendPhotographerID,
          status_work: 11, // MEDIA_HAS_BEEN_RECOGNIZED
        };

        let resStatusRecognition;
        if (data?.photographer_type === 'fsp') {
          resStatusRecognition = await updateStatusServiceFSP(
            statusData
          ).unwrap();
        } else {
          resStatusRecognition = await updateStatusServiceSSP(
            statusData
          ).unwrap();
        }

        if (!resStatusRecognition.errot) {
          toast.success(`Status update: Media has been recognized.`, {
            position: 'top-right',
            theme: 'light',
          });
        }
      } else {
        const statusData = {
          id: data?.id,
          photographer_id: sendPhotographerID,
          status_work: 7, // MEDIA_HAS_BEEN_UPLOADED
        };

        let resStatusUploaded;
        if (data?.photographer_type === 'fsp') {
          resStatusUploaded = await updateStatusServiceFSP(statusData).unwrap();
        } else {
          resStatusUploaded = await updateStatusServiceSSP(statusData).unwrap();
        }

        if (!resStatusUploaded.error) {
          toast.success(`Status update: Media has been uploaded`, {
            position: 'top-right',
            theme: 'light',
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Failed: ${error?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const handleStopProcessFTP = async () => {
    try {
      let updateData = {
        user_id: userProfile?.id,
        event_id: '',
      };

      const response = await updateActiveEvent(updateData).unwrap();

      if (!response.error) {
        autoRecognition(data);

        setUploadImgToFTP(false);
        setUploadImgToFotogrit(true);

        localStorage.removeItem('FT-MSFTP');

        toast.success(`FTP process has been stopped successfully`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      console.error(err);

      toast.error(`Failed to stop the FTP process: ${err?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const handleCancelConfirmationFTP = () => {
    setIsOpenPopUpConfirmation(false);
    setUploadImgToFTP(false);
    setUploadImgToFotogrit(true);
  };

  const handleOkWarning = async () => {
    try {
      let updateData = {
        user_id: userProfile?.id,
        event_id: data?.event_id,
      };

      const response = await updateActiveEvent(updateData).unwrap();

      if (!response.error) {
        autoRecognition(getDataServiceFTP);

        const statusData = {
          id: data?.id,
          photographer_id: sendPhotographerID,
          status_work: 4, // UPLOADING_MEDIA
        };

        let resStatus;
        if (data?.photographer_type === 'fsp') {
          resStatus = await updateStatusServiceFSP(statusData).unwrap();
        } else {
          resStatus = await updateStatusServiceSSP(statusData).unwrap();
        }

        toast.success(`Image upload to FTP has been successfully activated`, {
          position: 'top-right',
          theme: 'light',
        });

        setIsOpenPopUpWarning(false);

        localStorage.setItem('FT-MSFTP', JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      setIsOpenPopUpWarning(false);
      setUploadImgToFTP(false);
      setUploadImgToFotogrit(true);
      toast.error(`Failed to activate FTP: ${err?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const handleCancelWarning = () => {
    setIsOpenPopUpWarning(false);
    setUploadImgToFTP(false);
    setUploadImgToFotogrit(true);
  };

  const handleColorPick = async (id) => {
    try {
      const url = `/restricted/api/v1/recog/col-pick?event_id=${id}`;
      const response = await FetchData(url);

      if (!response?.error) {
        const link = response?.data?.redirect_url;
        window.open(link, '_blank', 'noopener noreferrer');

        const statusData = {
          id: data?.id,
          photographer_id: sendPhotographerID,
          status_work: 11, // MEDIA_HAS_BEEN_RECOGNIZED
        };

        let resStatus;
        if (data?.photographer_type === 'fsp') {
          resStatus = await updateStatusServiceFSP(statusData).unwrap();
        } else {
          resStatus = await updateStatusServiceSSP(statusData).unwrap();
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Failed: ${error?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const handleCompleteTask = async () => {
    try {
      let resStatus;
      if (data?.photographer_type === 'fsp') {
        resStatus = await updateStatusServiceFSP({
          id: data?.id,
          photographer_id: sendPhotographerID,
          status_work: 12, // COMPLETED_BY_FSP
        }).unwrap();
      } else {
        resStatus = await updateStatusServiceSSP({
          id: data?.id,
          photographer_id: sendPhotographerID,
          status_work: 13, // COMPLETED_BY_SSP
        }).unwrap();
      }

      if (!resStatus.error) {
        toast.success(`Task has been completed.`, {
          position: 'top-right',
          theme: 'light',
        });

        setIsOpenPopUpCompleteTask(false);
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed: ${err?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const handleCompleteBySSP = async () => {
    try {
      const response = await updateValidateFromFSP({
        service_request_id: data?.id,
        validate: !isCheckedCompletedBySSP,
      }).unwrap();

      if (!response.error) {
        toast.success(
          `Task ${
            isCheckedCompletedBySSP ? 'Uncompleted' : 'Completed'
          } by SSP`,
          {
            position: 'top-right',
            theme: 'light',
          }
        );

        setIsOpenPopUpCompletedBySSP(false);
      }
    } catch (err) {
      console.error(err);
      setIsOpenPopUpCompletedBySSP(false);
      toast.error(`Failed: ${err?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  // Fetch real-time data when a selection is made.
  useEffect(() => {
    // Find the selected item in the data table.
    const matchingData = dataTable?.find((item) => item.id === data?.id);

    const isStatusUploadedComplete =
      matchingData?.status_work === 'media has been uploaded' ||
      matchingData?.status_work === 'media has been recognized' ||
      matchingData?.status_work === 'complete' ||
      matchingData?.status_work === 'completed by ssp' ||
      matchingData?.status_work === 'completed by fsp';

    const statusRecognition =
      matchingData?.status_work === 'media has been recognized';

    const statusComplete = matchingData?.status_work === 'complete';

    setIsStatusMediaUploaded(isStatusUploadedComplete);
    setIsStatusRecognition(statusRecognition);
    setIsStatusComplete(statusComplete);

    setIsCheckedCompletedBySSP(matchingData?.validate_subcontract);
  }, [dataTable]);

  const isDataMatched = getDataServiceFTP?.id === data?.id;

  useEffect(() => {
    if (isDataMatched) {
      setUploadImgToFTP(true);
      setUploadImgToFotogrit(false);
    } else {
      setUploadImgToFTP(false);
      setUploadImgToFotogrit(true);
    }
  }, [data, isDataMatched]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h5 className="mb-2 font-bold">Complete Service</h5>

        {data?.photographer_type === 'fsp' &&
          data?.do_subcontract === true &&
          data?.status_work === 'completed by ssp' && (
            <div className="flex items-center gap-2 hover:opacity-70">
              <Checkbox
                name="isCheckedCompletedBySSP"
                checked={isCheckedCompletedBySSP}
                onChange={() => setIsOpenPopUpCompletedBySSP(true)}
                className="w-4 h-4"
              />

              <span
                className={`text-sm cursor-pointer ${
                  isCheckedCompletedBySSP ? 'text-black' : 'text-gray-500'
                }  font-bold `}
                onClick={() => setIsOpenPopUpCompletedBySSP(true)}
              >
                Completed by SSP
              </span>
            </div>
          )}
      </div>
      <div className="">
        <h6 className="font-bold">Step 1</h6>
        <p className="text-gray-400">Choose the option for uploading media.</p>

        <div className="grid gap-1 lg:grid-cols-3">
          <div
            className={`lg:col-span-2 px-2 py-4 rounded-xl gap-2 ${
              uploadImgToFTP ? 'bg-[#111111]/20' : 'bg-transparent'
            } `}
          >
            <RadioInput
              label="Uploading Image to FTP"
              name="uploadIMG"
              id="imgToFTP"
              checked={uploadImgToFTP}
              onChange={handleToggleUploadImgToFTP}
              labelStyle="font-medium"
            />

            <div className="mt-2 text-sm ml-7 ">
              <div className="mb-2 font-medium">
                <h6>Please enter this Information to your Camera</h6>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <CopyableText
                    type="text"
                    label="FTP Address"
                    value={formInput.url}
                    disabled={!uploadImgToFTP}
                  />

                  <div className="flex flex-col md:gap-2 md:flex-row md:items-center">
                    <label
                      htmlFor="username"
                      className="text-xs font-medium text-gray-500 w-[30%]"
                    >
                      Username
                    </label>

                    <div className="flex-grow">
                      <input
                        type="text"
                        name="username"
                        id="username"
                        readOnly
                        placeholder="your username in app"
                        className="w-full px-3 py-2 outline-none rounded-xl bg-white/50 shadow__gear-2 focus:bg-gray-300/90 disabled:opacity-80 disabled:bg-black/30 disabled:text-black disabled:placeholder:text-black"
                        disabled={!uploadImgToFTP}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex flex-col md:gap-2 md:flex-row md:items-center">
                    <label
                      htmlFor="port"
                      className="text-xs font-medium text-gray-500 w-[30%]"
                    >
                      Port
                    </label>

                    <div className="flex-grow">
                      <input
                        type="text"
                        name="port"
                        id="port"
                        placeholder="port"
                        value={formInput.port}
                        readOnly
                        className="w-full px-3 py-2 outline-none rounded-xl bg-white/50 shadow__gear-2 focus:bg-gray-300/90 disabled:opacity-80 disabled:bg-black/30 disabled:text-black disabled:placeholder:text-black"
                        disabled={!uploadImgToFTP}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col md:gap-2 md:flex-row md:items-center">
                    <label
                      htmlFor="password"
                      className="text-xs font-medium text-gray-500 w-[30%]"
                    >
                      Password
                    </label>

                    <div className="flex-grow">
                      <input
                        type="text"
                        name="password"
                        id="password"
                        placeholder="your password in app"
                        readOnly
                        className="w-full px-3 py-2 outline-none rounded-xl bg-white/50 shadow__gear-2 focus:bg-gray-300/90 disabled:opacity-80 disabled:bg-black/30 disabled:text-black disabled:placeholder:text-black"
                        disabled={!uploadImgToFTP}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-2 md:mt-0">
                    <Button
                      background="red"
                      className="w-44"
                      onClick={handleStopProcessFTP}
                      disabled={!uploadImgToFTP || !isDataMatched}
                    >
                      {isLoadingActiveEvent ? (
                        <LoaderButtonAction />
                      ) : (
                        'Stop Process'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div
              className={`px-2 py-4 rounded-xl ${
                uploadImgToFotogrit ? 'bg-[#111111]/20' : 'bg-transparent'
              } `}
            >
              <RadioInput
                label="Uploading Image to Fotogrit"
                name="uploadIMG"
                id="imgToFotogrit"
                checked={uploadImgToFotogrit}
                onChange={handleToggleUploadImgToFotogrit}
                labelStyle="font-medium"
              />

              <div className="grid gap-3 mt-2 text-sm ml-7 sm:grid-cols-1">
                <div className="flex flex-col gap-2 ">
                  <div className="font-medium">
                    <h6 className="max-w-[80%]">Upload Media to Fotogrit</h6>
                  </div>

                  <div className="">
                    <div className="w-full h-full mt-2">
                      <label htmlFor="upload" className="cursor-pointer ">
                        <Button
                          type="Button"
                          background="black"
                          className={`px-4 py-2 text-center rounded-xl transition-all duration-300 block w-full hover:bg-opacity-80 disabled:bg-opacity-70`}
                          onClick={handleFileInputClick}
                          disabled={!uploadImgToFotogrit}
                        >
                          <span className="text-white ">Upload</span>
                        </Button>
                        <input
                          id="upload"
                          type="file"
                          ref={fileInputRef}
                          multiple
                          accept="image/jpg,image/jpeg,video/mp4"
                          className="hidden"
                          onChange={handleUploadingFotogrit}
                          disabled={isLoadingUpload}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h6 className="font-bold">Step 2</h6>
        <div className={`grid gap-1 sm:grid-cols-2 lg:grid-cols-3 rounded-xl `}>
          <div className="flex flex-col gap-2 ">
            <div className="font-medium">
              <h6>Starting Color Pick</h6>
            </div>

            <div className="">
              <div className="w-full h-full mt-2">
                <label htmlFor="upload" className="cursor-pointer ">
                  <Button
                    type="Button"
                    background="black"
                    onClick={() => handleColorPick(data?.event_id)}
                    className="block w-full px-4 py-2 text-center transition-all duration-300 rounded-xl hover:bg-opacity-80 disabled:opacity-60"
                    disabled={!isStatusMediaUploaded}
                  >
                    <span className="text-white ">Start</span>
                  </Button>
                  <input
                    id="upload"
                    type="file"
                    multiple
                    accept="image/jpg,image/jpeg,video/mp4"
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="Button"
          background="green"
          onClick={() => setIsOpenPopUpCompleteTask(true)}
          className="w-44"
          disabled={!isStatusRecognition || isStatusComplete}
        >
          <span className="text-white ">Complete Task</span>
        </Button>
      </div>

      {/* POPUP COMPLETE TASK */}
      <PopUp
        setIsOpenPopUp={setIsOpenPopUpCompleteTask}
        isOpenPopUp={isOpenPopUpCompleteTask}
        headerButton="false"
      >
        <div className="p-4">
          <h5 className="mb-3 text-lg font-bold text-center">
            Are you sure want to Completed the assignment ?
          </h5>

          <div className="flex items-center justify-center">
            <div className="flex gap-2">
              <Button
                background="red"
                className="w-28"
                onClick={() => setIsOpenPopUpCompleteTask(false)}
                disabled={isLoadingStatusFSP || isLoadingStatusSSP}
              >
                {isLoadingStatusFSP || isLoadingStatusSSP ? (
                  <LoaderButtonAction />
                ) : (
                  'No'
                )}
              </Button>
              <Button
                background="black"
                className="w-28"
                onClick={handleCompleteTask}
                disabled={isLoadingStatusFSP || isLoadingStatusSSP}
              >
                {isLoadingStatusFSP || isLoadingStatusSSP ? (
                  <LoaderButtonAction />
                ) : (
                  'Yes'
                )}
              </Button>
            </div>
          </div>
        </div>
      </PopUp>
      {/* END POPUP COMPLETE TASK */}

      {/* POPUP COMPLETED BY SSP */}
      <PopUp
        setIsOpenPopUp={setIsOpenPopUpCompletedBySSP}
        isOpenPopUp={isOpenPopUpCompletedBySSP}
        headerButton="false"
      >
        <div className="p-4">
          <h5 className="mb-3 text-lg font-bold text-center">
            {`Are you sure to ${
              isCheckedCompletedBySSP ? 'Uncompleted' : 'Completed'
            } task by SSP ?`}
          </h5>
          <div className="flex items-center justify-center">
            <div className="flex gap-2">
              <Button
                background="red"
                className="w-28"
                onClick={() => setIsOpenPopUpCompletedBySSP(false)}
                disabled={isLoadingValidateFSP}
              >
                {isLoadingValidateFSP ? <LoaderButtonAction /> : 'No'}
              </Button>
              <Button
                background="black"
                className="w-28"
                onClick={handleCompleteBySSP}
                disabled={isLoadingValidateFSP}
              >
                {isLoadingValidateFSP ? <LoaderButtonAction /> : 'Yes'}
              </Button>
            </div>
          </div>
        </div>
      </PopUp>
      {/* END POPUP COMPLETED BY SSP */}

      {/* POPUP Confirmation */}
      <PopUp
        setIsOpenPopUp={setIsOpenPopUpConfirmation}
        isOpenPopUp={isOpenPopUpConfirmation}
        headerButton="false"
        handleClose={handleCancelConfirmationFTP}
      >
        <h5 className="text-lg font-bold text-center ">Confirmation</h5>

        <p className="max-w-md mb-4 font-medium text-center">
          You will activate this event session. <br /> Please click OK to
          continue your work.
        </p>

        <div className="flex items-center justify-center">
          <div className="flex gap-2">
            <Button
              background="red"
              className="w-28"
              onClick={handleCancelConfirmationFTP}
              disabled={isLoadingActiveEvent}
            >
              {isLoadingActiveEvent ? <LoaderButtonAction /> : 'Cancel'}
            </Button>
            <Button
              background="black"
              className="w-28"
              onClick={handleOkConfirmationFTP}
              disabled={isLoadingActiveEvent}
            >
              {isLoadingActiveEvent ? <LoaderButtonAction /> : 'Ok'}
            </Button>
          </div>
        </div>
      </PopUp>
      {/* END POPUP Confirmation */}

      {/* POPUP Warning */}
      <PopUp
        setIsOpenPopUp={setIsOpenPopUpWarning}
        isOpenPopUp={isOpenPopUpWarning}
        headerButton="false"
        handleClose={handleCancelWarning}
      >
        <div className="flex items-center justify-center w-16 h-16 p-2 mx-auto my-2 rounded-full bg-red-200/50">
          <PiWarningBold className="text-red-500 text-7xl animate-pulse" />
        </div>

        <p className="max-w-md font-medium text-center">
          You are currently in the process of uploading photos in the previous
          event. Please stop the process at the previous event first.
        </p>
        <p className="max-w-md mb-4 font-medium text-center">
          If you still want to access this event, the photo queue from the
          previous event will be moved to this event. Click confirm if you are
          willing.
        </p>

        <div className="flex items-center justify-center">
          <div className="flex gap-2">
            <Button
              background="red"
              className="w-28"
              onClick={handleCancelWarning}
            >
              {isLoadingActiveEvent ? <LoaderButtonAction /> : 'Cancel'}
            </Button>
            <Button
              background="black"
              className="w-28"
              onClick={handleOkWarning}
            >
              {isLoadingActiveEvent ? <LoaderButtonAction /> : 'Ok'}
            </Button>
          </div>
        </div>
      </PopUp>
      {/* END POPUP Warning */}
    </div>
  );
};

export default CompleteService;
