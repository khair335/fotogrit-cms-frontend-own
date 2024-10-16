import { apiCore } from './apiCore';

export const paymentCartSlice = apiCore.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentCart: builder.query({
      query: ({ type, serviceType }) =>
        `/restricted/api/v2/cart?type=${type}&service-type=${serviceType}`,
      providesTags: ['PaymentCart', 'ServiceRequest'],
    }),
    endContractRequest: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/services/contract/cut`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['PaymentCart'],
    }),
    cartValidation: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v2/cart/validate`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['PaymentCart'],
    }),
    deleteCartMedia: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/cart`,
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['PaymentCart'],
    }),
    deleteServiceRequestContract: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/services/contract/delete`,
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['PaymentCart'],
    }),
    deleteServiceRequest: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/services/request/delete`,
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['PaymentCart'],
    }),
    deleteServiceSubcontract: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/services/subcontract/delete`,
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['PaymentCart'],
    }),
    deleteServiceSubcontractDetail: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/services/subcontract/detail`,
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['PaymentCart'],
    }),
  }),
});

export const {
  useGetPaymentCartQuery,
  useEndContractRequestMutation,
  useCartValidationMutation,
  useDeleteCartMediaMutation,
  useDeleteServiceRequestContractMutation,
  useDeleteServiceRequestMutation,
  useDeleteServiceSubcontractMutation,
  useDeleteServiceSubcontractDetailMutation,
} = paymentCartSlice;
