import { Suspense, lazy, useState } from 'react';
import { useSelector } from 'react-redux';
import { BiReset } from 'react-icons/bi';
import { toast } from 'react-toastify';

const LazyBreadcrumb = lazy(() => import('@/components/Breadcrumb'));
const LazyButtonCollapse = lazy(() => import('@/components/ButtonCollapse'));
const LazyFilterSelect = lazy(() =>
  import('@/components/form-input/FilterSelect')
);
const LazyFilterSearch = lazy(() =>
  import('@/components/form-input/FilterSearch')
);
const LazyButton = lazy(() => import('@/components/Button'));
const LazyFormAddEventGroup = lazy(() =>
  import('@/components/event-group/FormAddEventGroup')
);
const LazyTableEventGroup = lazy(() =>
  import('@/components/event-group/TableEventGroup')
);

import {
  Button,
  Collapse,
  Modal,
  PopUp,
  PopUpDelete,
  Tooltip,
} from '@/components';
import { Card, CardBody } from '@/components/Card';
import { FormDetailEventGroup } from '@/components/event-group';
import {
  SkeletonBlock,
  SkeletonBreadcrumb,
  SkeletonForm,
  SkeletonTable,
} from '@/components/Skeleton';

import useDebounce from '@/hooks/useDebounce';

import { useGetCitiesQuery } from '@/services/api/cityApiSlice';
import { useGetPricesQuery } from '@/services/api/generalSettingApiSlice';
import {
  useDeleteEventGroupMutation,
  useGetEventGroupQuery,
  useGetOptionsMpvRankQuery,
} from '@/services/api/eventGroupApiSlice';
import { selectCurrentModules } from '@/services/state/authSlice';
import {
  useGetOptionsEventTypeQuery,
  useGetOptionsSponsorsQuery,
} from '@/services/api/othersApiSlice';
import { useOptionsAllUsersQuery } from '@/services/api/customerDataApiSlice';

const EventGroup = () => {
  const [isOpenAddNewGroup, setIsOpenAddNewGroup] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [popUpDelete, setPopUpDelete] = useState(false);
  const [popUpConfirmation, setPopUpConfirmation] = useState(false);
  const [popUpConfirmationSingle, setPopUpConfirmationSingle] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [isConfirmSingle, setIsConfirmSingle] = useState(false);
  const [getDetailEvent, setGetDetailEvent] = useState('');
  const [filterSelectedValue, setFilterSelectedValue] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(10);

  const modules = useSelector(selectCurrentModules);
  const groupEventAccess = modules[1];

  const { data: priceData } = useGetPricesQuery();
  const getPrice = priceData?.data?.master_commerce?.map((item) => ({
    id: item?.id,
    name: item?.name,
    price: item?.price,
  }));

  // For options filter city
  const { data: cities } = useGetCitiesQuery({
    page: '',
    searchTerm: '',
  });
  const optionsCities = cities?.data?.map((item) => ({
    value: item?.city,
    label: item?.city,
  }));
  if (Array.isArray(optionsCities)) {
    optionsCities.unshift({ value: '', label: 'Select City' });
  }

  // For Options Event Type
  const { data: eventTypeData } = useGetOptionsEventTypeQuery();
  const optionsEventType = eventTypeData?.data?.map((item) => ({
    value: item?.id,
    label: item?.event_type,
  }));

  // For Options Sponsors
  const { data: sponsorCategories } = useGetOptionsSponsorsQuery();
  const optionsSponsors = sponsorCategories?.data?.map((item) => ({
    value: item?.id,
    label: item?.name,
  }));

  // For Options Event Type
  const { data: mpvRank } = useGetOptionsMpvRankQuery();
  const optionsMvpRank = mpvRank?.data?.map((item) => ({
    value: item?.id,
    label: item?.name,
  }));

  // For Options User from customer-data
  const { data: userList } = useOptionsAllUsersQuery();
  const optionsUsers = userList?.data?.map((item) => ({
    value: item?.id,
    label: `${item?.code} ${item?.name ? `- ${item?.name}` : ''}`,
  }));

  const debouncedSearchValue = useDebounce(searchValue, 500);
  const {
    data: events,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetEventGroupQuery({
    city: filterSelectedValue,
    searchTerm: debouncedSearchValue,
    page: currentPage,
    limit: limitPerPage,
  });
  const eventGroupCode = events?.data?.event_group_code;
  const eventGroupSingleCode = events?.data?.event_group_single;

  const [deleteEventGroup, { isLoading: isLoadingDelete }] =
    useDeleteEventGroupMutation();

  const handleResetFilter = () => {
    setFilterSelectedValue('');
    setSearchValue('');
  };

  const handleDelete = async () => {
    try {
      const response = await deleteEventGroup({
        id: getDetailEvent?.id,
      }).unwrap();

      if (!response.error) {
        setPopUpDelete(false);
        setOpenModal(false);
        toast.success(
          `Event Group "${getDetailEvent?.name}" has been deleted!`,
          {
            position: 'top-right',
            theme: 'light',
          }
        );
      }
    } catch (err) {
      console.error('Failed to delete data', err);
      toast.error(`Failed to delete`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const breadcrumbItems = [
    { label: 'Event Managemenet', url: '#' },
    { label: 'Event Group' },
  ];

  return (
    <>
      <Card className="p-4 pb-0">
        <Suspense fallback={<SkeletonBreadcrumb />}>
          <LazyBreadcrumb title="Event Group" items={breadcrumbItems} />
        </Suspense>

        <CardBody className="mt-3">
          <div
            className={`flex flex-col-reverse gap-2 md:flex-row md:items-center ${
              groupEventAccess?.can_add
                ? 'md:justify-between'
                : 'md:justify-end'
            }`}
          >
            {groupEventAccess?.can_add && (
              <Suspense fallback={<SkeletonBlock />}>
                <LazyButtonCollapse
                  label="Add New Group"
                  isOpen={isOpenAddNewGroup}
                  handleClick={() => setIsOpenAddNewGroup(!isOpenAddNewGroup)}
                />
              </Suspense>
            )}

            <div className="flex gap-2 flex-col sm:flex-row sm:items-center sm:justify-between w-full sm:w-[60%] lg:w-[50%]">
              <div className="w-full sm:w-[45%] z-50">
                <Suspense fallback={<SkeletonBlock width="w-full" />}>
                  <LazyFilterSelect
                    dataOptions={optionsCities}
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
                    className="block w-full "
                  >
                    <BiReset className="mx-auto" />
                  </LazyButton>
                </Suspense>
              </Tooltip>
            </div>
          </div>

          <Collapse isOpen={isOpenAddNewGroup}>
            <Suspense fallback={<SkeletonForm cols={4} rows={4} />}>
              <LazyFormAddEventGroup
                setOpenColapse={setIsOpenAddNewGroup}
                cities={optionsCities}
                optionsEventType={optionsEventType}
                price={getPrice}
                eventGroupCode={eventGroupCode}
                eventGroupSingleCode={eventGroupSingleCode}
                optionsMvpRank={optionsMvpRank}
                setPopUpConfirmation={setPopUpConfirmation}
                isConfirm={isConfirm}
                setIsConfirm={setIsConfirm}
                setPopUpConfirmationSingle={setPopUpConfirmationSingle}
                isConfirmSingle={isConfirmSingle}
                setIsConfirmSingle={setIsConfirmSingle}
                optionsSponsors={optionsSponsors}
                optionsUsers={optionsUsers}
              />
            </Suspense>
          </Collapse>

          <section className="mt-3">
            <Suspense fallback={<SkeletonTable />}>
              <LazyTableEventGroup
                openModal={openModal}
                setOpenModal={setOpenModal}
                setGetData={setGetDetailEvent}
                data={events}
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
              title="Detail Event Group"
              openModal={openModal}
              setOpenModal={setOpenModal}
              rounded="rounded-xl"
            >
              <FormDetailEventGroup
                data={getDetailEvent}
                cities={optionsCities}
                optionsEventType={optionsEventType}
                setOpenModal={setOpenModal}
                setIsOpenPopUpDelete={setPopUpDelete}
                isAccess={groupEventAccess}
                optionsMvpRank={optionsMvpRank}
                optionsSponsors={optionsSponsors}
                optionsUsers={optionsUsers}
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

            {/* POPUP Confirm Add New data */}
            <PopUp
              isOpenPopUp={popUpConfirmation}
              setIsOpenPopUp={setPopUpConfirmation}
              title="Confirmation"
            >
              <p className="max-w-md mb-4 font-medium text-center ">
                Please make sure your{' '}
                <span className="font-bold italic">Event Type</span> is correct.
                The
                <span className="font-bold italic"> Event Type</span> cannot be
                changed after it has been processed.
              </p>

              <div className="flex items-center justify-center">
                <div className="flex gap-2">
                  <Button
                    background="red"
                    className="w-36"
                    onClick={() => setPopUpConfirmation(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    background="black"
                    className="w-36"
                    onClick={() => setIsConfirm(true)}
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            </PopUp>
            {/* END Confirm Add data */}

            {/* POPUP Confirm Single Event */}
            <PopUp
              isOpenPopUp={popUpConfirmationSingle}
              setIsOpenPopUp={setPopUpConfirmationSingle}
              title="Confirmation"
            >
              <p className="max-w-md mb-4 font-medium text-center ">
                Please make sure your{' '}
                <span className="font-bold italic">Event Type Single</span> is
                correct. The
                <span className="font-bold italic">
                  {' '}
                  Event Type Single
                </span>{' '}
                cannot be changed after it has been processed.
              </p>

              <div className="flex items-center justify-center">
                <div className="flex gap-2">
                  <Button
                    background="red"
                    className="w-36"
                    onClick={() => setPopUpConfirmationSingle(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    background="black"
                    className="w-36"
                    onClick={() => setIsConfirmSingle(true)}
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            </PopUp>
            {/* END Confirm Single Event */}
          </section>
        </CardBody>
      </Card>
    </>
  );
};

export default EventGroup;
