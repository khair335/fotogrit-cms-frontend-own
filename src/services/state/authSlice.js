import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const getUserFromCookies = () => {
  const user = Cookies.get('ft-user');
  return user ? JSON.parse(user) : null;
};
const getModulesFromCookies = () => {
  const modules = localStorage.getItem('ft-modules');
  return modules ? JSON.parse(modules) : null;
};
const getTokenFromCookies = () => {
  const token = Cookies.get('ft-token');
  return token ? token : null;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getUserFromCookies(),
    token: getTokenFromCookies(),
    modules: getModulesFromCookies(),
  },
  reducers: {
    setCredentials: (state, action) => {
      const payload = action.payload;
      const data = payload?.data?.data;
      state.user = data?.profile;
      state.modules = data?.modules;
      state.token = data?.token;

      // Save user & token to cookies with expiration
      const expireDays = 3; // Set the desired expiration days
      const cookieOptions = { expires: expireDays };
      // const expireMinutes = 1; // Set the desired expiration minutes
      // const cookieOptions = {
      //   expires: new Date(Date.now() + expireMinutes * 60 * 1000),
      // };

      Cookies.set('ft-user', JSON.stringify(data?.profile), cookieOptions);
      Cookies.set('ft-token', data?.token, cookieOptions);
      localStorage.setItem('ft-modules', JSON.stringify(data?.modules));
      localStorage.removeItem('ft-MS');
    },
    logOut: (state) => {
      state.user = {};
      state.token = null;

      // Remove user & token from cookies
      Cookies.remove('ft-user');
      Cookies.remove('ft-token');
      localStorage.removeItem('ft-modules');
      window.location.href = '/login';
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentModules = (state) => state.auth.modules;
export const selectCurrentToken = (state) => state.auth.token;
