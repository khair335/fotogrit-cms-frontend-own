import { apiCore } from './apiCore';

export const reportSlice = apiCore.injectEndpoints({
  endpoints: (builder) => ({
    getReportTransactions: builder.query({
      query: (params) =>
        `/restricted/api/v1/report/transaction?q=${
          params.searchTerm || ''
        }&page=${params.page || 1}&limit=${params.limit || 10}&start_date=${
          params.startDate || ''
        }&end_date=${params.endDate || ''}&compensation=${
          params.compensation || ''
        }&transaction_type=${
          params.transactionTypeOrder || ''
        }&transaction_type_service=${
          params.transactionTypeService || ''
        }&min_price=${params.minPrice || ''}&max_price=${
          params.maxPrice || ''
        }&compensation_payment_method=${
          params.compensationPaymentMethod || ''
        }&payment_method=${params.paymentMethod || ''}&user_name=${
          params.userName || ''
        }&user_code=${params.userCode || ''}&team_a_code=${
          params.teamACode || ''
        }&team_a_name=${params.teamAName || ''}&team_b_code=${
          params.teamBCode || ''
        }&team_b_name=${params.teamBName || ''}&club_a_code=${
          params.clubACode || ''
        }&club_a_name=${params.clubAName || ''}&club_b_code=${
          params.clubBCode || ''
        }&club_b_name=${params.clubBName || ''}&event_group_code=${
          params.eventGroupCode || ''
        }&event_group_name=${params.eventGroupName || ''}&event_code=${
          params.eventCode || ''
        }&event_name=${params.eventName || ''}&service_type=${
          params.serviceType || ''
        }&fsp_code=${params.fspCode || ''}&fsp_name=${
          params.fspName || ''
        }&fsp_share_min=${params.fspShareMin || ''}&fsp_share_max=${
          params.fspShareMax || ''
        }&ssp_code=${params.sspCode || ''}&ssp_name=${
          params.sspName || ''
        }&ssp_share_min=${params.sspShareMin || ''}&ssp_share_max=${
          params.sspShareMax || ''
        }`,
      // providesTags: ['UserData'],
    }),

    // OPTIONS LIST
    optionsListUsers: builder.query({
      query: () => `/restricted/api/v1/user`,
      providesTags: ['CustomerData'],
    }),
    optionsListUserFSP: builder.query({
      query: () => `/restricted/api/v1/services/request/photographers`,
    }),
    optionsListUserSSP: builder.query({
      query: () => `/restricted/api/v1/photographers/subcontract`,
    }),
    optionsListTeams: builder.query({
      query: () => `/restricted/api/v1/teams`,
      providesTags: ['TeamMaster'],
    }),
    optionsListClubs: builder.query({
      query: () => `/restricted/api/v1/clubs`,
      providesTags: ['ClubMaster'],
    }),
    optionsListEventGroups: builder.query({
      query: () => `/restricted/api/v1/event-group`,
      providesTags: ['EventGroup'],
    }),
    optionsListEvents: builder.query({
      query: () => `/restricted/api/v1/event-list`,
      providesTags: ['Events'],
    }),
    optionsListServiceTypes: builder.query({
      query: () => `/restricted/api/v1/services/type`,
      providesTags: ['ServiceRequest'],
    }),
    optionsCompensation: builder.query({
      query: () => `/restricted/api/v1/report/transaction/compansation-list`,
    }),
    optionsCompensationMethod: builder.query({
      query: () => `/restricted/api/v1/report/transaction/compansation-method`,
    }),
    optionsPaymentMethod: builder.query({
      query: () => `/restricted/api/v1/report/transaction/payment-method`,
    }),
  }),
});

export const {
  useGetReportTransactionsQuery,

  // OPTIONS LIST
  useOptionsListUsersQuery,
  useOptionsListUserFSPQuery,
  useOptionsListUserSSPQuery,
  useOptionsListTeamsQuery,
  useOptionsListClubsQuery,
  useOptionsListEventGroupsQuery,
  useOptionsListEventsQuery,
  useOptionsListServiceTypesQuery,
  useOptionsCompensationQuery,
  useOptionsCompensationMethodQuery,
  useOptionsPaymentMethodQuery,
} = reportSlice;
