import { Suspense, lazy, useState } from 'react';
import { useSelector } from 'react-redux';

const LazyBreadcrumb = lazy(() => import('@/components/Breadcrumb'));
const LazyFilterSearch = lazy(() =>
  import('@/components/form-input/FilterSearch')
);
const LazyTableEventChecking = lazy(() =>
  import('@/components/service-event-checking/TableEventChecking')
);

import { Modal } from '@/components';
import { Card, CardBody } from '@/components/Card';
import {
  FormConfirmationEventChecking,
  FormDetailEventChecking,
} from '@/components/service-event-checking';
import {
  SkeletonBlock,
  SkeletonBreadcrumb,
  SkeletonTable,
} from '@/components/Skeleton';

import useDebounce from '@/hooks/useDebounce';
import { selectCurrentModules } from '@/services/state/authSlice';
import { useGetEventGroupListQuery } from '@/services/api/eventGroupApiSlice';
import { useGetEventCheckingQuery } from '@/services/api/serviceRequestApiSlice';
import { useGetPricesQuery } from '@/services/api/generalSettingApiSlice';
import { useGetOptionsEventForServiceQuery } from '@/services/api/eventsApiSlice';

const breadcrumbItems = [
  {
    label: 'Service Management',
    url: '/photograper-management/request-other-service',
  },
  { label: 'My Services', url: '#' },
  { label: 'Event Checking' },
];

const ServiceEventChecking = () => {
  const [openModal, setOpenModal] = useState(false);
  const [isOpenModalConfirmation, setIsOpenModalConfirmation] = useState(false);
  const [getDetailData, setGetDetailData] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(10);

  const modules = useSelector(selectCurrentModules);
  const isAccessEventChecking = modules[27];

  const debouncedSearchValue = useDebounce(searchValue, 500);

  const { data, isLoading, isSuccess, isError, error } =
    useGetEventCheckingQuery({
      searchTerm: debouncedSearchValue,
      page: currentPage,
      limit: limitPerPage,
    });

  const { data: priceData } = useGetPricesQuery();
  const getPrice = priceData?.data?.master_commerce?.map((item) => ({
    id: item?.id,
    name: item?.name,
    price: item?.price,
  }));

  // For Options Event Group
  const [pageEventGroup, setPageEventGroup] = useState(1);
  const [searchQueryEventGroup, setSearchQueryEventGroup] = useState('');
  const debouncedSearchEventGroup = useDebounce(searchQueryEventGroup, 200);
  const { data: eventGroups } = useGetEventGroupListQuery({
    page: pageEventGroup,
    searchTerm: debouncedSearchEventGroup,
  });
  const totalPageOptionEventGroup = eventGroups?.meta?.total_page;
  const optionsEventGroup = eventGroups?.data?.event_groups?.map((item) => ({
    value: item?.id,
    label: `${item?.name}`,
  }));
  if (Array.isArray(optionsEventGroup)) {
    optionsEventGroup.unshift({ value: '', label: 'Select Event Group Name' });
  }

  // For Options Event
  const [selectedEventGroupID, setSelectedEventGroupID] = useState('');
  const [pageEvent, setPageEvent] = useState(1);
  const [searchQueryEvent, setSearchQueryEvent] = useState('');
  const debouncedSearchEvent = useDebounce(searchQueryEvent, 200);
  const { data: events } = useGetOptionsEventForServiceQuery({
    page: pageEvent,
    searchTerm: debouncedSearchEvent,
    eventGroup: selectedEventGroupID,
  });
  const totalPageOptionEvent = events?.meta?.total_page;
  const optionsEvent = events?.data?.events?.map((item) => ({
    value: item?.id,
    label: item?.event_name,
  }));
  if (Array.isArray(optionsEvent)) {
    optionsEvent.unshift({ value: '', label: 'Select Event Name' });
  }

  return (
    <>
      <Card className="p-4 pb-1 px-6">
        <Suspense fallback={<SkeletonBreadcrumb />}>
          <LazyBreadcrumb title="Event Checking" items={breadcrumbItems} />
        </Suspense>

        <CardBody className="mt-3">
          <div
            className={`flex flex-col-reverse gap-2 md:flex-row md:items-center  md:justify-end`}
          >
            <div className="w-full sm:w-[40%] lg:w-[30%]">
              <Suspense fallback={<SkeletonBlock width="w-full" />}>
                <LazyFilterSearch
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  setCurrentPage={setCurrentPage}
                />
              </Suspense>
            </div>
          </div>

          <section className="mt-3">
            <Suspense fallback={<SkeletonTable />}>
              <LazyTableEventChecking
                openModal={openModal}
                setOpenModal={setOpenModal}
                setGetData={setGetDetailData}
                data={data}
                isLoading={isLoading}
                isSuccess={isSuccess}
                isError={isError}
                error={error}
                limitPerPage={limitPerPage}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                isOpenModalConfirmation={isOpenModalConfirmation}
                setIsOpenModalConfirmation={setIsOpenModalConfirmation}
                isAccessEventChecking={isAccessEventChecking}
              />
            </Suspense>

            {/* MODAL DETAIL */}
            <Modal
              title="Detail Event Checking"
              openModal={openModal}
              setOpenModal={setOpenModal}
              rounded="rounded-xl"
            >
              <FormDetailEventChecking
                data={getDetailData}
                setOpenModal={setOpenModal}
              />
            </Modal>
            {/* END MODAL Detail */}

            {/* MODAL Konfirmation */}
            <Modal
              title="Konfirmasi"
              openModal={isOpenModalConfirmation}
              setOpenModal={setIsOpenModalConfirmation}
              rounded="rounded-xl"
              className="overflow-visible"
              locked
            >
              <FormConfirmationEventChecking
                data={getDetailData}
                prices={getPrice}
                setIsOpenModalConfirmation={setIsOpenModalConfirmation}
                optionsEventGroups={optionsEventGroup}
                setPageOptionEventGroup={setPageEventGroup}
                setSearchQueryOptionEventGroup={setSearchQueryEventGroup}
                totalPageOptionEventGroup={totalPageOptionEventGroup}
                optionsEvents={optionsEvent}
                setPageOptionEvent={setPageEvent}
                setSearchQueryOptionEvent={setSearchQueryEvent}
                totalPageOptionEvent={totalPageOptionEvent}
                setEventGropID={setSelectedEventGroupID}
              />
            </Modal>
            {/* END MODAL */}
          </section>
        </CardBody>
      </Card>
    </>
  );
};

export default ServiceEventChecking;
