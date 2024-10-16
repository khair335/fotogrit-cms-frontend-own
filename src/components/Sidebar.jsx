import { useEffect, useState, Fragment, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";

import {
  FaCalendarAlt,
  FaUserTie,
  FaSuitcase,
  FaWallet,
  FaSignOutAlt,
  FaMoneyBillWave,
} from "react-icons/fa";
import {
  FaCamera,
  FaCartShopping,
  FaBookmark,
  FaUserGear,
  FaUser,
  FaList,
  FaMoneyCheckDollar,
  FaFileCircleCheck,
  FaBagShopping,
  FaChartColumn,
  FaRectangleList,
} from "react-icons/fa6";
import { MdSpaceDashboard } from "react-icons/md";
import { IoIosArrowForward, IoIosConstruct } from "react-icons/io";
import { RiTeamFill } from "react-icons/ri";
import { GiTwoCoins } from "react-icons/gi";
import { TbBrandStripe } from "react-icons/tb";

import {
  logOut,
  selectCurrentModules,
  selectCurrentUser,
} from "@/services/state/authSlice";
import { Tooltip } from "@/components";
import { useUpdateActiveEventMutation } from "@/services/api/serviceRequestApiSlice";

const MenuRender = ({ item, index, isOpenDropDown, setIsOpenDropDown }) => {
  const currentPathname = window.location.pathname;

  const [isOpenSubmenuLv2, setisOpenSubmenuLv2] = useState(false);

  // If you want the dropdown to be freely open.
  // const handleToggleDropdown = () => {
  //   setIsOpenDropDown((prevOpenDropDown) => ({
  //     ...prevOpenDropDown,
  //     [index]: !prevOpenDropDown[index],
  //   }));
  //   localStorage.removeItem('ft-MS');
  // };

  // If you want to close other dropdowns when another dropdown button is clicked.
  const handleToggleDropdown = () => {
    setIsOpenDropDown((prevOpenDropDown) => {
      const updatedOpenDropDown = { ...prevOpenDropDown };
      Object.keys(updatedOpenDropDown).forEach((key) => {
        updatedOpenDropDown[key] = false;
      });
      updatedOpenDropDown[index] = !prevOpenDropDown[index];
      return updatedOpenDropDown;
    });
    localStorage.removeItem("ft-MS");
    setisOpenSubmenuLv2(false);
  };

  const handleOpenDropdownIfSubmenuClick = () => {
    setIsOpenDropDown((prevOpenDropDown) => ({
      ...prevOpenDropDown,
      [index]: true,
    }));
    localStorage.setItem("ft-MS", JSON.stringify(isOpenDropDown));
  };

  useEffect(() => {
    const storedOpenDropDown = localStorage.getItem("ft-MS");
    if (storedOpenDropDown) {
      setIsOpenDropDown(JSON.parse(storedOpenDropDown));
    }
  }, []);

  const handleToggleDropdownLv2 = (subIndex) => {
    setisOpenSubmenuLv2((prevOpenDropDown) => {
      const updatedOpenDropDown = { ...prevOpenDropDown };
      Object.keys(updatedOpenDropDown).forEach((key) => {
        updatedOpenDropDown[key] = false;
      });
      updatedOpenDropDown[subIndex] = !prevOpenDropDown[subIndex];
      return updatedOpenDropDown;
    });
    localStorage.removeItem("ft-SML2");
  };

  const handleOpenDropdownIfSubmenuLv2Click = (subIndex) => {
    setisOpenSubmenuLv2((prevOpenDropDown) => ({
      ...prevOpenDropDown,
      [subIndex]: true,
    }));
    localStorage.setItem("ft-SML2", JSON.stringify(isOpenSubmenuLv2));

    handleOpenDropdownIfSubmenuClick();
  };

  useEffect(() => {
    const storedOpenDropDownLv2 = localStorage.getItem("ft-SML2");
    if (storedOpenDropDownLv2) {
      setisOpenSubmenuLv2(JSON.parse(storedOpenDropDownLv2));
    }
  }, []);

  const isServerProd = import.meta.env.VITE_SERVER === "production";
  const isProd = item?.isProd;

  const checkMenuProd = isServerProd ? isProd === true : true;

  return (
    <div className="text-white" key={`subnav-${index}`}>
      {item?.subMenu ? (
        <>
          {checkMenuProd && (
            <>
              <button
                className="flex items-center justify-between w-full px-2 py-3 text-sm rounded-lg hover:bg-gray-300/20"
                onClick={handleToggleDropdown}
              >
                <div className="flex items-center gap-2">
                  <div className="">{item.icon}</div>
                  <span className="text-sm">{item.title}</span>
                </div>

                <IoIosArrowForward
                  className={`${
                    isOpenDropDown[index] ? "rotate-90" : ""
                  } transition-all duration-300`}
                />
              </button>
              <Transition
                as={Fragment}
                show={
                  isOpenDropDown[index] === undefined
                    ? false
                    : isOpenDropDown[index]
                }
                enter="transition-all duration-300 transform"
                enterFrom="opacity-0 translate-y-[-10%]"
                enterTo="opacity-100 translate-y-0"
                leave="transition-all duration-200 transform"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-[-10%]"
              >
                <div className="bg-black/20 rounded-lg mt-[1px]">
                  {item?.subMenu?.map((sub, subIndex) => {
                    return (
                      <div key={`sub-${subIndex}`}>
                        {sub?.subMenuLv2 ? (
                          <>
                            <button
                              className={`flex items-center justify-between w-full px-2 py-3 pl-6 text-sm rounded-lg hover:bg-gray-300/20 ${
                                isOpenSubmenuLv2[subIndex]
                                  ? "text-ftbrown font-bold"
                                  : ""
                              } `}
                              onClick={() => handleToggleDropdownLv2(subIndex)}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{sub.name}</span>
                              </div>

                              <IoIosArrowForward
                                className={`${
                                  isOpenSubmenuLv2[subIndex] ? "rotate-90" : ""
                                } transition-all duration-300`}
                              />
                            </button>

                            {isOpenSubmenuLv2[subIndex] && (
                              <div>
                                {sub?.subMenuLv2?.map((subLv2, indexLv2) => {
                                  return (
                                    <div
                                      className=""
                                      key={`subLv2-${indexLv2}-${index}`}
                                    >
                                      {subLv2?.modules?.can_menu && (
                                        <NavLink
                                          to={subLv2.url}
                                          className={({ isActive }) =>
                                            isActive
                                              ? "flex items-center justify-between py-3 px-2 text-sm rounded-lg text-ftgreen-600 pl-8 border-l-4 border-white gradient__gray"
                                              : "flex items-center justify-between py-3 px-2 text-sm rounded-lg hover:bg-gray-400/20 pl-8 hover:border-l-4 hover:border-white/40"
                                          }
                                          onClick={() =>
                                            handleOpenDropdownIfSubmenuLv2Click(
                                              subIndex
                                            )
                                          }
                                        >
                                          <div className="flex gap-0.5 items-center">
                                            <span>{subLv2.name} </span>
                                            <span className="text-orange-400 transform rotate-12 animate-pulse">
                                              {subLv2?.under_construction
                                                ? subLv2?.under_construction
                                                : null}
                                            </span>
                                          </div>

                                          {currentPathname === subLv2.url ? (
                                            <IoIosArrowForward />
                                          ) : (
                                            ""
                                          )}
                                        </NavLink>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {sub?.modules?.can_menu && (
                              <NavLink
                                to={sub.url}
                                className={({ isActive }) =>
                                  isActive
                                    ? "flex items-center justify-between py-3 px-2 text-sm rounded-lg text-ftgreen-600 pl-6 border-l-4 border-white gradient__gray"
                                    : "flex items-center justify-between py-3 px-2 text-sm rounded-lg hover:bg-gray-400/20 pl-6 hover:border-l-4 hover:border-white/40"
                                }
                                onClick={handleOpenDropdownIfSubmenuClick}
                              >
                                <div className="flex gap-0.5 items-center">
                                  <span>{sub.name} </span>
                                  <span className="text-orange-400 transform rotate-12 animate-pulse">
                                    {sub?.under_construction
                                      ? sub?.under_construction
                                      : null}
                                  </span>
                                </div>

                                {currentPathname === sub.url ? (
                                  <IoIosArrowForward />
                                ) : (
                                  ""
                                )}
                              </NavLink>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Transition>
            </>
          )}
        </>
      ) : (
        checkMenuProd && (
          <NavLink
            to={item.url}
            className={({ isActive }) =>
              isActive
                ? "text-sm flex items-center gap-2 py-3 px-2 w-full rounded-lg text-ftgreen-600 border-l-4 border-white gradient__gray"
                : "text-sm flex items-center gap-2 py-3 px-2 w-full rounded-lg hover:bg-gray-400/20 hover:border-l-4 hover:border-white/40"
            }
          >
            <div className="">{item.icon}</div>
            <span>{item.title}</span>
          </NavLink>
        )
      )}
    </div>
  );
};

const MenuIconRender = ({ item }) => {
  const [popUpMenuSidebar, setPopUpMenuSidebar] = useState(false);
  const currentPathnameIndexOne = "/" + window.location.pathname.split("/")[1];

  const [position, setPosition] = useState({ top: 0 });
  const navLinkRef = useRef(null);

  useEffect(() => {
    // Function to calculate the height of the NavLink element and set the position of the submenu
    const calculatePosition = () => {
      if (navLinkRef.current) {
        const { top } = navLinkRef.current.getBoundingClientRect();
        setPosition({ top: top });
      }
    };

    calculatePosition(); // Calculate the position when the component is loaded
    window.addEventListener("resize", calculatePosition); // Recalculate when the window is resized

    return () => {
      // Clean up event listeners when the component is no longer in use
      window.removeEventListener("resize", calculatePosition);
    };
  }, [popUpMenuSidebar]);

  const isServerProd = import.meta.env.VITE_SERVER === "production";
  const isProd = item?.isProd;

  const checkMenuProd = isServerProd ? isProd === true : true;

  return (
    <>
      {item.subMenu ? (
        <>
          {checkMenuProd && (
            <div className="relative">
              <NavLink
                ref={navLinkRef}
                to={item.url}
                className={`${
                  currentPathnameIndexOne === item.url ? "bg-gray-300/20" : ""
                } your-navlink-class flex items-center justify-center py-3 px-2 w-full rounded-lg hover:bg-gray-300/20 text-xl text-white`}
                onMouseEnter={() => setPopUpMenuSidebar(true)}
                onMouseLeave={() => setPopUpMenuSidebar(false)}
              >
                {item.icon}
              </NavLink>

              <Transition
                as={Fragment}
                show={popUpMenuSidebar}
                enter="transition-all duration-300 transform"
                enterFrom="opacity-0 translate-x-[-10%]"
                enterTo="opacity-100 translate-x-0"
                leave="transition-all duration-200 transform"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 translate-x-[-10%]"
              >
                <div
                  style={{ top: `${position.top}px` }}
                  className={`fixed top-0 left-16 bg-transparent transition-all duration-300`}
                  onMouseEnter={() => setPopUpMenuSidebar(true)}
                  onMouseLeave={() => setPopUpMenuSidebar(false)}
                >
                  <div
                    className={`bg-[#22262a] overflow-y-auto text-white p-4 shadow__great ml-[10px] rounded-lg w-[300px] relative pt-8 popup_menu_sidebar ${
                      item.title === "Settings" ? "max-h-56" : "max-h-80 "
                    }`}
                  >
                    <div className="absolute top-3 left-8">
                      <p className="text-xs text-gray-400">{item?.title}</p>
                    </div>
                    {item.subMenu.map((sub, index) => {
                      return (
                        <div key={`popUpMenu-${index}`}>
                          {sub?.subMenuLv2 ? (
                            <>
                              <span className="flex items-center gap-2 pl-6 mt-2 mb-1 text-xs text-ftbrown font-bold">
                                {sub?.name}
                              </span>

                              {sub?.subMenuLv2?.map((subMenuLv2, index) => (
                                <div className="" key={`subMenuLv2-${index}`}>
                                  {subMenuLv2?.modules?.can_menu && (
                                    <NavLink
                                      to={subMenuLv2?.url}
                                      className={({ isActive }) =>
                                        isActive
                                          ? "flex items-center justify-between py-3 px-2 text-sm rounded-lg text-ftgreen-600 pl-8 border-l-4 border-white gradient__gray"
                                          : "flex items-center justify-between py-3 px-2 text-sm rounded-lg hover:bg-gray-400/20 pl-8 hover:border-l-4 hover:border-white/40"
                                      }
                                    >
                                      <span>{subMenuLv2?.name}</span>
                                      <span className="text-orange-400 transform rotate-12 animate-pulse">
                                        {subMenuLv2?.under_construction
                                          ? subMenuLv2?.under_construction
                                          : null}
                                      </span>
                                    </NavLink>
                                  )}
                                </div>
                              ))}
                            </>
                          ) : (
                            <>
                              {sub?.modules?.can_menu && (
                                <div>
                                  <div
                                    className={`sidebar__arrow bg-[#22262a]`}
                                  />

                                  <NavLink
                                    to={sub.url}
                                    className={({ isActive }) =>
                                      isActive
                                        ? "flex items-center justify-between py-3 px-2 text-sm rounded-lg text-ftgreen-600 pl-6 border-l-4 border-white gradient__gray"
                                        : "flex items-center justify-between py-3 px-2 text-sm rounded-lg hover:bg-gray-400/20 pl-6 hover:border-l-4 hover:border-white/40"
                                    }
                                  >
                                    <span>{sub.name}</span>
                                    <span className="text-orange-400 transform rotate-12 animate-pulse">
                                      {sub?.under_construction
                                        ? sub?.under_construction
                                        : null}
                                    </span>
                                  </NavLink>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Transition>
            </div>
          )}
        </>
      ) : (
        checkMenuProd && (
          <NavLink
            to={item.url}
            className={({ isActive }) =>
              isActive
                ? "flex items-center justify-center text-xl py-3 px-2 w-full rounded-lg text-ftgreen-600 border-l-4 border-white gradient__gray"
                : "flex items-center text-white justify-center text-xl py-3 px-2 w-full rounded-lg hover:bg-gray-400/20 hover:border-l-4 hover:border-white/40"
            }
          >
            {item.icon}
          </NavLink>
        )
      )}
    </>
  );
};

const Sidebar = ({ active }) => {
  const dispatch = useDispatch();

  const [isOpenMenuDropdown, setIsOpenMenuDropdown] = useState({});

  const modules = useSelector(selectCurrentModules);
  // console.log({ modules });
  const user = useSelector(selectCurrentUser);
  const [updateActiveEvent] = useUpdateActiveEventMutation();

  const handleLogOut = async () => {
    try {
      const activeEvent = localStorage.getItem("FT-MSFTP");

      if (activeEvent) {
        let updateData = {
          user_id: user?.id,
          event_id: "",
        };

        const response = await updateActiveEvent(updateData).unwrap();

        if (!response.error) {
          localStorage.removeItem("FT-MSFTP");
        }
      }

      dispatch(logOut());
    } catch (err) {
      console.error(err);
    }
  };

  // Force logout if the user does not have modules
  if (!modules) {
    handleLogOut();
    return;
  }

  const canAccessDashboard = true; // dashboard

  const canAccessEventMaster =
    modules[0]?.can_menu || // event-requested
    modules[1]?.can_menu || // event-group
    modules[2]?.can_menu || // events
    modules[3]?.can_menu; // Assignment

  const canAccessEventManagement = true;
  const canAccessDonationManagement = true;

  const canAccessPhotographerManagement =
    modules[25]?.can_menu || // request-other-service
    modules[26]?.can_menu || // add/modify-my-service
    modules[27]?.can_menu || // event-checking
    modules[28]?.can_menu; // manage-service-request

  const canAccessWalletManagement = modules[37]?.can_menu; // service transaction
  // const canAccessCompensation = true;

  const canAccessApprovalManagement =
    modules[24]?.can_menu || // Approval-wallet-benefit-code
    modules[6]?.can_menu; // Approval-visibility-service

  const canAccessCommerseSetting =
    modules[8]?.can_menu || // general-setting
    modules[22]?.can_menu || // wallet-amount
    modules[23]?.can_menu || // referral
    modules[41]?.can_menu || // coin-management
    modules[37]?.can_menu; // wallet-management

  const canAccessOrder = modules[16]?.can_menu; // order
  const canAccessTeamMaster = modules[10]?.can_menu; // team-master
  const canAccessCoinManagement = modules[41]?.can_menu; // coins-management

  const canAccessUserCMSManagement =
    modules[11]?.can_menu || // user-role
    modules[12]?.can_menu; // admin/user data

  const canAccessCustomerManagement = modules[13]?.can_menu; // customer-data

  const canAccessClubManagement =
    modules[15]?.can_menu || modules[10]?.can_menu; // club

  const canAccessOthers =
    modules[14]?.can_menu || // event type
    modules[19]?.can_menu || // age group
    modules[17]?.can_menu || // app-setting
    modules[38]?.can_menu || // event-match-category
    modules[39]?.can_menu || // event-match-pool
    modules[40]?.can_menu; // main-position

  const canAccessPaymentCart = modules[31]?.can_menu; // payment & cart
  const canAccessReports = modules[43]?.can_menu; // reports > transaction
  const canAccessSponsor = modules[42]?.can_menu; // sponsor

  const modulesDummy = {
    can_menu: true,
    can_add: true,
    can_delete: true,
    can_edit: true,
  };

  const sidebarLinks = [
    {
      title: "Home",
      icon: <MdSpaceDashboard />,
      url: "/",
      modules: canAccessDashboard,
      isProd: true,
    },
    {
      title: "Events",
      icon: <FaCalendarAlt />,
      url: "/event-master",
      modules: canAccessEventMaster,
      isProd: true,
      subMenu: [
        {
          name: "Event Group",
          url: "/event-master/event-group",
          modules: modules[1],
        },
        {
          name: "Events",
          url: "/event-master/events",
          modules: modules[2],
        },
      ],
    },
    // {
    //   title: 'Event Management',
    //   icon: <FaRectangleList />,
    //   url: '/event-management',
    //   modules: canAccessEventManagement,
    //   isProd: false,
    //   subMenu: [
    //     {
    //       name: 'Other Event',
    //       url: '/event-management/other-event',
    //       subMenuLv2: [
    //         {
    //           name: 'Register Other Event',
    //           url: '/event-management/other-event/register-other',
    //           modules: modules[26],
    //         },
    //         {
    //           name: 'Manage Other Event',
    //           url: '/event-management/other-event/manage-other',
    //           modules: modules[26],
    //         },
    //         {
    //           name: 'Result of Other Event',
    //           url: '/event-management/other-event/result-other',
    //           modules: modules[26],
    //         },
    //       ],
    //     },
    //     {
    //       name: 'My Own Event',
    //       url: '/event-management/my-own-event',
    //       subMenuLv2: [
    //         {
    //           name: 'Create Event Group',
    //           url: '/event-management/my-own-event/create-event-group',
    //           modules: modulesDummy,
    //         },
    //         {
    //           name: 'Manage Request / Invitation',
    //           url: '/event-management/my-own-event/manage-request-invitation',
    //           modules: modulesDummy,
    //         },
    //         {
    //           name: 'Manage Requirements',
    //           url: '/event-management/my-own-event/manage-requirements',
    //           modules: modulesDummy,
    //         },
    //         {
    //           name: 'Manage Own Event',
    //           url: '/event-management/my-own-event/manage-own-event',
    //           modules: modulesDummy,
    //         },
    //         {
    //           name: 'Result of Own Event',
    //           url: '/event-management/my-own-event/result-of-own-event',
    //           modules: modulesDummy,
    //         },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   title: 'Donation Management',
    //   icon: <FaMoneyBillWave />,
    //   url: '/donation-management',
    //   modules: canAccessDonationManagement,
    //   isProd: false,
    //   subMenu: [
    //     {
    //       name: 'Donate to Others',
    //       url: '/donation-management/donate-to-others',
    //       modules: modulesDummy,
    //     },

    //     {
    //       name: 'My Donation',
    //       url: '/donation-management/my-own-event',
    //       subMenuLv2: [
    //         {
    //           name: 'Add New Request',
    //           url: '/donation-management/my-donation/add-new-request',
    //           modules: modulesDummy,
    //         },
    //         {
    //           name: 'Manage My Donation',
    //           url: '/donation-management/my-donation/manage-my-donation',
    //           modules: modulesDummy,
    //         },
    //       ],
    //     },
    //   ],
    // },

    {
      title: "Club & Teams",
      icon: <RiTeamFill />,
      url: "/club-management",
      modules: canAccessClubManagement,
      isProd: true,
      subMenu: [
        {
          name: "Club Management",
          url: "/club-management/modify-club",
          modules: modules[15],
        },
        {
          name: "Team Management",
          url: "/club-management/team-master",
          modules: modules[10],
        },
        // {
        //   name: 'Approval of clubs',
        //   url: '/club-management/approval-clubs',
        //   modules: modules[12],
        // },
      ],
    },
    {
      title: "Customers & Users",
      icon: <FaUserGear />,
      url: "/customer-user",
      modules: canAccessUserCMSManagement,
      isProd: true,
      subMenu: [
        {
          name: "User Management",
          icon: <FaSuitcase />,
          url: "/cms-management",
          modules: canAccessUserCMSManagement,
          isProd: true,
          subMenuLv2: [
            {
              name: "User Role",
              url: "/cms-management/user-role",
              modules: modules[11],
            },
            {
              name: "User Data",
              url: "/cms-management/user-data",
              modules: modules[12],
            },
          ],
        },

        {
          name: "Customer Management",
          icon: <FaUser />,
          url: "/customer-management",
          modules: canAccessCustomerManagement,
          isProd: true,
          subMenuLv2: [
            {
              name: "Customer Data",
              url: "/customer-management/customer-data",
              modules: modules[13],
            },
          ],
        },
      ],
    },
    {
      title: "Services",
      icon: <FaUserTie />,
      url: "/service-management",
      modules: canAccessPhotographerManagement,
      isProd: true,
      subMenu: [
        {
          name: "Request Other Service",
          url: "/service-management/request-other-service",
          modules: modules[25],
        },
        {
          name: "My Services",
          url: "/service-management/my-services",
          subMenuLv2: [
            {
              name: "Add/Modify My Service",
              url: "/service-management/my-services/add-modify",
              modules: modules[26],
            },
            {
              name: "Manage Service Request",
              url: "/service-management/my-services/manage-request",
              modules: modules[28],
            },
            {
              name: "Event Checking",
              url: "/service-management/my-services/event-checking",
              modules: modules[27],
            },
          ],
        },
      ],
    },
    // {
    //   title: 'Equipment Management',
    //   icon: <FaCamera />,
    //   url: '/equipment-management',
    //   modules: canAccessEquipmentManagement,
    //   isProd: false,
    //   subMenu: [
    //     {
    //       name: 'Request Equipment',
    //       url: '/equipment-management/request-equipment',
    //       modules: modulesDummy,
    //       under_construction: <IoIosConstruct />,
    //     },
    //     {
    //       name: 'My Equipment',
    //       url: '/equipment-management/my-equipment',
    //       subMenuLv2: [
    //         {
    //           name: 'Add/Modify My Equipment',
    //           url: '/equipment-management/my-services/add-equipment',
    //           modules: modulesDummy,
    //           under_construction: <IoIosConstruct />,
    //         },
    //         {
    //           name: 'Manage Rental Request',
    //           url: '/equipment-management/my-services/manage-request',
    //           modules: modulesDummy,
    //           under_construction: <IoIosConstruct />,
    //         },
    //       ],
    //     },
    //   ],
    // },

    // {
    //   title: 'User CMS Management',
    //   icon: <FaUserGear />,
    //   url: '/cms-management',
    //   modules: canAccessUserCMSManagement,
    //   isProd: true,
    //   subMenu: [
    //     {
    //       name: 'User Role',
    //       url: '/cms-management/user-role',
    //       modules: modules[11],
    //     },
    //     {
    //       name: 'User Data',
    //       url: '/cms-management/user-data',
    //       modules: modules[12],
    //     },
    //   ],
    // },

    {
      title: "Sponsors",
      icon: <TbBrandStripe />,
      url: "/sponsor-master",
      modules: canAccessSponsor,
      isProd: true,
    },

    {
      title: "Wallet & Coins",
      icon: <GiTwoCoins />,
      url: "/wallet-coin",
      modules: canAccessCommerseSetting,
      isProd: true,
      subMenu: [
        {
          name: "Coin Management",
          // icon: <GiTwoCoins />,
          url: "/commerce-setting/coin-management",
          modules: modules[41],
          // isProd: true,
        },
        {
          name: "Wallet Management",
          url: "/commerce-setting/service-transaction",
          modules: modules[37],
        },
      ],
    },
    {
      title: "Reports",
      icon: <FaChartColumn />,
      url: "/reports",
      modules: canAccessReports,
      isProd: true,
      subMenu: [
        // {
        //   name: 'Dashboard',
        //   url: '/reports/dashboard',
        //   modules: modulesDummy, // ganti ini jika sudah ada modulesnya
        //   under_construction: <IoIosConstruct />,
        // },
        {
          name: "Order",
          // icon: <FaBagShopping />,
          url: "/reports/order",
          modules: modules[16],
          // isProd: true,
        },
        {
          name: "Transaction",
          url: "/reports/transaction",
          modules: modules[43], // rule_code: transaction
        },
        // {
        //   name: 'Users',
        //   url: '/reports/users',
        //   modules: modulesDummy, // ganti ini jika sudah ada modulesnya
        //   under_construction: <IoIosConstruct />,
        // },
      ],
    },
    {
      title: "Approvals",
      icon: <FaFileCircleCheck />,
      url: "/approval-management",
      modules: canAccessApprovalManagement,
      isProd: true,
      subMenu: [
        // {
        //   name: 'Approval Price',
        //   url: '/approval-management/price',
        //   modules: modulesDummy, // ganti ini jika sudah ada modulesnya
        //   under_construction: <IoIosConstruct />,
        // },
        // DEV
        {
          name: "Approval & Visibility Service",
          url: "/approval-management/visibilty-service",
          modules: modules[6],
        },
        // {
        //   name: 'Approval & Visibility Equipment',
        //   url: '/approval-management/visibilty-equipment',
        //   modules: modulesDummy, // ganti ini jika sudah ada modulesnya
        //   under_construction: <IoIosConstruct />,
        // },
        // {
        //   name: 'Approval Wallet',
        //   url: '/approval-management/wallet',
        //   modules: modulesDummy, // ganti ini jika sudah ada modulesnya
        //   under_construction: <IoIosConstruct />,
        // },
        {
          name: "Approval Wallet Benefits",
          url: "/approval-management/wallet-benefits",
          modules: modules[24],
        },
      ],
    },
    {
      title: "Payment / Cart",
      icon: <FaCartShopping />,
      url: "/payment-and-cart",
      modules: canAccessPaymentCart,
      isProd: true,
    },
    // {
    //   title: 'Wallet Management',
    //   icon: <FaWallet />,
    //   url: '/wallet-management',
    //   modules: canAccessWalletManagement,
    //   isProd: true,
    //   subMenu: [

    // {
    //   name: 'Top Up',
    //   url: '/wallet-management/topup',
    //   modules: modulesDummy, // ganti ini jika sudah ada modulesnya
    //   under_construction: <IoIosConstruct />,
    // },
    // {
    //   name: 'Withdraw Wallet to Bank',
    //   url: '/wallet-management/withdraw-wallet-to-bank',
    //   modules: modulesDummy, // ganti ini jika sudah ada modulesnya
    //   under_construction: <IoIosConstruct />,
    // },
    // {
    //   name: 'Change Wallet Amount',
    //   url: '/wallet-management/change-wallet',
    //   modules: modulesDummy, // ganti ini jika sudah ada modulesnya
    //   under_construction: <IoIosConstruct />,
    // },
    //   ],
    // },
    // {
    //   title: 'Compensation',
    //   icon: <FaMoneyCheckDollar />,
    //   url: '/compensation',
    //   modules: canAccessCompensation,
    //   isProd: false,
    //   subMenu: [
    //     {
    //       name: 'Submenu 1',
    //       url: '/compensation/submenu-1',
    //       modules: modules[8], // general-setting, ganti ini jika sudah ada modulesnya
    //       under_construction: <IoIosConstruct />,
    //     },
    //   ],
    // },

    // {
    //   title: 'Coin Management',
    //   icon: <GiTwoCoins />,
    //   url: '/coin-management',
    //   modules: canAccessCoinManagement,
    //   isProd: true,
    // },

    {
      title: "Settings",
      icon: <FaList />,
      url: "/others",
      modules: canAccessOthers,
      isProd: true,
      subMenu: [
        // {
        //   name: 'Tool Type',
        //   url: '/others/tool-type',
        //   modules: modulesDummy,
        //   under_construction: <IoIosConstruct />,
        // },
        // {
        //   name: 'Watermark Setting',
        //   url: '/others/watermark-setting',
        //   modules: modulesDummy,
        //   under_construction: <IoIosConstruct />,
        // },
        {
          name: "App Setting",
          url: "/others/app-setting",
          modules: modules[17],
        },

        {
          name: "General Settings",
          icon: <FaSuitcase />,
          url: "/general-setting",
          modules: canAccessCommerseSetting,
          isProd: true,
          subMenuLv2: [
            {
              name: "Event Type",
              url: "/others/event-type",
              modules: modules[14], // event-type
            },
            {
              name: "Age Group",
              url: "/others/age-group",
              modules: modules[19], // age-group
            },
            // {
            //   name: 'Pool',
            //   url: '/others/pool',
            //   modules: modules[39], // event_match_pool
            // },
            {
              name: "Event Match",
              url: "/others/event-match",
              modules: modules[38], // event_match_category
            },
            {
              name: "Main Position",
              url: "/others/main-position",
              modules: modules[40], // main-position
            },
          ],
        },
        {
          name: "Commerce Setting",
          icon: <FaSuitcase />,
          url: "/commerce-setting",
          modules: canAccessCommerseSetting,
          isProd: true,
          subMenuLv2: [
            {
              name: "General Setting",
              url: "/commerce-setting/general",
              modules: modules[8],
            },
            // {
            //   name: 'Add/Modify User Benefits & Code',
            //   url: '/commerce-setting/user-benefits-and-code',
            //   modules: modulesDummy,
            //   under_construction: <IoIosConstruct />,
            // },
            {
              name: "Add/Modify Wallet Benefits Code",
              url: "/commerce-setting/wallet-benefits-code",
              modules: modules[23],
            },
            {
              name: "Add/Modify Top Up",
              url: "/commerce-setting/modify-topup",
              modules: modules[22],
            },
          ],
        },
      ],
    },
  ];

  return (
    <section
      className={`sidebar gradient__great ${
        active
          ? "w-[240px] overflow-y-auto"
          : "w-16 overflow-y-auto overflow-x-visible"
      }  h-screen transition-all duration-300 fixed top-0 left-0 z-70`}
    >
      {active ? (
        <div className="relative">
          <div className="sticky top-0 left-0 z-50 w-full gradient__great-1 ">
            <div className="w-[120px] h-[170px] mx-auto py-6 ">
              <Link to="/">
                <img
                  src="/images/logo-fotogrit.png"
                  alt="logo fotogrit"
                  className="object-cover w-full"
                />
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-[1px] px-[1px] w-[90%] mx-auto ">
            {sidebarLinks?.map((item, index) => {
              return (
                <div key={`subMenu-${index}`}>
                  {item?.modules && (
                    <MenuRender
                      item={item}
                      index={index}
                      isOpenDropDown={isOpenMenuDropdown}
                      setIsOpenDropDown={setIsOpenMenuDropdown}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className=" px-[1px] w-[90%] mx-auto mt-20 mb-4">
            <button
              className="flex items-center justify-between w-full px-2 py-3 text-sm text-white rounded-lg hover:bg-gray-300/20 hover:text-red-200"
              onClick={handleLogOut}
            >
              <div className="flex items-center gap-2">
                <FaSignOutAlt />
                <span className="text-sm">Logout</span>
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-between h-full">
          <div className="">
            <div className="sticky top-0 left-0 z-50 w-full h-[80px] gradient__great-1 mb-4">
              <div className="w-[40px] h-[50px] mx-auto py-6 ">
                <Link to="/">
                  <img
                    src="/images/logo-fotogrit.png"
                    alt="logo fotogrit"
                    className="object-cover w-full"
                  />
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-[1px] px-[1px] w-[90%] mx-auto">
              {sidebarLinks.map((item, index) => (
                <div key={`menuIcon-${index}`}>
                  {item?.modules && <MenuIconRender item={item} />}
                </div>
              ))}
            </div>
          </div>

          <div className=" w-[40px] h-[50px] mx-auto mt-36 mb-2">
            <Tooltip position="top" text="Logout">
              <button
                className="flex items-center justify-center w-full px-2 py-3 text-xl text-white rounded-lg hover:bg-gray-300/20"
                onClick={handleLogOut}
              >
                <FaSignOutAlt />
              </button>
            </Tooltip>
          </div>
        </div>
      )}
    </section>
  );
};

export default Sidebar;
