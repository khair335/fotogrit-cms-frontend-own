import { useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { IoIosArrowForward } from 'react-icons/io';

import { ButtonAction, Pagination, Tooltip } from '@/components';
import {
  DatePickerCustom,
  Input,
  SelectInput,
  UploadImage,
} from '@/components/form-input';

import { customTableStyles } from '@/constants/tableStyle';
import { ErrorFetchingData } from '@/components/Errors';
import { SkeletonTable } from '@/components/Skeleton';

const TableEditManageEvent = (props) => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    limitPerPage,
    setCurrentPage,
    currentPage,
  } = props;

  const teams = data?.data?.teams;
  const meta = data?.meta;

  const totalPages = meta?.total_page;
  const totalRecords = meta?.total_record;

  const [selectedRowIds, setSelectedRowIds] = useState('');

  const handleExpandable = (id) => {
    setSelectedRowIds((prevIds) => (prevIds === id ? '' : id));
  };

  // Columns Table
  const columns = [
    {
      name: 'Event ID',
      selector: (row) => row.event_code,
      cell: (row) => row.event_code || '-',
      sortable: true,
      minWidth: '140px',
    },
    {
      name: 'Age Group',
      selector: (row) => row.age_group,
      cell: (row) => row.age_group || '-',
      sortable: true,
      minWidth: '130px',
    },
    {
      name: 'Event Categories',
      selector: (row) => row.event_categories,
      cell: (row) => row.event_categories || '-',
      sortable: true,
      minWidth: '170px',
    },
    {
      name: 'Pool',
      selector: (row) => row.pool,
      cell: (row) => row.pool || '-',
      sortable: true,
      minWidth: '160px',
    },
    {
      name: 'Date / Time',
      selector: (row) => row.date_time,
      cell: (row) => row.date_time || '-',
      sortable: true,
      minWidth: '160px',
    },
    {
      name: 'Location',
      selector: (row) => row.location,
      cell: (row) => row.location || '-',
      sortable: true,
      minWidth: '160px',
    },
    {
      name: 'Team A',
      selector: (row) => row.team_a,
      cell: (row) => row.team_a || '-',
      sortable: true,
      minWidth: '160px',
    },
    {
      name: 'Team B',
      selector: (row) => row.team_b,
      cell: (row) => row.team_b || '-',
      sortable: true,
      minWidth: '160px',
    },
    {
      name: 'Action',
      center: true,
      width: '80px',
      cell: (row) => (
        <>
          <Tooltip text="open" position="top">
            <button
              className="p-2 font-bold text-white transition-all duration-150 bg-black rounded-lg hover:bg-gray-900 group"
              onClick={() => handleExpandable(row?.id)}
            >
              <IoIosArrowForward className="transition-all duration-300 group-hover:transform group-hover:rotate-90" />
            </button>
          </Tooltip>
        </>
      ),
    },
  ];

  const expandableRowsComponent = useMemo(() => {
    return ({ data }) => <ExpandedComponent rowData={data} />;
  }, []);

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
            data={teams}
            fixedHeader
            fixedHeaderScrollHeight="50vh"
            customStyles={customTableStyles}
            selectableRows
            expandableRows
            expandableRowsHideExpander
            expandableRowExpanded={(row) => selectedRowIds === row?.id}
            expandableRowsComponent={expandableRowsComponent}
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
    </div>
  );
};

const ExpandedComponent = () => {
  const initialInputValue = {
    serviceProvide1: '',
    finalScoreClubA: '',
    finalScoreClubB: '',
    serviceType1: '',
    winner: '',
    image: '',
    serviceProvide2: '',
    hallOfFame1: '',
    linkYoutube: '',
    serviceType2: '',
    hallOfFame2: '',
    linkMedia: '',
  };
  const [formInput, setFormInput] = useState(initialInputValue);
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorImg, setErrorImg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setErrorImg(null);
        setSelectedImage(file);
        setFormInput((prevState) => ({
          ...prevState,
          image: file,
        }));
      } else {
        setErrorImg('Invalid file type. Please select an image.');
        setSelectedImage(null);
      }
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4 p-2 pl-16">
      <div className="flex flex-col gap-1">
        <Input
          type="text"
          label="Service Provide 1"
          name="serviceProvide1"
          value={formInput.serviceProvide1}
          onChange={handleChange}
        />
        <Input
          type="text"
          label="Final Score Club A"
          name="finalScoreClubA"
          value={formInput.finalScoreClubA}
          onChange={handleChange}
        />
        <Input
          type="text"
          label="Final Score Club B"
          name="finalScoreClubB"
          value={formInput.finalScoreClubB}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Input
          type="text"
          label="Service Type 1"
          name="serviceType1"
          value={formInput.serviceType1}
          onChange={handleChange}
        />
        <Input
          type="text"
          label="Winner"
          name="winner"
          value={formInput.winner}
          onChange={handleChange}
        />
        <UploadImage
          label="Cover Image"
          onChange={handleImageChange}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          height="h-24"
          errorImg={errorImg}
          setErrorImg={setErrorImg}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Input
          type="text"
          label="Service Provide 2"
          name="serviceProvide2"
          value={formInput.serviceProvide2}
          onChange={handleChange}
        />
        <Input
          type="text"
          label="Hall of Fame 1 : MVP"
          name="hallOfFame1"
          value={formInput.hallOfFame1}
          onChange={handleChange}
        />
        <Input
          type="text"
          label="Link Youtube"
          name="linkYoutube"
          value={formInput.linkYoutube}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Input
          type="text"
          label="Service Type 2"
          name="serviceType2"
          value={formInput.serviceType2}
          onChange={handleChange}
        />
        <Input
          type="text"
          label="Hall of Fame 2 : Top Blocks"
          name="hallOfFame2"
          value={formInput.hallOfFame2}
          onChange={handleChange}
        />
        <Input
          type="text"
          label="Link Media"
          name="linkMedia"
          value={formInput.linkMedia}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default TableEditManageEvent;
