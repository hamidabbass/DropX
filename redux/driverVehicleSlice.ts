import { API_BASE_URL } from '@/config/api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Thunk to hydrate driver (verification) + first vehicle using access token in state
export const hydrateDriverFromApi = createAsyncThunk(
  'driverVehicle/hydrateDriverFromApi',
  async (_, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const access = state.driverAuth?.loginData?.access;
      if (!access) return {};
      const headers = { Authorization: `Bearer ${access}` } as const;
      // Fetch verification list
      let verification: any = null;
      try {
        const res = await fetch(`${API_BASE_URL}/driver-verification/verifications/`, { headers });
        if (res.ok) {
          const data = await res.json();
          verification = Array.isArray(data) ? (data[data.length - 1] || data[0]) : data;
        }
      } catch {}
      // Fetch vehicles
      let vehicle: any = null;
      try {
        const vRes = await fetch(`${API_BASE_URL}/vehicle/vehicles/`, { headers });
        if (vRes.ok) {
          const vData = await vRes.json();
            vehicle = Array.isArray(vData) ? vData[0] : vData;
        }
      } catch {}
      return { verification, vehicle };
    } catch (e) {
      return {};
    }
  }
);

interface DriverVehicleState {
  driver: {
    name: string;
    cnic: string;
    license: string;
    phone: string;
    photo: string | null;
  } | null;
  vehicle: any | null;
}

const initialState: DriverVehicleState = {
  driver: null,
  vehicle: null,
};

const driverVehicleSlice = createSlice({
  name: 'driverVehicle',
  initialState,
  reducers: {
    setDriverInfo(state, action: PayloadAction<Partial<DriverVehicleState['driver']>>) {
      const payload = action.payload || {};
      state.driver = {
        name: payload.name ?? state.driver?.name ?? "",
        cnic: payload.cnic ?? state.driver?.cnic ?? "",
        license: payload.license ?? state.driver?.license ?? "",
        phone: payload.phone ?? state.driver?.phone ?? "",
        photo: payload.photo ?? state.driver?.photo ?? null,
      };
    },
    setVehicleInfo(state, action: PayloadAction<any>) {
      state.vehicle = action.payload;
    },
    clearDriverVehicle(state) {
      state.driver = null;
      state.vehicle = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(hydrateDriverFromApi.fulfilled, (state, action) => {
      const { verification, vehicle } = action.payload as any;
      if (verification) {
        state.driver = {
          name: verification.full_name || state.driver?.name || '',
          cnic: verification.cnic_number || state.driver?.cnic || '',
          license: state.driver?.license || '',
          phone: state.driver?.phone || '',
          photo: state.driver?.photo || null,
        };
      }
      if (vehicle && !state.vehicle) state.vehicle = vehicle;
    });
  }
});

export const { setDriverInfo, setVehicleInfo, clearDriverVehicle } = driverVehicleSlice.actions;
export default driverVehicleSlice.reducer;
