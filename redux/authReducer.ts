// redux/slices/authReducer.ts
import { createSlice } from '@reduxjs/toolkit';
import { loginDriver } from './authActions';

interface AuthState {
  isLoading: boolean;
  isLoggedIn: boolean;
  token: string | null;
  error: string | null;
}

const initialState: AuthState = {
  isLoading: false,
  isLoggedIn: false,
  token: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginDriver.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginDriver.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.isLoggedIn = true;
      })
      .addCase(loginDriver.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
