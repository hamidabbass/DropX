import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import tw from "twrnc";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function OTPScreen() {
  const { phone } = useLocalSearchParams();
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 3) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 10);
    }

    if (newOtp.every((d) => d !== "")) {
      const otpCode = newOtp.join("");
      console.log("Entered OTP:", otpCode);
      Keyboard.dismiss();
      router.push("/personal-info");
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={tw`flex-1 bg-white p-6 justify-between`}>
      <View>
        <Text style={tw`text-xl font-bold text-black mb-2`}>
          Enter OTP Code 🔐
        </Text>
        <Text style={tw`text-gray-600 mb-6`}>
          Check your messages! We've sent a one-time code to {phone}. Enter the
          code below to verify your account and continue.
        </Text>

        <View style={tw`flex-row justify-between mb-4`}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={tw`w-14 h-14 border rounded-xl text-center text-xl ${
                digit ? "border-green-500" : "border-gray-300"
              }`}
              value={digit}
              onChangeText={(value) => handleChange(index, value)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(index, nativeEvent.key)
              }
              maxLength={1}
              keyboardType="number-pad"
              autoFocus={index === 0}
              returnKeyType="next"
            />
          ))}
        </View>

        <Text style={tw`text-center text-gray-600 mb-2`}>
          You can resend the code in{" "}
          <Text style={tw`text-green-600`}>{timer} seconds</Text>
        </Text>

        <TouchableOpacity disabled={timer > 0}>
          <Text
            style={tw`text-center text-gray-500 ${
              timer === 0 ? "text-green-600" : ""
            }`}
          >
            Resend code
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
