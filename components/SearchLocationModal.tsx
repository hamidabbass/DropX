import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

export type Suggestion = {
  name: string;
  distance: string;
  address: string;
  latitude: number;
  longitude: number;
};

interface SearchLocationModalProps {
  visible: boolean;
  searchQuery: string;
  filteredSuggestions: Suggestion[];
  onClose: () => void;
  onSearchChange: (text: string) => void;
  onSelectLocation: (item: Suggestion) => void;
}

const SearchLocationModal: React.FC<SearchLocationModalProps> = ({
  visible,
  searchQuery,
  filteredSuggestions,
  onClose,
  onSearchChange,
  onSelectLocation,
}) => (
  <Modal visible={visible} animationType="slide">
    <View style={tw`flex-1 bg-white p-5 pt-10`}>
      <TouchableOpacity
        onPress={onClose}
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
          onChangeText={onSearchChange}
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
            onPress={() => onSelectLocation(item)}
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
);

export default SearchLocationModal;
