import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  uploadProgress: 0,
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setUploadProgress: (state, action) => {
      return {
        ...state,
        uploadProgress: action.payload,
      };
    },
  },
});

export const { setUploadProgress } = globalSlice.actions;

export default globalSlice.reducer;

export const getUploadProgress = (state) => state.global.uploadProgress;
