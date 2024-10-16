import { apiCore } from './apiCore';

export const teamMasterSlice = apiCore.injectEndpoints({
  endpoints: (builder) => ({
    getTeamMaster: builder.query({
      query: ({ city, searchTerm, page = 1, limit = 10 }) =>
        `/restricted/api/v1/teams?c=${city}&q=${searchTerm}&page=${page}&limit=${limit}`,
      providesTags: ['TeamMaster'],
    }),
    // for options select
    getTeamMasterList: builder.query({
      query: ({ page = 1, searchTerm }) =>
        `/restricted/api/v1/teams?page=${page}&q=${searchTerm}`,
      providesTags: ['TeamMaster'],
    }),
    addNewTeamMaster: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/teams`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['TeamMaster'],
    }),
    updateTeamMaster: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/teams`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['TeamMaster'],
    }),
    deleteTeamMaster: builder.mutation({
      query: ({ id }) => ({
        url: `/restricted/api/v1/teams/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['TeamMaster'],
    }),
  }),
});

export const {
  useGetTeamMasterQuery,
  useGetTeamMasterListQuery,
  useAddNewTeamMasterMutation,
  useUpdateTeamMasterMutation,
  useDeleteTeamMasterMutation,
} = teamMasterSlice;
