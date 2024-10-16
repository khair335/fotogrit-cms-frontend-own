import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { toast } from 'react-toastify';

import { SkeletonTable } from '../../Skeleton';
import { ErrorFetchingData, NoDataMessage } from '@/components/Errors';
import {
  ButtonAction,
  LoaderButtonAction,
  Pagination,
  PopUp,
  Tooltip,
} from '@/components';
import { formatDate } from '@/helpers/FormatDate';
import { useUploadImagesMutation } from '@/services/api/uploadApiSlice';
import { customTableStyles } from '@/constants/tableStyle';
import { FaCircleInfo } from 'react-icons/fa6';
import TableDetailStatusRecognition from './TableDetailStatusRecognition';
import { FetchData } from '@/helpers/FetchData';
import getApiUrl from '@/helpers/GetApiUrl';

const TableEventList = (props) => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    setOpenModal,
    setGetData,
    setIsOpenPopUpUploading,
    selectedEventId,
    setSelectedEventId,
    setIsUploadCompleted,
    isAccessStreamContabo,
    isAccessFaceReqognition,
    setCurrentPage,
    currentPage,
    limitPerPage,
    metaPagination,
    isTeamManager,
  } = props;

  const API_URL = getApiUrl;

  const [openPopUpDetailRecognition, setOpenPopUpDetailRecognition] =
    useState(false);
  const [eventID, setEventID] = useState('');
  const [eventNumberID, setEventNumberID] = useState('');

  const totalPages = metaPagination?.total_page;
  const totalRecords = metaPagination?.total_record;

  const handleStreamContabo = async (id) => {
    try {
      const url = `/restricted/api/v1/events/stream-contabo/${id}`;
      const response = await FetchData(url);
      if (!response?.error) {
        window.open(`/stream-contabo`, '_blank', 'noopener noreferrer');
        toast.success(
          `Streaming in queue, processing will be done in background`,
          {
            position: 'top-right',
            theme: 'light',
          }
        );
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Failed: ${error?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const handleRecognition = async (id) => {
    try {
      const url = `/restricted/api/v1/recog/col-pick?event_id=${id}`;
      const response = await FetchData(url);

      if (!response?.error) {
        const link = response?.data?.redirect_url;
        window.open(link, '_blank', 'noopener noreferrer');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const [uploadImages, { isLoading: isLoadingUpload }] =
    useUploadImagesMutation();

  const handleFileChange = async (e) => {
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
            `Invalid file format. Only images (JPEG, PNG) and videos (MP4) are allowed.`,
            {
              position: 'top-right',
              theme: 'light',
            }
          );
          return; //  Stop if there is a file that doesn't match
        }

        setIsOpenPopUpUploading(true);

        const formData = new FormData();
        formData.append('event_id', selectedEventId);
        files.forEach((image) => {
          formData.append('images', image);
        });

        const response = await uploadImages({
          url: `${API_URL}/restricted/api/v1/event/media-list`,
          data: formData,
        }).unwrap();

        if (!response.error) {
          toast.success(`Media has been added!`, {
            position: 'top-right',
            theme: 'light',
          });

          setIsUploadCompleted(true);
        }
      } catch (err) {
        console.error(err);
        setIsOpenPopUpUploading(false);
        toast.error(`Failed: ${err?.data?.message}`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    }
  };

  const handleUploadButtonClick = (row) => {
    setSelectedEventId(row?.id);
  };

  const handleClickPopUprecognition = (data) => {
    setEventID(data?.id);
    setEventNumberID(data?._id);
    setOpenPopUpDetailRecognition(true);
  };

  // Columns Table
  const columns = [
    {
      name: 'Group Code',
      selector: (row) => row.group_code,
      sortable: true,
      width: '140px',
      cell: (row) => (
        <div className="w-full h-full py-[14px]">
          <span className="">{row.group_code}</span>
        </div>
      ),
    },
    {
      name: 'Event Code',
      selector: (row) => row.event_code,
      cell: (row) => (
        <div className="w-full h-full py-[14px] ">
          <div className="flex flex-col w-full gap-1 ">
            <p>{row.event_code}</p>
            {isAccessStreamContabo?.can_menu ? (
              <button
                className="block w-full p-3 text-center text-white rounded-lg bg-secondary hover:bg-opacity-80 disabled:opacity-50 disabled:bg-gray-500"
                onClick={() => handleStreamContabo(row.id)}
              >
                <p>Stream Contabo</p>
              </button>
            ) : null}
            {isAccessFaceReqognition?.can_menu ? (
              <button
                className="block w-full p-3 text-center text-white rounded-lg bg-secondary hover:bg-opacity-80"
                onClick={() => handleRecognition(row?.id)}
              >
                <p>Facial Recognition</p>
              </button>
            ) : null}
          </div>
        </div>
      ),
      sortable: true,
      width: '160px',
    },
    {
      name: 'Cover Image',
      selector: (row) => row.cover_image,
      cell: (row) => {
        return row?.thumbnail ? (
          <div className="w-full h-full p-2 ">
            <div className="w-full max-h-24 overflow-hidden mx-auto mt-2 rounded-sm">
              <img
                src={row?.thumbnail}
                alt={`img-${row.event_code}`}
                className="object-cover object-center w-full h-full"
              />
            </div>
          </div>
        ) : (
          <div className="w-full h-full p-2">
            <div className=" w-[80%] mt-2 mx-auto">
              <img
                src="/images/logo-fotogrit.png"
                alt="image placeholder"
                className="object-fill w-full h-full"
              />
            </div>
          </div>
        );
      },
      width: '160px',
      center: true,
    },
    {
      name: 'Event Name',
      selector: (row) => row.event_name,
      sortable: true,
      minWidth: '180px',
      wrap: true,
      cell: (row) => (
        <div className="w-full h-full py-[14px] flex items-start justify-between">
          <p className="w-[80%]">{row.event_name}</p>
          <div className="">
            <Tooltip text="Status Recognition & Col Pick" position="top">
              <FaCircleInfo
                className="cursor-pointer text-lg text-cyan-500 hover:text-cyan-700 transition-all duration-300"
                onClick={() => handleClickPopUprecognition(row)}
              />
            </Tooltip>
          </div>
        </div>
      ),
    },
    {
      name: 'Date & Time',
      selector: (row) => row.date_start,
      cell: (row) => (
        <div className="w-full h-full py-[14px]">
          <p>
            {formatDate(row.date_start)} {row.time_start || '..'} -{' '}
            {formatDate(row.date_finish)} {row.time_finish || '..'}
          </p>
        </div>
      ),
      sortable: true,
      minWidth: '160px',
    },
    {
      name: 'Location',
      selector: (row) => row.event_location,
      sortable: true,
      minWidth: '160px',
      cell: (row) => (
        <div className="w-full h-full py-[14px]">
          <span className="">{row.event_location}</span>
        </div>
      ),
    },
  ];

  // Add Column
  if (!isTeamManager) {
    columns.push(
      {
        name: 'Create By',
        selector: (row) => row.created_by || '-',
        sortable: true,
        minWidth: '160px',
        cell: (row) => (
          <div className="w-full h-full py-[14px]">
            <span className="">{row.created_by}</span>
          </div>
        ),
      },
      {
        name: 'Media',
        selector: () => 'upload',
        width: '120px',
        center: true,
        cell: (row) => (
          <div className="w-full h-full py-[14px]">
            <label htmlFor="upload" className="cursor-pointer ">
              <div
                className={`px-4 py-2 text-center rounded-md transition-all duration-300 ${
                  isLoadingUpload
                    ? 'bg-gray-400'
                    : 'bg-black hover:bg-opacity-80'
                } 
                `}
                onClick={() => handleUploadButtonClick(row)}
              >
                <span className="text-white ">
                  {isLoadingUpload && row?.id === selectedEventId ? (
                    <LoaderButtonAction />
                  ) : (
                    'Upload'
                  )}
                </span>
              </div>
              <input
                id="upload"
                type="file"
                multiple
                accept="image/jpg,image/jpeg,video/mp4"
                className="hidden"
                onChange={handleFileChange}
                disabled={isLoadingUpload}
              />
            </label>
          </div>
        ),
      },
      {
        name: 'Action',
        center: true,
        width: '100px',
        cell: (props) => (
          <div className="w-full h-full py-[14px] flex justify-center">
            <ButtonAction
              setGetData={setGetData}
              setOpenModal={setOpenModal}
              {...props}
            />
          </div>
        ),
      }
    );
  }

  return (
    <div>
      {isError ? (
        <ErrorFetchingData error={error} />
      ) : isLoading ? (
        <SkeletonTable />
      ) : isSuccess ? (
        <div className="border-t border-gray-200">
          <DataTable
            columns={columns}
            data={data}
            fixedHeader
            fixedHeaderScrollHeight="50vh"
            customStyles={customTableStyles}
            persistTableHead
            noDataComponent={<NoDataMessage title="Events" />}
          />

          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            limitPerPage={limitPerPage}
          />
        </div>
      ) : null}

      <PopUp
        isOpenPopUp={openPopUpDetailRecognition}
        setIsOpenPopUp={setOpenPopUpDetailRecognition}
        title="List Status Auto Recognition & Color Pick"
      >
        <div className="max-w-xl">
          <TableDetailStatusRecognition
            eventID={eventID}
            eventNumberID={eventNumberID}
            openPopUp={openPopUpDetailRecognition}
          />
        </div>
      </PopUp>
    </div>
  );
};

export default TableEventList;
