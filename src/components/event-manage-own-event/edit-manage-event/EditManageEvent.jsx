import { useState } from 'react';

import { Button, ButtonCollapse, Collapse } from '@/components';
import FormAddManageEvent from './FormAddManageEvent';
import { useGetTeamMasterQuery } from '@/services/api/teamMasterApiSlice';
import useDebounce from '@/hooks/useDebounce';
import TableEditManageEvent from './TableEditManageEvent';

const EditManageEvent = () => {
  const [isOpenNewData, setIsOpenNewData] = useState(false);

  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(10);
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const {
    data: dataListRequest,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetTeamMasterQuery({
    city: '',
    searchTerm: debouncedSearchValue,
    page: currentPage,
    limit: limitPerPage,
  });

  return (
    <>
      <section>
        <ButtonCollapse
          label="Add New Event"
          isOpen={isOpenNewData}
          handleClick={() => setIsOpenNewData(!isOpenNewData)}
        />

        <Collapse isOpen={isOpenNewData}>
          <FormAddManageEvent setOpenColapse={setIsOpenNewData} />
        </Collapse>

        <div className="flex sm:flex-row flex-col items-center justify-between mb-2 mt-3">
          <h3 className="font-medium text-lg ">List of Event</h3>

          <div className="flex items-center gap-2">
            <Button background="brown">Request New Service</Button>
            <Button background="green">Bulk Change</Button>
          </div>
        </div>
      </section>

      <section>
        <TableEditManageEvent
          data={dataListRequest}
          isLoading={isLoading}
          isSuccess={isSuccess}
          isError={isError}
          error={error}
          limitPerPage={limitPerPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </section>
    </>
  );
};

export default EditManageEvent;
