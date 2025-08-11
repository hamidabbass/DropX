import PersonalInfo from '@/app/driverinfo';
import LiveTrackingMapWithAvatar from '@/components/LiveTrackingMap';
import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

function Promos() {
  return <View style={tw`flex-1 items-center justify-center`}><Text>Promos Page</Text></View>;
}
function Activity() {
  return <View style={tw`flex-1 items-center justify-center`}><Text>Activity Page</Text></View>;
}
function Account() {
  return <PersonalInfo />;
}

const tabComponents = {
  home: <LiveTrackingMapWithAvatar />,
  promos: <Promos />,
  activity: <Activity />,
  account: (
    <ScrollView style={tw`flex-1 bg-white`} contentContainerStyle={tw`pb-24`}>
      <Account />
    </ScrollView>
  ),
};

type TabName = 'home' | 'promos' | 'activity' | 'account';
export default function TabLayout() {
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const tabs: {
    name: TabName;
    icon: React.ComponentProps<typeof FontAwesome>['name'];
    label: string;
  }[] = [
    { name: 'home', icon: 'home', label: 'Home' },
    { name: 'promos', icon: 'refresh', label: 'Promos' },
    { name: 'activity', icon: 'file-text-o', label: 'Activity' },
    { name: 'account', icon: 'user-o', label: 'Account' },
  ];

  const CustomTabBar = () => (
    <>
      {/* White background behind the tab bar to cover bottom content */}
      <View style={tw`absolute left-0 right-0 bottom-0 h-24 bg-white z-0`} pointerEvents="none" />
      <View style={tw`absolute bottom-4 left-5 right-5 h-[70px] bg-black rounded-[35px] flex-row items-center justify-around shadow-lg z-10`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.name;
          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => setActiveTab(tab.name)}
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
    </>
  );

  return (
    <View style={tw`flex-1 bg-white`}>
      {tabComponents[activeTab]}
      <CustomTabBar />
    </View>
  );
}