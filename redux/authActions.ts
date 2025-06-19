// redux/slices/authActions.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import {API_BASE_URL} from "@/config/api"

export const loginDriver = createAsyncThunk(
  'auth/loginDriver',
  async (
    { email, password }: { email: string; password: string },
    thunkAPI
  ) => {
    try {
      const res = await fetch(`${API_BASE_URL}/accounts/driver-login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || 'Login failed');

      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
