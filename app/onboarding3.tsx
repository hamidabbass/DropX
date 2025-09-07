import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import tw from "twrnc";
import { router } from "expo-router";
import PaginationDots from "@/components/common/PaginationDots";

const { height } = Dimensions.get("window");
const IMAGE_HEIGHT = height * 0.65;

export default function OnboardingStepThree() {
  return (
    <View style={tw`flex-1 bg-white items-center justify-between pb-6`}>
      <Image
        source={require("../assets/images/payment-image.webp")}
        style={{
          width: "100%",
          height: IMAGE_HEIGHT,
          alignSelf: "center",
        }}
        resizeMode="cover"
      />

      <View style={tw`px-6 items-center`}>
        <Text style={tw`text-black text-xl font-bold text-center`}>
          Secure Payments &{"\n"}Seamless Transactions
        </Text>
        <Text style={tw`text-gray-600 text-sm text-center mt-2`}>
          Say hello to convenience payments. Pay for your deliveries securely
          using DropX easypaisa, jazzcash or cash.
        </Text>
      </View>

      {/* Dot Indicator */}
      <PaginationDots total={3} activeIndex={2} />

      {/* Button */}
      <View style={tw`w-full px-6 mt-6`}>
        <TouchableOpacity
          style={tw`bg-black py-3 rounded-xl`}
          onPress={() => router.replace("/auth")} // Navigate into the app
        >
          <Text style={tw`text-center text-white font-semibold`}>
            Let’s Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
