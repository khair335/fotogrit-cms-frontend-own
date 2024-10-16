import axios from 'axios';
import { apiCore } from './apiCore';
import { setUploadProgress } from '../state/globalSlice';

export const uploadSlice = apiCore.injectEndpoints({
  endpoints: (builder) => ({
    uploadImages: builder.mutation({
      queryFn: async ({ url, data }, api) => {
        try {
          const result = await axios.post(url, data, {
            //...other options like headers here
            headers: {
              'X-TOKEN': api.getState().auth.token,
            },
            onUploadProgress: (upload) => {
              //Set the progress value to show the progress bar
              let uploadloadProgress = Math.round(
                (100 * upload.loaded) / upload.total
              );
              api.dispatch(setUploadProgress(uploadloadProgress));
            },
          });

          return { data: result.data };
        } catch (axiosError) {
          let err = axiosError;
          return {
            error: {
              status: err.response?.status,
              data: err.response?.data || err.message,
            },
          };
        }
      },
      invalidatesTags: ['Events'],
    }),
  }),
});

export const { useUploadImagesMutation } = uploadSlice;
