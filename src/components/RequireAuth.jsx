import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { IoIosWarning } from 'react-icons/io';
import { jwtDecode } from 'jwt-decode';

import {
  logOut,
  selectCurrentToken,
  selectCurrentUser,
} from '@/services/state/authSlice';
import { FaRegClock } from 'react-icons/fa';
import { Layout } from '.';

const PopUpSomethingWrong = ({ onClick, title, text, icon }) => {
  return (
    <div className="fixed inset-0 z-100 grid place-items-center bg-gray-900/70 px-6">
      <div className="max-w-md p-6 mx-auto bg-white rounded-lg">
        <div className="flex items-center justify-center text-red-500 animate-pulse">
          {icon || null}
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        <p className="my-4 text-center font-medium">{text}</p>
        <div className="flex justify-center">
          <button
            className="px-8 font-bold py-2 text-white bg-black rounded hover:bg-red-950 transition-all duration-300"
            onClick={onClick}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

const RequireAuth = () => {
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  const location = useLocation();
  const dispatch = useDispatch();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    dispatch(logOut());
  };

  const isTokenExpired = (token) => {
    if (!token) {
      // Token is not present, considered expired
      return true;
    }

    const decodedToken = jwtDecode(token);

    if (!decodedToken.exp) {
      // If expiration time is not available, considered expired
      return true;
    }

    // Obtaining expiration time in milliseconds
    const expirationTime = decodedToken.exp * 1000;

    // Obtaining current time in milliseconds
    const currentTime = new Date().getTime();

    // Comparing expiration time with current time
    return expirationTime < currentTime;
  };

  useEffect(() => {
    const isExpired = isTokenExpired(token);

    if (isExpired) {
      setShowLogoutModal(true);
    } else {
      setShowLogoutModal(false);
    }
  }, [dispatch]);

  return token ? (
    <>
      <Layout>
        <Outlet />
      </Layout>

      {showLogoutModal && (
        <PopUpSomethingWrong
          onClick={handleLogout}
          icon={<FaRegClock className="w-8 h-8 mr-2" />}
          title="Session Expired!"
          text="Your session has expired. You will be redirected to the Login page."
        />
      )}

      {user === null ? (
        <PopUpSomethingWrong
          onClick={handleLogout}
          icon={<IoIosWarning className="w-8 h-8 mr-2" />}
          title="Something Wrong!"
          text="Oops Sorry! You will be redirected to the Login page."
        />
      ) : (
        ''
      )}
    </>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
