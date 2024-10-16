import { lazy, Suspense, useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { BiReset } from 'react-icons/bi';

const LazyBreadcrumb = lazy(() => import('@/components/Breadcrumb'));
const LazyButton = lazy(() => import('@/components/Button'));
const LazyFilterSearch = lazy(() =>
  import('@/components/form-input/FilterSearch')
);
const LazyFilterSelect = lazy(() =>
  import('@/components/form-input/FilterSelect')
);
const LazyButtonCollapse = lazy(() => import('@/components/ButtonCollapse'));
const LazyTableTeamMaster = lazy(() =>
  import('@/components/team-master/TableTeamMaster')
);

import { Collapse, Modal, PopUpDelete, Tooltip } from '@/components';
import { Card, CardBody } from '@/components/Card';
import {
  FormAddTeamMaster,
  FormDetailTeamMaster,
} from '@/components/team-master';
import {
  SkeletonBlock,
  SkeletonBreadcrumb,
  SkeletonTable,
} from '@/components/Skeleton';

import useDebounce from '@/hooks/useDebounce';
import { useGetCitiesQuery } from '@/services/api/cityApiSlice';
import {
  useDeleteTeamMasterMutation,
  useGetTeamMasterQuery,
} from '@/services/api/teamMasterApiSlice';
import { selectCurrentModules } from '@/services/state/authSlice';
import {
  useGetOptionsAgeGroupQuery,
  useGetOptionsEventPoolQuery,
  useGetOptionsEventTypeQuery,
} from '@/services/api/othersApiSlice';
import { useGetOptionsClubsQuery } from '@/services/api/clubMasterApiSlice';
import { useGetCustomerDataListQuery } from '@/services/api/customerDataApiSlice';

const TeamMaster = () => {
  const [isOpenNewData, setIsOpenNewData] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [popUpDelete, setPopUpDelete] = useState(false);
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

  const teamListCode = dataTeam?.data?.team_code;

  const [deleteTeamMaster, { isLoading: isLoadingDelete }] =
    useDeleteTeamMasterMutation();

  const handleResetFilter = () => {
    setFilterSelectedValue('');
    setSearchValue('');
  };

  const handleDelete = async () => {
    try {
      const response = await deleteTeamMaster({
        id: getDetailData?.id,
      }).unwrap();

      if (!response.error) {
        setPopUpDelete(false);
        setOpenModal(false);
        toast.success(`"${getDetailData?.name}" has been deleted!`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      console.error('Failed to delete data', err);
      toast.error(`Failed: ${err?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  // Get Options City from api city
  const { data: cities } = useGetCitiesQuery({
    page: '',
    searchTerm: '',
  });
  const selectDataCities = cities?.data?.map((item) => ({
    value: item?.city,
    label: item?.city,
  }));
  if (Array.isArray(selectDataCities)) {
    selectDataCities.unshift({ value: '', label: 'Select City' });
  }

  // Get Options CLubs
  const { data: clubsData } = useGetOptionsClubsQuery();
  const optionsClubs = clubsData?.data?.clubs?.map((item) => ({
    value: item?.id,
    label: `${item?.code} - ${item?.name}`,
    logo: item?.logo,
  }));
  if (Array.isArray(optionsClubs)) {
    optionsClubs.unshift({ value: '', label: 'Select Club', logo: '' });
  }

  // Get Options Age Group
  const { data: AgeGroupsData } = useGetOptionsAgeGroupQuery();
  const optionsAgeGroups = AgeGroupsData?.data?.map((item) => ({
    value: item?.id,
    label: `${item?.age_group} ${item?.gender} ${item?.description}`,
  }));
  if (Array.isArray(optionsAgeGroups)) {
    optionsAgeGroups.unshift({ value: '', label: 'Select Age Group' });
  }

  // Get Options Event Type
  const { data: eventTypeData } = useGetOptionsEventTypeQuery();
  const optionsEventType = eventTypeData?.data?.map((item) => ({
    value: item?.id,
    label: item?.event_type,
  }));
  if (Array.isArray(optionsEventType)) {
    optionsEventType.unshift({ value: '', label: 'Select Event Type' });
  }

  // for options pool
  const { data: pools } = useGetOptionsEventPoolQuery();
  const optionsPools = pools?.data?.map((item) => ({
    value: item?.id,
    label: item?.name,
  }));
  if (Array.isArray(optionsPools)) {
    optionsPools.unshift({ value: '', label: 'Select Pool' });
  }

  // Options Customers
  const { data: customers } = useGetCustomerDataListQuery({
    page: '',
    searchTerm: '',
  });
  const optionsCustomers = customers?.data?.map((item) => ({
    value: item?.id,
    label: `${item?.code} ${item?.name ? `- ${item?.name}` : ''}`,
    email: item?.email,
    phone: item?.phone_number,
  }));
  if (Array.isArray(optionsCustomers)) {
    optionsCustomers.unshift({ value: '', label: 'Select PIC' });
  }

  const breadcrumbItems = [
    { label: 'Add/Modify Team', url: '#' },
    { label: 'Add/Modify Team' },
  ];

  return (
    <>
      <Card className="pt-4 pb-0 px-4">
        <Suspense fallback={<SkeletonBreadcrumb />}>
          <LazyBreadcrumb title="Add/Modify Team" items={breadcrumbItems} />
        </Suspense>

        <CardBody className="mt-2">
          <div
            className={`flex flex-col-reverse gap-2 md:flex-row md:items-center  ${
              teamMasterAccess?.can_add
                ? 'md:justify-between'
                : 'md:justify-end'
            }`}
          >
            {teamMasterAccess?.can_add && (
              <Suspense fallback={<SkeletonBlock />}>
                <LazyButtonCollapse
                  label="Add New Team"
                  isOpen={isOpenNewData}
                  handleClick={() => setIsOpenNewData(!isOpenNewData)}
                />
              </Suspense>
            )}

            <div className="flex gap-2 flex-col sm:flex-row sm:items-center sm:justify-between w-full sm:w-[60%] lg:w-[50%]">
              <div className="w-full sm:w-[45%] z-50">
                <Suspense fallback={<SkeletonBlock width="w-full" />}>
                  <LazyFilterSelect
                    dataOptions={selectDataCities}
                    placeholder="Select City"
                    filterSelectedValue={filterSelectedValue}
                    setFilterSelectedValue={setFilterSelectedValue}
                    setCurrentPage={setCurrentPage}
                  />
                </Suspense>
              </div>

              <div className="w-full sm:w-[45%]">
                <Suspense fallback={<SkeletonBlock width="w-full" />}>
                  <LazyFilterSearch
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    setCurrentPage={setCurrentPage}
                  />
                </Suspense>
              </div>

              <Tooltip text="Reset Filter" position="top">
                <Suspense fallback={<SkeletonBlock width="w-10" />}>
                  <LazyButton
                    background="black"
                    onClick={handleResetFilter}
                    className="block w-full"
                  >
                    <BiReset className="mx-auto" />
                  </LazyButton>
                </Suspense>
              </Tooltip>
            </div>
          </div>

          <Collapse isOpen={isOpenNewData}>
            <FormAddTeamMaster
              setOpenColapse={setIsOpenNewData}
              teamListCode={teamListCode}
              optionsCities={selectDataCities}
              optionsClubs={optionsClubs}
              optionsAgeGroups={optionsAgeGroups}
              optionsEventType={optionsEventType}
              optionsPools={optionsPools}
              optionsCustomers={optionsCustomers}
            />
          </Collapse>

          <section className="mt-3">
            <Suspense fallback={<SkeletonTable />}>
              <LazyTableTeamMaster
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
            </Suspense>

            {/* MODAL */}
            <Modal
              title="Detail Team"
              openModal={openModal}
              setOpenModal={setOpenModal}
              rounded="rounded-xl"
            >
              <FormDetailTeamMaster
                data={getDetailData}
                setOpenModal={setOpenModal}
                setIsOpenPopUpDelete={setPopUpDelete}
                isAccess={teamMasterAccess}
                optionsCities={selectDataCities}
                optionsClubs={optionsClubs}
                optionsAgeGroups={optionsAgeGroups}
                optionsEventType={optionsEventType}
                optionsPools={optionsPools}
                optionsCustomers={optionsCustomers}
              />
            </Modal>
            {/* END MODAL */}

            {/* Pop Up Delete */}
            <PopUpDelete
              handleDelete={handleDelete}
              isLoading={isLoadingDelete}
              isOpenPopUpDelete={popUpDelete}
              setIsOpenPopUpDelete={setPopUpDelete}
            />
            {/* End Pop Up Delete */}
          </section>
        </CardBody>
      </Card>
    </>
  );
};

export default TeamMaster;
