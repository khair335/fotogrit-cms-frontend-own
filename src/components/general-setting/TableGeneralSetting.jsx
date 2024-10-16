import DataTable from 'react-data-table-component';

import { SkeletonTableTwoRow } from '../Skeleton';
import { ButtonAction } from '@/components';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';
import { ErrorFetchingData } from '@/components/Errors';

const TableGeneralSetting = (props) => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    setOpenModal,
    setGetData,
  } = props;

  // Columns Table
  const columns = [
    {
      name: 'Group Code',
      selector: (row) => row.code,
      sortable: true,
      width: '160px',
    },
    {
      name: 'Price Name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Price',
      selector: (row) => row.price,
      sortable: true,
      cell: (row) => CurrencyFormat(row.price),
    },
    {
      name: 'Action',
      center: true,
      width: '100px',
      cell: (props) => (
        <ButtonAction
          setGetData={setGetData}
          setOpenModal={setOpenModal}
          {...props}
        />
      ),
    },
  ];

  // Custom Style Table
  const customStyles = {
    rows: {
      style: {
        '&:not(:last-of-type)': {
          border: 'none',
        },
      },
    },
    headCells: {
      style: {
        fontWeight: 800,
        fontSize: '14px',
      },
    },
    cells: {
      style: {
        fontSize: '12px',
      },
    },
  };

  return (
    <div>
      {isError ? (
        <ErrorFetchingData error={error} />
      ) : isLoading ? (
        <SkeletonTableTwoRow />
      ) : isSuccess ? (
        <div className="border-t border-gray-200">
          <DataTable
            columns={columns}
            data={data}
            fixedHeader
            fixedHeaderScrollHeight="150px"
            customStyles={customStyles}
          />
        </div>
      ) : null}
    </div>
  );
};

export default TableGeneralSetting;
