import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authReducer';
import driverAuthReducer from './driverAuthReducer';
import driverVerificationReducer from './driverVerificationReducer';

export const store = configureStore({
  reducer: {
  auth: authReducer,
  driverVerification: driverVerificationReducer,
  driverAuth: driverAuthReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
