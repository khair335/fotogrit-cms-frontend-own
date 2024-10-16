import { apiCore } from './apiCore';

export const referralCodeSlice = apiCore.injectEndpoints({
  endpoints: (builder) => ({
    getReferralCode: builder.query({
      query: ({ searchTerm, page = 1, limit = 10 }) =>
        `/restricted/api/v1/referral?q=${searchTerm}&page=${page}&limit=${limit}`,
      providesTags: ['Wallet'],
    }),
    getApprovalReferralCode: builder.query({
      query: ({ searchTerm, page = 1, limit = 10 }) =>
        `/restricted/api/v1/referral?q=${searchTerm}&page=${page}&limit=${limit}&status=waiting for approval`,
      providesTags: ['Wallet'],
    }),
    addNewReferralCode: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/referral`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Wallet'],
    }),
    deleteReferralCode: builder.mutation({
      query: ({ id }) => ({
        url: `/restricted/api/v1/referral/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Wallet'],
    }),

    approveReferralCode: builder.mutation({
      query: (body) => ({
        url: '/restricted/api/v1/referral-approval',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Wallet'],
    }),
  }),
});

export const {
  useGetReferralCodeQuery,
  useGetApprovalReferralCodeQuery,
  useAddNewReferralCodeMutation,
  useDeleteReferralCodeMutation,

  useApproveReferralCodeMutation,
} = referralCodeSlice;
