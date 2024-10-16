import { apiCore } from './apiCore';

export const orderSlice = apiCore.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: ({ customerName = '', searchTerm = '' }) =>
        `/restricted/api/v1/orders/all?c=${customerName}&q=${searchTerm}`,
      providesTags: ['Orders'],
    }),
    getDetailOrder: builder.query({
      query: ({ id }) => `/restricted/api/v1/orders/all/${id}`,
      providesTags: ['Orders'],
    }),
  }),
});

export const { useGetOrdersQuery, useGetDetailOrderQuery } = orderSlice;
