import { apiCore } from './apiCore';

export const equipmentSlice = apiCore.injectEndpoints({
  endpoints: (builder) => ({
    // for options select
    getEquipments: builder.query({
      query: ({ searchTerm, page = 1, limit = 10 }) =>
        `/restricted/api/v1/equipments?q=${searchTerm}&page=${page}&limit=${limit}`,
      providesTags: ['Equipment'],
    }),
    addNewEquipment: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/equipments`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Equipment'],
    }),
    updateEquipment: builder.mutation({
      query: (body) => ({
        url: '/restricted/api/v1/equipments',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Equipment'],
    }),
    deleteEquipment: builder.mutation({
      query: ({ id }) => ({
        url: `/restricted/api/v1/equipments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Equipment'],
    }),
  }),
});

export const {
  useGetEquipmentsQuery,
  useAddNewEquipmentMutation,
  useUpdateEquipmentMutation,
  useDeleteEquipmentMutation,
} = equipmentSlice;
