import { apiCore } from './apiCore';

export const profileSettingApiSlice = apiCore.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query({
      query: () => `/restricted/api/v1/client/profile`,
      providesTags: ['ProfileSetting'],
    }),
    updateMyProfile: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/client`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['ProfileSetting'],
    }),
  }),
});

export const { useGetMyProfileQuery, useUpdateMyProfileMutation } =
  profileSettingApiSlice;
