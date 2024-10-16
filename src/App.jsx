import "react-toastify/dist/ReactToastify.css";

import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";

import { selectCurrentModules } from "./services/state/authSlice";

import { RequireAuth } from "./components";

import Order from "./pages/Order";
import NotFound from "./pages/404";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventGroup from "./pages/EventGroup";
import GeneralSetting from "./pages/GeneralSetting";
import TeamMaster from "./pages/TeamMaster";
import UnderConstruction from "./pages/UnderConstruction";
import UserRole from "./pages/UserRole";
import UserData from "./pages/UserData";
import OthersAppSetting from "./pages/OthersAppSetting";
import CustomerData from "./pages/CustomerData";
import StreamContabo from "./pages/StreamContabo";
import ModifyTopUp from "./pages/ModifyTopUp";
import WalletBenefitsCode from "./pages/WalletBenefitsCode";
import ApprovalWalletBenefits from "./pages/ApprovalWalletBenefits";
import ServiceRequest from "./pages/ServiceRequest";
import ServiceEventChecking from "./pages/ServiceEventChecking";
import ServiceAddModify from "./pages/ServiceAddModify";
import ServiceManageRequest from "./pages/ServiceManageRequest";
import ApprovalVisibiltyService from "./pages/ApprovalVisibiltyService";
import PaymentCart from "./pages/PaymentCart";
import WalletServiceTransaction from "./pages/WalletServiceTransaction";
import ReportTransaction from "./pages/ReportTransaction";
import ReportUser from "./pages/ReportUser";
import Topup from "./pages/Topup";
import WithdrawWallet from "./pages/WithdrawWallet";
import ChangeWallet from "./pages/ChangeWallet";
import EquipmentAddModify from "./pages/EquipmentAddModify";
import OthersEventType from "./pages/OthersEventType";
import OthersToolType from "./pages/OthersToolType";
import OthersWatermarkSetting from "./pages/OthersWatermarkSetting";
import UserBenefitsCode from "./pages/UserBenefitsCode";
import EquipmentRequest from "./pages/EquipmentRequest";
import EquipmentManageRequest from "./pages/EquipmentManageRequest";
import ProfileSetting from "./pages/ProfileSetting";
import ApprovalClub from "./pages/ApprovalClub";
import ClubData from "./pages/ClubData";
import EventRegisterOther from "./pages/EventRegisterOther";
import EventManageOther from "./pages/EventManageOther";
import EventResultOther from "./pages/EventResultOther";
import EventCreateEventGroup from "./pages/EventCreateEventGroup";
import EventManageRequestInvitation from "./pages/EventManageRequestInvitation";
import EventManageOwnEvent from "./pages/EventManageOwnEvent";
import EventManageRequirement from "./pages/EventManageRequirement";
import DonationDonateOthers from "./pages/DonationDonateOthers";
import DonationNewRequest from "./pages/DonationNewRequest";
import DonationManageMyDonation from "./pages/DonationManageMyDonation";
import EventResultOwnEvent from "./pages/EventResultOwnEvent";
import OthersAgeGroup from "./pages/OthersAgeGroup";
import OthersPool from "./pages/OthersPool";
import OthersEventMatch from "./pages/OthersEventMatch";
import OthersMainPosition from "./pages/OthersMainPosition";
import CoinManagement from "./pages/CoinManagement";
import ReportDashboard from "./pages/ReportDashboard";
import SponsorMaster from "./pages/SponsorMaster";

function App() {
  const modules = useSelector(selectCurrentModules);
  const isPermission = modules ? modules : [];

  const isNotProduction = import.meta.env.VITE_SERVER !== "production";

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* protected routes */}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Home />} />
          <Route path="/event-master">
            {isPermission[1]?.can_menu && (
              <>
                <Route index element={<EventGroup />} />
                <Route path="event-group" element={<EventGroup />} />
              </>
            )}
            {isPermission[2]?.can_menu && (
              <Route path="events" element={<Events />} />
            )}
          </Route>
          {/* dev */}
          {isNotProduction && (
            <Route path="/event-management">
              <Route index element={<EventRegisterOther />} />

              <Route path="other-event">
                <Route path="register-other" element={<EventRegisterOther />} />
                <Route path="manage-other" element={<EventManageOther />} />
                <Route path="result-other" element={<EventResultOther />} />
              </Route>

              <Route path="my-own-event">
                <Route
                  path="create-event-group"
                  element={<EventCreateEventGroup />}
                />
                <Route
                  path="manage-request-invitation"
                  element={<EventManageRequestInvitation />}
                />
                <Route
                  path="manage-requirements"
                  element={<EventManageRequirement />}
                />
                <Route
                  path="manage-own-event"
                  element={<EventManageOwnEvent />}
                />
                <Route
                  path="result-of-own-event"
                  element={<EventResultOwnEvent />}
                />
              </Route>
            </Route>
          )}
          {/* dev */}
          {isNotProduction && (
            <Route path="/donation-management">
              <Route index element={<DonationDonateOthers />} />
              <Route
                path="donate-to-others"
                element={<DonationDonateOthers />}
              />
              <Route path="my-donation">
                <Route
                  path="add-new-request"
                  element={<DonationNewRequest />}
                />

                <Route
                  path="manage-my-donation"
                  element={<DonationManageMyDonation />}
                />
              </Route>
            </Route>
          )}

          <Route path="/service-management">
            {isPermission[25]?.can_menu && (
              <>
                <Route index element={<ServiceRequest />} />
                <Route
                  path="request-other-service"
                  element={<ServiceRequest />}
                />
              </>
            )}

            <Route path="my-services">
              {isPermission[26]?.can_menu && (
                <>
                  <Route index element={<ServiceAddModify />} />
                  <Route path="add-modify" element={<ServiceAddModify />} />
                </>
              )}

              {isPermission[27]?.can_menu && (
                <Route
                  path="event-checking"
                  element={<ServiceEventChecking />}
                />
              )}
              {isPermission[28]?.can_menu && (
                <Route
                  path="manage-request"
                  element={<ServiceManageRequest />}
                />
              )}
            </Route>
          </Route>

          {/* dev */}
          {/* <Route path="/equipment-management">
            <Route index element={<EquipmentRequest />} />
            <Route path="request-equipment" element={<EquipmentRequest />} />

            <Route path="my-services">
              <Route index element={<EquipmentAddModify />} />
              <Route path="add-equipment" element={<EquipmentAddModify />} />
              <Route
                path="manage-request"
                element={<EquipmentManageRequest />}
              />
            </Route>
          </Route> */}
          <Route path="/cms-management">
            {isPermission[11]?.can_menu && (
              <>
                <Route index element={<UserRole />} />
                <Route path="user-role" element={<UserRole />} />
              </>
            )}

            {isPermission[12]?.can_menu && (
              <Route path="user-data" element={<UserData />} />
            )}
          </Route>

          {isPermission[31]?.can_menu && (
            <Route path="/payment-and-cart" element={<PaymentCart />} />
          )}

          <Route path="/wallet-management">
            <Route index element={<WalletServiceTransaction />} />

            {/* <Route path="topup" element={<Topup />} />
              <Route
                path="withdraw-wallet-to-bank"
                element={<WithdrawWallet />}
              />
              <Route path="change-wallet" element={<ChangeWallet />} /> */}
          </Route>

          {/* <Route path="/compensation">
            <Route index element={<UnderConstruction />} />
            <Route path="submenu-1" element={<UnderConstruction />} />
          </Route> */}
          <Route path="/approval-management">
            <Route index element={<ApprovalWalletBenefits />} />
            {isPermission[24]?.can_menu && (
              <Route
                path="wallet-benefits"
                element={<ApprovalWalletBenefits />}
              />
            )}
            {isPermission[6]?.can_menu && (
              <Route
                path="visibilty-service"
                element={<ApprovalVisibiltyService />}
              />
            )}

            {/* <Route path="visibilty-equipment" element={<UnderConstruction />} />
            <Route path="wallet" element={<UnderConstruction />} />
            <Route path="price" element={<UnderConstruction />} /> */}
          </Route>

          <Route path="/commerce-setting">
            {isPermission[8]?.can_menu && (
              <>
                <Route index element={<GeneralSetting />} />
                <Route path="general" element={<GeneralSetting />} />
              </>
            )}

            {/* dev */}
            {/* <Route
              path="user-benefits-and-code"
              element={<UserBenefitsCode />}
            /> */}

            {isPermission[23]?.can_menu && (
              <Route
                path="wallet-benefits-code"
                element={<WalletBenefitsCode />}
              />
            )}
            {isPermission[22]?.can_menu && (
              <Route path="modify-topup" element={<ModifyTopUp />} />
            )}
            {isPermission[41]?.can_menu && (
              <Route path="coin-management" element={<CoinManagement />} />
            )}
            {isPermission[37]?.can_menu && (
              <Route
                path="service-transaction"
                element={<WalletServiceTransaction />}
              />
            )}
          </Route>

          {isPermission[13]?.can_menu && (
            <Route path="/customer-management">
              <Route index element={<CustomerData />} />
              <Route path="customer-data" element={<CustomerData />} />
            </Route>
          )}
          {isPermission[15]?.can_menu && (
            <Route path="/club-management">
              <Route index element={<ClubData />} />
              <Route path="modify-club" element={<ClubData />} />
              {isPermission[10]?.can_menu && (
                <Route path="team-master" element={<TeamMaster />} />
              )}
              {/* <Route path="approval-clubs" element={<ApprovalClub />} /> */}
            </Route>
          )}
          {isPermission[42]?.can_menu && (
            <Route path="/sponsor-master" element={<SponsorMaster />} />
          )}
          <Route path="/others">
            {isPermission[17]?.can_menu && (
              <>
                <Route index element={<OthersAppSetting />} />
                <Route path="app-setting" element={<OthersAppSetting />} />
              </>
            )}

            {isPermission[14]?.can_menu && (
              <Route path="event-type" element={<OthersEventType />} />
            )}
            {isPermission[19]?.can_menu && (
              <Route path="age-group" element={<OthersAgeGroup />} />
            )}

            {isPermission[39]?.can_menu && (
              <Route path="pool" element={<OthersPool />} />
            )}
            {isPermission[38]?.can_menu && (
              <Route path="event-match" element={<OthersEventMatch />} />
            )}
            {isPermission[40]?.can_menu && (
              <Route path="main-position" element={<OthersMainPosition />} />
            )}
            {/* dev */}
            {/*
            <Route path="tool-type" element={<OthersToolType />} />
            <Route
              path="watermark-setting"
              element={<OthersWatermarkSetting />}
            /> */}
          </Route>

          {/* dev */}

          <Route path="/reports">
            <Route index element={<ReportTransaction />} />
            <Route path="transaction" element={<ReportTransaction />} />
            {/* <Route path="dashboard" element={<ReportDashboard />} /> */}
            {/* <Route path="users" element={<ReportUser />} /> */}
            {isPermission[16]?.can_menu && (
              <Route path="order" element={<Order />} />
            )}
          </Route>

          <Route path="/profile-setting" element={<ProfileSetting />} />
          <Route path="/under-construction" element={<UnderConstruction />} />
          <Route path="/*" element={<NotFound />} />
          {isPermission && isPermission[20]?.can_menu && (
            <Route path="/stream-contabo" element={<StreamContabo />} />
          )}
        </Route>
      </Routes>

      <ToastContainer />
    </>
  );
}

export default App;
