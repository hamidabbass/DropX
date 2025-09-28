import { API_BASE_URL } from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import tw from "twrnc";
import { useAppDispatch } from "../hooks/reduxHooks";
import { loginDriver as loginDriverThunk } from "../redux/driverAuthActions";

export default function SignInScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [userType, setUserType] = useState<"driver" | "sender">("driver");
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (text: string) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(emailRegex.test(text) ? "" : "Enter a valid email address");
  };

  const validatePassword = (text: string) => {
    setPassword(text);
    setPasswordError(text.length >= 6 ? "" : "Password must be at least 6 characters");
  };

  const isFormValid = () => {
    return email && password && emailError === "" && passwordError === "";
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      Alert.alert("Invalid Input", "Please fix the errors before submitting.");
      return;
    }

    setLoading(true);
    try {
      if (userType === "driver") {
        // Go through Redux so loginData is kept in state
        const data = await dispatch(loginDriverThunk({ email, password })).unwrap();
        await AsyncStorage.setItem("access", data.access);
        await AsyncStorage.setItem("refresh", data.refresh);
        await AsyncStorage.setItem("userType", userType);
        console.log("✅ Access Token Stored:", data.access);
        router.push("/(tabs)/home");
      } else {
        // Sender login: keep existing direct call for now
        const loginEndpoint = `${API_BASE_URL}/accounts/sender-login/`;
        const response = await fetch(loginEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.detail || "Login failed");
        await AsyncStorage.setItem("access", data.access);
        await AsyncStorage.setItem("refresh", data.refresh);
        await AsyncStorage.setItem("userType", userType);
        console.log("✅ Access Token Stored:", data.access);
        router.push("/(tabs)/home");
      }
    } catch (error: any) {
      console.error("Login error:", error.message);
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`px-6 pt-6 pb-6`} keyboardShouldPersistTaps="handled">
        <Image source={require("../assets/images/dropX.png")} style={tw`size-56 mx-auto`} resizeMode="contain" />

        <Text style={tw`text-2xl font-bold text-center text-black mb-2 -mt-16`}>
          Welcome Back 👋
        </Text>
        <Text style={tw`text-gray-500 text-center mb-6`}>
          Sign in to your DropX account
        </Text>

        <View style={tw`flex-row justify-center mb-6`}>
          <TouchableOpacity
            onPress={() => setUserType("driver")}
            style={tw`flex-1 py-3 rounded-l-full border ${userType === "driver" ? "bg-black" : "bg-gray-100"}`}
          >
            <Text style={tw`text-center ${userType === "driver" ? "text-white font-bold" : "text-black"}`}>
              Login as Driver
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setUserType("sender")}
            style={tw`flex-1 py-3 rounded-r-full border ${userType === "sender" ? "bg-black" : "bg-gray-100"}`}
          >
            <Text style={tw`text-center ${userType === "sender" ? "text-white font-bold" : "text-black"}`}>
              Login as Sender
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={validateEmail}
          style={tw`border border-gray-300 rounded-lg p-3 mb-1`}
        />
        {emailError ? (
          <Text style={tw`text-red-500 text-xs mb-3`}>{emailError}</Text>
        ) : (
          <View style={tw`mb-3`} />
        )}

        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={validatePassword}
          style={tw`border border-gray-300 rounded-lg p-3 mb-1`}
        />
        {passwordError ? (
          <Text style={tw`text-red-500 text-xs mb-3`}>{passwordError}</Text>
        ) : (
          <View style={tw`mb-3`} />
        )}

        <TouchableOpacity style={tw`flex-row items-center mb-4`} onPress={() => setRememberMe(!rememberMe)}>
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

      <View style={tw`px-6 pb-6 -mt-20`}>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!isFormValid() || loading}
          style={tw`py-3 rounded-full ${
            isFormValid() && !loading ? "bg-black" : "bg-gray-300"
          } flex items-center`}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={tw`text-white text-center font-bold text-base`}>Login</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={tw`text-sm text-gray-600 text-center pb-10`}>
        Don’t have an account?{" "}
        <Text
          onPress={() =>
            router.replace(userType === "driver" ? "/signupdriver" : "/signupsender")
          }
          style={tw`text-black font-semibold`}
        >
          Register
        </Text>
      </Text>
    </SafeAreaView>
  );
}
