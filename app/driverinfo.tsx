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

  // Hydrate driver + vehicle + verification info after login if missing
  React.useEffect(() => {
    const hydrate = async () => {
      try {
        // Even if vehicle exists, we might still need driver (cnic/photo) so don't early return just on vehicle
        const access = loginData?.access || (await AsyncStorage.getItem("access"));
        if (!access) return;

        const authHeader = { Authorization: `Bearer ${access}` } as const;

        // Fetch vehicle (try to support array or single object responses) only if not in state
        if (!vehicle) {
          try {
            const vehicleRes = await fetch(`${API_BASE_URL}/vehicle/vehicles/`, {
              headers: { ...authHeader },
            });
            if (vehicleRes.ok) {
              const v = await vehicleRes.json();
              const picked = Array.isArray(v) ? v[0] : v;
              if (picked) dispatch(setVehicleInfo(picked));
            }
          } catch {
            // ignore vehicle fetch errors for now
          }
        }

        // Fetch verification info (CNIC + full name) if missing
        if (!driver?.cnic || !driver?.name) {
          try {
            const verRes = await fetch(`${API_BASE_URL}/driver-verification/verifications/`, {
              headers: { ...authHeader },
            });
            if (verRes.ok) {
              const data = await verRes.json();
              const record = Array.isArray(data) ? (data[data.length - 1] || data[0]) : data; // last (latest) fallback first
              if (record) {
                const full_name = record.full_name || record.name || driverRegister?.full_name;
                const cnic_number = record.cnic_number || record.cnic;
                if (full_name || cnic_number) {
                  dispatch(setDriverInfo({
                    name: full_name || driver?.name || "",
                    cnic: cnic_number || driver?.cnic || "",
                  }));
                }
              }
            }
          } catch {
            // ignore verification fetch errors
          }
        }

        // Attempt to hydrate photo from AsyncStorage if not present
        if (!driver?.photo) {
          const storedPhoto = await AsyncStorage.getItem('driverPhoto');
            if (storedPhoto) {
              dispatch(setDriverInfo({ photo: storedPhoto }));
            }
        }
      } catch (e) {
        // noop
      }
    };
    hydrate();
  }, [loginData?.access, vehicle, driver?.cnic, driver?.name, driver?.photo]);

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
