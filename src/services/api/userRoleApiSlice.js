import { apiCore } from './apiCore';

export const userRoleSlice = apiCore.injectEndpoints({
  endpoints: (builder) => ({
    // for options select
    getRoles: builder.query({
      query: () => `/restricted/api/v1/role?limit=100`,
      providesTags: ['UserRole'],
    }),
    getUserRoles: builder.query({
      query: ({ searchTerm, page = 1, limit = 10 }) =>
        `/restricted/api/v1/role?q=${searchTerm}&page=${page}&limit=${limit}`,
      providesTags: ['UserRole'],
    }),
    addNewUserRole: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/role`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['UserRole'],
    }),
    updateUserRole: builder.mutation({
      query: (body) => ({
        url: '/restricted/api/v1/role',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['UserRole'],
    }),
    deleteUserRole: builder.mutation({
      query: ({ id }) => ({
        url: `/restricted/api/v1/role/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['UserRole'],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetUserRolesQuery,
  useAddNewUserRoleMutation,
  useUpdateUserRoleMutation,
  useDeleteUserRoleMutation,
} = userRoleSlice;
