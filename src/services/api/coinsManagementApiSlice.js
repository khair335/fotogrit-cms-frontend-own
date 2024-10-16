import { apiCore } from './apiCore';

export const coinsManagementSlice = apiCore.injectEndpoints({
  endpoints: (builder) => ({
    getCoins: builder.query({
      query: ({ searchTerm = '', page = 1, limit = 10 }) =>
        `/restricted/api/v1/coins?q=${searchTerm}&page=${page}&limit=${limit}`,
      providesTags: ['CoinManagement'],
    }),
    addNewCoin: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/coins`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['CoinManagement'],
    }),
  }),
});

export const { useGetCoinsQuery, useAddNewCoinMutation } = coinsManagementSlice;
