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
      <Image
        source={require('../assets/images/dropX.png')}
        style={tw`size-40 mb-4`}
        resizeMode="contain"
      />

      <Text style={tw`text-white text-4xl font-semibold`}>DropX</Text>

      <View style={tw`absolute bottom-12`}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    </View>
  );
}
