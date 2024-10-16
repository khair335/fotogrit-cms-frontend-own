import { apiCore } from './apiCore';

export const authApiSlice = apiCore.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/pub/api/v1/login',
        method: 'POST',
        body: { ...credentials },
      }),
    }),
    getMe: builder.query({
      query: () => `/restricted/api/v1/client/profile`,
    }),
  }),
});

export const { useLoginMutation, useGetMeQuery } = authApiSlice;
