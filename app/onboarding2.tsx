import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import tw from "twrnc";
import { router } from "expo-router";
import PaginationDots from "@/components/common/PaginationDots";

const { height } = Dimensions.get("window");
const IMAGE_HEIGHT = height * 0.65;

export default function OnboardingStepTwo() {
  return (
    <View style={tw`flex-1 bg-white items-center justify-between pb-6`}>
      <Image
        source={require("../assets/images/onboarding.webp")}
        style={{
          width: "100%",
          height: IMAGE_HEIGHT,
          alignSelf: "center",
        }}
        resizeMode="cover"
      />

      <View style={tw`px-6 items-center`}>
        <Text style={tw`text-black text-xl font-bold text-center`}>
          Choose Your Delivery –{"\n"}Tailored to Your Needs
        </Text>
        <Text style={tw`text-gray-600 text-sm text-center mt-2`}>
          Select your preferred mode of transportation – motorbike / scooter, or
          car – and order a ride with just a few taps.
        </Text>
      </View>

      <PaginationDots total={3} activeIndex={1} />

      <View style={tw`flex-row justify-between w-full px-6 mt-6`}>
        <TouchableOpacity
          style={tw`flex-1 bg-gray-200 py-3 rounded-xl mr-2`}
          onPress={() => router.replace("/auth")}
        >
          <Text style={tw`text-center text-black font-semibold`}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`flex-1 bg-black py-3 rounded-xl ml-2`}
          onPress={() => router.replace("/onboarding3")}
        >
          <Text style={tw`text-center text-white font-semibold`}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
