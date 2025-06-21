import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import SocialButton from "@/components/common/SocialButton";
import tw from "twrnc";
import { router } from "expo-router";

export default function AuthScreen() {
  return (
    <View style={tw`flex-1 bg-white px-6 justify-between pt-16 pb-6`}>
      <View style={tw`items-center`}>
        <Image
          source={require("../assets/images/dropX.png")}
          style={tw`size-80`}
          resizeMode="contain"
        />
      </View>

      <View style={tw`flex justify-center items-center flex-col -mt-40`}>
        <Text style={tw`text-black text-2xl font-bold`}>
          Let’s Get Started!
        </Text>
        <Text style={tw`text-gray-500 mt-2`}>
          Let’s dive in into your account
        </Text>
      </View>

      <View style={tw`w-full -mt-32`}>
        <TouchableOpacity
          onPress={() => router.replace("/signup")}
          style={tw`bg-black py-4 rounded-full mb-3`}
        >
          <Text style={tw`text-center text-white font-bold`}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/signin")}
          style={tw`bg-gray-100 py-4 rounded-full`}
        >
          <Text style={tw`text-center text-black font-bold`}>Login</Text>
        </TouchableOpacity>
      </View>

      <View style={tw`flex-row justify-center mt-4`}>
        <TouchableOpacity onPress={() => router.push("/privacypolicy")}>
          <Text style={tw`text-gray-400 text-xs underline`}>
            Privacy Policy
          </Text>
        </TouchableOpacity>

        <Text style={tw`text-gray-400 mx-2`}>•</Text>

        <TouchableOpacity onPress={() => router.push("/termsofservice")}>
          <Text style={tw`text-gray-400 text-xs underline`}>
            Terms of Service
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
