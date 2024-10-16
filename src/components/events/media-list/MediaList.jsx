import { useEffect, useMemo, useState } from 'react';
import { BiReset } from 'react-icons/bi';

import {
  Button,
  ButtonCollapse,
  Collapse,
  Modal,
  PopUpDelete,
  PopUpUploading,
  Tooltip,
} from '@/components';
import TableMediaList from './TableMediaList';
import FormAddMediaList from './FormAddMediaList';
import FormDetailMediaList from './FormDetailMediaList';
import { FilterSearch, FilterSelect } from '@/components/form-input';

import {
  useDeleteAllMediaByEventMutation,
  useDeleteMediaBulkMutation,
  useDeleteMediaListMutation,
} from '@/services/api/eventsApiSlice';
import { toast } from 'react-toastify';
import { FaTrashAlt } from 'react-icons/fa';

const MediaList = (props) => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    searchValue,
    setSearchValue,
    currentPage,
    setCurrentPage,
    limitPerPage,
    setLimitPerPage,
    isAccess,
    filterSelected,
    setFilterSelected,
    optionsEventList,
    currentActiveTab,
    eventGroupID,
    isUT014,
  } = props;

  const [isOpenNewData, setIsOpenNewData] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [popUpDelete, setPopUpDelete] = useState(false);
  const [popUpDeleteBulk, setPopUpDeleteBulk] = useState(false);
  const [popUpDeleteAll, setPopUpDeleteAll] = useState(false);
  const [getData, setGetData] = useState('');
  const [popUpUploading, setPopUpUploading] = useState(false);
  const [isUploadCompleted, setIsUploadCompleted] = useState(false);
  const [selectRows, setSelectRows] = useState([]);
  const [clearSelectedRows, setClearSelectedRows] = useState(false);

  const metaPagination = data?.meta;
  const media = data?.data;

  const [deleteMediaList, { isLoading: isLoadingDelete }] =
    useDeleteMediaListMutation();
  const [deleteMediaBulk, { isLoading: isLoadingDeleteBulk }] =
    useDeleteMediaBulkMutation();
  const [deleteAllMediaByEvent, { isLoading: isLoadingDeleteAll }] =
    useDeleteAllMediaByEventMutation();

  const handleDelete = async () => {
    try {
      const response = await deleteMediaList({
        id: getData?.id,
      }).unwrap();

      if (!response.error) {
        setPopUpDelete(false);
        setOpenModal(false);
        toast.success(
          `Media with the code "${getData?.code_media}" has been deleted!`,
          {
            position: 'top-right',
            theme: 'light',
          }
        );
      }
    } catch (err) {
      setPopUpDelete(false);
      setOpenModal(false);
      console.error('Failed to delete', err);
      toast.error(`Failed: ${err?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const handleDeleteBulkMediaSelected = useMemo(() => {
    const bulkDelete = async () => {
      try {
        const dataIdDelete = selectRows?.map((row) => row?.id);

        const response = await deleteMediaBulk({
          id: dataIdDelete,
        }).unwrap();

        if (!response.error) {
          setClearSelectedRows(!clearSelectedRows);
          setSelectRows([]);
          setPopUpDeleteBulk(false);
          toast.success(
            `${selectRows.length} media ${
              selectRows.length > 1 ? 'have' : 'has'
            } been deleted!`,
            {
              position: 'top-right',
              theme: 'light',
            }
          );
        }
      } catch (err) {
        setClearSelectedRows(!clearSelectedRows);
        setPopUpDeleteBulk(false);
        setSelectRows([]);
        console.error(err);
        toast.error(`Failed: ${err?.data?.message}`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    };
    return bulkDelete;
  }, [media, selectRows, clearSelectedRows]);

  const handleDeleteAllMedia = async () => {
    try {
      const response = await deleteAllMediaByEvent({
        id_event: filterSelected,
      }).unwrap();

      if (!response.error) {
        setPopUpDeleteAll(false);
        toast.success(
          `${metaPagination?.total_record} media ${
            metaPagination?.total_record > 1 ? 'have' : 'has'
          } been deleted!`,
          {
            position: 'top-right',
            theme: 'light',
          }
        );
      }
    } catch (err) {
      setPopUpDeleteAll(false);
      console.error(err);
      toast.error(`Failed: ${err?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const handleResetFilter = () => {
    setFilterSelected('');
    setSearchValue('');
  };

  useEffect(() => {
    setFilterSelected('');
  }, [currentActiveTab]);

  useEffect(() => {
    setFilterSelected('');
  }, [eventGroupID]);

  const matchedEvent = useMemo(() => {
    return optionsEventList?.find((data) => data?.value === filterSelected);
  }, [filterSelected, optionsEventList]);

  return (
    <>
      <div
        className={`flex flex-col-reverse gap-2 md:flex-row md:items-center  ${
          (isAccess?.can_add && !isUT014) || selectRows?.length > 0
            ? 'md:justify-between'
            : 'md:justify-end'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          {selectRows?.length > 0 ? (
            <Button
              background="red"
              className={`w-28 flex items-center justify-center gap-2`}
              onClick={() => setPopUpDeleteBulk(true)}
            >
              <FaTrashAlt /> Delete
            </Button>
          ) : (
            isAccess?.can_add &&
            !isUT014 && (
              <ButtonCollapse
                label="Add New Media"
                isOpen={isOpenNewData}
                handleClick={() => setIsOpenNewData(!isOpenNewData)}
              />
            )
          )}

          {selectRows?.length === 0 &&
            filterSelected !== '' &&
            media.length > 0 && (
              <Button
                background="red"
                className={`py-2.5 flex items-center justify-center gap-2 font-medium`}
                onClick={() => setPopUpDeleteAll(true)}
              >
                <FaTrashAlt /> Delete All Media
              </Button>
            )}
        </div>

        <div className="flex gap-2 flex-col sm:flex-row sm:items-center sm:justify-between w-full sm:w-[60%] lg:w-[40%]">
          <div className="w-full sm:w-[45%] z-20">
            <FilterSelect
              dataOptions={optionsEventList}
              placeholder="Select Event"
              filterSelectedValue={filterSelected}
              setFilterSelectedValue={setFilterSelected}
              setCurrentPage={setCurrentPage}
            />
          </div>

          <div className="w-full sm:w-[45%]">
            <FilterSearch
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              setCurrentPage={setCurrentPage}
            />
          </div>

          <Tooltip text="Reset Filter" position="top">
            <Button
              background="black"
              onClick={handleResetFilter}
              className="block w-full "
            >
              <BiReset className="mx-auto" />
            </Button>
          </Tooltip>
        </div>
      </div>

      <Collapse isOpen={isOpenNewData}>
        <FormAddMediaList
          optionsEvents={optionsEventList}
          setIsOpenPopUpUploading={setPopUpUploading}
          setIsUploadCompleted={setIsUploadCompleted}
          eventGroupID={eventGroupID}
        />
      </Collapse>

      <div className="z-0 mt-4 ">
        <TableMediaList
          openModal={openModal}
          setOpenModal={setOpenModal}
          setGetData={setGetData}
          data={media}
          isLoading={isLoading}
          isSuccess={isSuccess}
          isError={isError}
          error={error}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          metaPagination={metaPagination}
          limitPerPage={limitPerPage}
          setLimitPerPage={setLimitPerPage}
          setSelectRows={setSelectRows}
          clearSelectedRows={clearSelectedRows}
        />
      </div>

      {/* MODAL */}
      <Modal
        title="Detail Media List"
        openModal={openModal}
        setOpenModal={setOpenModal}
      >
        <FormDetailMediaList
          data={getData}
          setIsOpenPopUpDelete={setPopUpDelete}
          setOpenModal={setOpenModal}
          isAccess={isAccess}
        />
      </Modal>
      {/* END MODAL */}

      {/* Pop Up Delete */}
      {popUpDelete && (
        <PopUpDelete
          handleDelete={handleDelete}
          isLoading={isLoadingDelete}
          isOpenPopUpDelete={popUpDelete}
          setIsOpenPopUpDelete={setPopUpDelete}
        />
      )}
      {/* End Pop Up Delete */}

      {/* Pop Up Delete Bulk */}
      {popUpDeleteBulk && (
        <PopUpDelete
          handleDelete={handleDeleteBulkMediaSelected}
          isLoading={isLoadingDeleteBulk}
          isOpenPopUpDelete={popUpDeleteBulk}
          data={selectRows?.length}
          setIsOpenPopUpDelete={setPopUpDeleteBulk}
        />
      )}
      {/* End Pop Up Delete Bulk */}

      {/* Pop Up Delete All */}
      {popUpDeleteAll && (
        <PopUpDelete
          message={`Are you sure you want to delete all media from this "${matchedEvent?.label}" event?`}
          handleDelete={handleDeleteAllMedia}
          isLoading={isLoadingDeleteAll}
          isOpenPopUpDelete={popUpDeleteAll}
          data={metaPagination?.total_record}
          setIsOpenPopUpDelete={setPopUpDeleteAll}
        />
      )}
      {/* End Pop Up Delete All */}

      {/* Pop Up Uploading */}
      {popUpUploading && (
        <PopUpUploading
          isOpenPopUpUploading={popUpUploading}
          setIsOpenPopUpUploading={setPopUpUploading}
          isUploadCompleted={isUploadCompleted}
          setIsUploadCompleted={setIsUploadCompleted}
          disableBtnMedia
        />
      )}
      {/* End Pop Up Uploading */}
    </>
  );
};

export default MediaList;
