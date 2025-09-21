import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import tw from "twrnc";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { setDriverInfo, setVehicleInfo } from "../redux/driverVehicleSlice";
import { createVehicle } from "../redux/vehicleActions";

const VehicleDetails: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, error, result } = useAppSelector((state) => state.vehicle);
  const driverVerification = useAppSelector((state) => state.driverVerification.persisted);
  const driverAuth = useAppSelector((state) => state.driverAuth.loginData);
  const driverRegister = useAppSelector((state) => state.driverAuth.registerData);
  const driverPhoto = useAppSelector((state) => state.driverVehicle.driver?.photo);
  const [form, setForm] = useState({
    vehicle_type_name: "",
    description: "",
    make: "",
    model: "",
    year: "",
    number_plate: "",
    color: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = () => {
    dispatch(
      createVehicle({
        ...form,
        year: Number(form.year),
      })
    );
  };

  // On successful vehicle creation, persist driver/vehicle info and navigate
  useEffect(() => {
    if (result) {
      // Compose info
      // Map backend fields to local fields
      // Always merge registration values for phone/license/name
      const license = driverAuth?.license_number || driverRegister?.license_number || driverAuth?.license || driverRegister?.license || "";
      const phone = driverAuth?.phone_number || driverRegister?.phone_number || driverAuth?.phone || driverRegister?.phone || "";
      let name = driverVerification?.full_name || driverAuth?.full_name || driverRegister?.full_name || "";
      if (!name && (driverRegister?.first_name || driverRegister?.last_name)) {
        name = [driverRegister?.first_name, driverRegister?.last_name].filter(Boolean).join(' ');
      }
      const driverInfo = {
        name,
        cnic: driverVerification?.cnic_number || "",
        license,
        phone,
        photo: driverPhoto || null,
      };
      dispatch(setDriverInfo(driverInfo));
      dispatch(setVehicleInfo(result));
      // Navigate to driverinfo page
      router.replace("/driverinfo");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "white" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={tw`p-6 pb-28`}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={tw`text-xl font-bold mb-4`}>Vehicle Details</Text>
        <TextInput
          placeholder="Vehicle Type Name*"
          style={tw`border border-gray-300 rounded-lg p-3 mb-2.5`}
          value={form.vehicle_type_name}
          onChangeText={(v) => handleChange("vehicle_type_name", v)}
        />
        <TextInput
          placeholder="Make*"
          style={tw`border border-gray-300 rounded-lg p-3 mb-2.5`}
          value={form.make}
          onChangeText={(v) => handleChange("make", v)}
        />
        <TextInput
          placeholder="Model*"
          style={tw`border border-gray-300 rounded-lg p-3 mb-2.5`}
          value={form.model}
          onChangeText={(v) => handleChange("model", v)}
        />
        <TextInput
          placeholder="Year*"
          style={tw`border border-gray-300 rounded-lg p-3 mb-2.5`}
          value={form.year}
          onChangeText={(v) => handleChange("year", v)}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Number Plate*"
          style={tw`border border-gray-300 rounded-lg p-3 mb-2.5`}
          value={form.number_plate}
          onChangeText={(v) => handleChange("number_plate", v)}
        />
        <TextInput
          placeholder="Color"
          style={tw`border border-gray-300 rounded-lg p-3 mb-2.5`}
          value={form.color}
          onChangeText={(v) => handleChange("color", v)}
        />
        <TextInput
          placeholder="Description"
          style={tw`border border-gray-300 rounded-lg p-3 mb-2.5 min-h-20 text-left text-top`}
          value={form.description}
          onChangeText={(v) => handleChange("description", v)}
          multiline
          textAlignVertical="top"
        />

        {error && (
          <Text style={tw`text-red-500 mb-2`}>
            {typeof error === "string" ? error : JSON.stringify(error)}
          </Text>
        )}
        {result && (
          <Text style={tw`text-green-600 mb-2`}>
            Vehicle created successfully!
          </Text>
        )}
      </ScrollView>
      <View style={[tw`absolute left-0 right-0 bottom-0 bg-white p-4`]}>
        <TouchableOpacity
          style={tw`bg-black py-3 rounded-lg`}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={tw`text-white text-center text-base`}>
            {isLoading ? "Saving..." : "Save Vehicle"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default VehicleDetails;
