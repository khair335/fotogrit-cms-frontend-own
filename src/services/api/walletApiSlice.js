import { apiCore } from './apiCore';

export const walletSlice = apiCore.injectEndpoints({
  endpoints: (builder) => ({
    // for options select
    getWalletAmount: builder.query({
      query: ({ searchTerm, page = 1, limit = 10, walletType = '' }) =>
        `/restricted/api/v1/wallet-amount?q=${searchTerm}&page=${page}&limit=${limit}&wallet_type=${walletType}`,
      providesTags: ['Wallet'],
    }),
    addNewWalletAmount: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/wallet-amount`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Wallet'],
    }),
    updateWalletAmount: builder.mutation({
      query: (body) => ({
        url: '/restricted/api/v1/wallet-amount',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Wallet'],
    }),
    deleteWalletAmount: builder.mutation({
      query: ({ id }) => ({
        url: `/restricted/api/v1/wallet-amount/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Wallet'],
    }),
  }),
});

export const {
  useGetWalletAmountQuery,
  useAddNewWalletAmountMutation,
  useUpdateWalletAmountMutation,
  useDeleteWalletAmountMutation,
} = walletSlice;
