import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedRowsServices: [],
  isSubcontract: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setSelectedRowsServices: (state, action) => {
      return {
        ...state,
        selectedRowsServices: action.payload,
      };
    },
    setIsSubcontract: (state, action) => {
      state.isSubcontract = action.payload;
    },
  },
});

export const { setSelectedRowsServices, setIsSubcontract } = cartSlice.actions;

export default cartSlice.reducer;

export const getSelectedRowsServices = (state) =>
  state.cart.selectedRowsServices;
export const getIsSubcontract = (state) => state.cart.isSubcontract;
