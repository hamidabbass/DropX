import { API_BASE_URL } from '@/config/api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const verifyDriver = createAsyncThunk(
  'driver/verifyDriver',
  async (
    { faceImageUri, cnicImageUri }: { faceImageUri: string; cnicImageUri: string },
    thunkAPI
  ) => {
    try {
      const formData = new FormData();
      formData.append('face_image', {
        uri: faceImageUri,
        name: 'face.jpg',
        type: 'image/jpeg',
      } as any);
      formData.append('cnic_image', {
        uri: cnicImageUri,
        name: 'cnic.jpg',
        type: 'image/jpeg',
      } as any);

      // Get token from Redux state
      const state: any = thunkAPI.getState();
      const token = state.driverAuth?.loginData?.access;
      if (!token) throw new Error('No access token found. Please login again.');

      const res = await fetch(`${API_BASE_URL}/driver-verification/verifications/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        body: formData as any,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || 'Verification failed');
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
