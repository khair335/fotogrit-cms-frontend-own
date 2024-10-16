import { createSlice } from '@reduxjs/toolkit';

const reportSlice = createSlice({
  name: 'report',
  initialState: {
    selectedFilters: {},
    dropdownStates: {},
    filterTransactions: {},
  },
  reducers: {
    setSelectedFilters: (state, action) => {
      const { id, filters } = action.payload;
      state.selectedFilters[id] = filters;
    },
    setIsOpenDropdownFilter: (state, action) => {
      const { id, isOpen } = action.payload;
      state.dropdownStates[id] = isOpen;
    },

    setFilterTransactions: (state, action) => {
      const { filterKey, filterValue } = action.payload;
      state.filterTransactions[filterKey] = filterValue;
    },
    resetFilterTransactions: (state) => {
      state.filterTransactions = {};
      state.selectedFilters = {};
    },
  },
});

export const {
  setSelectedFilters,
  setIsOpenDropdownFilter,
  setFilterTransactions,
  resetFilterTransactions,
} = reportSlice.actions;

export default reportSlice.reducer;

export const getSelectedFilters = (state, id) =>
  state.report.selectedFilters[id];
export const getDropdownState = (state, id) => state.report.dropdownStates[id];

export const getFilterTransactionByKey = (state, key) =>
  state.report.filterTransactions[key];
export const getAllFilterTransaction = (state) =>
  state.report.filterTransactions;
