import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import tw from 'twrnc';
import { routeTitles } from '@/utils/routeTitles';

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
    <View style={tw`pt-12 pb-4 px-5  flex-row items-center`}>
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
