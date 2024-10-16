import axios from 'axios';
import Cookies from 'js-cookie';
import getApiUrl from './GetApiUrl';

const getTokenFromCookies = () => {
  const token = Cookies.get('ft-token');
  return token ? token : null;
};

export const FetchData = async (url) => {
  try {
    const API_URL = getApiUrl;

    const token = getTokenFromCookies();

    const response = await axios.get(`${API_URL}${url}`, {
      headers: {
        'X-TOKEN': token,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response;
  }
};
