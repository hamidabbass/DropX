import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import tw from "twrnc";

const RideOptionsScreen: React.FC<{ onBook: () => void }> = ({ onBook }) => {
  const [price, setPrice] = useState("");

  return (
    <View style={tw`flex-1 pt-6 bg-white`}>
      <View style={tw`px-6 pt-2 pb-2`}>
        <Text style={tw`text-black text-2xl font-bold mb-2`}>
          Set Delivery Price
        </Text>
        <View
          style={tw`flex-row items-center mb-6 bg-white rounded-xl p-4 border border-gray-700`}
        >
          <Ionicons
            name="cube-outline"
            size={32}
            color="#10B981"
            style={tw`mr-3`}
          />
          <View style={tw`flex-1`}>
            <Text style={tw`text-black text-lg font-semibold mb-1`}>
              Luggage Delivery
            </Text>
            <Text style={tw`text-gray-400 text-xs`}>
              Set your price for this delivery
            </Text>
          </View>
        </View>
        <View
          style={tw`flex-row items-center justify-between bg-white rounded-xl px-4 py-3 mb-6 border border-gray-700`}
        >
          <Text style={tw`text-black text-base font-semibold`}>Weight</Text>
          <TextInput
            style={tw`border border-gray-700 rounded px-3 py-2 w-28 text-right text-black bg-white`}
            keyboardType="numeric"
            value={price}
            onChangeText={(val) => setPrice(val.replace(/[^0-9]/g, ""))}
            placeholder="Enter weight"
            placeholderTextColor="#888"
          />
        </View>
        <View
          style={tw`flex-row items-center justify-between bg-white rounded-xl px-4 py-3 mb-6 border border-gray-700`}
        >
          <Text style={tw`text-black text-base font-semibold`}>Amount</Text>
          <TextInput
            style={tw`border border-gray-700 rounded px-3 py-2 w-28 text-right text-black bg-white`}
            keyboardType="numeric"
            value={price}
            onChangeText={(val) => setPrice(val.replace(/[^0-9]/g, ""))}
            placeholder="Enter price"
            placeholderTextColor="#888"
          />
        </View>
      </View>
      <View style={tw`px-6 mt-2 mb-2`}>
        <View style={tw`flex-row justify-between mb-2`}>
          <Text style={tw`text-gray-400`}>Payment</Text>
          <Text style={tw`text-gray-200 font-semibold`}>DropX Wallet</Text>
        </View>
      </View>
      <View style={tw`absolute bottom-8 w-full`}>
        <TouchableOpacity
          style={tw`bg-black mx-6 rounded-full py-4 items-center shadow-lg`}
          onPress={onBook}
          activeOpacity={0.8}
        >
          <Text style={tw`text-white font-bold text-lg tracking-wide`}>
            Confirm Delivery
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RideOptionsScreen;
