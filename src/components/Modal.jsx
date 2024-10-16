import { Transition } from '@headlessui/react';
import React, { Fragment } from 'react';

import { IoIosArrowForward, IoMdClose } from 'react-icons/io';
import { RiCloseLine } from 'react-icons/ri';

const Modal = ({
  openModal,
  setOpenModal,
  children,
  title = 'title modal',
  className,
  rounded,
  locked,
}) => {
  return (
    <Transition appear as={Fragment} show={openModal}>
      <div
        className={` w-full bg-transparent absolute inset-0 z-60 flex items-center `}
      >
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
            onClick={() => setOpenModal(locked ? true : false)}
          />
        </Transition.Child>

        <div
          className={`modal w-full min-h-[20%] max-h-[80%] rounded-xl z-10 m-6 relative overflow-auto ${className}`}
        >
          <Transition.Child
            enter="transform duration-300 ease-out"
            enterFrom="opacity-0 scale-y-0"
            enterTo="opacity-100 scale-y-100"
            leave="transform duration-200 ease-in"
            leaveFrom="opacity-100 scale-y-100"
            leaveTo="opacity-0 scale-y-0"
            className={`bg-white ${rounded}`}
          >
            <div
              className={`sticky top-0 left-0 z-60 flex items-center justify-between w-full gap-4 p-3 mb-4 bg-white ${rounded}`}
            >
              <div className="flex items-center gap-4">
                <button
                  className="flex items-center justify-center w-6 h-6 p-1 text-sm text-white bg-black rounded-md group"
                  onClick={() => setOpenModal(locked ? true : false)}
                >
                  <IoIosArrowForward
                    className={`transition-all duration-300 group-hover:transform ${
                      locked ? '' : 'group-hover:rotate-90'
                    } `}
                  />
                </button>
                <h5 className="font-medium">{title}</h5>
              </div>

              <button
                className="flex items-center justify-center p-1 text-black bg-transparent rounded-md group text-lg bg-red-50 hover:bg-red-100 hover:text-red-600 transition-all duration-75 group"
                onClick={() => setOpenModal(locked ? true : false)}
              >
                <RiCloseLine
                  className={`transition-all duration-300 group-hover:transform group-hover:scale-125 ${
                    locked ? 'hidden' : ''
                  } `}
                />
              </button>
            </div>

            <div className="px-6 pb-4 ">{children}</div>
          </Transition.Child>
        </div>
      </div>
    </Transition>
  );
};

export default Modal;
