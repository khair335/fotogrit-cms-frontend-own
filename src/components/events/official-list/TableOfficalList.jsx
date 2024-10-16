import { useState } from 'react';
import { MdArrowDropUp, MdArrowDropDown } from 'react-icons/md';
import { ButtonAction, Pagination } from '@/components';
import { ErrorFetchingData, NoDataMessage } from '@/components/Errors';
import { SkeletonTable } from '../../Skeleton';

const TableOfficialList = (props) => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    setOpenModal,
    setGetData,
    setCurrentPage,
    metaPagination,
    limitPerPage,
    currentPage,
    eventGroupID,
    officialAddForm,
    optionsTeams,
    filterSelectedOfficialTeam,
  } = props;

  const totalPages = metaPagination?.total_page;
  const totalRecords = metaPagination?.total_record;

  const teamCode = optionsTeams?.find((item) => item?.value === filterSelectedOfficialTeam)?.label;

  // State for sorting
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  // Handle sorting when column is clicked
  const handleSort = (column) => {
    const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(direction);
  };

  // Sort data based on column and direction
  const sortedData = data && [...data]?.sort((a, b) => {
    if (sortDirection === 'asc') {
      return a[sortColumn] > b[sortColumn] ? 1 : -1;
    }
    return a[sortColumn] < b[sortColumn] ? 1 : -1;
  });

  // Render sorting icon based on column and direction
  const renderSortIcon = (column) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? <MdArrowDropUp className="text-2xl" /> : <MdArrowDropDown className="text-2xl" />;
  };

  return (
    <div>
      {isError ? (
        <ErrorFetchingData error={error} />
      ) : isLoading ? (
        <SkeletonTable />
      ) : isSuccess ? (
        <div className="border-t border-gray-200">
          {/* Custom HTML Table */}
          <table className="min-w-full border-collapse table-auto">
            {/* Table Head */}
            <thead>
              <tr className="bg-white  border-b border-gray-200">
                <th
                  className="px-6 py-3 text-left text-sm font-extrabold text-black cursor-pointer"
                  onClick={() => handleSort('event_code')}
                >
                  <div className="flex items-center">
                    Group Code {renderSortIcon('event_code')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-sm font-extrabold text-black cursor-pointer"
                  onClick={() => handleSort('team_code')}
                >
                  <div className="flex items-center">
                    Team Code {renderSortIcon('team_code')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-sm font-extrabold text-black cursor-pointer"
                  onClick={() => handleSort('code')}
                >
                  <div className="flex items-center">
                    Officials ID {renderSortIcon('code')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-sm font-extrabold text-black cursor-pointer"
                  onClick={() => handleSort('officials')}
                >
                  <div className="flex items-center">
                    Officials Role {renderSortIcon('officials')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-sm font-extrabold text-black cursor-pointer"
                  onClick={() => handleSort('user')}
                >
                  <div className="flex items-center">
                    User {renderSortIcon('user')}
                  </div>
                </th>
                <th className="px-6 py-3 text-center text-sm font-extrabold text-black">
                  Action
                </th>
              </tr>
            </thead>

            {/* Table Body */}
                <tbody>
                    {officialAddForm}
              {sortedData.length > 0 ? (
                <>

                  {sortedData.map((row, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {row.event_code || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {row?.team_code} {row?.team}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {row?.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {row?.officials
                          ? row.officials
                              .map((official) => official.official_name)
                              .join(', ')
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {row.user_code ? `${row.user_code} - ` : ''} {row.user || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <ButtonAction
                          setGetData={setGetData}
                          setOpenModal={setOpenModal}
                          disabled={!eventGroupID}
                          {...row}
                        />
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
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

export default TableOfficialList;
