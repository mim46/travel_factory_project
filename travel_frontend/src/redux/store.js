import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import packageReducer from './slices/packageSlice';
import bookingReducer from './slices/bookingSlice';
import userReducer from './slices/userSlice';
import queryReducer from './slices/querySlice';
import destinationReducer from './slices/destinationSlice';
import reportReducer from './slices/reportSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    packages: packageReducer,
    bookings: bookingReducer,
    users: userReducer,
    query: queryReducer,
    destinations: destinationReducer,
    reports: reportReducer,
  },
});

export default store;
