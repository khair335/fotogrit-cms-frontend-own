import React, { Fragment } from 'react';

import { PiWarningBold } from 'react-icons/pi';
import { Transition } from '@headlessui/react';
import { Button } from '@/components';

const PopUpConflict = ({ handleClose, isOpenPopUp, dataConflicts }) => {
  return (
    <Transition appear as={Fragment} show={isOpenPopUp}>
      <div className="absolute inset-0 top-0 z-50 flex items-center justify-center w-full h-full">
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
            onClick={handleClose}
          />
        </Transition.Child>

        <div className=" w-[80%] sm:w-[50%] lg:w-[35%] h-[50%] sm:h-[30%] md:h-[40%] z-10">
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-50"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-50"
          >
            <div className="flex flex-col items-center justify-center w-full h-full gap-2 p-4 py-8 bg-white rounded-lg">
              <div className="flex items-center justify-center w-16 h-16 p-2 mx-auto mb-2 rounded-full bg-red-200/50">
                <PiWarningBold className="text-red-500 text-7xl animate-pulse" />
              </div>

              <p className="text-xs font-medium text-center">
                Maaf, photographer yang Anda tugaskan telah memiliki pekerjaan
                di tanggal dan jam yang sama. Silahkan cari photographer lain.
              </p>

              {/* <h5 className="text-sm font-bold">Conflicts</h5>

              {dataConflicts.length > 0 ? (
                <ul className="flex flex-col gap-1 text-xs text-center">
                  {dataConflicts.map((conflict, index) => (
                    <li
                      key={index}
                      className="flex flex-col p-2 text-white rounded-md bg-ftbrown"
                    >
                      <span>{`${conflict.event1.event_name} and ${conflict.event2.event_name}`}</span>
                      <span>{`Date: ${formatDate(conflict.event1.date)}`}</span>
                      <span>{`Time: ${conflict.event1.time_start}-${conflict.event1.time_finish} and ${conflict.event2.time_start}-${conflict.event2.time_finish}`}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No schedule conflicts found.</p>
              )} */}

              <div className="grid place-items-center">
                <div className="flex w-full gap-2 mt-4">
                  <Button
                    background="black"
                    className="w-28"
                    onClick={handleClose}
                  >
                    Ok
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

export default PopUpConflict;
