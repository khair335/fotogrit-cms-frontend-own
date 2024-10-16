import { Suspense, lazy, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PiWarningBold } from 'react-icons/pi';

const LazyLayoutLogin = lazy(() => import('@/components/login/Layout'));
const LazyLogo = lazy(() => import('@/components/login/Logo'));
const LazyFormSignIn = lazy(() => import('@/components/login/FormSignIn'));

import { Button, PopUp } from '../components';
import { SkeletonLayoutLogin } from '@/components/Skeleton';

import { selectCurrentToken } from '@/services/state/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useSelector(selectCurrentToken);

  const [isOpenPopupNoAccess, setIsOpenPopupNoAccess] = useState(false);

  const menuParam = new URLSearchParams(location.search).get('menu');
  const isLoginPage = location.pathname === '/login';
  const hasToken = !!token;

  const handleNavigation = () => {
    switch (menuParam) {
      case 'referral':
        navigate('/approval-management/wallet-benefits');
        break;
      case 'request order photographer':
        navigate('/service-management/request-other-service?subcontract=true');
        break;
      case 'event approval':
        navigate('/service-management/my-services/event-checking');
        break;
      case 'request offer service':
        navigate('/approval-management/visibilty-service');
        break;
      case 'service received':
        navigate('/service-management/my-services/add-modify');
        break;
      case 'permintaan service':
        navigate('/service-management/my-services/add-modify');
        break;
      case 'photographer menerima penugasan':
        navigate('/service-management/request-other-service');
        break;
      case 'photographer menolak penugasan':
        navigate('/service-management/request-other-service?subcontract=true');
        break;
      case 'update':
        navigate('/approval-management/wallet');
        break;
      case 'new contract':
        navigate('/service-management/request-other-service?my-contract=true');
        break;
      default:
        navigate('/');
    }
  };

  useEffect(() => {
    if (isLoginPage && hasToken) {
      handleNavigation();
    }
  }, [isLoginPage, hasToken]);

  return (
    <>
      <Suspense fallback={<SkeletonLayoutLogin />}>
        <LazyLayoutLogin>
          <div className="md:w-[400px] lg:w-[370px]">
            <div className="w-[160px] md:w-[250px] lg:w-[150px] mx-auto mb-2 md:mb-6">
              <LazyLogo />
            </div>

            <div className="w-full h-full bg-[#272B30]/60 backdrop-blur rounded-[20px] p-6">
              <div className="">
                <h3
                  className={`font-bold text-ftgreen-600 text-[20px] mb-4 text-center`}
                >
                  Sign In
                </h3>

                <LazyFormSignIn
                  handleNavigation={handleNavigation}
                  setIsOpenPopupNoAccess={setIsOpenPopupNoAccess}
                />
              </div>
            </div>
          </div>
        </LazyLayoutLogin>
      </Suspense>

      {/* POPUP CAN'T LOGIN */}
      <PopUp
        isOpenPopUp={isOpenPopupNoAccess}
        setIsOpenPopUp={setIsOpenPopupNoAccess}
      >
        <div className="">
          <div className="flex items-center justify-center w-16 h-16 p-2 mx-auto mb-2 rounded-full bg-red-200/50">
            <PiWarningBold className="text-red-500 text-7xl animate-pulse" />
          </div>
          <h2 className="max-w-md mb-1 font-bold text-base text-center text-gray-600">
            Oops! An Error Occurred
          </h2>
          <p className="max-w-sm mb-1 font-medium text-center text-gray-600">
            Sorry, you don&apos;t have permission to access this page.
          </p>

          <div className="flex items-center justify-center mt-4">
            <Button
              background="black"
              className="w-20"
              onClick={() => setIsOpenPopupNoAccess(false)}
            >
              Ok
            </Button>
          </div>
        </div>
      </PopUp>
      {/* END POPUP CAN'T LOGIN */}
    </>
  );
};

export default Login;
