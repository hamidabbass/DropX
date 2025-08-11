import { routeTitles } from '@/utils/routeTitles';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRouter, useSegments } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

export default function HeaderBar() {
  const router = useRouter();
  const navigation = useNavigation();
  const segments = useSegments();
  const routeName = segments[segments.length - 1];

  const config = routeTitles[routeName] || { title: '', showBack: true };

  if (!config.title && !config.showBack) return null;

  const handleBack = () => {
    if (navigation.canGoBack()) {
      router.back();
    } else if (config.fallbackRoute) {
      router.replace(config.fallbackRoute as any);
    }
  };

  return (
    <View style={tw`py-4 px-5 flex-row items-center border-b-[0.5px] border-gray-400 bg-white`}>
      {config.showBack && (
        <TouchableOpacity onPress={handleBack}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
      )}
      <Text style={tw`text-lg font-semibold text-black ${config.showBack ? 'ml-4' : ''}`}>
        {config.title}
      </Text>
    </View>
  );
}
