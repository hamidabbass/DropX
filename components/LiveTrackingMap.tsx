import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Dimensions,
  Modal,
  TouchableOpacity,
  FlatList
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import tw from 'twrnc';
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const mockSuggestions = [
  { name: 'New York University', distance: '0.4 km', address: 'NY 10012' },
  { name: 'Washington Square Park', distance: '0.5 km', address: 'NYC' },
  { name: 'Comedy Cellar', distance: '0.8 km', address: '117 Macdougal St' },
  { name: 'Stand Book Store', distance: '1.1 km', address: '828 Broadway' },
];

type Suggestion = typeof mockSuggestions[0];

const LiveTrackingMapWithAvatar: React.FC = () => {
  const mapRef = useRef<MapView>(null);

  // — Core state —
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [locationConfirmed, setLocationConfirmed] = useState(false);

  // — Search UI state —
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<Suggestion[]>(mockSuggestions);

  // — Selected location drives the bottom sheet —
  const [selectedLocation, setSelectedLocation] = useState<Suggestion | null>(null);

  // — Pulsing avatar animation —
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  useEffect(() => {
    scale.value = withRepeat(
      withTiming(2.5, { duration: 1500, easing: Easing.out(Easing.ease) }),
      -1,
      true
    );
    opacity.value = withRepeat(
      withTiming(0, { duration: 1500, easing: Easing.out(Easing.ease) }),
      -1,
      true
    );
  }, []);
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  // — Location tracking —
  useEffect(() => {
    let sub: Location.LocationSubscription;
    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Location permission denied');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      sub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Highest, timeInterval: 3000, distanceInterval: 5 },
        (loc) => {
          setLocation(loc.coords);
          setLocationConfirmed(true);
          mapRef.current?.animateToRegion({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      );
    };
    startTracking();
    return () => sub && sub.remove();
  }, []);

  // — Search handlers —
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setFilteredSuggestions(mockSuggestions);
    } else {
      setFilteredSuggestions(
        mockSuggestions.filter((item) =>
          item.name.toLowerCase().includes(text.toLowerCase())
        )
      );
    }
  };

  const handleSelectLocation = (item: Suggestion) => {
    setSelectedLocation(item);
    setSearchModalVisible(false);
    // if you have real coords, call:
    // mapRef.current?.animateToRegion({ latitude: item.lat, longitude: item.lng, latitudeDelta: 0.01, longitudeDelta: 0.01 });
  };

  const handleEditLocation = () => {
    // reopen search and clear selection
    setSelectedLocation(null);
    setSearchModalVisible(true);
  };

  return (
    <View style={tw`flex-1`}>
      {region && (
        <MapView
          ref={mapRef}
          style={tw`absolute inset-0`}
          region={region}
          showsUserLocation={false}
          showsMyLocationButton={false}
        >
          {location && (
            <Marker coordinate={location}>
              <View style={tw`items-center justify-center`}>
                {!locationConfirmed && (
                  <Animated.View
                    style={[tw`absolute w-32 h-32 rounded-full bg-green-300`, pulseStyle]}
                  />
                )}
                <View style={tw`absolute w-28 h-28 bg-green-300 rounded-full opacity-30`} />
                <View style={tw`absolute w-20 h-20 bg-green-500 rounded-full opacity-50`} />
                <Image
                  source={{ uri: 'https://i.pravatar.cc/300' }}
                  style={tw`w-14 h-14 rounded-full border-2 border-white`}
                />
              </View>
            </Marker>
          )}
        </MapView>
      )}

      {!selectedLocation ? (
        !locationConfirmed ? (
          <View style={tw`absolute bottom-24 w-full items-center`}>
            <Text style={tw`text-lg font-semibold text-gray-700`}>
              Searching your location...
            </Text>
          </View>
        ) : (
          <View style={tw`absolute bottom-0 w-full bg-white p-5 pb-28 rounded-t-3xl shadow-lg`}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>Where to?</Text>
            <TouchableOpacity
              onPress={() => setSearchModalVisible(true)}
              style={tw`bg-gray-100 rounded-xl px-4 py-3 mb-4`}
            >
              <Text style={tw`text-base text-gray-500`}>Enter location</Text>
            </TouchableOpacity>
            <View style={tw`flex-row justify-between`}>
              {['Home', 'Office', 'Apartment', "Mom's House"].map((label, i) => (
                <View key={i} style={tw`bg-gray-200 px-4 py-2 rounded-full`}>
                  <Text style={tw`text-sm text-gray-700`}>{label}</Text>
                </View>
              ))}
            </View>
          </View>
        )
      ) : (
        <View style={tw`absolute bottom-0 w-full bg-white p-5 pb-28 rounded-t-3xl shadow-lg`}>
          <Text style={tw`text-lg font-semibold text-gray-800 mb-2`}>
            Set pickup location
          </Text>
          <View style={tw`flex-row items-center justify-between mb-4`}>
            <View style={tw`flex-row items-center`}>
              <Ionicons name="location-outline" size={20} color="black" style={tw`mr-2`} />
              <View>
                <Text style={tw`text-base font-medium`}>{selectedLocation.name}</Text>
                <Text style={tw`text-sm text-gray-500`}>
                  {selectedLocation.address}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleEditLocation}>
              <Ionicons name="pencil-outline" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => console.log('Next pressed')}
            style={tw`bg-green-500 rounded-xl py-3 items-center`}
          >
            <Text style={tw`text-white font-bold text-lg`}>Next</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 🔍 Fullscreen Search Modal */}
      <Modal visible={searchModalVisible} animationType="slide">
        <View style={tw`flex-1 bg-white p-5 pt-10`}>
          <TouchableOpacity
            onPress={() => setSearchModalVisible(false)}
            style={tw`absolute top-4 right-4`}
          >
            <Ionicons name="close" size={28} color="black" />
          </TouchableOpacity>
          <Text style={tw`text-xl font-bold mb-4`}>Where do you want to go?</Text>
          <View style={tw`bg-gray-100 flex-row items-center px-4 py-3 rounded-lg mb-4`}>
            <Ionicons name="navigate" size={20} color="green" />
            <Text style={tw`ml-2 text-gray-700`}>Your current location</Text>
          </View>
          <View style={tw`flex-row items-center bg-gray-100 rounded-lg px-4 mb-4`}>
            <Ionicons name="search" size={20} color="#EF4444" />
            <TextInput
              placeholder="Where to?"
              style={tw`ml-2 py-3 flex-1`}
              value={searchQuery}
              onChangeText={handleSearchChange}
              autoFocus
            />
            <TouchableOpacity>
              <Ionicons name="add-circle-outline" size={24} color="#10B981" />
            </TouchableOpacity>
          </View>
          <View style={tw`flex-row gap-2 mb-4`}>
            <View style={tw`bg-gray-200 px-4 py-2 rounded-full`}>
              <Text>📍 Select from map</Text>
            </View>
            <View style={tw`bg-gray-200 px-4 py-2 rounded-full`}>
              <Text>Home</Text>
            </View>
            <View style={tw`bg-gray-200 px-4 py-2 rounded-full`}>
              <Text>Office</Text>
            </View>
          </View>
          <FlatList
            data={filteredSuggestions}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelectLocation(item)}
                style={tw`flex-row justify-between items-center py-4 border-b border-gray-200`}
              >
                <View>
                  <Text style={tw`text-base font-medium text-black`}>
                    {item.name}
                  </Text>
                  <Text style={tw`text-sm text-gray-500`}>
                    {item.address}
                  </Text>
                </View>
                <View style={tw`flex-row items-center`}>
                  <Text style={tw`text-gray-500 text-sm mr-2`}>
                    {item.distance}
                  </Text>
                  <Ionicons name="bookmark-outline" size={18} color="#6B7280" />
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

export default LiveTrackingMapWithAvatar;
