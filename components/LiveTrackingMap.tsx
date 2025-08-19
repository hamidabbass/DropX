import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import tw from 'twrnc';
import ScheduleModal from '../app/schedule';
import SearchLocationModal from './SearchLocationModal';

const mockSuggestions = [
  {
    name: 'New York University',
    distance: '0.4 km',
    address: 'NY 10012',
    latitude: 40.7295,
    longitude: -73.9965,
  },
  {
    name: 'Washington Square Park',
    distance: '0.5 km',
    address: 'NYC',
    latitude: 40.7308,
    longitude: -73.9973,
  },
  {
    name: 'Comedy Cellar',
    distance: '0.8 km',
    address: '117 Macdougal St',
    latitude: 40.7302,
    longitude: -74.0007,
  },
  {
    name: 'Stand Book Store',
    distance: '1.1 km',
    address: '828 Broadway',
    latitude: 40.7333,
    longitude: -73.9903,
  },
];

type Suggestion = typeof mockSuggestions[0];
// Add latitude and longitude to Suggestion type

const LiveTrackingMapWithAvatar: React.FC = () => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
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
    // Animate to selected location
    if (item.latitude && item.longitude) {
      mapRef.current?.animateToRegion({
        latitude: item.latitude,
        longitude: item.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setRegion({
        latitude: item.latitude,
        longitude: item.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const handleEditLocation = () => {
    // reopen search and clear selection
    setSelectedLocation(null);
    setSearchModalVisible(true);
  };

  return (
    <View style={tw`flex-1`}>
      {!showScheduleModal ? (
        <>
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
              {/* Show selected location marker and route */}
              {selectedLocation && (
                <>
                  <Marker
                    coordinate={{
                      latitude: selectedLocation.latitude,
                      longitude: selectedLocation.longitude,
                    }}
                    title={selectedLocation.name}
                    description={selectedLocation.address}
                  />
                  {location && (
                    <Polyline
                      coordinates={[{ latitude: location.latitude, longitude: location.longitude }, { latitude: selectedLocation.latitude, longitude: selectedLocation.longitude }]}
                      strokeColor="#10B981"
                      strokeWidth={5}
                    />
                  )}
                </>
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
            <View style={tw`absolute bottom-10 w-full bg-white p-5 pb-16 rounded-t-3xl shadow-lg`}>
              <Text style={tw`text-lg font-bold text-gray-800 mb-2`}>Set pickup location</Text>
              <View style={tw`flex-row items-center mb-4`}>
                <View style={tw`bg-gray-100 p-3 rounded-full mr-3`}>
                  <Ionicons name="location-outline" size={24} color="black" />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-base font-bold text-black`}>{selectedLocation.name}</Text>
                  <Text style={tw`text-sm text-gray-500`}>{selectedLocation.address}</Text>
                </View>
                <TouchableOpacity onPress={handleEditLocation}>
                  <Ionicons name="pencil-outline" size={22} color="#6B7280" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => setShowScheduleModal(true)}
                style={tw`bg-black rounded-full py-3 items-center mt-2`}
              >
                <Text style={tw`text-white font-bold text-lg`}>Set Schedule</Text>
              </TouchableOpacity>
            </View>
          )}

          <SearchLocationModal
            visible={searchModalVisible}
            searchQuery={searchQuery}
            filteredSuggestions={filteredSuggestions}
            onClose={() => setSearchModalVisible(false)}
            onSearchChange={handleSearchChange}
            onSelectLocation={handleSelectLocation}
          />
        </>
      ) : (
        <ScheduleModal
          visible={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          onSetSchedule={(date) => {
            setShowScheduleModal(false);
          }}
        />
      )}
    </View>
  );
};

export default LiveTrackingMapWithAvatar;
