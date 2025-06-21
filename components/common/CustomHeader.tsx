import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import tw from 'twrnc';

export default function CustomHeader({ title = '' }) {
  const router = useRouter();

  return (
    <View style={tw`pt-12 pb-4 px-5 bg-white flex-row items-center border-b border-gray-200`}>
      <TouchableOpacity onPress={() => router.back()}>
        <Feather name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={tw`text-lg font-semibold text-black ml-4`}>
        {title}
      </Text>
    </View>
  );
}
