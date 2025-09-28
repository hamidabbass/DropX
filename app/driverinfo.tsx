import { API_BASE_URL } from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import tw from "twrnc";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { setDriverInfo, setVehicleInfo } from "../redux/driverVehicleSlice";

export default function DriverInfoScreen() {
  const dispatch = useAppDispatch();
  const driver = useAppSelector((state) => state.driverVehicle.driver);
  const vehicle = useAppSelector((state) => state.driverVehicle.vehicle);
  // Fallback to registration and login data if not found in driver
  const driverRegister = useAppSelector((state) => state.driverAuth.registerData);
  const loginData = useAppSelector((state) => state.driverAuth.loginData);
  console.log("Driver Info Screen - driver:", vehicle, driver, driverRegister);

  // Hydrate driver + vehicle info after login if missing
  React.useEffect(() => {
    const hydrate = async () => {
      try {
        if (driver && vehicle) return; // already loaded
        const access = loginData?.access || (await AsyncStorage.getItem("access"));
        if (!access) return;

        const authHeader = { Authorization: `Bearer ${access}` } as const;

        // Fetch vehicle (try to support array or single object responses)
        try {
          const vehicleRes = await fetch(`${API_BASE_URL}/vehicle/vehicles/`, {
            headers: { ...authHeader },
          });
          if (vehicleRes.ok) {
            const v = await vehicleRes.json();
            const picked = Array.isArray(v) ? v[0] : v;
            if (picked) dispatch(setVehicleInfo(picked));
          }
        } catch {}

        // Fetch profile from a few likely endpoints; stop at first success
        const candidates = [
          `${API_BASE_URL}/accounts/me/`,
          `${API_BASE_URL}/accounts/driver-profile/`,
          `${API_BASE_URL}/accounts/profile/`,
          `${API_BASE_URL}/accounts/driver/me/`,
        ];
        for (const url of candidates) {
          try {
            const res = await fetch(url, { headers: { ...authHeader } });
            if (!res.ok) continue;
            const data = await res.json();
            // Normalize various possible shapes
            const first = data?.first_name || data?.firstName || data?.user?.first_name;
            const last = data?.last_name || data?.lastName || data?.user?.last_name;
            const name = [first, last].filter(Boolean).join(" ") || data?.full_name || data?.fullName || data?.name;
            const phone = data?.phone_number || data?.phone || data?.user?.phone_number;
            const license = data?.license_number || data?.license || data?.user?.license_number;
            const cnic = data?.cnic || data?.cnic_number || data?.user?.cnic_number;
            const photo = data?.photo || data?.avatar || data?.profile_picture || null;
            dispatch(setDriverInfo({ name, phone, license, cnic, photo } as any));
            break;
          } catch {}
        }
      } catch (e) {
        // noop
      }
    };
    hydrate();
    // Only run when tokens/state change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginData?.access]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={tw`flex-1`}
    >
      <ScrollView
        style={tw`flex-1 bg-white`}
        contentContainerStyle={tw`pt-4 px-6 pb-16 flex-grow`}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={tw`text-2xl font-bold text-black mt-6 mb-4`}>Driver Info</Text>
        {/* Driver Photo */}
        <View style={tw`items-center mb-6 mt-2`}>
          {driver?.photo ? (
            <Image source={{ uri: driver.photo }} style={tw`size-44 rounded-full`} />
          ) : (
            <View style={tw`size-44 bg-gray-200 rounded-full items-center justify-center`}>
              <Text style={tw`text-5xl`}>👤</Text>
            </View>
          )}
        </View>
        {/* Driver Details */}
        <View style={tw`mb-6`}> 
          <Text style={tw`text-lg font-bold mb-1`}>Name:</Text>
          <Text style={tw`border border-gray-300 rounded-lg p-3 mb-2.5`}>{driver?.name || '-'}</Text>
          <Text style={tw`text-lg font-bold mb-1`}>CNIC:</Text>
          <Text style={tw`border border-gray-300 rounded-lg p-3 mb-2.5`}>{driver?.cnic || '-'}</Text>
          <Text style={tw`text-lg font-bold mb-1`}>Phone Number:</Text>
          <Text style={tw`border border-gray-300 rounded-lg p-3 mb-2.5`}>
            {driver?.phone || driverRegister?.phone_number || '—'}
          </Text>
          <Text style={tw`text-lg font-bold mb-1`}>License Number:</Text>
            <Text style={tw`border border-gray-300 rounded-lg p-3 mb-2.5`}>
              {driver?.license || driverRegister?.license_number || '—'}
            </Text>
        </View>
        {/* Vehicle Details */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-xl font-bold mb-2`}>Vehicle Details</Text>
          {vehicle ? (
            <>
              <Text style={tw`text-lg font-bold mb-1`}>Type:</Text>
              <Text style={tw`border border-gray-300 rounded-lg p-3 mb-2.5`}>{vehicle.vehicle_type_name || '-'}</Text>
              <Text style={tw`text-lg font-bold mb-1`}>Make:</Text>
              <Text style={tw`border border-gray-300 rounded-lg p-3 mb-2.5`}>{vehicle.make || '-'}</Text>
              <Text style={tw`text-lg font-bold mb-1`}>Model:</Text>
              <Text style={tw`border border-gray-300 rounded-lg p-3 mb-2.5`}>{vehicle.model || '-'}</Text>
              <Text style={tw`text-lg font-bold mb-1`}>Year:</Text>
              <Text style={tw`border border-gray-300 rounded-lg p-3 mb-2.5`}>{vehicle.year || '-'}</Text>
              <Text style={tw`text-lg font-bold mb-1`}>Number Plate:</Text>
              <Text style={tw`border border-gray-300 rounded-lg p-3 mb-2.5`}>{vehicle.number_plate || '-'}</Text>
              <Text style={tw`text-lg font-bold mb-1`}>Color:</Text>
              <Text style={tw`border border-gray-300 rounded-lg p-3 mb-2.5`}>{vehicle.color || '-'}</Text>
              <Text style={tw`text-lg font-bold mb-1`}>Description:</Text>
              <Text style={tw`border border-gray-300 rounded-lg p-3 mb-2.5`}>{vehicle.description || '-'}</Text>
            </>
          ) : (
            <Text style={tw`text-base`}>No vehicle info available.</Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
