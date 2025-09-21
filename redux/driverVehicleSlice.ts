import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
});

export const { setDriverInfo, setVehicleInfo, clearDriverVehicle } = driverVehicleSlice.actions;
export default driverVehicleSlice.reducer;
