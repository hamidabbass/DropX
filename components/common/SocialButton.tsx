import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

function SocialButton({ label, icon }: { label: string; icon: any }) {
  return (
    <TouchableOpacity style={tw`flex-row justify-center items-center border border-gray-200 rounded-full px-4 py-3 mb-3`}>
      <Image source={icon} style={tw`w-5 h-5 mr-3`} />
      <Text style={tw`text-black font-medium`}>{label}</Text>
    </TouchableOpacity>
  );
}

export default SocialButton