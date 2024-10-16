const {
  VITE_SERVER,
  VITE_API_URL_DEV,
  VITE_API_URL_STAGING,
  VITE_API_URL_PROD,
} = import.meta.env;

const getApiUrl = (() => {
  switch (VITE_SERVER) {
    case 'production':
      return VITE_API_URL_PROD;
    case 'staging':
      return VITE_API_URL_STAGING;
    case 'development':
      return VITE_API_URL_DEV;
    default:
      return VITE_API_URL_DEV;
  }
})();

export default getApiUrl;
