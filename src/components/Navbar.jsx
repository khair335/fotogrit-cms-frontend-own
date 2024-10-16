import { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Transition } from '@headlessui/react';

import {
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
  AiOutlineBell,
} from 'react-icons/ai';
import { Link } from 'react-router-dom';
import Tooltip from './Tooltip';
import { Dropdown, DropdownHover } from './Dropdown';

import { selectCurrentUser } from '@/services/state/authSlice';
import { logOut } from '@/services/state/authSlice';
import { useUpdateActiveEventMutation } from '@/services/api/serviceRequestApiSlice';
import { useGetMyProfileQuery } from '@/services/api/profileSettingApiSlice';

const Navbar = ({ activeSidebar, setActiveSidebar }) => {
  const [dropdownProfile, setDropdownProfile] = useState(false);
  const [dropdownNotification, setDropdownNotification] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  const { data } = useGetMyProfileQuery();
  const dataProfile = data?.data;

  const [updateActiveEvent] = useUpdateActiveEventMutation();

  const handleLogOut = async () => {
    try {
      const activeEvent = localStorage.getItem('FT-MSFTP');

      if (activeEvent) {
        let updateData = {
          user_id: user?.id,
          event_id: '',
        };

        const response = await updateActiveEvent(updateData).unwrap();

        if (!response.error) {
          localStorage.removeItem('FT-MSFTP');
        }
      }

      dispatch(logOut());
    } catch (err) {
      console.error(err);
    }
  };

  const myName =
    dataProfile?.name && dataProfile?.name?.split(' ')[0].length > 10
      ? dataProfile?.name?.split(' ')[0].substring(0, 16)
      : dataProfile?.name?.split(' ')[0];

  return (
    <nav className="bg-white shadow-xl py-[10px] px-4 pr-6 flex justify-between items-center absolute top-0 w-full z-60">
      <div className="">
        <Tooltip
          text={activeSidebar ? 'close sidebar' : 'open sidebar'}
          position="right"
        >
          <button
            className="bg-gray-400/30 p-2 rounded-[4px] text-xl"
            onClick={() => setActiveSidebar(!activeSidebar)}
          >
            {activeSidebar ? <AiOutlineMenuFold /> : <AiOutlineMenuUnfold />}
          </button>
        </Tooltip>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative">
          <button
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-400/20"
            onMouseEnter={() => setDropdownProfile(true)}
            onMouseLeave={() => setDropdownProfile(false)}
          >
            <div className="w-[30px] h-[30px] rounded-md overflow-hidden">
              <img
                src={`${
                  dataProfile?.image_profile || '/images/default-avatar.jpg'
                }`}
                alt="profile user"
                className="object-cover object-center w-full h-full"
              />
            </div>

            <h4 className="hidden mr-2 font-medium capitalize sm:flex">
              {dataProfile?.name
                ? myName
                : dataProfile?.email?.split('@')[0].split('.')[0]}
            </h4>
          </button>

          <DropdownHover
            isOpen={dropdownProfile}
            setIsOpen={setDropdownProfile}
          >
            <div className="w-[300px]">
              <div className="flex items-center w-full gap-4 px-1 py-2 rounded-sm bg-gray-300/50 ">
                <div className="w-[40px] h-[40px] rounded-md overflow-hidden">
                  <img
                    src={`${
                      dataProfile?.image_profile || '/images/default-avatar.jpg'
                    }`}
                    alt="profile user"
                    className="object-cover object-center h-full w-full"
                  />
                </div>

                <h4 className="mr-2 font-medium capitalize">
                  {dataProfile?.name
                    ? dataProfile?.name
                    : dataProfile?.email?.split('@')[0].split('.')[0]}
                </h4>
              </div>
              <Link
                to="/profile-setting"
                className="flex w-full p-2 rounded-md hover:bg-gray-400/20"
              >
                Profile Setting
              </Link>
              <button
                className="flex w-full p-2 rounded-md hover:bg-gray-400/20"
                onClick={handleLogOut}
              >
                Logout
              </button>
            </div>
          </DropdownHover>
        </div>

        {/* <div className="relative">
          <button
            className="p-2 rounded-lg hover:bg-gray-400/20"
            onClick={() => setDropdownNotification(!dropdownNotification)}
          >
            <div className="relative">
              <AiOutlineBell className="text-lg" />
              <span className="w-[6px] h-[6px] rounded-full bg-black absolute top-0 right-[2px]" />
            </div>
          </button>

          <Dropdown
            isOpen={dropdownNotification}
            setIsOpen={setDropdownNotification}
          >
            <div className="w-[300px]">
              <div className="border-b border-gray-300">
                <h5 className="p-3 font-bold ">Notifications</h5>
              </div>
              <ul>
                <li className="px-3 py-2 border-b border-gray-200 hover:bg-gray-200">
                  Lorem, ipsum dolor.
                </li>
                <li className="px-3 py-2 border-b border-gray-200 hover:bg-gray-200">
                  Lorem, ipsum dolor.
                </li>
                <li className="px-3 py-2 hover:bg-gray-200 ">
                  Lorem, ipsum dolor.
                </li>
              </ul>
            </div>
          </Dropdown>
        </div> */}

        {/* <div className="">
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="inline-flex justify-center w-full p-2 font-medium rounded-md hover:bg-gray-400/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
              <div className="relative">
                <AiOutlineBell className="text-lg" />
                <span className="w-[8px] h-[8px] rounded-full bg-ftgreen-600 border border-gray-400 absolute top-0 right-[0px]" />
              </div>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition-all duration-300 transform"
              enterFrom="opacity-0 translate-y-[-10%]"
              enterTo="opacity-100 translate-y-0"
              leave="transition-all duration-200 transform"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-[-10%]"
            >
              <Menu.Items className="absolute right-0 w-64 mt-4 origin-top-right bg-white divide-y divide-gray-500 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="p-2 ">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        className={`${
                          active ? 'bg-ftgreen-600/10' : 'text-gray-900'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        href="#"
                      >
                        Notification 1
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        className={`${
                          active ? 'bg-ftgreen-600/10' : 'text-gray-900'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        href="#"
                      >
                        Notification 2
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        className={`${
                          active ? 'bg-ftgreen-600/10' : 'text-gray-900'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        href="#"
                      >
                        Notification 3
                      </Link>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div> */}
      </div>
    </nav>
  );
};

export default Navbar;
