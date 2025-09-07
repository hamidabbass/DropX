import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import tw from "twrnc";
import PhoneNumberInput from "@/components/common/PhoneInput";
import { useRouter, useLocalSearchParams } from "expo-router";
import type { CountryItem } from "react-native-country-codes-picker";

export default function SenderInfoScreen() {
  const router = useRouter();
  const { fullName, email, phone, address } = useLocalSearchParams();

  const [name, setName] = useState(typeof fullName === "string" ? fullName : "");
  const [emailVal, setEmailVal] = useState(typeof email === "string" ? email : "");
  const [phoneVal, setPhoneVal] = useState(typeof phone === "string" ? phone : "");
  const [addressVal, setAddressVal] = useState(typeof address === "string" ? address : "");

  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [country, setCountry] = useState<CountryItem>({
    code: "PK",
    dial_code: "+92",
    flag: "🇵🇰",
    name: { en: "Pakistan" },
  });

  const handleContinue = () => {
    if (!name || !emailVal || !phoneVal || !addressVal) {
      Alert.alert("Missing Info", "Please fill in all required fields.");
      return;
    }

    // Here you can hit an API to save sender info if needed

    router.replace("/(tabs)/home"); // Navigate to the home screen after saving info
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={tw`flex-1`}
    >
      <ScrollView
        style={tw`flex-1 bg-white`}
        contentContainerStyle={tw`pt-6 px-6 pb-20`}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={tw`text-2xl font-bold text-black mb-6`}>Sender Info</Text>

        <TextInput
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          style={tw`bg-gray-100 rounded-lg px-4 py-3 mb-4`}
        />

        <TextInput
          placeholder="Email"
          value={emailVal}
          onChangeText={setEmailVal}
          keyboardType="email-address"
          autoCapitalize="none"
          style={tw`bg-gray-100 rounded-lg px-4 py-3 mb-4`}
        />

        <PhoneNumberInput
          phone={phoneVal}
          setPhone={setPhoneVal}
          country={country}
          setCountry={setCountry}
          showPicker={showCountryPicker}
          setShowPicker={setShowCountryPicker}
        />

        <TextInput
          placeholder="Address"
          value={addressVal}
          onChangeText={setAddressVal}
          style={tw`bg-gray-100 rounded-lg px-4 py-3 mb-4`}
        />

        <TouchableOpacity
          onPress={handleContinue}
          style={tw`bg-black py-4 rounded-full mt-6`}
        >
          <Text style={tw`text-white text-center font-bold text-base`}>
            Save & Continue
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
