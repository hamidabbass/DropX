import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { router } from 'expo-router';
import PaginationDots from "@/components/common/PaginationDots"

export default function OnboardingStepThree() {
  return (
    <View style={tw`flex-1 bg-white items-center justify-between pt-10 pb-6`}>
      
      {/* Hero Image */}
      {/* <Image
        source={require('../assets/onboarding-payments.png')} // save uploaded image here
        style={tw`w-72 h-96`}
        resizeMode="contain"
      /> */}

      {/* Text Content */}
      <View style={tw`px-6 items-center`}>
        <Text style={tw`text-black text-xl font-bold text-center`}>
          Secure Payments &{'\n'}Seamless Transactions
        </Text>
        <Text style={tw`text-gray-600 text-sm text-center mt-2`}>
          Say hello to convenience payments. Pay for your deliveries securely using DropX easypaisa, jazzcash or cash.
        </Text>
      </View>

      {/* Dot Indicator */}
      <PaginationDots total={3} activeIndex={2} />

      {/* Button */}
      <View style={tw`w-full px-6 mt-6`}>
        <TouchableOpacity
          style={tw`bg-black py-3 rounded-xl`}
          // onPress={() => router.replace('/auth')}
          onPress={() => router.replace('/(tabs)/home')}
        >
          <Text style={tw`text-center text-white font-semibold`}>Let’s Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
