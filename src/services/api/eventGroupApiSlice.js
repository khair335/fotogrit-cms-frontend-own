import { apiCore } from './apiCore';

export const eventGroupSlice = apiCore.injectEndpoints({
  endpoints: (builder) => ({
    getEventGroup: builder.query({
      query: ({ city, searchTerm, limit, page }) =>
        `/restricted/api/v1/event-group/owned?city=${city}&q=${searchTerm}&limit=${limit}&page=${page}`,
      providesTags: ['EventGroup'],
    }),
    addNewEventGroup: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/event-group`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['EventGroup', 'ServiceRequest'],
    }),
    updateEventGroup: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/event-group`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['EventGroup', 'ServiceRequest'],
    }),
    deleteEventGroup: builder.mutation({
      query: ({ id }) => ({
        url: `/restricted/api/v1/event-group/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['EventGroup', 'ServiceRequest'],
    }),

    // MVP RANK
    getDetailMvpRank: builder.query({
      query: ({ groupID }) =>
        `/restricted/api/v1/event-group/mvp-rank/${groupID}`,
      providesTags: ['EventGroup'],
    }),
    addMvpRank: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/event-group/mvp-rank`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['EventGroup'],
    }),

    // for options
    getEventGroupList: builder.query({
      query: ({ page = 1, searchTerm = '' }) =>
        `/restricted/api/v1/event-group?page=${page}&q=${searchTerm}`,
      providesTags: ['EventGroup'],
    }),
    getEventGroupOwned: builder.query({
      query: ({ page = 1, searchTerm = '' }) =>
        `/restricted/api/v1/event-group/owned?page=${page}&q=${searchTerm}`,
      providesTags: ['EventGroup'],
    }),
    getOptionsMpvRank: builder.query({
      query: () => `/restricted/api/v1/mvp-rank`,
      providesTags: ['EventGroup'],
    }),
  }),
});

export const {
  useGetEventGroupQuery,
  useAddNewEventGroupMutation,
  useUpdateEventGroupMutation,
  useDeleteEventGroupMutation,

  // MVP RANK
  useGetDetailMvpRankQuery,
  useAddMvpRankMutation,

  // for options
  useGetEventGroupListQuery,
  useGetEventGroupOwnedQuery,
  useGetOptionsMpvRankQuery,
} = eventGroupSlice;
