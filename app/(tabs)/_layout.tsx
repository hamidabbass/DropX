import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import tw from 'twrnc';

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { name: 'home', icon: 'home', label: 'Home', route: '/home' },
    { name: 'promos', icon: 'refresh', label: 'Promos', route: '/promos' },
    { name: 'activity', icon: 'file-text-o', label: 'Activity', route: '/activity' },
    { name: 'account', icon: 'user-o', label: 'Account', route: '/account' },
  ];

  const CustomTabBar = () => {
    return (
      <View style={tw`absolute bottom-5 left-5 right-5 h-[70px] bg-black rounded-[35px] flex-row items-center justify-around shadow-lg`}>
        {tabs.map((tab) => {
          const isActive = pathname === tab.route || (pathname === '/' && tab.name === 'home');
          
          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => router.push(tab.route)}
              style={tw`${isActive ? 'flex-row' : 'flex-col'} items-center justify-center px-${isActive ? '4' : '3'} py-2 ${isActive ? 'bg-white' : 'bg-transparent'} rounded-3xl ${isActive ? 'min-w-[100px]' : 'min-w-[40px]'} h-[44px] ${isActive ? 'gap-1' : 'gap-0'}`}
            >
              <FontAwesome 
                name={tab.icon} 
                size={28} 
                color={isActive ? '#000000' : '#ffffff'} 
              />
              {isActive && (
                <Text style={tw`text-black text-sm font-semibold`}>
                  {tab.label}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarStyle: { display: 'none' }, // Hide default tab bar
          headerShown: false,
        }}
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="activity" />
        <Tabs.Screen name="promos" />
        <Tabs.Screen name="account" />
        <Tabs.Screen name="more" />
      </Tabs>
      <CustomTabBar />
    </>
  );
}