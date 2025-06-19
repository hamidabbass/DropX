import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  ScrollView,
} from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/Feather";
import SocialButton from "@/components/common/SocialButton";
import type { CountryItem } from "react-native-country-codes-picker";
import PhoneNumberInput from "@/components/common/PhoneInput";
import { useRouter } from "expo-router";

export default function SignUpScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);

  // Country picker state
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [country, setCountry] = useState({
    code: "US",
    dial_code: "+1",
    flag: "🇺🇸",
    name: "United States",
  });

  const handleSubmit = () => {
    if (!agreed) {
      Alert.alert(
        "Terms Not Accepted",
        "You need to accept the Terms & Conditions."
      );
      return;
    }

    if (!phone || phone.length < 6) {
      Alert.alert("Invalid Number", "Please enter a valid phone number");
      return;
    }

    const fullPhoneNumber = `${country.dial_code}${phone.replace(/\D/g, "")}`;
    console.log("Full Phone Number:", fullPhoneNumber);

    // Navigate to OTP screen
    router.push({
      pathname: "/otp",
      params: { phone: fullPhoneNumber },
    });
  };

  const handleCountrySelect = (item: CountryItem) => {
    setCountry({
      code: item.code,
      dial_code: item.dial_code,
      flag: item.flag,
      name: item.name,
    });
    setShowCountryPicker(false);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView
        contentContainerStyle={tw`px-6 pt-4 pb-8 flex-grow`}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Text style={tw`text-2xl font-bold text-black mb-2`}>
          Join GoRide Today ✨
        </Text>
        <Text style={tw`text-gray-500 mb-6`}>
          Let's get started! Enter your phone number to create your account.
        </Text>

        <PhoneNumberInput
          phone={phone}
          setPhone={setPhone}
          country={country}
          setCountry={setCountry}
          showPicker={showCountryPicker}
          setShowPicker={setShowCountryPicker}
        />

        <TouchableOpacity
          style={tw`flex-row items-center mb-4`}
          onPress={() => setAgreed(!agreed)}
        >
          <View
            style={tw`w-5 h-5 mr-2 rounded border border-gray-400 items-center justify-center ${
              agreed ? "bg-green-500" : "bg-white"
            }`}
          >
            {agreed && <Icon name="check" size={14} color="#fff" />}
          </View>
          <Text style={tw`text-sm text-gray-600`}>
            I agree to GoRide{" "}
            <Text style={tw`text-green-600`}>Terms & Conditions</Text>
          </Text>
        </TouchableOpacity>

        {/* Sign In Link */}
        <Text style={tw`text-sm text-gray-600 mb-3 text-center`}>
          Already have an account?{" "}
          <Text style={tw`text-green-600 font-semibold`}>Sign in</Text>
        </Text>

        {/* Divider */}
        <View style={tw`flex-row items-center my-4`}>
          <View style={tw`flex-1 h-px bg-gray-200`} />
          <Text style={tw`mx-4 text-gray-400`}>or</Text>
          <View style={tw`flex-1 h-px bg-gray-200`} />
        </View>

        {/* Social Login Buttons */}
        <View style={tw`w-full mt-4`}>
          <SocialButton
            label="Continue with Google"
            icon={require("../assets/svgs/google.svg")}
            style={tw`mb-4`}
          />
          <SocialButton
            label="Continue with Apple"
            icon={require("../assets/svgs/apple.svg")}
          />
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={tw`px-6 pb-6`}>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!agreed || !phone}
          style={tw`w-full rounded-full py-4 ${
            agreed && phone ? "bg-green-600" : "bg-gray-300"
          }`}
        >
          <Text style={tw`text-white text-center font-bold text-base`}>
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
