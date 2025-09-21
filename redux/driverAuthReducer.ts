import { createSlice } from '@reduxjs/toolkit';
import { loginDriver, registerDriver } from './driverAuthActions';

interface DriverAuthState {
  isLoading: boolean;
  error: string | null;
  registerData: any;
  loginData: any;
}

const initialState: DriverAuthState = {
  isLoading: false,
  error: null,
  registerData: null,
  loginData: null,
};

const driverAuthSlice = createSlice({
  name: 'driverAuth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerDriver.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerDriver.fulfilled, (state, action) => {
        state.isLoading = false;
        state.registerData = action.payload;
        // Persist registration values to driverVehicle slice
        // This requires importing setDriverInfo and store
        try {
          const { phone_number, license_number, first_name, last_name } = action.payload || {};
          const name = [first_name, last_name].filter(Boolean).join(' ');
          // Dynamically import to avoid circular dependency
          const { setDriverInfo } = require('./driverVehicleSlice');
          const { store } = require('./store');
          store.dispatch(setDriverInfo({
            name,
            phone: phone_number || '',
            license: license_number || '',
          }));
        } catch (e) {
          // ignore
        }
      })
      .addCase(registerDriver.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(loginDriver.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginDriver.fulfilled, (state, action) => {
        state.isLoading = false;
        state.loginData = action.payload;
      })
      .addCase(loginDriver.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default driverAuthSlice.reducer;
