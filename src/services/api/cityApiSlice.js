import { apiCore } from '../api/apiCore';

export const citySlice = apiCore.injectEndpoints({
  endpoints: (builder) => ({
    getCities: builder.query({
      query: ({ page = 1, searchTerm }) =>
        `/restricted/api/v1/city?page=${page}&q=${searchTerm}`,
      providesTags: ['City'],
    }),
    getCitiesWithFilter: builder.query({
      query: (searchTerm) => `/restricted/api/v1/city?q=${searchTerm}`,
      providesTags: ['City'],
    }),
    addNewCity: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/city`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['City'],
    }),
    updateCity: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/city`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['City'],
    }),
    deleteCity: builder.mutation({
      query: ({ id }) => ({
        url: `/restricted/api/v1/city/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['City'],
    }),
  }),
});

export const {
  useGetCitiesQuery,
  useGetCitiesWithFilterQuery,
  useAddNewCityMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
} = citySlice;
