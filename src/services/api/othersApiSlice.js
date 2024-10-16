import { apiCore } from './apiCore';

export const othersSlice = apiCore.injectEndpoints({
  endpoints: (builder) => ({
    // AGE GROUP
    getAgeGroup: builder.query({
      query: ({ searchTerm = '', page = 1, limit = 10 }) =>
        `/restricted/api/v1/age-groups?q=${searchTerm}&page=${page}&limit=${limit}`,
      providesTags: ['Others'],
    }),
    addNewAgeGroup: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/age-groups`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Others'],
    }),
    updateAgeGroup: builder.mutation({
      query: (body) => ({
        url: '/restricted/api/v1/age-groups',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Others'],
    }),
    deleteAgeGroup: builder.mutation({
      query: ({ id }) => ({
        url: `/restricted/api/v1/age-groups/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Others'],
    }),

    // EVENT TYPE
    getEventType: builder.query({
      query: ({ searchTerm = '', page = 1, limit = 10 }) =>
        `/restricted/api/v1/event-types?q=${searchTerm}&page=${page}&limit=${limit}`,
      providesTags: ['Others'],
    }),
    addNewEventType: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/event-types`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Others'],
    }),
    updateEventType: builder.mutation({
      query: (body) => ({
        url: '/restricted/api/v1/event-types',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Others'],
    }),

    // EVENT MATCH CATEGORY
    getEventMatch: builder.query({
      query: ({ searchTerm = '', page = 1, limit = 10 }) =>
        `/restricted/api/v1/event-match-category?q=${searchTerm}&page=${page}&limit=${limit}`,
      providesTags: ['Others'],
    }),
    addNewEventMatch: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/event-match-category`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Others'],
    }),
    updateEventMatch: builder.mutation({
      query: (body) => ({
        url: '/restricted/api/v1/event-match-category',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Others'],
    }),
    deleteEventMatch: builder.mutation({
      query: ({ id }) => ({
        url: `/restricted/api/v1/event-match-category/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Others'],
    }),

    // EVENT MATCH POOL
    getEventPool: builder.query({
      query: ({ searchTerm = '', page = 1, limit = 10 }) =>
        `/restricted/api/v1/event-match-pool?q=${searchTerm}&page=${page}&limit=${limit}`,
      providesTags: ['Others'],
    }),
    addNewEventPool: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/event-match-pool`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Others'],
    }),
    updateEventPool: builder.mutation({
      query: (body) => ({
        url: '/restricted/api/v1/event-match-pool',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Others'],
    }),
    deleteEventPool: builder.mutation({
      query: ({ id }) => ({
        url: `/restricted/api/v1/event-match-pool/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Others'],
    }),

    // MAIN POSITION
    getMainPositions: builder.query({
      query: ({ searchTerm = '', page = 1, limit = 10 }) =>
        `/restricted/api/v1/main-position?q=${searchTerm}&page=${page}&limit=${limit}`,
      providesTags: ['Others'],
    }),
    addNewMainPosition: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/main-position`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Others'],
    }),
    updateMainPosition: builder.mutation({
      query: (body) => ({
        url: '/restricted/api/v1/main-position',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Others'],
    }),
    deleteMainPosition: builder.mutation({
      query: ({ id }) => ({
        url: `/restricted/api/v1/main-position/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Others'],
    }),

    // SPONSOR
    getSponsors: builder.query({
      query: ({ searchTerm = '', page = 1, limit = 10 }) =>
        `/restricted/api/v1/sponsors?q=${searchTerm}&page=${page}&limit=${limit}`,
      providesTags: ['Others'],
    }),
    addNewSponsor: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/sponsors`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Others'],
    }),
    updateSponsor: builder.mutation({
      query: (body) => ({
        url: '/restricted/api/v1/sponsors',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Others'],
    }),
    deleteSponsor: builder.mutation({
      query: ({ id }) => ({
        url: `/restricted/api/v1/sponsors/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Others'],
    }),

    // OPTIONS
    getOptionsAgeGroup: builder.query({
      query: () => `/restricted/api/v1/age-groups`,
      providesTags: ['Others'],
    }),
    getOptionsEventType: builder.query({
      query: () => `/restricted/api/v1/event-types`,
      providesTags: ['Others'],
    }),
    getOptionsEventPool: builder.query({
      query: () => `/restricted/api/v1/event-match-pool`,
      providesTags: ['Others'],
    }),
    getOptionsEventMatch: builder.query({
      query: () => `/restricted/api/v1/event-match-category`,
      providesTags: ['Others'],
    }),
    getOptionsMainPositions: builder.query({
      query: () => `/restricted/api/v1/main-position`,
      providesTags: ['Others'],
    }),
    getOptionsSponsorsCategories: builder.query({
      query: () => `/restricted/api/v1/sponsor/categories`,
      providesTags: ['Others'],
    }),
    getOptionsSponsors: builder.query({
      query: () => `/restricted/api/v1/sponsors`,
      providesTags: ['Others'],
    }),
  }),
});

export const {
  // AGE GROUP
  useGetAgeGroupQuery,
  useAddNewAgeGroupMutation,
  useUpdateAgeGroupMutation,
  useDeleteAgeGroupMutation,

  // EVENT TYPE
  useGetEventTypeQuery,
  useAddNewEventTypeMutation,
  useUpdateEventTypeMutation,

  // EVENT MATCH CATEGORY
  useGetEventMatchQuery,
  useAddNewEventMatchMutation,
  useUpdateEventMatchMutation,
  useDeleteEventMatchMutation,

  // EVENT POOL
  useGetEventPoolQuery,
  useAddNewEventPoolMutation,
  useUpdateEventPoolMutation,
  useDeleteEventPoolMutation,

  // MAIN POSITION
  useGetMainPositionsQuery,
  useAddNewMainPositionMutation,
  useUpdateMainPositionMutation,
  useDeleteMainPositionMutation,

  // SPONSOR
  useGetSponsorsQuery,
  useAddNewSponsorMutation,
  useUpdateSponsorMutation,
  useDeleteSponsorMutation,

  // OPTIONS
  useGetOptionsAgeGroupQuery,
  useGetOptionsEventTypeQuery,
  useGetOptionsEventPoolQuery,
  useGetOptionsEventMatchQuery,
  useGetOptionsMainPositionsQuery,
  useGetOptionsSponsorsCategoriesQuery,
  useGetOptionsSponsorsQuery,
} = othersSlice;
