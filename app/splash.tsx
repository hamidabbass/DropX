import React, { useEffect } from "react";
import { View, Text, Image } from "react-native";
import tw from "twrnc"; // adjust import to your tw setup
import { ActivityIndicator } from "react-native";
import { router } from 'expo-router';

export default function SplashScreen() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/onboarding");
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={tw`flex-1 bg-black items-center justify-center`}>
      {/* Logo */}
      {/* <Image
        source={require('../assets/logo.png')} // replace with your actual logo path
        style={tw`w-24 h-24 mb-4`}
        resizeMode="contain"
      /> */}

      {/* App Name */}
      <Text style={tw`text-white text-xl font-semibold`}>DropX</Text>

      {/* Spinner */}
      <View style={tw`absolute bottom-12`}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    </View>
  );
}
