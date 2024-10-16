import React, { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { IoIosArrowForward } from 'react-icons/io';

const PopUp = ({
  setIsOpenPopUp,
  isOpenPopUp,
  children,
  title,
  className,
  handleClose,
}) => {
  return (
    <Transition appear as={Fragment} show={isOpenPopUp}>
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
            onClick={() =>
              handleClose ? handleClose() : setIsOpenPopUp(false)
            }
          />
        </Transition.Child>

        <div className={`z-10  ${className} `}>
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-50"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-50"
          >
            <div className="relative flex flex-col items-center justify-center w-full h-full gap-2 p-2 bg-white rounded-xl">
              {title ? (
                <div
                  className={`sticky top-0 left-0 z-50 flex items-center w-full gap-4 bg-white`}
                >
                  <button
                    className="flex items-center justify-center w-6 h-6 p-1 text-sm text-white bg-black rounded-md group"
                    onClick={() => setIsOpenPopUp(false)}
                  >
                    <IoIosArrowForward className="transition-all duration-300 group-hover:transform group-hover:rotate-90" />
                  </button>
                  <h5 className="font-bold">{title || 'Enter Title'}</h5>
                </div>
              ) : (
                ''
              )}

              <div className="p-2 text-xs">{children}</div>
            </div>
          </Transition.Child>
        </div>
      </div>
    </Transition>
  );
};

export default PopUp;
