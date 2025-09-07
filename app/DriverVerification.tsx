import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Image, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

const DriverVerification: React.FC<{ onComplete?: (data: { driverPhoto: string; cnicFront: string }) => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [driverPhoto, setDriverPhoto] = useState<string | null>(null);
  const [cnicFront, setCnicFront] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPicker, setCurrentPicker] = useState<'driver' | 'cnic' | null>(null);


  const pickImage = async (onPick: (uri: string) => void, fromCamera = false) => {
    setLoading(true);
    let result;
    if (fromCamera) {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });
    }
    setLoading(false);
    if (!result.canceled && result.assets && result.assets.length > 0) {
      onPick(result.assets[0].uri);
    }
    setModalVisible(false);
    setCurrentPicker(null);
  };

  const handleNext = () => {
    if (step === 1 && driverPhoto) {
      setStep(2);
    } else if (step === 2 && cnicFront && driverPhoto) {
      if (onComplete) onComplete({ driverPhoto: driverPhoto as string, cnicFront: cnicFront as string });
    }
  };

  return (
  <View style={tw`flex-1 items-center justify-center p-6 bg-white`}>
      {/* Modal for choosing image source */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => { setModalVisible(false); setCurrentPicker(null); }}
      >
        <View style={tw`flex-1 justify-center items-center bg-black/40`}>
          <View style={tw`bg-white rounded-xl p-6 w-64`}> 
            <Text style={tw`text-lg font-bold mb-4 text-center`}>Select Option</Text>
            <Pressable
              style={tw`bg-black rounded-lg px-4 py-3 mb-3`}
              onPress={() => {
                if (currentPicker === 'driver') pickImage(setDriverPhoto, false);
                else if (currentPicker === 'cnic') pickImage(setCnicFront, false);
              }}
              disabled={loading}
            >
              <Text style={tw`text-white text-center text-base`}>Upload from Gallery</Text>
            </Pressable>
            <Pressable
              style={tw`bg-gray-500 rounded-lg px-4 py-3 mb-3`}
              onPress={() => {
                if (currentPicker === 'driver') pickImage(setDriverPhoto, true);
                else if (currentPicker === 'cnic') pickImage(setCnicFront, true);
              }}
              disabled={loading}
            >
              <Text style={tw`text-white text-center text-base`}>Capture Photo</Text>
            </Pressable>
            <Pressable
              style={tw`mt-2`}
              onPress={() => { setModalVisible(false); setCurrentPicker(null); }}
            >
              <Text style={tw`text-center text-gray-500`}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {step === 1 && (
        <>
          <Text style={tw`text-xl font-bold mb-5`}>Upload Your Picture</Text>
          <TouchableOpacity
            style={tw`w-56 h-80 rounded-2xl border-2 border-dashed border-gray-400 mb-5 items-center justify-center bg-gray-100 overflow-hidden`}
            onPress={() => { setModalVisible(true); setCurrentPicker('driver'); }}
            disabled={loading}
            activeOpacity={0.7}
          >
            {driverPhoto ? (
              <Image source={{ uri: driverPhoto }} style={tw`w-full h-full rounded-2xl`} resizeMode="cover" />
            ) : (
              <Image source={require('../assets/images/avatar.png')} style={tw`w-32 h-32 rounded-full`} />
            )}
          </TouchableOpacity>
          <View style={tw`flex-1 justify-end w-full`}>
            <TouchableOpacity
              style={tw`bg-black px-6 py-3 rounded-lg w-full mb-2 ${!driverPhoto || loading ? 'opacity-50' : ''}`}
              onPress={handleNext}
              disabled={!driverPhoto || loading}
            >
              <Text style={tw`text-white text-center text-base`}>Next</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {step === 2 && (
        <>
          <Text style={tw`text-xl font-bold mb-5`}>Upload CNIC Frontside</Text>
          <TouchableOpacity
            style={tw`w-full h-56 rounded-2xl border-2 border-dashed border-gray-400 mb-5 items-center justify-center bg-gray-100 overflow-hidden`}
            onPress={() => { setModalVisible(true); setCurrentPicker('cnic'); }}
            disabled={loading}
            activeOpacity={0.7}
          >
            {cnicFront ? (
              <Image source={{ uri: cnicFront }} style={tw`w-full h-full rounded-2xl`} resizeMode="cover" />
            ) : (
              <Image source={require('../assets/images/nic-card.png')} style={tw`w-48 h-28 rounded-lg`} resizeMode="contain" />
            )}
          </TouchableOpacity>
          <View style={tw`flex-1 justify-end w-full`}>
            <TouchableOpacity
              style={tw`bg-black px-6 py-3 rounded-lg w-full mb-2 ${!cnicFront || loading ? 'opacity-50' : ''}`}
              onPress={handleNext}
              disabled={!cnicFront || loading}
            >
              <Text style={tw`text-white text-center text-base`}>Finish</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};


export default DriverVerification;
