import CustomHeader from "@/components/common/CustomHeader";
import { useColorScheme } from "@/hooks/useColorScheme";
import { store } from "@/redux/store";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useSegments } from 'expo-router';
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Provider } from "react-redux";

function AppWithSafeArea() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const segments = useSegments();
  // Hide header on (tabs) route
  const isTabsRoute = (segments as string[]).includes('(tabs)');
  return (
    <ThemeProvider
      value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colorScheme === "dark" ? DarkTheme.colors.background : DefaultTheme.colors.background,
        }}
        edges={["top", "bottom", "left", "right"]}
      >
        {!isTabsRoute && <CustomHeader />}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="splash" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </SafeAreaView>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) return null;

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppWithSafeArea />
      </SafeAreaProvider>
    </Provider>
  );
}
