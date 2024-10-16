import { Suspense, lazy, useState } from 'react';
import { toast } from 'react-toastify';

const LazyBreadcrumb = lazy(() => import('@/components/Breadcrumb'));
const LazyButtonCollapse = lazy(() => import('@/components/ButtonCollapse'));
const LazyFilterSearch = lazy(() =>
  import('@/components/form-input/FilterSearch')
);
const LazyTableUserData = lazy(() =>
  import('@/components/user-data/TableUserData')
);

import { Collapse, Modal, PopUpDelete } from '@/components';
import { Card, CardBody } from '@/components/Card';
import { FormAddUserData, FormDetailUserData } from '@/components/user-data';
import {
  SkeletonBlock,
  SkeletonBreadcrumb,
  SkeletonTable,
} from '@/components/Skeleton';

import useDebounce from '@/hooks/useDebounce';
import {
  useDeleteUserDataMutation,
  useGetUserDataQuery,
} from '@/services/api/userDataApiSlice';
import { useGetRolesQuery } from '@/services/api/userRoleApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentModules } from '@/services/state/authSlice';

const UserData = () => {
  const [isOpenNewData, setIsOpenNewData] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [popUpDelete, setPopUpDelete] = useState(false);
  const [getDetailData, setGetDetailData] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(10);

  const modules = useSelector(selectCurrentModules);
  const userDataAccess = modules[19];

  const debouncedSearchValue = useDebounce(searchValue, 500);

  const {
    data: userData,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUserDataQuery({
    searchTerm: debouncedSearchValue,
    page: currentPage,
    limit: limitPerPage,
  });

  const userCode = userData?.data?.user_code;

  const [deleteUserData, { isLoading: isLoadingDelete }] =
    useDeleteUserDataMutation();

  const { data: roles } = useGetRolesQuery();
  const selectDataRoles = roles?.data?.map((item) => ({
    value: item?.id,
    label: item?.role,
  }));
  if (Array.isArray(selectDataRoles)) {
    selectDataRoles.unshift({ value: '', label: 'Select Role' });
  }

  const handleDelete = async () => {
    try {
      const response = await deleteUserData({ id: getDetailData?.id }).unwrap();

      if (!response?.error) {
        setPopUpDelete(false);
        setOpenModal(false);

        toast.success(`"${getDetailData?.name}" has been deleted!`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed: ${err?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const breadcrumbItems = [
    { label: 'User CMS Management', url: '#' },
    { label: 'User Data' },
  ];

  return (
    <>
      <Card className="p-4 pb-1 px-6">
        <Suspense fallback={<SkeletonBreadcrumb />}>
          <LazyBreadcrumb title="User Data" items={breadcrumbItems} />
        </Suspense>

        <CardBody className="mt-3">
          <div
            className={`flex flex-col-reverse gap-2 md:flex-row md:items-center  ${
              userDataAccess?.can_add ? 'md:justify-between' : 'md:justify-end'
            }`}
          >
            {userDataAccess?.can_add && (
              <Suspense fallback={<SkeletonBlock />}>
                <LazyButtonCollapse
                  label="Add New User"
                  isOpen={isOpenNewData}
                  handleClick={() => setIsOpenNewData(!isOpenNewData)}
                />
              </Suspense>
            )}

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

          <Collapse isOpen={isOpenNewData}>
            <FormAddUserData
              setOpenColapse={setIsOpenNewData}
              roles={selectDataRoles}
              userCode={userCode}
            />
          </Collapse>

          <section className="mt-4">
            <Suspense fallback={<SkeletonTable />}>
              <LazyTableUserData
                openModal={openModal}
                setOpenModal={setOpenModal}
                setGetData={setGetDetailData}
                data={userData}
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
              title="Detail User Data"
              openModal={openModal}
              setOpenModal={setOpenModal}
              className="overflow-visible "
              rounded="rounded-xl"
            >
              <FormDetailUserData
                data={getDetailData}
                setOpenModal={setOpenModal}
                setIsOpenPopUpDelete={setPopUpDelete}
                roles={selectDataRoles}
                isAccess={userDataAccess}
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

export default UserData;
