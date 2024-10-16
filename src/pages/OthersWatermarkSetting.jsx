import { useState } from 'react';
import { toast } from 'react-toastify';

import {
  Breadcrumb,
  ButtonCollapse,
  Collapse,
  Modal,
  PopUpDelete,
} from '@/components';
import { Card, CardBody } from '@/components/Card';
import { FilterSearch } from '@/components/form-input';
import useDebounce from '@/hooks/useDebounce';
import {
  useDeleteUserDataMutation,
  useGetUserDataQuery,
} from '@/services/api/userDataApiSlice';
import { useGetRolesQuery } from '@/services/api/userRoleApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentModules } from '@/services/state/authSlice';
import {
  FormAddWatermark,
  FormDetailWatermark,
  TableWatermark,
} from '@/components/others-watermark-setting';

const breadcrumbItems = [
  { label: 'Settings', url: '#' },
  { label: 'Watermark Setting' },
];

const OthersWatermarkSetting = () => {
  const [isOpenNewData, setIsOpenNewData] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [popUpDelete, setPopUpDelete] = useState(false);
  const [getDetailData, setGetDetailData] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(10);

  const modules = useSelector(selectCurrentModules);
  const isAccessThisPage = {
    can_access: true,
    can_add: true,
    can_delete: true,
    can_edit: true,
  };

  const debouncedSearchValue = useDebounce(searchValue, 500);

  const {
    data: watermarkData,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUserDataQuery({
    searchTerm: debouncedSearchValue,
    page: currentPage,
    limit: limitPerPage,
  });

  const userCode = watermarkData?.data?.user_code;

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
      toast.error(`Failed to delete`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  return (
    <>
      <Card className="p-4 px-6">
        <Breadcrumb title="Watermark Setting" items={breadcrumbItems} />

        <CardBody className="mt-4">
          <div
            className={`flex flex-col-reverse gap-2 md:flex-row md:items-center  ${
              isAccessThisPage?.can_add
                ? 'md:justify-between'
                : 'md:justify-end'
            }`}
          >
            {isAccessThisPage?.can_add && (
              <ButtonCollapse
                label="Add New Data"
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
            <FormAddWatermark
              setOpenColapse={setIsOpenNewData}
              roles={selectDataRoles}
              userCode={userCode}
            />
          </Collapse>

          <section className="mt-4">
            <TableWatermark
              openModal={openModal}
              setOpenModal={setOpenModal}
              setGetData={setGetDetailData}
              data={watermarkData}
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
              title="Detail Watermark"
              openModal={openModal}
              setOpenModal={setOpenModal}
            >
              <FormDetailWatermark
                data={getDetailData}
                setOpenModal={setOpenModal}
                setIsOpenPopUpDelete={setPopUpDelete}
                roles={selectDataRoles}
                isAccess={isAccessThisPage}
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

export default OthersWatermarkSetting;
