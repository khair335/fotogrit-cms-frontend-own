import { apiCore } from './apiCore';

export const generalSettingSlice = apiCore.injectEndpoints({
  endpoints: (builder) => ({
    getGeneralSetting: builder.query({
      query: ({ page = 1, limit = 10 }) =>
        `/restricted/api/v1/general-setting?page=${page}&limit=${limit}`,
      providesTags: ['GeneralSetting'],
    }),
    getPrices: builder.query({
      query: () => `/restricted/api/v1/general-setting`,
      providesTags: ['GeneralSetting'],
    }),
    updateGeneralSetting: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/general-setting`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['GeneralSetting'],
    }),
  }),
});

export const {
  useGetGeneralSettingQuery,
  useGetPricesQuery,
  useUpdateGeneralSettingMutation,
} = generalSettingSlice;
