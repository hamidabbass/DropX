import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { verifyDriver } from "../redux/driverVerificationActions";

const DriverVerification: React.FC = () => {
  const [driverPhoto, setDriverPhoto] = useState<string | null>(null);
  const [cnicFront, setCnicFront] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPicker, setCurrentPicker] = useState<"driver" | "cnic" | null>(
    null
  );
  const dispatch = useAppDispatch();
  const { isLoading, error, result, persisted } = useAppSelector(
    (state) => state.driverVerification
  );

  const pickImage = async (
    onPick: (uri: string) => void,
    fromCamera = false
  ) => {
    let result;
    if (fromCamera) {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        // Remove aspect to allow cropping full image
        quality: 0.7,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        // Remove aspect to allow cropping full image
        quality: 0.7,
      });
    }
    if (!result.canceled && result.assets && result.assets.length > 0) {
      onPick(result.assets[0].uri);
      // Reset result so mustReupload is cleared and button is enabled
      dispatch({ type: 'driverVerification/clearPersistedVerification' });
    }
    setModalVisible(false);
    setCurrentPicker(null);
  };

  const handleNext = () => {
    if (driverPhoto && cnicFront) {
      dispatch(
        verifyDriver({ faceImageUri: driverPhoto, cnicImageUri: cnicFront })
      );
    }
  };

  // If verification failed, require re-upload
  // Only require re-upload if result exists and not loading
  const mustReupload =
    !!result &&
    !isLoading &&
    (!result.face_verification_status ||
      !result.verification_status ||
      (typeof result.verification_status === 'string' && result.verification_status.toLowerCase() !== 'verified'));

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView
        contentContainerStyle={tw`flex-grow items-center justify-center p-6`}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Modal for choosing image source */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => {
            setModalVisible(false);
            setCurrentPicker(null);
          }}
        >
          <View style={tw`flex-1 justify-center items-center bg-black/40`}>
            <View style={tw`bg-white rounded-xl p-6 w-64`}>
              <Text style={tw`text-lg font-bold mb-4 text-center`}>
                Select Option
              </Text>
              <Pressable
                style={tw`bg-black rounded-lg px-4 py-3 mb-3`}
                onPress={() => {
                  if (currentPicker === "driver")
                    pickImage(setDriverPhoto, false);
                  else if (currentPicker === "cnic")
                    pickImage(setCnicFront, false);
                }}
                disabled={isLoading}
              >
                <Text style={tw`text-white text-center text-base`}>
                  Upload from Gallery
                </Text>
              </Pressable>
              <Pressable
                style={tw`bg-gray-500 rounded-lg px-4 py-3 mb-3`}
                onPress={() => {
                  if (currentPicker === "driver")
                    pickImage(setDriverPhoto, true);
                  else if (currentPicker === "cnic")
                    pickImage(setCnicFront, true);
                }}
                disabled={isLoading}
              >
                <Text style={tw`text-white text-center text-base`}>
                  Capture Photo
                </Text>
              </Pressable>
              <Pressable
                style={tw`mt-2`}
                onPress={() => {
                  setModalVisible(false);
                  setCurrentPicker(null);
                }}
              >
                <Text style={tw`text-center text-gray-500`}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Driver Photo Section */}
        <Text style={tw`text-xl font-bold mb-3`}>Upload Your Picture</Text>
        <TouchableOpacity
          style={tw`w-full h-52 rounded-2xl border-2 border-dashed border-gray-400 mb-5 items-center justify-center bg-gray-100 overflow-hidden`}
          onPress={() => {
            setModalVisible(true);
            setCurrentPicker("driver");
          }}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          {driverPhoto ? (
            <Image
              source={{ uri: driverPhoto }}
              style={tw`w-full h-full rounded-2xl`}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={require("../assets/images/avatar.png")}
              style={tw`w-32 h-32 rounded-full`}
            />
          )}
        </TouchableOpacity>

        {/* CNIC Photo Section */}
        <Text style={tw`text-xl font-bold mb-3`}>Upload CNIC Frontside</Text>
        <TouchableOpacity
          style={tw`w-full h-52 rounded-2xl border-2 border-dashed border-gray-400 mb-8 items-center justify-center bg-gray-100 overflow-hidden`}
          onPress={() => {
            setModalVisible(true);
            setCurrentPicker("cnic");
          }}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          {cnicFront ? (
            <Image
              source={{ uri: cnicFront }}
              style={tw`w-full h-full rounded-2xl`}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={require("../assets/images/nic-card.png")}
              style={tw`w-40 h-24 rounded-lg`}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>

        {/* Show result or error */}
        {error && (
          <Text style={tw`text-red-500 text-center mb-4`}>{error}</Text>
        )}
        {result && (
          <View style={tw`bg-gray-100 rounded-xl p-4 mb-4 w-full`}>
            <Text style={tw`text-base mb-1`}>
              <Text style={tw`font-bold`}>Verification Status:</Text>{' '}
              {result.verification_status}
            </Text>
            {/* CNIC Number */}
            <Text style={tw`text-base mb-1`}>
              <Text style={tw`font-bold`}>CNIC Number:</Text>{' '}
              {result.cnic_number}
            </Text>
            {/* Full Name */}
            <Text style={tw`text-base mb-1`}>
              <Text style={tw`font-bold`}>Full Name:</Text> {result.full_name}
            </Text>
            {/* Logs (if present and array) */}
            {Array.isArray(result.logs) && result.logs.length > 0 && (
              <View style={tw`mt-2`}>
                <Text style={tw`font-bold mb-1`}>Logs:</Text>
                {result.logs.map((log: any, idx: number) => (
                  <View key={log.log_id || idx} style={tw`mb-1 pl-2`}>
                    <Text style={tw`text-xs`}>Action: {log.action}</Text>
                    <Text style={tw`text-xs`}>Comments: {log.comments}</Text>
                    <Text style={tw`text-xs`}>Timestamp: {log.timestamp}</Text>
                  </View>
                ))}
              </View>
            )}
            {mustReupload && (
              <Text style={tw`text-red-600 font-bold mt-2`}>
                Verification failed. Please re-upload clear images to continue.
              </Text>
            )}
          </View>
        )}

        <View style={tw`w-full mt-8`}>
          <TouchableOpacity
            style={tw`bg-black px-6 py-3 rounded-lg w-full mb-2 ${
              !driverPhoto || !cnicFront || isLoading || mustReupload ? "opacity-50" : ""
            }`}
            onPress={handleNext}
            disabled={!driverPhoto || !cnicFront || isLoading || mustReupload}
          >
            <Text style={tw`text-white text-center text-base`}>
              {isLoading ? "Verifying..." : mustReupload ? "Re-upload Required" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default DriverVerification;
