import { createSlice } from '@reduxjs/toolkit';
import { createVehicle } from './vehicleActions';

const initialState = {
  isLoading: false,
  error: null as string | null,
  result: null as any,
};

const vehicleSlice = createSlice({
  name: 'vehicle',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createVehicle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.result = null;
      })
      .addCase(createVehicle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.result = action.payload;
      })
      .addCase(createVehicle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default vehicleSlice.reducer;
