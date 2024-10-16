import { apiCore } from './apiCore';

export const userDataSlice = apiCore.injectEndpoints({
  endpoints: (builder) => ({
    getUserData: builder.query({
      query: ({ searchTerm, page = 1, limit = 10 }) =>
        `/restricted/api/v1/admin?q=${searchTerm}&page=${page}&limit=${limit}`,
      providesTags: ['UserData'],
    }),
    // for options select
    getUserDataList: builder.query({
      query: () => `/restricted/api/v1/admin`,
      providesTags: ['UserData'],
    }),
    addNewUserData: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/admin`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['UserData'],
    }),
    updateUserData: builder.mutation({
      query: (body) => ({
        url: '/restricted/api/v1/admin',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['UserData'],
    }),
    deleteUserData: builder.mutation({
      query: ({ id }) => ({
        url: `/restricted/api/v1/admin/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['UserData'],
    }),
  }),
});

export const {
  useGetUserDataQuery,
  useGetUserDataListQuery,
  useAddNewUserDataMutation,
  useUpdateUserDataMutation,
  useDeleteUserDataMutation,
} = userDataSlice;
