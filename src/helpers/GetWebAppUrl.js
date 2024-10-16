const {
  VITE_SERVER,
  VITE_URL_WEB_APP_DEV,
  VITE_URL_WEB_APP_STAGING,
  VITE_URL_WEB_APP_PROD,
} = import.meta.env;

const getWebAppUrl = (() => {
  switch (VITE_SERVER) {
    case 'production':
      return VITE_URL_WEB_APP_PROD;
    case 'staging':
      return VITE_URL_WEB_APP_STAGING;
    case 'development':
      return VITE_URL_WEB_APP_DEV;
    default:
      return VITE_URL_WEB_APP_DEV;
  }
})();

export default getWebAppUrl;
