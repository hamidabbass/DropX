import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { router } from 'expo-router';
import PaginationDots from "@/components/common/PaginationDots"

export default function OnboardingScreen() {
  return (
    <View style={tw`flex-1 bg-white items-center justify-between pt-10 pb-6`}>
      
      {/* Hero Image */}
      {/* <Image
        source={require('../assets/onboarding-map-phone.png')} // save image with this name
        style={tw`w-72 h-96`}
        resizeMode="contain"
      /> */}

      {/* Text Content */}
      <View style={tw`px-6 items-center`}>
        <Text style={tw`text-black text-xl font-bold text-center`}>
          Welcome to GoRide – Your Journey, Your Way
        </Text>
        <Text style={tw`text-gray-600 text-sm text-center mt-2`}>
          Get ready to experience hassle-free transportation. We've got everything you need to travel with ease. Let’s get started!
        </Text>
      </View>

      {/* Dot Indicator */}
      <PaginationDots total={3} activeIndex={0} />

      {/* Buttons */}
      <View style={tw`flex-row justify-between w-full px-6 mt-6`}>
        <TouchableOpacity
          style={tw`flex-1 bg-gray-200 py-3 rounded-xl mr-2`}
          onPress={() => router.replace('/auth')}
        >
          <Text style={tw`text-center text-black font-semibold`}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`flex-1 bg-black py-3 rounded-xl ml-2`}
          onPress={() => router.replace('/onboarding2')} // Next screen
        >
          <Text style={tw`text-center text-white font-semibold`}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
