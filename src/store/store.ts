import { configureStore } from '@reduxjs/toolkit';
import findPlaceSlice from '../features/hero/findPlaceSlice';
import hotelFilterReducer from './hotelFilterSlice';
import flightFilterReducer from './flightFilterSlice';

export const store = configureStore({
  reducer: {
    hero: findPlaceSlice,
    hotelFilter: hotelFilterReducer,
    flightFilter: flightFilterReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
