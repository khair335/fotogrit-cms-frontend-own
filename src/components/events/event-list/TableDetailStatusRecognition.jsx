import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { FaArrowsRotate } from 'react-icons/fa6';
import { toast } from 'react-toastify';

import { ErrorFetchingData } from '@/components/Errors';
import { SkeletonTable } from '@/components/Skeleton';
import { Button, LoaderButtonAction, Pagination, Tooltip } from '@/components';

import { customTableStyles } from '@/constants/tableStyle';
import { FetchData } from '@/helpers/FetchData';
import { useGetListProcessRecognitionQuery } from '@/services/api/eventsApiSlice';

const TableDetailStatusRecognition = (props) => {
  const { eventID, openPopUp, eventNumberID } = props;

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const { data, isLoading, isSuccess, isError, error, refetch } =
    useGetListProcessRecognitionQuery({
      page: currentPage,
      limit: limitPerPage,
      eventID: eventID,
    });

  const dataTable = data?.data;
  const meta = data?.meta;

  const totalPages = meta?.total_page;
  const totalRecords = meta?.total_record;

  const handleRecognition = async () => {
    setLoading(true);
    try {
      const url = `/restricted/api/v1/recog/image-upload?event_id=${eventID}`;
      const response = await FetchData(url);
      if (!response?.error) {
        setLoading(false);
        toast.success(`Face recognition has been successfully restarted.`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
      toast.error(`Failed: ${error?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const handleColorPick = () => {
    const link = `http://4.194.136.130:4001/col_pick?event_id=${eventNumberID}`;

    window.open(link, '_blank', 'noopener noreferrer');
  };

  const columns = [
    {
      name: 'API Call ID',
      selector: (row) => row.api_call_id,
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      cell: (row) => (
        <div>
          {row.status !== -1 ? (
            <span>{`${row.status}%`}</span>
          ) : (
            <span className="text-red-500">canceled</span>
          )}
        </div>
      ),
      sortable: true,
      minWidth: '100px',
      wrap: true,
    },
    {
      name: 'Description',
      selector: (row) => row.api,
      cell: (row) => (
        <>
          {row.api === 'img_upload'
            ? 'Face Recognition'
            : row.api === 'face_reg'
            ? 'Col Pick'
            : '-'}
        </>
      ),
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: 'Action',
      center: true,
      width: '100px',
      cell: (row) => (
        <div className="">
          {row.api === 'img_upload' ? (
            <Tooltip text="Face Recognition" position="top">
              <Button
                background="black"
                className="text-xs"
                onClick={handleRecognition}
                disabled={loading}
              >
                {loading ? <LoaderButtonAction /> : <FaArrowsRotate />}
              </Button>
            </Tooltip>
          ) : (
            <Tooltip text="Color Pick" position="top">
              <Button
                background="black"
                className="text-xs"
                onClick={handleColorPick}
              >
                <FaArrowsRotate />
              </Button>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    refetch();

    // Set interval to execute refetch every 10 seconds
    const intervalId = setInterval(() => {
      refetch();
    }, 10000);

    // Clean up the interval when the component is unmounted or the effect is re-run
    return () => clearInterval(intervalId);
  }, [openPopUp]);

  return (
    <>
      {isError ? (
        <ErrorFetchingData error={error} />
      ) : isLoading ? (
        <SkeletonTable />
      ) : isSuccess ? (
        <div className="border-t border-gray-200">
          <DataTable
            columns={columns}
            data={dataTable}
            fixedHeader
            fixedHeaderScrollHeight="50vh"
            customStyles={customTableStyles}
            noDataComponent={<NodataComponent />}
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
    </>
  );
};

const NodataComponent = () => {
  return (
    <div className="p-2">
      <p className="text-sm text-gray-600">
        Recognition status data is either empty or unprocessed.
      </p>
    </div>
  );
};

export default TableDetailStatusRecognition;
