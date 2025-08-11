
import PaginationDots from "@/components/common/PaginationDots";
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    title: 'Welcome to DropX – Your Delivery, Your Way',
    description: "Get ready to experience hassle-free transportation. We've got everything you need to deliver with ease. Let’s get started!",
    // image: require('../assets/onboarding-map-phone.png'),
  },
  {
    title: 'Choose Your Delivery –\nTailored to Your Needs',
    description: 'Select your preferred mode of transportation – motorbike / scooter, or car – and order a ride with just a few taps.',
    // image: require('../assets/onboarding-choose-ride.png'),
  },
  {
    title: 'Secure Payments &\nSeamless Transactions',
    description: 'Say hello to convenience payments. Pay for your deliveries securely using DropX easypaisa, jazzcash or cash.',
    // image: require('../assets/onboarding-payments.png'),
  },
];

export default function OnboardingScreen() {
  const flatListRef = useRef<FlatList<any>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleContinue = () => {
    if (activeIndex < onboardingData.length - 1) {
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({ index: activeIndex + 1 });
      }
    } else {
      router.replace('/(tabs)/home');
    }
  };

  const handleSkip = () => {
    router.replace('/auth');
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={tw`flex-1 bg-white pt-10 pb-6`}>
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        keyExtractor={(_, i) => i.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={[tw`items-center justify-between`, { width }]}> 
            {/* Hero Image */}
            {/* <Image source={item.image} style={tw`w-72 h-96`} resizeMode="contain" /> */}
            <View style={tw`px-6 items-center mt-10`}>
              <Text style={tw`text-black text-xl font-bold text-center`}>{item.title}</Text>
              <Text style={tw`text-gray-600 text-sm text-center mt-2`}>{item.description}</Text>
            </View>
          </View>
        )}
      />
      <PaginationDots total={onboardingData.length} activeIndex={activeIndex} />
      {activeIndex === onboardingData.length - 1 ? (
        <View style={tw`w-full px-6 mt-6`}>
          <TouchableOpacity
            style={tw`bg-black py-3 rounded-xl`}
            onPress={handleContinue}
          >
            <Text style={tw`text-center text-white font-semibold`}>
              Let's Get Started
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={tw`flex-row justify-between w-full px-6 mt-6`}>
          <TouchableOpacity
            style={tw`flex-1 bg-gray-200 py-3 rounded-xl mr-2`}
            onPress={handleSkip}
          >
            <Text style={tw`text-center text-black font-semibold`}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`flex-1 bg-black py-3 rounded-xl ml-2`}
            onPress={handleContinue}
          >
            <Text style={tw`text-center text-white font-semibold`}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
