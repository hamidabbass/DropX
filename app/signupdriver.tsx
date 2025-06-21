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

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    licenseNumber: "",
    password: "",
    phone: "",
    agreed: "",
  });

  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [country, setCountry] = useState({
    code: "PK",
    dial_code: "+92",
    flag: "🇵🇰",
    name: "Pakistan",
  });

  const validateFields = () => {
    const newErrors: any = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) newErrors.email = "Invalid email format";
    }
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!licenseNumber.trim())
      newErrors.licenseNumber = "License number is required";
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!agreed) newErrors.agreed = "You must accept the terms";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

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
      const response = await fetch(`${API_BASE_URL}/accounts/driver-register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || "Registration failed.");
      }

      Alert.alert("Success", "Account created successfully!");

      router.push({
        pathname: "/personalinfo",
        params: {
          fullName: `${firstName} ${lastName}`,
          email,
          phone: fullPhone,
          address,
          licenseNumber,
        },
      });
    } catch (err: any) {
      console.error("❌ Registration error:", err.message);
      Alert.alert("Registration Failed", err.message);
    }
  };

  const isFormValid = () => {
    return (
      firstName &&
      lastName &&
      email &&
      phone &&
      address &&
      licenseNumber &&
      password.length >= 6 &&
      agreed
    );
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
          <Text style={tw`text-xl font-bold text-center text-black mb-6 -mt-20`}>
            Become a DropX Driver
          </Text>

          <TextInput
            placeholder="First Name *"
            value={firstName}
            onChangeText={(text) => {
              setFirstName(text);
              if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: "" }));
            }}
            style={tw`border border-gray-300 rounded-lg p-3 mb-2.5`}
          />
          {errors.firstName && <Text style={tw`text-red-500 text-xs mb-2`}>{errors.firstName}</Text>}

          <TextInput
            placeholder="Last Name *"
            value={lastName}
            onChangeText={(text) => {
              setLastName(text);
              if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: "" }));
            }}
            style={tw`border border-gray-300 rounded-lg p-3 mb-2.5`}
          />
          {errors.lastName && <Text style={tw`text-red-500 text-xs mb-2`}>{errors.lastName}</Text>}

          {/* Email */}
          <TextInput
            placeholder="Email *"
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
            }}
            style={tw`border border-gray-300 rounded-lg p-3 mb-2.5`}
          />
          {errors.email && <Text style={tw`text-red-500 text-xs mb-2`}>{errors.email}</Text>}

          {/* Phone Number */}
          <PhoneNumberInput
            phone={phone}
            setPhone={(text) => {
              setPhone(text);
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
            }}
            country={country}
            setCountry={setCountry}
            showPicker={showCountryPicker}
            setShowPicker={setShowCountryPicker}
          />
          {errors.phone && <Text style={tw`text-red-500 text-xs mb-2`}>{errors.phone}</Text>}

          {/* Address */}
          <TextInput
            placeholder="Address *"
            value={address}
            onChangeText={(text) => {
              setAddress(text);
              if (errors.address) setErrors((prev) => ({ ...prev, address: "" }));
            }}
            style={tw`border border-gray-300 rounded-lg p-3 mb-2.5`}
          />
          {errors.address && <Text style={tw`text-red-500 text-xs mb-2`}>{errors.address}</Text>}

          {/* License Number */}
          <TextInput
            placeholder="License Number *"
            value={licenseNumber}
            onChangeText={(text) => {
              setLicenseNumber(text);
              if (errors.licenseNumber) setErrors((prev) => ({ ...prev, licenseNumber: "" }));
            }}
            style={tw`border border-gray-300 rounded-lg p-3 mb-2.5`}
          />
          {errors.licenseNumber && (
            <Text style={tw`text-red-500 text-xs mb-2`}>{errors.licenseNumber}</Text>
          )}

          <TextInput
            placeholder="Password *"
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
            }}
            style={tw`border border-gray-300 rounded-lg p-3 mb-2.5`}
          />
          {errors.password && (
            <Text style={tw`text-red-500 text-xs mb-2`}>{errors.password}</Text>
          )}

          <TouchableOpacity
            style={tw`flex-row items-center mb-4`}
            onPress={() => {
              setAgreed(!agreed);
              if (errors.agreed) setErrors((prev) => ({ ...prev, agreed: "" }));
            }}
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
              <Text style={tw`text-black font-semibold`}>Terms & Conditions</Text>
            </Text>
          </TouchableOpacity>
          {errors.agreed && (
            <Text style={tw`text-red-500 text-xs mb-2`}>{errors.agreed}</Text>
          )}

          {/* Register Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!isFormValid()}
            style={tw`py-4 rounded-full mb-6 ${
              isFormValid() ? "bg-black" : "bg-gray-300"
            }`}
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
