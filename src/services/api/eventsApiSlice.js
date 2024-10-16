import { apiCore } from './apiCore';

export const eventsSlice = apiCore.injectEndpoints({
  endpoints: (builder) => ({
    // TEAM LIST
    getTeamList: builder.query({
      query: ({ eventGroup, searchTerm, page, limit = 10 }) =>
        `/restricted/api/v1/event/team-list?group=${eventGroup}&q=${searchTerm}&page=${page}&limit=${limit}`,
      providesTags: ['Events'],
    }),
    updateTeamList: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/event/team-list`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Events'],
    }),

    // EVENT LIST
    getEventList: builder.query({
      query: ({ eventGroup, searchTerm, page = 1, limit = 10 }) =>
        `/restricted/api/v1/events?event-group=${eventGroup}&q=${searchTerm}&page=${page}&limit=${limit}`,
      providesTags: ['Events'],
    }),
    getListProcessRecognition: builder.query({
      query: ({ page = 1, eventID = '', limit = 10 }) =>
        `/restricted/api/v1/event/api-call?page=${page}&event=${eventID}&limit=${limit}`,
      providesTags: ['Events'],
    }),
    addNewEventList: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/event`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Events', 'ServiceRequest'],
    }),
    updateEventList: builder.mutation({
      query: (body) => ({
        url: '/restricted/api/v1/event',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Events', 'ServiceRequest'],
    }),
    deleteEventList: builder.mutation({
      query: ({ id }) => ({
        url: `/restricted/api/v1/event/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Events', 'ServiceRequest'],
    }),

    // ROSTER LIST
    getRosterList: builder.query({
      query: ({
        eventGroup = '',
        searchTerm = '',
        team = '',
        page = 1,
        limit = 10,
      }) =>
        `/restricted/api/v1/event/roster-list?event-group=${eventGroup}&q=${searchTerm}&team=${team}&page=${page}&limit=${limit}`,
      providesTags: ['Events'],
    }),
    addNewRosterList: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/event/roster-list`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Events'],
    }),
    updateRosterList: builder.mutation({
      query: (body) => ({
        url: '/restricted/api/v1/event/roster-list',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Events'],
    }),
    deleteRosterList: builder.mutation({
      query: ({ id }) => ({
        url: `/restricted/api/v1/event/roster-list/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Events'],
    }),

    // ROSTER LIST
    getOfficialList: builder.query({
      query: ({
        eventGroup = '',
        searchTerm = '',
        team = '',
        page = 1,
        limit = 10,
      }) =>
        `restricted/api/v1/event/official-list?event-group=${eventGroup}&q=${searchTerm}&team=${team}&page=${page}&limit=${limit}`,
      providesTags: ['Events'],
    }),
    addNewOfficialList: builder.mutation({
      query: (body) => ({
        url: `restricted/api/v1/event/official-list`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Events'],
    }),
    updateOfficialList: builder.mutation({
      query: (body) => ({
        url: 'restricted/api/v1/event/official-list',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Events'],
    }),
    deleteOfficialList: builder.mutation({
      query: ({ id }) => ({
        url: `restricted/api/v1/event/official-list/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Events'],
    }),

    // MEDIA LIST
    getMediaList: builder.query({
      query: ({ eventGroup, event, searchTerm, page = 1, limit = 10 }) =>
        `/restricted/api/v1/event/media-list?event=${event}&event-group=${eventGroup}&q=${searchTerm}&page=${page}&limit=${limit}`,
      providesTags: ['Events'],
    }),
    addNewMediaList: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/event/media-list`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Events'],
    }),
    updateMediaList: builder.mutation({
      query: (body) => ({
        url: '/restricted/api/v1/event/media-list',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Events'],
    }),
    deleteMediaList: builder.mutation({
      query: ({ id }) => ({
        url: `/restricted/api/v1/event/media-list/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Events'],
    }),
    deleteMediaBulk: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/event/media/list/bulk`,
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['Events'],
    }),
    deleteAllMediaByEvent: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/event/media/list/all`,
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['Events'],
    }),

    // for options
    getOptionsEvents: builder.query({
      query: ({ searchTerm = '', page = 1, eventGroup = '' }) =>
        `/restricted/api/v1/events?event-group=${eventGroup}&q=${searchTerm}&page=${page}`,
      providesTags: ['Events'],
    }),
    getOptionsEventForService: builder.query({
      query: ({ eventGroup = '', startDate = '', endDate = '' }) =>
        `/restricted/api/v1/event-list?event-group=${eventGroup}&start-date=${startDate}&end-date=${endDate}`,
      providesTags: ['ServiceRequest', 'Events'],
    }),
    getOptionsOfficials: builder.query({
      query: () => `/restricted/api/v1/officials`,
      providesTags: ['Events'],
    }),
  }),
});

export const {
  // TEAM LIST
  useGetTeamListQuery,
  useUpdateTeamListMutation,

  // EVENT LIST
  useGetEventListQuery,
  useGetListProcessRecognitionQuery,
  useAddNewEventListMutation,
  useUpdateEventListMutation,
  useDeleteEventListMutation,

  // ROSTER LIST
  useGetRosterListQuery,
  useAddNewRosterListMutation,
  useUpdateRosterListMutation,
  useDeleteRosterListMutation,

  // OFFICIAL LIST
  useGetOfficialListQuery,
  useAddNewOfficialListMutation,
  useUpdateOfficialListMutation,
  useDeleteOfficialListMutation,

  // MEDIA LIST
  useGetMediaListQuery,
  useAddNewMediaListMutation,
  useUpdateMediaListMutation,
  useDeleteMediaListMutation,
  useDeleteMediaBulkMutation,
  useDeleteAllMediaByEventMutation,

  // for options
  useGetOptionsEventsQuery,
  useGetOptionsEventForServiceQuery,
  useGetOptionsOfficialsQuery,
} = eventsSlice;
