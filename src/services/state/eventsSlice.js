import { createSlice } from '@reduxjs/toolkit';

const eventSlice = createSlice({
  name: 'event',
  initialState: {
    eventGroupID: '',
    eventListID: '',
    tabEventActive: 0,
    isRequiredFilterGroupEvent: false,
  },
  reducers: {
    setEventGroupID: (state, action) => {
      state.eventGroupID = action.payload;
    },
    setEventListID: (state, action) => {
      state.eventListID = action.payload;
    },
    setTabEventActive: (state, action) => {
      state.tabEventActive = action.payload;
    },
    setIsRequiredFilterGroupEvent: (state, action) => {
      state.isRequiredFilterGroupEvent = action.payload;
    },
  },
});

export const {
  setEventGroupID,
  setEventListID,
  setTabEventActive,
  setIsRequiredFilterGroupEvent,
} = eventSlice.actions;

export default eventSlice.reducer;

export const selectCurrentEventGroupID = (state) => state.event.eventGroupID;
export const getEventListID = (state) => state.event.eventListID;
export const getTabEventActive = (state) => state?.event?.tabEventActive;
export const getIsRequiredGroupID = (state) =>
  state?.event?.isRequiredFilterGroupEvent;
