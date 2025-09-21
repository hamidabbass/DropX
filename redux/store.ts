import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authReducer';
import driverAuthReducer from './driverAuthReducer';
import driverVehicleReducer from './driverVehicleSlice';
import driverVerificationReducer from './driverVerificationReducer';
import vehicleReducer from './vehicleReducer';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    driverVerification: driverVerificationReducer,
    driverAuth: driverAuthReducer,
    vehicle: vehicleReducer,
    driverVehicle: driverVehicleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
