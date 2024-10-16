import React, { Fragment } from 'react';

import { Button } from '.';
import { FaTrash } from 'react-icons/fa';
import { LoaderButtonAction } from '@/components';
import { Transition } from '@headlessui/react';

const PopUpDelete = ({
  handleDelete,
  isLoading,
  setIsOpenPopUpDelete,
  isOpenPopUpDelete,
  data = null,
  message,
}) => {
  return (
    <Transition appear as={Fragment} show={isOpenPopUpDelete}>
      <div className="absolute inset-0 top-0 z-60 flex items-center justify-center w-full h-full">
        <Transition.Child
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className={` bg__backdrop absolute inset-0 `}
            onClick={() => setIsOpenPopUpDelete(false)}
          />
        </Transition.Child>

        <div className="w-[80%] sm:w-[50%] lg:w-[40%] h-[50%] sm:h-[30%] md:h-[40%] z-10">
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-50"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-50"
          >
            <div className="flex flex-col items-center justify-center w-full h-full gap-2 p-4 py-8 text-center bg-white rounded-lg">
              <div className="flex items-center justify-center w-16 h-16 p-4 mx-auto mb-2 rounded-full bg-red-200/50">
                <FaTrash className="text-2xl text-red-500 animate-pulse" />
              </div>

              <h5 className="text-2xl font-bold">Confirm Delete!</h5>

              <p className="text-lg font-medium">
                {message || 'Do you want to delete this data?'}
              </p>

              {data && (
                <p>
                  <span className="font-bold">{data}</span> item
                  {data > 1 && 's'} will be deleted.
                </p>
              )}

              <div className="grid place-items-center">
                <div className="flex w-full gap-2 mt-4">
                  <Button
                    background="red"
                    className="w-28"
                    onClick={() => setIsOpenPopUpDelete(false)}
                    disabled={isLoading ? true : false}
                  >
                    {isLoading ? <LoaderButtonAction /> : 'Cancel'}
                  </Button>
                  <Button
                    background="black"
                    className="w-28"
                    onClick={handleDelete}
                    disabled={isLoading ? true : false}
                  >
                    {isLoading ? <LoaderButtonAction /> : 'Yes'}
                  </Button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </div>
    </Transition>
  );
};

export default PopUpDelete;
