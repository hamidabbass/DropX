import React from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import tw from "twrnc";
import { useAppSelector } from "../hooks/reduxHooks";

export default function DriverInfoScreen() {
  const driver = useAppSelector((state) => state.driverVehicle.driver);
  const vehicle = useAppSelector((state) => state.driverVehicle.vehicle);
  // Debug: show all driver info for troubleshooting
  // Remove after confirming fix
  // console.log('driver info:', driver);

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
          <Text style={tw`text-base mb-2`}>{driver?.name || '-'}</Text>
          <Text style={tw`text-lg font-bold mb-1`}>CNIC:</Text>
          <Text style={tw`text-base mb-2`}>{driver?.cnic || '-'}</Text>
          <Text style={tw`text-lg font-bold mb-1`}>Phone Number:</Text>
          <Text style={tw`text-base mb-2`}>{driver?.phone || 'Not found in Redux. Check registration/login flow.'}</Text>
          <Text style={tw`text-lg font-bold mb-1`}>License Number:</Text>
          <Text style={tw`text-base mb-2`}>{driver?.license || 'Not found in Redux. Check registration/login flow.'}</Text>
        </View>
        {/* Vehicle Details */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-xl font-bold mb-2`}>Vehicle Details</Text>
          {vehicle ? (
            <>
              <Text style={tw`text-lg font-bold mb-1`}>Type:</Text>
              <Text style={tw`text-base mb-2`}>{vehicle.vehicle_type_name || '-'}</Text>
              <Text style={tw`text-lg font-bold mb-1`}>Make:</Text>
              <Text style={tw`text-base mb-2`}>{vehicle.make || '-'}</Text>
              <Text style={tw`text-lg font-bold mb-1`}>Model:</Text>
              <Text style={tw`text-base mb-2`}>{vehicle.model || '-'}</Text>
              <Text style={tw`text-lg font-bold mb-1`}>Year:</Text>
              <Text style={tw`text-base mb-2`}>{vehicle.year || '-'}</Text>
              <Text style={tw`text-lg font-bold mb-1`}>Number Plate:</Text>
              <Text style={tw`text-base mb-2`}>{vehicle.number_plate || '-'}</Text>
              <Text style={tw`text-lg font-bold mb-1`}>Color:</Text>
              <Text style={tw`text-base mb-2`}>{vehicle.color || '-'}</Text>
              <Text style={tw`text-lg font-bold mb-1`}>Description:</Text>
              <Text style={tw`text-base mb-2`}>{vehicle.description || '-'}</Text>
            </>
          ) : (
            <Text style={tw`text-base`}>No vehicle info available.</Text>
          )}
        </View>
        <View style={tw`mb-6`}>
          <Text style={tw`text-red-500 text-xs mb-2`}>DEBUG: {JSON.stringify(driver)}</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
