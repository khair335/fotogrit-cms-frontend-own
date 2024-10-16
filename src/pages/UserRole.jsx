import { Suspense, lazy, useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const LazyBreadcrumb = lazy(() => import('@/components/Breadcrumb'));
const LazyButtonCollapse = lazy(() => import('@/components/ButtonCollapse'));
const LazyFilterSearch = lazy(() =>
  import('@/components/form-input/FilterSearch')
);
const LazyTableUserRole = lazy(() =>
  import('@/components/user-role/TableUserRole')
);

import { Collapse, Modal, PopUpDelete } from '@/components';
import { Card, CardBody } from '@/components/Card';
import { FormAddUserRole, FormDetailUserRole } from '@/components/user-role';
import {
  SkeletonBlock,
  SkeletonBreadcrumb,
  SkeletonTable,
} from '@/components/Skeleton';

import useDebounce from '@/hooks/useDebounce';
import {
  useDeleteUserRoleMutation,
  useGetUserRolesQuery,
} from '@/services/api/userRoleApiSlice';
import { selectCurrentModules } from '@/services/state/authSlice';

const UserRole = () => {
  const [isOpenNewData, setIsOpenNewData] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [popUpDelete, setPopUpDelete] = useState(false);
  const [getDetailData, setGetDetailData] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(10);

  const modules = useSelector(selectCurrentModules);
  const userRoleAccess = modules[11];

  const debouncedSearchValue = useDebounce(searchValue, 500);

  const { data, isLoading, isSuccess, isError, error } = useGetUserRolesQuery({
    searchTerm: debouncedSearchValue,
    page: currentPage,
    limit: limitPerPage,
  });

  const [deleteUserRole, { isLoading: isLoadingDelete }] =
    useDeleteUserRoleMutation();

  const handleDelete = async () => {
    try {
      const response = await deleteUserRole({
        id: getDetailData?.id,
      }).unwrap();

      if (!response.error) {
        setPopUpDelete(false);
        setOpenModal(false);
        toast.success(`Role "${getDetailData?.role}" has been deleted!`, {
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

  const breadcrumbItems = [
    { label: 'User CMS Management', url: '#' },
    { label: 'User Role' },
  ];

  return (
    <>
      <Card className="pt-4 pb-0 px-6">
        <Suspense fallback={<SkeletonBreadcrumb />}>
          <LazyBreadcrumb title="User Role" items={breadcrumbItems} />
        </Suspense>

        <CardBody className="mt-3">
          <div
            className={`flex flex-col-reverse gap-2 md:flex-row md:items-center  ${
              userRoleAccess?.can_add ? 'md:justify-between' : 'md:justify-end'
            }`}
          >
            {userRoleAccess?.can_add && (
              <Suspense fallback={<SkeletonBlock />}>
                <LazyButtonCollapse
                  label="Add New Role"
                  isOpen={isOpenNewData}
                  handleClick={() => setIsOpenNewData(!isOpenNewData)}
                />
              </Suspense>
            )}

            <div className="w-full sm:w-[50%] lg:w-[30%]">
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
            <FormAddUserRole setOpenColapse={setIsOpenNewData} />
          </Collapse>

          <section className="mt-3">
            <Suspense fallback={<SkeletonTable />}>
              <LazyTableUserRole
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
              />
            </Suspense>

            {/* MODAL */}
            <Modal
              title="Detail User Role"
              openModal={openModal}
              setOpenModal={setOpenModal}
            >
              <FormDetailUserRole
                data={getDetailData}
                setOpenModal={setOpenModal}
                setIsOpenPopUpDelete={setPopUpDelete}
                isAccess={userRoleAccess}
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

export default UserRole;
