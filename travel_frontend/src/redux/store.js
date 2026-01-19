import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import packageReducer from './slices/packageSlice';
import bookingReducer from './slices/bookingSlice';
import userReducer from './slices/userSlice';
import queryReducer from './slices/querySlice';
import destinationReducer from './slices/destinationSlice';
import reportReducer from './slices/reportSlice';
import messageReducer from './slices/messageSlice';
import forgotPasswordReducer from './slices/forgotPasswordSlice';
import countryReducer from './slices/countrySlice';
import placeReducer from './slices/placeSlice';
import galleryReducer from './slices/gallerySlice';
import pageContentReducer from './slices/pageContentSlice';
import reviewReducer from './slices/reviewSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    packages: packageReducer,
    bookings: bookingReducer,
    query: queryReducer,
    destinations: destinationReducer,
    reports: reportReducer,
    user: userReducer,
    messages: messageReducer,
    forgotPassword: forgotPasswordReducer,
    countries: countryReducer,
    places: placeReducer,
    gallery: galleryReducer,
    pageContent: pageContentReducer,
    reviews: reviewReducer,
  },
});

export default store;
