import { apiCore } from './apiCore';

export const appSettingApiSlice = apiCore.injectEndpoints({
  endpoints: (builder) => ({
    getAppSetting: builder.query({
      query: () => `/pub/api/v1/app/settings`,
      providesTags: ['AppSetting'],
    }),
    updateAppSetting: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/app/settings`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['AppSetting'],
    }),
  }),
});

export const { useGetAppSettingQuery, useUpdateAppSettingMutation } =
  appSettingApiSlice;
