import { createSlice } from '@reduxjs/toolkit';
import { verifyDriver } from './driverVerificationActions';



interface DriverVerificationState {
  isLoading: boolean;
  error: string | null;
  result: any | null;
  persisted: {
    face_verification_status?: boolean;
    verification_status?: string;
    cnic_number?: string;
    full_name?: string;
  };
}

const initialState: DriverVerificationState = {
  isLoading: false,
  error: null,
  result: null,
  persisted: {},
};

const driverVerificationSlice = createSlice({
  name: 'driverVerification',
  initialState,
  reducers: {
    setPersistedVerification(state, action) {
      state.persisted = action.payload;
    },
    clearPersistedVerification(state) {
      state.persisted = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyDriver.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.result = null;
      })
      .addCase(verifyDriver.fulfilled, (state, action) => {
        state.isLoading = false;
        state.result = action.payload;
        // Persist important fields
        state.persisted = {
          face_verification_status: action.payload.face_verification_status,
          verification_status: action.payload.verification_status,
          cnic_number: action.payload.cnic_number,
          full_name: action.payload.full_name,
        };
      })
      .addCase(verifyDriver.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setPersistedVerification, clearPersistedVerification } = driverVerificationSlice.actions;
export default driverVerificationSlice.reducer;
