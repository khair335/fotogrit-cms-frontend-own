import { apiCore } from './apiCore';

export const clubMasterSlice = apiCore.injectEndpoints({
  endpoints: (builder) => ({
    getClubList: builder.query({
      query: ({ page, limit, searchTerm, city }) =>
        `/restricted/api/v1/clubs?page=${page}&limit=${limit}&q=${searchTerm}&city=${city}`,
      providesTags: ['ClubMaster'],
    }),
    addNewClubMaster: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/clubs`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ClubMaster'],
    }),
    updateClubMaster: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/clubs`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['ClubMaster'],
    }),
    deleteClubMaster: builder.mutation({
      query: ({ id }) => ({
        url: `/restricted/api/v1/clubs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ClubMaster'],
    }),

    // for options
    getOptionsClubs: builder.query({
      query: () => `/restricted/api/v1/clubs`,
      providesTags: ['ClubMaster'],
    }),
  }),
});

export const {
  useGetClubListQuery,
  useAddNewClubMasterMutation,
  useUpdateClubMasterMutation,
  useDeleteClubMasterMutation,

  // for options
  useGetOptionsClubsQuery,
} = clubMasterSlice;
