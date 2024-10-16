import { Suspense, lazy, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BiReset } from 'react-icons/bi';

const LazyBreadcrumb = lazy(() => import('@/components/Breadcrumb'));
const LazyFilterSelect = lazy(() =>
  import('@/components/form-input/FilterSelect')
);
const LazyButton = lazy(() => import('@/components/Button'));
const LazyEventList = lazy(() =>
  import('@/components/events/event-list/EventList')
);
const LazyMediaList = lazy(() =>
  import('@/components/events/media-list/MediaList')
);
const LazyRosterList = lazy(() =>
  import('@/components/events/roster-list/RosterList')
);
const LazyOfficialList = lazy(() =>
  import('@/components/events/official-list/OfficialList')
);
const LazyTeamList = lazy(() =>
  import('@/components/events/team-list/TeamList')
);

import { Tooltip } from '@/components';
import { Tabs, Tab, TabPanel } from '@/components/Tabs';
import { Card, CardHeader, CardBody } from '@/components/Card';

import useDebounce from '@/hooks/useDebounce';

import {
  getEventListID,
  getIsRequiredGroupID,
  getTabEventActive,
  selectCurrentEventGroupID,
  setEventGroupID,
  setIsRequiredFilterGroupEvent,
  setTabEventActive,
} from '@/services/state/eventsSlice';

import { useGetEventGroupOwnedQuery } from '@/services/api/eventGroupApiSlice';
import {
  useGetEventListQuery,
  useGetMediaListQuery,
  useGetOfficialListQuery,
  useGetOptionsEventsQuery,
  useGetRosterListQuery,
  useGetTeamListQuery,
} from '@/services/api/eventsApiSlice';
import { useGetTeamMasterListQuery } from '@/services/api/teamMasterApiSlice';
import { useGetCustomerDataListQuery } from '@/services/api/customerDataApiSlice';
import {
  selectCurrentModules,
  selectCurrentUser,
} from '@/services/state/authSlice';
import { useGetCitiesQuery } from '@/services/api/cityApiSlice';
import { useGetPricesQuery } from '@/services/api/generalSettingApiSlice';
import {
  SkeletonBlock,
  SkeletonBreadcrumb,
  SkeletonTab,
} from '@/components/Skeleton';
import { userTypeAdminCheck } from '@/helpers/UserTypeCheck';

const breadcrumbItems = [
  { label: 'Event Management', url: '#' },
  { label: 'Events' },
];

const Events = () => {
  const dispatch = useDispatch();

  const eventGroupId = useSelector(selectCurrentEventGroupID);
  const activeTab = useSelector(getTabEventActive);
  const eventListID = useSelector(getEventListID);
  const isRequiredGroupID = useSelector(getIsRequiredGroupID);

  // Reset the state(Redux) value when the location changes.
  useEffect(() => {
    dispatch(setEventGroupID(''));
    dispatch(setTabEventActive(0));
  }, [dispatch]);

  const modules = useSelector(selectCurrentModules);
  const eventAccess = modules[2];
  const user = useSelector(selectCurrentUser);
  const isTeamManager = user?.user_type === 'UT013';
  const isUT014 = user?.user_type === 'UT014'; // UT014 = Event Group Owner
  const isAdmin = userTypeAdminCheck(user);

  const [filterSelectedEventGroup, setFilterSelectedEventGroup] = useState(
    eventGroupId || ''
  );
  const [searchTeamList, setSearchTeamList] = useState('');
  const [searchEventList, setSearchEventList] = useState('');
  const [searchRosterList, setSearchRosterList] = useState('');
  const [searchOfficialList, setSearchOfficialList] = useState('');
  const [searchMediaList, setSearchMediaList] = useState('');
  const [currentActiveTab, setCurrentActiveTab] = useState(
    isTeamManager || isUT014 ? 1 : activeTab || 4
  );

  const debouncedSearchTeamList = useDebounce(searchTeamList, 500);
  const debouncedSearchEventList = useDebounce(searchEventList, 500);
  const debouncedSearchRosterList = useDebounce(searchRosterList, 500);
  const debouncedSearchOfficialList = useDebounce(searchOfficialList, 500);
  const debouncedSearchMediaList = useDebounce(searchMediaList, 500);

  // For filter Event Group
  const { data: eventGroupList } = useGetEventGroupOwnedQuery({
    page: '',
    searchTerm: '',
  });
  const eventGroupData = eventGroupList?.data?.event_groups;
  const optionsEventGroup = eventGroupData?.map((item) => ({
    value: item?.id,
    label:
      item?.name === item?.code ? item?.code : `${item?.code} - ${item?.name}`,
    lockRosterDate: item?.lock_roaster_date,
    lockOfficialDate: item?.lock_official_date,
  }));
  if (Array.isArray(optionsEventGroup)) {
    optionsEventGroup.unshift({ value: '', label: 'Select Event Group' });
  }

  // For Options Teams from team-master
  const { data: teams } = useGetTeamMasterListQuery({
    page: '',
    searchTerm: '',
  });
  const optionsAllTeams = teams?.data?.teams?.map((item) => ({
    value: item?.id,
    label: `${item.code} ${item.name} ${
      item?.age_group ? ` - ${item?.age_group}` : ''
    } ${item?.age_group_gender} ${item?.age_group_desc}`,
  }));

  // For Options Customers from customer-data
  const { data: customers } = useGetCustomerDataListQuery({
    page: '',
    searchTerm: '',
  });
  const optionsCustomers = customers?.data?.map((item) => ({
    value: item?.id,
    label: `${item?.code} ${item?.name ? `- ${item?.name}` : ''}`,
  }));
  if (Array.isArray(optionsCustomers)) {
    optionsCustomers.unshift({ value: '', label: 'Select User' });
  }

  // For Options City from api city
  const { data: cities } = useGetCitiesQuery({
    page: '',
    searchTerm: '',
  });
  const selectOptionsCities = cities?.data?.map((item) => ({
    value: item?.city,
    label: item?.city,
  }));
  if (Array.isArray(selectOptionsCities)) {
    selectOptionsCities.unshift({ value: '', label: 'Select City' });
  }

  // API Team List
  const [currentPageTeamList, setCurrentPageTeamList] = useState(1);
  const [limitPerPageTeamList] = useState(10);
  const {
    data: teamList,
    isLoading: isLoadingTeamList,
    isSuccess: isSuccessTeamList,
    isError: isErrorTeamList,
    error: errorTeamList,
  } = useGetTeamListQuery({
    eventGroup: filterSelectedEventGroup,
    searchTerm: debouncedSearchTeamList,
    page: currentPageTeamList,
    limit: limitPerPageTeamList,
  });
  const metaPaginationTeamList = teamList?.meta;

  // for options teams from team-list
  const optionsTeamsByTeamList = teamList?.data?.flatMap((group) =>
    group?.teams?.map((team) => ({
      value: team?.team_id,
      label: `${team.code} ${team.name} ${
        team?.age_group ? `- ${team?.age_group}` : ''
      } ${team?.age_group_gender} ${team?.age_group_desc}`,
    }))
  );
  if (Array.isArray(optionsTeamsByTeamList)) {
    optionsTeamsByTeamList.unshift({ value: '', label: 'Select Team' });
  }

  const optionsTeams = isTeamManager
    ? optionsAllTeams
    : filterSelectedEventGroup
    ? optionsTeamsByTeamList
    : optionsAllTeams;

  // API Event List
  const [currentPageEvent, setCurrentPageEvent] = useState(1);
  const [limitPerPageEvent] = useState(10);
  const {
    data: eventList,
    isLoading: isLoadingEventList,
    isSuccess: isSuccessEventList,
    isError: isErrorEventList,
    error: errorEventList,
  } = useGetEventListQuery({
    eventGroup: filterSelectedEventGroup,
    searchTerm: debouncedSearchEventList,
    page: currentPageEvent,
    limit: limitPerPageEvent,
  });

  // for options events from event-list
  const { data: dataEventList } = useGetOptionsEventsQuery({
    page: '',
    searchTerm: '',
    eventGroup: filterSelectedEventGroup,
  });
  const optionsEventList = dataEventList?.data?.events?.map((item) => ({
    value: item?.id,
    label: `${item?.event_code} - ${item?.event_name}`,
    _id: item?._id,
  }));
  if (Array.isArray(optionsEventList)) {
    optionsEventList.unshift({ value: '', label: 'Select Events' });
  }

  // API Roster List
  const [currentPageRoster, setCurrentPageRoster] = useState(1);
  const [limitPerPageRoster] = useState(10);
  const [filterSelectedRosterTeam, setFilterSelectedRosterTeam] = useState('');
  const {
    data: rosterList,
    isLoading: isLoadingRosterList,
    isSuccess: isSuccessRosterList,
    isError: isErrorRosterList,
    error: errorRosterList,
  } = useGetRosterListQuery({
    eventGroup: filterSelectedEventGroup,
    searchTerm: debouncedSearchRosterList,
    team: filterSelectedRosterTeam,
    page: currentPageRoster,
    limit: limitPerPageRoster,
  });

  // API Official List
  const [currentPageOfficial, setCurrentPageOfficial] = useState(1);
  const [limitPerPageOfficial] = useState(10);
  const [filterSelectedOfficialTeam, setFilterSelectedOfficialTeam] =
    useState('');
  const {
    data: officialList,
    isLoading: isLoadingOfficialList,
    isSuccess: isSuccessOfficialList,
    isError: isErrorOfficialList,
    error: errorOfficialList,
  } = useGetOfficialListQuery({
    eventGroup: filterSelectedEventGroup,
    searchTerm: debouncedSearchOfficialList,
    team: filterSelectedOfficialTeam,
    page: currentPageOfficial,
    limit: limitPerPageOfficial,
  });

  // API Media List
  const [filterMediaSelectedEvent, setFilterMediaSelectedEvent] = useState('');
  const [currentPageMedia, setCurrentPageMedia] = useState(1);
  const [limitPerPageMedia, setLimitPerPageMedia] = useState(10);
  const {
    data: mediaList,
    isLoading: isLoadingMediaList,
    isSuccess: isSuccessMediaList,
    isError: isErrorMediaList,
    error: errorMediaList,
  } = useGetMediaListQuery({
    event: filterMediaSelectedEvent,
    eventGroup: filterSelectedEventGroup,
    searchTerm: debouncedSearchMediaList,
    page: currentPageMedia,
    limit: limitPerPageMedia,
  });

  const { data: priceData } = useGetPricesQuery();
  const getPrice = priceData?.data?.master_commerce?.map((item) => ({
    name: item?.name,
    price: item?.price,
  }));

  const handleResetFilter = () => {
    setFilterSelectedEventGroup('');
    dispatch(setEventGroupID(''));
  };

  useEffect(() => {
    if (eventListID) {
      setFilterMediaSelectedEvent(eventListID);
    }
  }, [eventListID]);

  useEffect(() => {
    dispatch(setIsRequiredFilterGroupEvent(false));

    if (filterSelectedEventGroup !== '') {
      dispatch(setIsRequiredFilterGroupEvent(false));
    }
  }, [filterSelectedEventGroup, activeTab, dispatch]);

  const isSetCurrentPage =
    currentActiveTab === 0
      ? setCurrentPageTeamList
      : currentActiveTab === 1
      ? setCurrentPageEvent
      : currentActiveTab === 2
      ? setCurrentPageRoster
      : setCurrentPageMedia;

  return (
    <>
      <Card>
        <CardHeader className="relative">
          <Suspense fallback={<SkeletonBreadcrumb />}>
            <LazyBreadcrumb title="Events" items={breadcrumbItems} />
          </Suspense>

          <div className="flex items-center gap-2 sm:w-[40%] md:w-[30%] mt-4 sm:mt-0">
            <div className="flex-grow relative">
              <div className="z-100">
                <Suspense fallback={<SkeletonBlock width="w-full" />}>
                  <LazyFilterSelect
                    dataOptions={optionsEventGroup}
                    placeholder="Select Event Group"
                    filterSelectedValue={filterSelectedEventGroup}
                    setFilterSelectedValue={setFilterSelectedEventGroup}
                    setCurrentPage={isSetCurrentPage}
                  />
                </Suspense>
              </div>

              {isRequiredGroupID && (
                <div className="text-[10px]  text-red-600 bg-red-200 px-2 py-1 rounded-md absolute -bottom-7 left-0">
                  <div className="bg-red-200 w-2 h-2 absolute left-2 -top-1 transform rotate-45 " />
                  Please select an event group
                </div>
              )}
            </div>

            <Tooltip text="Reset Filter" position="bottom">
              <Suspense fallback={<SkeletonBlock width="w-10" />}>
                <LazyButton
                  background="black"
                  onClick={handleResetFilter}
                  className="block w-full "
                >
                  <BiReset className="mx-auto" />
                </LazyButton>
              </Suspense>
            </Tooltip>
          </div>
        </CardHeader>

        <CardBody>
          <Suspense fallback={<SkeletonTab />}>
            <Tabs
              defaultActiveTab={currentActiveTab}
              setDefaultActiveTab={setCurrentActiveTab}
            >
              <Tab label="Team List">
                <TabPanel>
                  <LazyTeamList
                    data={teamList?.data}
                    isLoading={isLoadingTeamList}
                    isSuccess={isSuccessTeamList}
                    isError={isErrorTeamList}
                    error={errorTeamList}
                    searchValue={searchTeamList}
                    eventGroupID={filterSelectedEventGroup}
                    optionsTeams={optionsAllTeams}
                    isAccess={eventAccess}
                    currentPage={currentPageTeamList}
                    setCurrentPage={setCurrentPageTeamList}
                    limitPerPage={limitPerPageTeamList}
                    metaPagination={metaPaginationTeamList}
                    setSearchValue={setSearchTeamList}
                    isTeamManager={isTeamManager}
                  />
                </TabPanel>
              </Tab>
              <Tab label="Event List">
                <TabPanel>
                  <LazyEventList
                    data={eventList}
                    isLoading={isLoadingEventList}
                    isSuccess={isSuccessEventList}
                    isError={isErrorEventList}
                    error={errorEventList}
                    searchValue={searchEventList}
                    eventGroupID={filterSelectedEventGroup}
                    isAccess={eventAccess}
                    optionsTeams={optionsTeams}
                    optionsCities={selectOptionsCities}
                    eventGroupData={eventGroupData}
                    price={getPrice}
                    modules={modules}
                    currentPage={currentPageEvent}
                    limitPerPage={limitPerPageEvent}
                    setSearchValue={setSearchEventList}
                    setCurrentActiveTab={setCurrentActiveTab}
                    setCurrentPage={setCurrentPageEvent}
                    isTeamManager={isTeamManager}
                  />
                </TabPanel>
              </Tab>
              <Tab label="Roster List">
                <TabPanel>
                  <LazyRosterList
                    data={rosterList}
                    isLoading={isLoadingRosterList}
                    isSuccess={isSuccessRosterList}
                    isError={isErrorRosterList}
                    error={errorRosterList}
                    filterSelectedRosterTeam={filterSelectedRosterTeam}
                    setFilterSelectedRosterTeam={setFilterSelectedRosterTeam}
                    searchValue={searchRosterList}
                    setSearchValue={setSearchRosterList}
                    eventGroupID={filterSelectedEventGroup}
                    optionsTeams={optionsTeams}
                    optionsCustomers={optionsCustomers}
                    currentPage={currentPageRoster}
                    setCurrentPage={setCurrentPageRoster}
                    limitPerPage={limitPerPageRoster}
                    isAccess={eventAccess}
                    eventGroupData={eventGroupData}
                    optionsEventGroup={optionsEventGroup}
                    isUT014={isUT014}
                    isAdmin={isAdmin}
                  />
                </TabPanel>
              </Tab>

              <Tab label="Official List">
                <TabPanel>
                  <LazyOfficialList
                    data={officialList}
                    isLoading={isLoadingOfficialList}
                    isSuccess={isSuccessOfficialList}
                    isError={isErrorOfficialList}
                    error={errorOfficialList}
                    filterSelectedOfficialTeam={filterSelectedOfficialTeam}
                    setFilterSelectedOfficialTeam={
                      setFilterSelectedOfficialTeam
                    }
                    searchValue={searchOfficialList}
                    setSearchValue={setSearchOfficialList}
                    eventGroupID={filterSelectedEventGroup}
                    optionsTeams={optionsTeams}
                    optionsCustomers={optionsCustomers}
                    currentPage={currentPageOfficial}
                    setCurrentPage={setCurrentPageOfficial}
                    limitPerPage={limitPerPageOfficial}
                    isAccess={eventAccess}
                    eventGroupData={eventGroupData}
                    optionsEventGroup={optionsEventGroup}
                    isUT014={isUT014}
                    isAdmin={isAdmin}
                  />
                </TabPanel>
              </Tab>

              {!isTeamManager && !isUT014 && (
                <Tab label="Media List">
                  <TabPanel>
                    <LazyMediaList
                      data={mediaList}
                      isLoading={isLoadingMediaList}
                      isSuccess={isSuccessMediaList}
                      isError={isErrorMediaList}
                      error={errorMediaList}
                      searchValue={searchMediaList}
                      setSearchValue={setSearchMediaList}
                      currentPage={currentPageMedia}
                      setCurrentPage={setCurrentPageMedia}
                      limitPerPage={limitPerPageMedia}
                      setLimitPerPage={setLimitPerPageMedia}
                      isAccess={eventAccess}
                      filterSelected={filterMediaSelectedEvent}
                      setFilterSelected={setFilterMediaSelectedEvent}
                      optionsEventList={optionsEventList}
                      currentActiveTab={currentActiveTab}
                      eventGroupID={filterSelectedEventGroup}
                      isUT014={isUT014}
                    />
                  </TabPanel>
                </Tab>
              )}
            </Tabs>
          </Suspense>
        </CardBody>
      </Card>
    </>
  );
};

export default Events;
