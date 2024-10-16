import { useState } from 'react';
import { useSelector } from 'react-redux';

import { Breadcrumb, ButtonCollapse, Collapse, Modal } from '@/components';
import { Card, CardBody } from '@/components/Card';
import { FilterSearch } from '@/components/form-input';

import useDebounce from '@/hooks/useDebounce';
import { useGetCitiesQuery } from '@/services/api/cityApiSlice';
import { useGetTeamMasterQuery } from '@/services/api/teamMasterApiSlice';
import { selectCurrentModules } from '@/services/state/authSlice';
import {
  FormAddNewEventGroup,
  TableListEventGroup,
  FormDetailEventGroup,
} from '@/components/event-create-event-group';

const breadcrumbItems = [
  { label: 'Event Management', url: '#' },
  { label: 'My Own Event', url: '#' },
  { label: 'Create Event Group' },
];

const EventCreateEventGroup = () => {
  const [isOpenNewData, setIsOpenNewData] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [filterSelectedValue, setFilterSelectedValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [getDetailData, setGetDetailData] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(10);

  const modules = useSelector(selectCurrentModules);
  const teamMasterAccess = modules[10];

  const debouncedSearchValue = useDebounce(searchValue, 500);

  const {
    data: dataTeam,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetTeamMasterQuery({
    city: filterSelectedValue,
    searchTerm: debouncedSearchValue,
    page: currentPage,
    limit: limitPerPage,
  });

  const eventGroupCode = dataTeam?.data?.team_code;

  // Get Options City from api city
  const [pageCity, setPageCity] = useState(1);
  const [searchQueryCity, setSearchQueryCity] = useState('');
  const debouncedSearchCity = useDebounce(searchQueryCity, 200);
  const { data: cities } = useGetCitiesQuery({
    page: pageCity,
    searchTerm: debouncedSearchCity,
  });
  const totalPageOptionCity = cities?.meta?.total_page;

  const optionsCities = cities?.data?.map((item) => ({
    value: item?.city,
    label: item?.city,
  }));
  if (Array.isArray(optionsCities)) {
    optionsCities.unshift({ value: '', label: 'Select City' });
  }

  return (
    <>
      <Card className="pt-4 pb-0 px-4">
        <Breadcrumb title="My Own Event" items={breadcrumbItems} />

        <CardBody className="mt-2">
          <div
            className={`flex flex-col-reverse gap-2 md:flex-row md:items-center ${
              teamMasterAccess?.can_add
                ? 'md:justify-between'
                : 'md:justify-end'
            }`}
          >
            {teamMasterAccess?.can_add && (
              <ButtonCollapse
                label="Add New Event"
                isOpen={isOpenNewData}
                handleClick={() => setIsOpenNewData(!isOpenNewData)}
              />
            )}

            <div className="w-full sm:w-[40%] lg:w-[30%]">
              <FilterSearch
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>

          <Collapse isOpen={isOpenNewData}>
            <FormAddNewEventGroup
              setOpenColapse={setIsOpenNewData}
              eventGroupCode={eventGroupCode}
              optionsCities={optionsCities}
              setPageOptionCity={setPageCity}
              setSearchQueryOptionCity={setSearchQueryCity}
              totalPageOptionCity={totalPageOptionCity}
            />
          </Collapse>

          <section className="mt-3">
            <TableListEventGroup
              openModal={openModal}
              setOpenModal={setOpenModal}
              setGetData={setGetDetailData}
              data={dataTeam}
              isLoading={isLoading}
              isSuccess={isSuccess}
              isError={isError}
              error={error}
              limitPerPage={limitPerPage}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />

            {/* MODAL */}
            <Modal
              title="Detail Event Group"
              openModal={openModal}
              setOpenModal={setOpenModal}
              rounded="rounded-xl"
            >
              <FormDetailEventGroup
                data={getDetailData}
                setOpenModal={setOpenModal}
              />
            </Modal>
            {/* END MODAL */}
          </section>
        </CardBody>
      </Card>
    </>
  );
};

export default EventCreateEventGroup;
