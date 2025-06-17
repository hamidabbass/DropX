import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import tw from "twrnc";
import PhoneNumberInput from "@/components/common/PhoneInput";
import DatePicker from "@/components/DatePicker";
import Feather from "react-native-vector-icons/Feather";
import { useRouter } from "expo-router";

export default function PersonalInfoScreen() {
  const [phone, setPhone] = useState("");
  const router = useRouter();
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [country, setCountry] = useState({
    code: "US",
    dial_code: "+1",
    flag: "🇺🇸",
    name: "United States",
  });
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView style={tw`flex-1 bg-white px-6 py-6`}>
      <Text style={tw`text-xl font-bold mb-4`}>Fill Personal Info</Text>

      <View style={tw`items-center mb-6`}>
        <Pressable onPress={pickImage} style={tw`relative`}>
          {image ? (
            <Image source={{ uri: image }} style={tw`w-24 h-24 rounded-full`} />
          ) : (
            <View
              style={tw`w-24 h-24 bg-gray-200 rounded-full items-center justify-center`}
            >
              <Text style={tw`text-2xl`}>👤</Text>
            </View>
          )}

          <View
            style={tw`absolute bottom-1 right-1 bg-green-600 size-6 rounded-full items-center justify-center border-2 border-white`}
          >
            <Feather name="edit-2" size={14} color="#fff" />
          </View>
        </Pressable>
      </View>

      {/* Full Name */}
      <Text style={tw`text-sm text-black mb-1`}>Full Name</Text>
      <TextInput
        placeholder="Full Name"
        style={tw`bg-gray-100 rounded-lg px-4 py-3 mb-4`}
      />

      {/* Email */}
      <Text style={tw`text-sm text-black mb-1`}>Email</Text>
      <TextInput
        placeholder="Email"
        style={tw`bg-gray-100 rounded-lg px-4 py-3 mb-4`}
        keyboardType="email-address"
      />

      <PhoneNumberInput
        phone={phone}
        setPhone={setPhone}
        country={country}
        setCountry={setCountry}
        showPicker={showCountryPicker}
        setShowPicker={setShowCountryPicker}
      />

      {/* Gender */}
      <Text style={tw`text-sm text-black mb-1`}>Gender</Text>
      <TextInput
        placeholder="Gender"
        style={tw`bg-gray-100 rounded-lg px-4 py-3 mb-4`}
      />

      <Text style={tw`text-sm text-black mb-1`}>Date</Text>
      <TextInput
        placeholder="dd/mm/yy"
        style={tw`bg-gray-100 rounded-lg px-4 py-3 mb-4`}
      />

      <TouchableOpacity
        onPress={() => router.replace("/(tabs)/home")}
        style={tw`bg-green-600 rounded-full py-4 mt-6`}
      >
        <Text style={tw`text-center text-white font-bold`}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
