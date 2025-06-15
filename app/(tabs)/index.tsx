import tw from "twrnc";
import SplashScreen from "@/components/SplashScreen";
import { View, Text } from "react-native";

export default function HomeScreen() {
  return (
    <View style={tw`bg-white h-full`}>
      <SplashScreen />
    </View>
  );
}
