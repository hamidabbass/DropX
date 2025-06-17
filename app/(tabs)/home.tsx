import tw from "twrnc";
import LiveTrackingMapWithAvatar from '@/components/LiveTrackingMap';
import { View, Text } from "react-native";

export default function HomeScreen() {
  return (
    <View style={tw`bg-white h-full`}>
      <LiveTrackingMapWithAvatar />
    </View>
  );
}
