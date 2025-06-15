import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc'; // or your tw setup

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          height: 80,
          elevation: 0,
          borderTopWidth: 0,
        },
        tabBarBackground: () => (
          <View style={tw`absolute bottom-4 left-4 right-4 h-16 bg-blue-100 rounded-full`} />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="home" label="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="call"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="call-outline" />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="add-circle-outline" />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="star-outline" />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="ellipsis-horizontal" />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({ icon, focused, label } : any) {
  return (
    <View
      style={tw.style(
        'flex-row items-center px-3 py-2 rounded-full',
        focused ? 'bg-white' : 'bg-transparent'
      )}
    >
      <Ionicons
        name={icon}
        size={24}
        color={focused ? '#1D4ED8' : '#60A5FA'} // Tailwind blue-700 vs blue-400
      />
      {focused && label && (
        <Text style={tw`text-blue-700 font-semibold ml-2`}>{label}</Text>
      )}
    </View>
  );
}
