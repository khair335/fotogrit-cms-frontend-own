// Need to use the React-specific entry point to import createApi
import getApiUrl from '@/helpers/GetApiUrl';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = getApiUrl;

// Define a service using a base URL and expected endpoints
export const apiCore = createApi({
  reducerPath: 'apiCore',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}`,
    // credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      let token = getState().auth.token;

      if (token) {
        headers.set('X-TOKEN', `${token}`);
      }

      return headers;
    },
  }),
  tagTypes: [
    'User',
    'EventGroup',
    'Events',
    'City',
    'UserRole',
    'UserData',
    'CustomerData',
    'AppSetting',
    'GeneralSetting',
    'Orders',
    'TeamMaster',
    'Wallet',
    'ServiceRequest',
    'Equipment',
    'ProfileSetting',
    'PaymentCart',
    'ClubMaster',
    'Others',
    'CoinManagement',
  ],
  endpoints: () => ({}),
});
