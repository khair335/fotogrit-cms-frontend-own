import { apiCore } from './apiCore';

export const serviceRequestSlice = apiCore.injectEndpoints({
  endpoints: (builder) => ({
    // SERVICE REQUEST
    getRequestNewService: builder.query({
      query: ({ serviceType = '' }) =>
        `/restricted/api/v1/services/request/all?menu=rns&service-type=${serviceType}`,
      providesTags: ['ServiceRequest'],
    }),
    getServiceMySubcontract: builder.query({
      query: ({ serviceType = '' }) =>
        `/restricted/api/v1/services/request/for-subcontract?service-type=${serviceType}`,
      providesTags: ['ServiceRequest'],
    }),
    getListServiceRequest: builder.query({
      query: ({ serviceType = '' }) =>
        `/restricted/api/v1/services/request/all?menu=list-all&service-type=${serviceType}`,
      providesTags: ['ServiceRequest'],
    }),
    getPhotographerOptions: builder.query({
      query: ({ serviceType = '' }) =>
        `/restricted/api/v1/services/request/photographers?service-type=${serviceType}`,
      providesTags: ['ServiceRequest'],
    }),
    getServiceTypeOptions: builder.query({
      query: ({ photographerID = '', serviceType = '' }) =>
        `/restricted/api/v1/services/get-photographer?photographer=${photographerID}&service-type=${serviceType}`,
      providesTags: ['ServiceRequest'],
    }),
    addNewServiceRequest: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/services/request`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ServiceRequest'],
    }),
    addNewServiceRequestScoringAllEvent: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/services/request/scoring/all`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ServiceRequest'],
    }),
    getAmountDueNow: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/services/request/amount-due`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['ServiceRequest'],
    }),

    // SERVICE REQUEST => CONTRACT
    getContracts: builder.query({
      query: ({
        searchTerm = '',
        status = '',
        limit = 10,
        page = 1,
        serviceType = '',
      }) =>
        `/restricted/api/v1/services/contract?q=${searchTerm}&status=${status}&limit=${limit}&page=${page}&service-type=${serviceType}`,
      providesTags: ['ServiceRequest'],
    }),
    getListEventByContract: builder.query({
      query: ({
        contractID = '',
        startDate = '',
        endDate = '',
        payment = '',
      }) =>
        `/restricted/api/v1/services/request?contract=${contractID}&start-date=${startDate}&end-date=${endDate}&payment=${payment}`,
      providesTags: ['ServiceRequest'],
    }),
    getActiveContracts: builder.query({
      query: () => `/restricted/api/v1/services/contract?status=active`,
      providesTags: ['ServiceRequest'],
    }),
    addNewContract: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/services/contract`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ServiceRequest'],
    }),

    // SUBCONTRACT
    getListPhotographer: builder.query({
      query: () => `/restricted/api/v1/photographers/subcontract`,
      providesTags: ['ServiceRequest'],
    }),
    getServiceByPhotographer: builder.query({
      query: ({ photographerID }) =>
        `/restricted/api/v1/services/by-photographer?id=${photographerID}`,
      providesTags: ['ServiceRequest'],
    }),
    getActiveSubcontract: builder.query({
      query: () => `/restricted/api/v1/services/subcontract?status=active`,
      providesTags: ['ServiceRequest'],
    }),
    createSubcontract: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/services/subcontract`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ServiceRequest'],
    }),
    createSubcontractAssignment: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/services/subcontract/detail`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ServiceRequest'],
    }),

    // Manage My Service
    getServiceRequestFSP: builder.query({
      query: ({ dateFilter = '', serviceType = '' }) =>
        `/restricted/api/v1/services/request/fsp/manage?date-start=${dateFilter}&service-type=${serviceType}`,
      providesTags: ['ServiceRequest'],
    }),
    getServiceRequestSSP: builder.query({
      query: ({ dateFilter = '', serviceType = '' }) =>
        `/restricted/api/v1/services/request/ssp/manage?date-start=${dateFilter}&service-type=${serviceType}`,
      providesTags: ['ServiceRequest'],
    }),
    updateStatusServiceFSP: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/services/request/fsp/status`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['ServiceRequest'],
    }),
    updateStatusServiceSSP: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/services/request/ssp/status`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['ServiceRequest'],
    }),
    updateActiveEvent: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/services/request/active-event`,
        method: 'PUT',
        body,
      }),
    }),
    updateValidateFromFSP: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/services/subcontract/validate`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['ServiceRequest'],
    }),

    // EVENT CHECKING
    getEventChecking: builder.query({
      query: ({ searchTerm, page = 1, limit = 10 }) =>
        `/restricted/api/v1/services/event-check?q=${searchTerm}&page=${page}&limit=${limit}`,
      providesTags: ['ServiceRequest'],
    }),
    updateStatusEventChecking: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/services/event-check`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['ServiceRequest'],
    }),

    // ADD MODIFY SERVICES
    getServices: builder.query({
      query: ({ searchTerm = '', page = 1, limit = 10, serviceType = '' }) =>
        `/restricted/api/v1/services?q=${searchTerm}&page=${page}&limit=${limit}&service-type=${serviceType}`,
      providesTags: ['ServiceRequest'],
    }),
    addNewServices: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/services`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ServiceRequest'],
    }),
    updateService: builder.mutation({
      query: (body) => ({
        url: '/restricted/api/v1/services',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['ServiceRequest'],
    }),
    deleteService: builder.mutation({
      query: ({ id }) => ({
        url: `/restricted/api/v1/services/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ServiceRequest'],
    }),

    // ADD/MODIFY SERVICE => VARIABEL FEE
    getVariableFees: builder.query({
      query: ({ id }) => `/restricted/api/v1/services/fee/${id}`,
      providesTags: ['ServiceRequest'],
    }),
    addNewVariableFee: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/services/fee`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ServiceRequest'],
    }),
    updateVariableFee: builder.mutation({
      query: (body) => ({
        url: '/restricted/api/v1/services/fee',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['ServiceRequest'],
    }),
    deleteVariableFee: builder.mutation({
      query: ({ id }) => ({
        url: `/restricted/api/v1/services/fee/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ServiceRequest'],
    }),

    // ADD MODIFY SERVICES => Approval visibilty & service
    getApprovedServices: builder.query({
      query: ({ searchTerm, page = 1, limit = 10 }) =>
        `/restricted/api/v1/services?q=${searchTerm}&page=${page}&limit=${limit}&list=all`,
      providesTags: ['ServiceRequest'],
    }),
    getListApprovalServices: builder.query({
      query: ({ searchTerm, page = 1, limit = 10 }) =>
        `/restricted/api/v1/services?q=${searchTerm}&page=${page}&limit=${limit}&list=new`,
      providesTags: ['ServiceRequest'],
    }),
    approvalService: builder.mutation({
      query: (body) => ({
        url: '/restricted/api/v1/services/approval',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['ServiceRequest'],
    }),
    updateVisibility: builder.mutation({
      query: (body) => ({
        url: '/restricted/api/v1/services/visibility',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['ServiceRequest'],
    }),

    // Service Transaction
    getServiceTransaction: builder.query({
      query: ({
        searchTerm = '',
        page = 1,
        limit = 10,
        to = '',
        startDate = '',
        endDate = '',
        item = '',
      }) =>
        `/restricted/api/v1/service/transactions?q=${searchTerm}&page=${page}&limit=${limit}&to=${to}&start_date=${startDate}&end_date=${endDate}&item=${item}`,
      providesTags: ['ServiceRequest'],
    }),

    // for options dropdown
    getCompensation: builder.query({
      query: () => `/restricted/api/v1/services/compensation`,
      providesTags: ['ServiceRequest'],
    }),
    getListServiceTypes: builder.query({
      query: () => `/restricted/api/v1/services/type`,
      providesTags: ['ServiceRequest'],
    }),
    getOptionsUsers: builder.query({
      query: ({ params = '' }) =>
        `/restricted/api/v1/services/users?q=${params}`,
      providesTags: ['ServiceRequest'],
    }),
  }),
});

export const {
  // SERVICE REQUEST
  useGetRequestNewServiceQuery,
  useGetServiceMySubcontractQuery,
  useGetListServiceRequestQuery,
  useGetPhotographerOptionsQuery,
  useGetServiceTypeOptionsQuery,
  useAddNewServiceRequestMutation,
  useAddNewServiceRequestScoringAllEventMutation,
  useGetAmountDueNowMutation,

  // SERVICE REQUEST => CONTRACT
  useGetContractsQuery,
  useGetListEventByContractQuery,
  useGetActiveContractsQuery,
  useAddNewContractMutation,

  // SUBCONTRACT
  useGetListPhotographerQuery,
  useGetServiceByPhotographerQuery,
  useGetActiveSubcontractQuery,
  useCreateSubcontractMutation,
  useCreateSubcontractAssignmentMutation,

  // Manage My Service
  useGetServiceRequestFSPQuery,
  useGetServiceRequestSSPQuery,
  useUpdateStatusServiceFSPMutation,
  useUpdateStatusServiceSSPMutation,
  useUpdateActiveEventMutation,
  useUpdateValidateFromFSPMutation,

  // EVENT CHECKING
  useGetEventCheckingQuery,
  useUpdateStatusEventCheckingMutation,

  // ADD MODIFY SERVICES
  useGetServicesQuery,
  useAddNewServicesMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,

  // ADD/MODIFY SERVICE => VARIABEL FEE
  useGetVariableFeesQuery,
  useAddNewVariableFeeMutation,
  useUpdateVariableFeeMutation,
  useDeleteVariableFeeMutation,

  // ADD MODIFY SERVICES => Approval visibilty & service
  useGetApprovedServicesQuery,
  useGetListApprovalServicesQuery,
  useApprovalServiceMutation,
  useUpdateVisibilityMutation,

  // Service Transaction
  useGetServiceTransactionQuery,

  // for options dropdown
  useGetCompensationQuery,
  useGetListServiceTypesQuery,
  useGetOptionsUsersQuery,
} = serviceRequestSlice;
