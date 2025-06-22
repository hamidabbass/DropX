import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import tw from "twrnc";
import PhoneNumberInput from "@/components/common/PhoneInput";
import Feather from "react-native-vector-icons/Feather";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";
import type { CountryItem } from "react-native-country-codes-picker";

export default function PersonalInfoScreen() {
  const router = useRouter();
  const {
    fullName,
    email,
    phone: routePhone,
    address: routeAddress,
    licenseNumber: routeLicense,
  } = useLocalSearchParams();

  const [image, setImage] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState("pending");
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedAt, setVerifiedAt] = useState<string | null>(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(typeof fullName === "string" ? fullName : "");
  const [emailVal, setEmailVal] = useState(typeof email === "string" ? email : "");
  const [phone, setPhone] = useState(typeof routePhone === "string" ? routePhone : "");
  const [address, setAddress] = useState(typeof routeAddress === "string" ? routeAddress : "");
  const [licenseNumber, setLicenseNumber] = useState(typeof routeLicense === "string" ? routeLicense : "");

  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [country, setCountry] = useState<CountryItem>({
    code: "PK",
    dial_code: "+92",
    flag: "🇵🇰",
    name: { en: "Pakistan" },
  });

  const captureImage = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission denied", "Camera permission is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setVerificationStatus("pending");
      setIsVerified(false);
      setVerifiedAt(null);
      setLogs([]);
    }
  };

  const handleVerification = async () => {
    if (!image) {
      Alert.alert("Upload Required", "Please capture your image before verifying.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("face_image", {
        uri: image,
        type: "image/jpeg",
        name: "face.jpg",
      } as any);

      const res = await axios.post(`${API_BASE_URL}/driver-verification/verifications/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      const { status, is_verified, verified_at, logs } = res.data;

      setVerificationStatus(status);
      setIsVerified(is_verified);
      setVerifiedAt(verified_at);
      setLogs(logs || []);

      if (!is_verified) {
        Alert.alert("Verification Failed", "Face does not match. Try again.");
      } else {
        Alert.alert("Verified", "Face verification successful.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong during verification.");
      setVerificationStatus("failed");
    } finally {
      setLoading(false);
    }
  };

  const canProceed = isVerified;

  return (
    <ScrollView style={tw`flex-1 bg-white px-6 py-6`}>
      <Text style={tw`text-2xl font-bold text-black mt-10`}>Driver Info</Text>

      {/* Avatar + Verify */}
      <View style={tw`items-center mb-6 mt-6`}>
        <Pressable onPress={captureImage} style={tw`relative`}>
          {image ? (
            <Image source={{ uri: image }} style={tw`size-44 rounded-full`} />
          ) : (
            <View style={tw`size-44 bg-gray-200 rounded-full items-center justify-center`}>
              <Text style={tw`text-5xl`}>👤</Text>
            </View>
          )}
          <View style={tw`absolute bottom-2 right-2 bg-green-600 size-8 rounded-full items-center justify-center border-2 border-white`}>
            <Feather name="camera" size={18} color="#fff" />
          </View>
        </Pressable>

        {image && (
          <TouchableOpacity
            onPress={handleVerification}
            style={tw`mt-4 bg-blue-600 px-6 py-2 rounded-full`}
          >
            <Text style={tw`text-white font-bold text-base`}>
              {loading ? "Verifying..." : "Verify"}
            </Text>
          </TouchableOpacity>
        )}

        <Text style={tw`mt-3 text-base`}>
          {loading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : verificationStatus === "Verified" ? (
            "✅ Verified"
          ) : verificationStatus === "Rejected" ? (
            "❌ Rejected"
          ) : (
            "📷 Awaiting Verification"
          )}
        </Text>
      </View>

      {/* Fields */}
      <Text style={tw`text-sm text-black mb-1`}>Full Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Full Name"
        style={tw`bg-gray-100 rounded-lg px-4 py-3 mb-4`}
      />

      <Text style={tw`text-sm text-black mb-1`}>Email</Text>
      <TextInput
        value={emailVal}
        onChangeText={setEmailVal}
        placeholder="Email"
        keyboardType="email-address"
        style={tw`bg-gray-100 rounded-lg px-4 py-3 mb-4`}
      />

      <PhoneNumberInput
        phone={phone}
        setPhone={setPhone}
        country={country}
        setCountry={(val: CountryItem) => setCountry(val)}
        showPicker={showCountryPicker}
        setShowPicker={setShowCountryPicker}
      />

      <Text style={tw`text-sm text-black mb-1`}>Address</Text>
      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="Address"
        style={tw`bg-gray-100 rounded-lg px-4 py-3 mb-4`}
      />

      <Text style={tw`text-sm text-black mb-1`}>License Number</Text>
      <TextInput
        value={licenseNumber}
        onChangeText={setLicenseNumber}
        placeholder="License Number"
        style={tw`bg-gray-100 rounded-lg px-4 py-3 mb-4`}
      />

      <TouchableOpacity
        onPress={() => {
          if (!canProceed) {
            Alert.alert("Verification Required", "Please verify your face before continuing.");
            return;
          }
          router.replace("/(tabs)/home");
        }}
        style={tw`bg-black rounded-full py-4 mt-6`}
        disabled={!canProceed}
      >
        <Text style={tw`text-center text-white font-bold`}>
          {canProceed ? "Continue" : "Verify to Continue"}
        </Text>
      </TouchableOpacity>

      {logs.length > 0 && (
        <View style={tw`mt-6`}>
          <Text style={tw`font-bold text-base mb-2`}>Verification Logs:</Text>
          {logs.map((log: any) => (
            <View key={log.log_id} style={tw`mb-2 p-3 bg-gray-100 rounded-lg`}>
              <Text style={tw`text-sm text-black`}>{log.action}</Text>
              <Text style={tw`text-xs text-gray-600`}>{log.comments}</Text>
              <Text style={tw`text-xs text-gray-400`}>
                {new Date(log.timestamp).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
