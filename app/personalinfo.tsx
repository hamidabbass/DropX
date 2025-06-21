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
import Feather from "react-native-vector-icons/Feather";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { fullName, email, phone: routePhone, address: routeAddress, licenseNumber: routeLicense } = useLocalSearchParams();

  const [image, setImage] = useState(null);

  const [name, setName] = useState(typeof fullName === "string" ? fullName : "");
const [emailVal, setEmailVal] = useState(typeof email === "string" ? email : "");
const [phone, setPhone] = useState(typeof routePhone === "string" ? routePhone : "");
const [address, setAddress] = useState(typeof routeAddress === "string" ? routeAddress : "");
const [licenseNumber, setLicenseNumber] = useState(typeof routeLicense === "string" ? routeLicense : "");

  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [country, setCountry] = useState({
    code: "PK",
    dial_code: "+92",
    flag: "🇵🇰",
    name: "Pakistan",
  });

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
      <View style={tw`items-center mb-8 mt-4`}>
        <Pressable onPress={pickImage} style={tw`relative`}>
          {image ? (
            <Image source={{ uri: image }} style={tw`size-44 rounded-full`} />
          ) : (
            <View style={tw`size-44 bg-gray-200 rounded-full items-center justify-center`}>
              <Text style={tw`text-5xl`}>👤</Text>
            </View>
          )}

          <View
            style={tw`absolute bottom-1 right-1 bg-green-600 size-8 rounded-full items-center justify-center border-2 border-white`}
          >
            <Feather name="edit-2" size={18} color="#fff" />
          </View>
        </Pressable>
      </View>

      <Text style={tw`text-sm text-black mb-1`}>Full Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Full Name"
        style={tw`bg-gray-100 rounded-lg px-4 py-3 mb-4`}
      />

      <Text style={tw`text-sm text-black mb-1`}>Email</Text>
      <TextInput
        value={emailVal}
        onChangeText={setEmailVal}
        placeholder="Email"
        keyboardType="email-address"
        style={tw`bg-gray-100 rounded-lg px-4 py-3 mb-4`}
      />

      <PhoneNumberInput
        phone={phone}
        setPhone={setPhone}
        country={country}
        setCountry={setCountry}
        showPicker={showCountryPicker}
        setShowPicker={setShowCountryPicker}
      />

      <Text style={tw`text-sm text-black mb-1`}>Address</Text>
      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="Address"
        style={tw`bg-gray-100 rounded-lg px-4 py-3 mb-4`}
      />

      <Text style={tw`text-sm text-black mb-1`}>License Number</Text>
      <TextInput
        value={licenseNumber}
        onChangeText={setLicenseNumber}
        placeholder="License Number"
        style={tw`bg-gray-100 rounded-lg px-4 py-3 mb-4`}
      />

      <TouchableOpacity
        onPress={() => router.replace("/(tabs)/home")}
        style={tw`bg-black rounded-full py-4 mt-6`}
      >
        <Text style={tw`text-center text-white font-bold`}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
