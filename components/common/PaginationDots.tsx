import React from 'react';
import { View } from 'react-native';
import tw from 'twrnc';

type Props = {
  total: number;
  activeIndex: number;
};

export default function PaginationDots({ total, activeIndex }: Props) {
  return (
    <View style={tw`flex-row items-center justify-center mt-4`}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            i === activeIndex
              ? tw`w-6 h-2 rounded-full bg-black mx-1`
              : tw`w-2 h-2 rounded-full bg-gray-300 mx-1`
          ]}
        />
      ))}
    </View>
  );
}
