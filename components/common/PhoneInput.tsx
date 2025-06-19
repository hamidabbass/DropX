import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/Feather";
import { CountryItem, CountryPicker } from "react-native-country-codes-picker";

type Props = {
  phone: string;
  setPhone: (value: string) => void;
  country: CountryItem;
  setCountry: (value: CountryItem) => void;
  showPicker: boolean;
  setShowPicker: (value: boolean) => void;
};

export default function PhoneNumberInput({
  phone,
  setPhone,
  country,
  setCountry,
  showPicker,
  setShowPicker,
}: Props) {
  const handleCountrySelect = (item: CountryItem) => {
    setCountry({
      code: item.code,
      dial_code: item.dial_code,
      flag: item.flag,
      name: item.name,
    });
    setShowPicker(false);
  };

  return (
    <>
      <View style={tw`flex-row items-center border border-gray-300 rounded-lg mb-3`}>
        <TouchableOpacity
          style={tw`flex-row items-center px-1 py-2 border-r border-gray-200`}
          onPress={() => setShowPicker(true)}
        >
          <Text style={tw`text-lg mr-2`}>{country.flag}</Text>
          <Text style={tw`text-base text-black`}>{country.dial_code}</Text>
          <Icon name="chevron-down" size={16} color="#666" style={tw`ml-2`} />
        </TouchableOpacity>

        <TextInput
          style={tw`flex-1 text-base text-black px-4 py-2`}
          placeholder="123 456 7890"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={(text) => setPhone(text.replace(/\D/g, ""))}
          maxLength={15}
        />
      </View>

      <CountryPicker
        lang="en"
        show={showPicker}
        pickerButtonOnPress={handleCountrySelect}
        onBackdropPress={() => setShowPicker(false)}
        style={{
          modal: {
            height: "70%",
            backgroundColor: "#fff",
          },
          textInput: {
            height: 48,
            backgroundColor: "#f3f4f6",
            borderRadius: 8,
            paddingHorizontal: 16,
          },
          countryButton: {
            paddingVertical: 12,
          },
        }}
        searchMessage="Search your country"
        hideSearch={false}
        preferredCountries={["US", "GB", "CA", "AU"]}
      />
    </>
  );
}
