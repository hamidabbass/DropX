import { API_BASE_URL } from '@/config/api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const registerDriver = createAsyncThunk(
  'driverAuth/registerDriver',
  async (
    payload: {
      first_name: string;
      last_name: string;
      email: string;
      phone_number: string;
      address: string;
      password: string;
      license_number: string;
    },
    thunkAPI
  ) => {
    try {
      const res = await fetch(`${API_BASE_URL}/accounts/driver-register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || 'Registration failed.');
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const loginDriver = createAsyncThunk(
  'driverAuth/loginDriver',
  async (
    payload: { email: string; password: string },
    thunkAPI
  ) => {
    try {
      const res = await fetch(`${API_BASE_URL}/accounts/driver-login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || 'Login failed.');
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
