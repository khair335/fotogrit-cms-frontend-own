import DataTable from 'react-data-table-component';

import { SkeletonTable } from '../Skeleton';
import { ButtonAction } from '@/components';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';
import { customTableStyles } from '@/constants/tableStyle';
import { ErrorFetchingData, NoDataMessage } from '@/components/Errors';
import { formatDate } from '@/helpers/FormatDate';
import { useEffect, useMemo, useState } from 'react';

const TablePaymentCart = (props) => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    setOpenModal,
    setGetData,
    setSelectedRows,
    selectedRows,
    clearSelectedRows,
    setSelectedRowsSubItems,
    searchValue,
    setFilterData,
  } = props;

  const [selectedMainRowIds, setSelectedMainRowIds] = useState([]);

  const dataContracts = data?.data?.contracts || [];
  const dataSubContracts = data?.data?.subcontracts || [];
  const dataMedia = data?.data?.media || [];

  const updatedDataContracts = dataContracts?.map((item) => ({
    ...item,
    cart_type: 3,
  }));

  const updatedDataSubContracts = dataSubContracts?.map((item) => ({
    ...item,
    cart_type: 4,
  }));

  const updatedDataMedia = dataMedia?.map((item) => ({
    ...item,
    cart_type: 1,
  }));

  const dataTable = [
    ...updatedDataContracts,
    ...updatedDataSubContracts,
    ...updatedDataMedia,
  ];

  const dataTableTransform = dataTable?.map((item) => {
    let disabled = false;
    let defaultExpanded = false;
    if (
      item?.requests?.length === 0 ||
      item?.details?.length === 0 ||
      item?.cart_type === 1
    ) {
      disabled = true;
      defaultExpanded = false;
    }
    // if (
    //   item?.requests?.length < 2 ||
    //   item?.details?.length < 2 ||
    //   item?.cart_type === 1
    // ) {
    //   disabled = true;
    //   defaultExpanded = false;
    // }

    return { ...item, disabled, defaultExpanded };
  });

  const filteredItems = searchValue
    ? dataTableTransform?.filter((item) => {
        return (
          (item?.due_date &&
            formatDate(item?.due_date)
              .toLowerCase()
              .includes(searchValue.toLowerCase())) ||
          (item?.event_name &&
            item?.event_name
              ?.toLowerCase()
              .includes(searchValue.toLowerCase())) ||
          (item?.service_type &&
            item?.contract_type &&
            `${item?.service_type} - ${item?.contract_type}}`
              .toLowerCase()
              .includes(searchValue.toLowerCase())) ||
          (item?.remaining_assignment &&
            item?.remaining_assignment?.toString().includes(searchValue)) ||
          (item?.service_percent_share &&
            item?.service_percent_share?.toString().includes(searchValue)) ||
          (item?.renewal_fee &&
            `Rp ${item?.renewal_fee}`
              ?.toString()
              ?.toLowerCase()
              ?.includes(searchValue?.toLowerCase())) ||
          (item?.service_name &&
            `${item?.service_name} - ${item?.service_type} - ${item?.contract_type}`
              .toLowerCase()
              .includes(searchValue.toLowerCase()))
        );
      })
    : dataTableTransform;

  const handleChangeRows = ({ selectedRows }) => {
    const updatedSelectedRows = selectedRows?.map((row) => ({
      ...row,
      is_contract: true,
    }));

    setSelectedRows(updatedSelectedRows);

    // Ambil ID dari setiap baris yang terpilih
    const selectedIds = selectedRows?.map((row) => {
      let dataID = [];
      if (row?.requests?.length > 0 || row?.details?.length > 0) {
        dataID = row.id;
      }
      // if (row?.requests?.length > 1 || row?.details?.length > 1) {
      //   dataID = row.id;
      // }

      return dataID;
    });
    setSelectedMainRowIds(selectedIds);
  };

  useEffect(() => {
    setFilterData(filteredItems);
  }, [searchValue, data]);

  // Columns Table
  const columns = [
    {
      name: 'Item',
      selector: (row) => row.cart_type,
      cell: (row) => (
        <span>
          {row.cart_type === 1
            ? 'Media'
            : row.cart_type === 3
            ? 'Service'
            : row.cart_type === 4
            ? 'Service (subcon)'
            : '-'}
        </span>
      ),
      sortable: true,
      minWidth: '150px',
      wrap: true,
    },
    {
      name: 'Due Date',
      selector: (row) => row.due_date,
      cell: (row) => {
        const isContractTypeBasedOnEvent = [
          'per group event',
          'per day',
          'per event',
        ].includes(row?.contract_type);
        const isCartTypeNotService =
          row?.cart_type !== 3 && row?.cart_type !== 4;
        const defaultDate = row.due_date === '0001-01-01T07:07:12+07:07';

        return isContractTypeBasedOnEvent || isCartTypeNotService || defaultDate
          ? '-'
          : formatDate(row.due_date);
      },
      sortable: true,
      minWidth: '140px',
      wrap: true,
    },
    {
      name: 'Event Name',
      selector: (row) => row.event_name,
      cell: (row) => row.event_name || '-',
      // cell: (row) => {
      //   // console.log({ row });
      //   const dataEvent = row?.details?.length > 0 ? row?.details[0] : '';

      //   return dataEvent.event_name || '-';
      // },
      sortable: true,
      wrap: true,
      width: '160px',
    },
    {
      name: 'Service Name',
      selector: (row) => row.service_name,
      cell: (row) =>
        row.cart_type !== 1
          ? `${row.service_name} - ${row.service_type} - ${row.contract_type}`
          : '-',
      sortable: true,
      width: '150px',
      wrap: true,
    },
    {
      name: <span>Remaining Assignment</span>,
      selector: (row) => row.remaining_assignment,
      cell: (row) =>
        row.cart_type === 3 || row.cart_type === 4
          ? `${row?.remaining_assignment} ${
              row?.variable_unit !== '-' ? `(${row?.variable_unit})` : ''
            }`
          : '-',
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: <span>Variable Unit Usage</span>,
      selector: (row) => row.extra_assignment,
      // cell: (row) => row?.extra_assignment,
      cell: (row) =>
        row.cart_type === 3 || row.cart_type === 4
          ? `${row?.extra_assignment} ${
              row?.remaining_assignment === 0 && row?.variable_unit !== '-'
                ? `(${row?.variable_unit})`
                : ''
            }`
          : '-',
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: 'Total Payment',
      selector: (row) => row.renewal_fee,
      cell: (row) =>
        row.cart_type !== 1
          ? CurrencyFormat(row?.renewal_fee)
          : CurrencyFormat(row?.price),
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },

    {
      name: 'Action',
      center: true,
      cell: (props) => (
        <ButtonAction
          setGetData={setGetData}
          setOpenModal={setOpenModal}
          {...props}
        />
      ),
    },
  ];

  const conditionalRowStyles = [
    {
      when: (row) => {
        const today = new Date();
        const defaultDate = row.due_date !== '0001-01-01T07:07:12+07:07';
        const isContractTypeBasedOnEvent = ['per month', 'per week'].includes(
          row?.contract_type
        );
        const hasDueDate =
          isContractTypeBasedOnEvent && defaultDate ? row.due_date : '-';
        const dueDate = new Date(hasDueDate);

        return isContractTypeBasedOnEvent ? dueDate <= today : '';
      },
      style: {
        // backgroundColor: '#FF6969', // red
        color: '#ef233c', // red
      },
    },
    {
      when: (row) =>
        selectedRows
          ? selectedRows.some((selectedRow) => selectedRow.id === row.id)
          : '',
      style: (row) => {
        const today = new Date();
        const defaultDate = row.due_date !== '0001-01-01T07:07:12+07:07';
        const isContractTypeBasedOnEvent = ['per month', 'per week'].includes(
          row?.contract_type
        );
        const hasDueDate =
          isContractTypeBasedOnEvent && defaultDate ? row.due_date : '-';
        const dueDate = new Date(hasDueDate);

        const isDueDate = isContractTypeBasedOnEvent ? dueDate <= today : '';
        return {
          backgroundColor: '#beae85e5',
          color: !isDueDate ? 'white' : '#ef233c',
        };
      },
    },
  ];

  const expandableRowsComponent = useMemo(() => {
    return ({ data }) => (
      <ExpandedComponent
        rowData={data}
        setSelectedRowsSubItems={setSelectedRowsSubItems}
        selectedRows={selectedRows}
        clearSelectedRows={clearSelectedRows}
      />
    );
  }, [selectedRows]);

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
            data={filteredItems}
            fixedHeader
            fixedHeaderScrollHeight="54vh"
            responsive={true}
            customStyles={customTableStyles}
            selectableRows
            clearSelectedRows={clearSelectedRows}
            onSelectedRowsChange={handleChangeRows}
            conditionalRowStyles={conditionalRowStyles}
            expandableRows
            expandableRowsComponent={expandableRowsComponent}
            expandableRowExpanded={(row) =>
              selectedMainRowIds?.includes(row?.id)
            }
            expandableRowDisabled={(row) => row?.disabled}
            persistTableHead
            noDataComponent={<NoDataMessage title="Cart Items" />}
          />
        </div>
      ) : null}
    </div>
  );
};

const ExpandedComponent = ({
  rowData,
  setSelectedRowsSubItems,
  selectedRows,
  clearSelectedRows,
}) => {
  const [getRows, setGetRows] = useState([]);

  const dataTableRequest = rowData?.requests
    ? rowData?.requests
    : rowData?.details
    ? rowData?.details
    : [];

  // const dataTableRequest = useMemo(() => {
  //   return rowData?.requests
  //     ? rowData?.requests.slice(1)
  //     : rowData?.details
  //     ? rowData?.details.slice(1)
  //     : [];
  // }, [selectedRows]);

  // console.log({ dataTable });

  const rowSelectCritera = useMemo(() => {
    return () => {
      // Check whether all rows in the sub-table are selected
      const allRowsSelected =
        selectedRows?.length > 0 &&
        dataTableRequest?.every((subRow) =>
          selectedRows?.some(
            (selectedRow) =>
              selectedRow?.id === subRow?.service_contract_id ||
              selectedRow?.id === subRow?.subcontract_id
          )
        );

      // If all rows are selected, save the selected data into the state
      if (allRowsSelected) {
        const updatedSelectedRows = dataTableRequest?.map((row) => ({
          ...row,
          cart_type: rowData?.cart_type,
          start_contract: rowData?.start_contract,
          due_date: rowData?.due_date,
          is_contract: false,
          contract_type: rowData?.contract_type,
          remaining_assignment: rowData?.remaining_assignment,
        }));

        setSelectedRowsSubItems((prev) => ({
          ...prev,
          [rowData?.id]: updatedSelectedRows,
        }));

        setGetRows(updatedSelectedRows);
      }

      return allRowsSelected;
    };
  }, [selectedRows]);

  // Columns Table
  const columns = [
    {
      name: 'Item',
      selector: () => rowData.cart_type,
      cell: () => (
        <span>
          {rowData.cart_type === 1
            ? 'Media'
            : rowData.cart_type === 3
            ? 'Service'
            : rowData.cart_type === 4
            ? 'Service (Subcon)'
            : '-'}
        </span>
      ),
      minWidth: '150px',
      wrap: true,
    },
    {
      name: 'Due Date',
      selector: () => rowData.due_date,
      cell: () => {
        const isContractTypeBasedOnEvent = [
          'per group event',
          'per day',
          'per event',
        ].includes(rowData?.contract_type);
        const isCartTypeNotService = rowData?.cart_type !== 3;
        const defaultDate = rowData.due_date === '0001-01-01T07:07:12+07:07';

        return isContractTypeBasedOnEvent || isCartTypeNotService || defaultDate
          ? '-'
          : formatDate(rowData.due_date);
      },
      minWidth: '140px',
      wrap: true,
    },
    {
      name: 'Event Name',
      selector: (row) => row.event_name || '-',
      wrap: true,
      width: '160px',
    },
    {
      name: 'Service Name',
      selector: () => rowData.service_type,
      cell: () => `${rowData.service_type} - ${rowData.contract_type}`,
      width: '150px',
      wrap: true,
    },
    {
      name: <span>Remaining Assignment</span>,
      selector: () => rowData?.remaining_assignment,
      cell: () => rowData?.remaining_assignment,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: <span>Variable Unit Usage</span>,
      selector: () => rowData.extra_assignment,
      cell: () => rowData?.extra_assignment,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: 'Total Payment',
      selector: () => rowData.renewal_fee,
      cell: () => CurrencyFormat(rowData?.renewal_fee),
      minWidth: '160px',
      wrap: true,
    },

    {
      name: 'Action',
      center: true,
    },
  ];

  const handleChangeRows = ({ selectedRows }) => {
    const updatedSelectedRows = selectedRows?.map((row) => ({
      ...row,
      cart_type: rowData?.cart_type,
      start_contract: rowData?.start_contract,
      due_date: rowData?.due_date,
      is_contract: false,
      contract_type: rowData?.contract_type,
      remaining_assignment: rowData?.remaining_assignment,
    }));

    setSelectedRowsSubItems((prev) => ({
      ...prev,
      [rowData?.id]: updatedSelectedRows,
    }));

    setGetRows(updatedSelectedRows);
  };

  const conditionalRowStyles = [
    {
      when: () => {
        const today = new Date();
        const defaultDate = rowData.due_date !== '0001-01-01T07:07:12+07:07';
        const isContractTypeBasedOnEvent = ['per month', 'per week'].includes(
          rowData?.contract_type
        );
        const hasDueDate =
          isContractTypeBasedOnEvent && defaultDate ? rowData.due_date : '-';
        const dueDate = new Date(hasDueDate);

        return isContractTypeBasedOnEvent ? dueDate <= today : '';
      },

      style: {
        // backgroundColor: '#FF6969', // red
        color: '#ef233c', // red
      },
    },
    {
      when: (row) =>
        getRows
          ? getRows?.some((selectedRow) => selectedRow?.id === row?.id)
          : '',
      style: () => {
        const today = new Date();
        const defaultDate = rowData.due_date !== '0001-01-01T07:07:12+07:07';
        const isContractTypeBasedOnEvent = ['per month', 'per week'].includes(
          rowData?.contract_type
        );
        const hasDueDate =
          isContractTypeBasedOnEvent && defaultDate ? rowData.due_date : '-';
        const dueDate = new Date(hasDueDate);

        const isDueDate = isContractTypeBasedOnEvent ? dueDate <= today : '';

        return {
          backgroundColor: '#beae85e5',
          color: isDueDate ? '#ef233c' : 'white',
        };
      },
    },
  ];

  const tableStyles = {
    rows: {
      style: {
        border: 'none',
        '&:not(:last-of-type)': {
          border: 'none',
        },
      },
    },
    cells: {
      style: {
        fontSize: '12px',
      },
    },
  };

  return (
    <div className="pl-12 border-b border-gray-300">
      {dataTableRequest?.length > 0 ? (
        <DataTable
          columns={columns}
          data={dataTableRequest}
          noHeader
          noTableHead
          responsive={true}
          customStyles={tableStyles}
          selectableRows
          clearSelectedRows={clearSelectedRows}
          onSelectedRowsChange={handleChangeRows}
          conditionalRowStyles={conditionalRowStyles}
          selectableRowSelected={rowSelectCritera}
        />
      ) : null}
    </div>
  );
};

export default TablePaymentCart;
