import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import tw from "twrnc";
import { router } from "expo-router";

export default function SplashScreen() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/onboarding");
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={tw`flex-1 bg-black items-center justify-center`}>
      <Text style={tw`text-white text-6xl font-extrabold tracking-wide`}>
        DropX
      </Text>

      <View style={tw`absolute bottom-16`}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    </View>
  );
}
