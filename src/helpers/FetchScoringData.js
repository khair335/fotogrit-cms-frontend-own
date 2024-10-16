import axios from 'axios';

export const FetchScoringData = async (url) => {
  try {
    const API_URL = import.meta.env.VITE_API_SCORING_URL;

    const response = await axios.get(`${API_URL}${url}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};
