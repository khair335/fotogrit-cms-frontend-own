import { configureStore } from '@reduxjs/toolkit';
import { apiCore } from './api/apiCore';
import authReducer from './state/authSlice';
import eventReducer from './state/eventsSlice';
import globalReducer from './state/globalSlice';
import cartReducer from './state/cartSlice';
import reportReducer from './state/reportSlice';

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [apiCore.reducerPath]: apiCore.reducer,
    auth: authReducer,
    event: eventReducer,
    global: globalReducer,
    cart: cartReducer,
    report: reportReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiCore.middleware),
});
