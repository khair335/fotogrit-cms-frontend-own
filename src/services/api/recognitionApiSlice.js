import { apiCore } from './apiCore';

export const recognitionSlice = apiCore.injectEndpoints({
  endpoints: (builder) => ({
    autoRecognition: builder.query({
      query: ({ eventID }) =>
        `/restricted/api/v1/recog/image-upload?event_id=${eventID}`,
      providesTags: ['Events'],
    }),
  }),
});

export const { useAutoRecognitionQuery } = recognitionSlice;
