import { apiCore } from './apiCore';

export const customerDataSlice = apiCore.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerData: builder.query({
      query: ({ searchTerm = '', limit = 10, page = 1, userTypes }) =>
        `/restricted/api/v1/user?q=${searchTerm}&limit=${limit}&page=${page}&user_type=${userTypes}`,
      providesTags: ['CustomerData'],
    }),
    addNewCustomerData: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/user`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['CustomerData'],
    }),
    updateCustomerData: builder.mutation({
      query: ({ body, id }) => ({
        url: `/restricted/api/v1/user/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['CustomerData'],
    }),
    deleteCustomerData: builder.mutation({
      query: ({ id }) => ({
        url: `/restricted/api/v1/user/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CustomerData'],
    }),

    // Main Position
    getUserMainPosition: builder.query({
      query: ({ id }) => `/restricted/api/v1/user-main-position/${id}`,
      providesTags: ['CustomerData', 'Others'],
    }),
    addUserMainPosition: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/user-main-position`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['CustomerData'],
    }),

    // Current Club
    getCurrentClub: builder.query({
      query: ({ id }) => `/restricted/api/v1/client/club/${id}`,
      providesTags: ['CustomerData', 'ClubMaster'],
    }),
    addCurrentClub: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/client/club`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['CustomerData'],
    }),

    // for options
    getCustomerDataList: builder.query({
      query: ({ page = 1, searchTerm = '' }) =>
        `/restricted/api/v1/user?page=${page}&q=${searchTerm}&user_type=7587cd95e124ffec707adaef8cdfb0bf,602721e4516534ad0bdc3f186e1147ea,ed966b4ce147bed4b520b6e1bd9408be`, // customer(UT003) | team manager(UT013) | Event Group Owner(UT014)
      providesTags: ['CustomerData'],
    }),
    optionsUserTypes: builder.query({
      query: () => `/restricted/api/v1/user/types/list`,
      providesTags: ['CustomerData'],
    }),
    optionsAllUsers: builder.query({
      query: () => `/restricted/api/v1/user`,
      providesTags: ['CustomerData'],
    }),
  }),
});

export const {
  useGetCustomerDataQuery,
  useAddNewCustomerDataMutation,
  useUpdateCustomerDataMutation,
  useDeleteCustomerDataMutation,

  // Main Position
  useGetUserMainPositionQuery,
  useAddUserMainPositionMutation,

  // Current Club
  useGetCurrentClubQuery,
  useAddCurrentClubMutation,

  // for options
  useGetCustomerDataListQuery,
  useOptionsUserTypesQuery,
  useOptionsAllUsersQuery,
} = customerDataSlice;
