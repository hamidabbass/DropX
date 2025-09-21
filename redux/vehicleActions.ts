import { API_BASE_URL } from '@/config/api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export interface VehicleData {
  vehicle_type_name: string;
  description?: string;
  make: string;
  model: string;
  year: number;
  number_plate: string;
  color?: string;
}

export const createVehicle = createAsyncThunk(
  'vehicle/createVehicle',
  async (data: VehicleData, { getState, rejectWithValue }) => {
    try {
      // Get token from Redux state
      const state: any = getState();
      const token = state.driverAuth?.loginData?.access || state.auth?.token || state.auth?.access;
      if (!token) throw new Error('No access token found. Please login again.');
      const response = await fetch(`${API_BASE_URL}/vehicle/vehicles/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const resData = await response.json();
      if (!response.ok) throw new Error(resData?.detail || 'Vehicle creation failed');
      return resData;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);
