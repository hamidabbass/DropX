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
} from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/Feather";
import SocialButton from "@/components/common/SocialButton";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "@/config/api";
import { loginDriver } from '@/redux/authActions';


export default function SignInScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [userType, setUserType] = useState<"driver" | "sender">("driver");

  const handleSubmit = async () => {
  if (!email || !password) {
    Alert.alert("Missing Fields", "Please enter email and password");
    return;
  }

  try {
    const response = await fetch (`${API_BASE_URL}/accounts/driver-login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.detail || "Login failed");
    }

    console.log("Login successful:", data);

    // ✅ Optional: store token in async storage or context here if provided
    // await AsyncStorage.setItem('accessToken', data.token);

    // Redirect to dashboard
    router.push("/(tabs)/home");
  } catch (error: any) {
    console.error("Login error:", error.message);
    Alert.alert("Login Failed", error.message);
  }
};


  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView
        contentContainerStyle={tw`px-6 pt-6 pb-6`}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require("../assets/images/dropX.png")}
          style={tw`size-56 mx-auto`}
          resizeMode="contain"
        />
        <Text style={tw`text-2xl font-bold text-center text-black mb-2 -mt-16`}>
          Welcome Back 👋
        </Text>
        <Text style={tw`text-gray-500 text-center mb-6`}>
          Sign in to your DropX account
        </Text>

        {/* Role Selector */}
        <View style={tw`flex-row justify-center mb-6`}>
          <TouchableOpacity
            onPress={() => setUserType("driver")}
            style={tw`flex-1 py-3 rounded-l-full border ${
              userType === "driver" ? "bg-black" : "bg-gray-100"
            }`}
          >
            <Text
              style={tw`text-center ${
                userType === "driver" ? "text-white font-bold" : "text-black"
              }`}
            >
              Login as Driver
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setUserType("sender")}
            style={tw`flex-1 py-3 rounded-r-full border ${
              userType === "sender" ? "bg-black" : "bg-gray-100"
            }`}
          >
            <Text
              style={tw`text-center ${
                userType === "sender" ? "text-white font-bold" : "text-black"
              }`}
            >
              Login as Sender
            </Text>
          </TouchableOpacity>
        </View>

        {/* Email Input */}
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={tw`border border-gray-300 rounded-lg p-3 mb-4`}
        />

        {/* Password Input */}
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={tw`border border-gray-300 rounded-lg p-3 mb-4`}
        />

        {/* Remember Me */}
        <TouchableOpacity
          style={tw`flex-row items-center mb-4`}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <View
            style={tw`w-5 h-5 mr-2 rounded border border-gray-400 items-center justify-center ${
              rememberMe ? "bg-black" : "bg-white"
            }`}
          >
            {rememberMe && <Icon name="check" size={14} color="#fff" />}
          </View>
          <Text style={tw`text-sm text-gray-600`}>Remember me</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Submit Button */}
      <View style={tw`px-6 pb-6 -mt-20`}>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!email || !password}
          style={tw`py-3 rounded-full ${
            email && password ? "bg-black" : "bg-gray-300"
          }`}
        >
          <Text style={tw`text-white text-center font-bold text-base`}>
            Login
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={tw`text-sm text-gray-600 text-center pb-10`}>
        Don't have an account?{" "}
        <Text
          onPress={() => router.replace("/signupdriver")}
          style={tw`text-black font-semibold`}
        >
          Register
        </Text>
      </Text>
    </SafeAreaView>
  );
}
