import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/Feather";
import PhoneNumberInput from "@/components/common/PhoneInput";
import { useRouter } from "expo-router";
import type { CountryItem } from "react-native-country-codes-picker";
import { API_BASE_URL } from "@/config/api";

export default function SignUpScreen() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [country, setCountry] = useState({
    code: "US",
    dial_code: "+1",
    flag: "🇺🇸",
    name: "United States",
  });

  const validateForm = () => {
    if (!firstName || !lastName || !email || !address || !password || !phone) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return false;
    }

    if (!agreed) {
      Alert.alert(
        "Terms Not Accepted",
        "You must accept the Terms & Conditions."
      );
      return false;
    }

    return true;
  };

  const isFormValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return (
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      emailRegex.test(email) &&
      address.trim() !== "" &&
      password.length >= 6 &&
      phone.trim().length >= 6 &&
      agreed
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const fullPhoneNumber = `${country.dial_code}${phone.replace(/\D/g, "")}`;

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone_number: fullPhoneNumber,
      address,
      password,
    };

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/accounts/sender-register/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        const errorMsg =
          result?.message || "Registration failed. Please try again.";
        throw new Error(errorMsg);
      }

      Alert.alert("Success", "You’ve registered successfully!");
      router.push({ pathname: "/personalinfo", params: { phone: fullPhoneNumber } });
    } catch (error: any) {
      Alert.alert(
        "Registration Error",
        error.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView
        contentContainerStyle={tw`px-6 pb-8`}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Image */}
        <Image
          source={require("../assets/images/dropX.png")}
          style={tw`size-56 mx-auto -mt-6`}
          resizeMode="contain"
        />

        <Text style={tw`text-xl font-bold text-center text-black mb-6 -mt-20`}>
          Become a DropX User
        </Text>

        {/* Form Inputs */}
        <TextInput
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          style={tw`border rounded-lg px-4 py-3 mb-4 border-gray-300`}
        />
        <TextInput
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          style={tw`border rounded-lg px-4 py-3 mb-4 border-gray-300`}
        />
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          style={tw`border rounded-lg px-4 py-3 mb-4 border-gray-300`}
        />

        {/* Phone Number Input */}
        <PhoneNumberInput
          phone={phone}
          setPhone={setPhone}
          country={country}
          setCountry={setCountry}
          showPicker={showCountryPicker}
          setShowPicker={setShowCountryPicker}
        />

        <TextInput
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
          style={tw`border rounded-lg px-4 py-3 mb-4 border-gray-300`}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={tw`border rounded-lg px-4 py-3 mb-4 border-gray-300`}
        />

        {/* Terms Checkbox */}
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
            I agree to GoRide{" "}
            <Text style={tw`text-black font-medium`}>Terms & Conditions</Text>
          </Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!isFormValid() || loading}
          style={tw`w-full rounded-full py-3 ${
            isFormValid() ? "bg-black" : "bg-gray-200"
          } flex items-center`}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={tw`text-white font-bold text-base`}>Register</Text>
          )}
        </TouchableOpacity>

        {/* Link to Login */}
        <Text style={tw`text-sm text-gray-600 mt-4 text-center`}>
          Already have an account?{" "}
          <Text
            style={tw`text-black font-semibold`}
            onPress={() => router.replace("/signin")}
          >
            Login
          </Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
