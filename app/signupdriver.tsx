// SignUpScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/Feather";
import { useRouter } from "expo-router";
import PhoneNumberInput from "@/components/common/PhoneInput";
import { API_BASE_URL } from "@/config/api";

export default function SignUpScreen() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [country, setCountry] = useState({
    code: "PK",
    dial_code: "+92",
    flag: "🇵🇰",
    name: "Pakistan",
  });

  const handleSubmit = async () => {
    if (!agreed) {
      Alert.alert(
        "Terms Not Accepted",
        "You must accept the Terms & Conditions."
      );
      return;
    }

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !phone ||
      !licenseNumber
    ) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }

    const fullPhone = `${country.dial_code}${phone.replace(/\D/g, "")}`;

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone_number: fullPhone,
      address,
      password,
      license_number: licenseNumber,
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/accounts/driver-register/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || "Registration failed.");
      }

      Alert.alert("Success", "Account created successfully!");

      // Push to profile screen with user data
      router.push({
        pathname: "/personalinfo",
        params: {
          fullName: `${firstName} ${lastName}`,
          email,
          phone: fullPhone,
          address: address,
          licenseNumber: licenseNumber
        },
      });
    } catch (err: any) {
      console.error("❌ Registration error:", err.message);
      Alert.alert("Registration Failed", err.message);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={tw`flex-1`}
      >
        <ScrollView
          contentContainerStyle={tw`px-6 pb-10 -mt-10`}
          keyboardShouldPersistTaps="handled"
        >
          <Image
            source={require("../assets/images/dropX.png")}
            style={tw`size-56 mx-auto`}
            resizeMode="contain"
          />
          <Text
            style={tw`text-xl font-bold text-center text-black mb-6 -mt-20`}
          >
            Become a DropX Driver
          </Text>

          <TextInput
            placeholder="First Name *"
            value={firstName}
            onChangeText={setFirstName}
            style={tw`border border-gray-300 rounded-lg p-3 mb-3`}
          />
          <TextInput
            placeholder="Last Name *"
            value={lastName}
            onChangeText={setLastName}
            style={tw`border border-gray-300 rounded-lg p-3 mb-3`}
          />
          <TextInput
            placeholder="Email *"
            value={email}
            keyboardType="email-address"
            onChangeText={setEmail}
            style={tw`border border-gray-300 rounded-lg p-3 mb-3`}
          />

          <PhoneNumberInput
            phone={phone}
            setPhone={setPhone}
            country={country}
            setCountry={setCountry}
            showPicker={showCountryPicker}
            setShowPicker={setShowCountryPicker}
          />

          <TextInput
            placeholder="Address *"
            value={address}
            onChangeText={setAddress}
            style={tw`border border-gray-300 rounded-lg p-3 mb-3`}
          />
          <TextInput
            placeholder="License Number *"
            value={licenseNumber}
            onChangeText={setLicenseNumber}
            style={tw`border border-gray-300 rounded-lg p-3 mb-3`}
          />
          <TextInput
            placeholder="Password *"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={tw`border border-gray-300 rounded-lg p-3 mb-3`}
          />

          <TouchableOpacity
            style={tw`flex-row items-center mb-4`}
            onPress={() => setAgreed(!agreed)}
          >
            <View
              style={tw`w-5 h-5 mr-2 rounded border border-gray-400 items-center justify-center ${
                agreed ? "bg-black" : "bg-white"
              }`}
            >
              {agreed && <Icon name="check" size={14} color="#fff" />}
            </View>
            <Text style={tw`text-sm text-gray-600`}>
              I agree to{" "}
              <Text style={tw`text-black font-semibold`}>
                Terms & Conditions
              </Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit}
            style={tw`bg-black py-4 rounded-full mb-6`}
          >
            <Text style={tw`text-center text-white font-bold`}>Register</Text>
          </TouchableOpacity>

          <Text style={tw`text-sm text-gray-600 text-center`}>
            Already have an account?{" "}
            <Text
              onPress={() => router.replace("/signin")}
              style={tw`text-black font-semibold`}
            >
              Login
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
