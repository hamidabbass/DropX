import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { setDriverInfo } from "../redux/driverVehicleSlice";
import { verifyDriver } from "../redux/driverVerificationActions";

const DriverVerification: React.FC = () => {
  const router = useRouter();
  const [driverPhoto, setDriverPhoto] = useState<string | null>(null);
  const [cnicFront, setCnicFront] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPicker, setCurrentPicker] = useState<"driver" | "cnic" | null>(
    null
  );
  // Track if user has re-uploaded either image after a failed verification
  const [hasReuploaded, setHasReuploaded] = useState(false);
  // Add a state to track if Verify has been clicked
  const [hasVerified, setHasVerified] = useState(false);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { isLoading, error, result, persisted } = useAppSelector(
    (state) => state.driverVerification
  );

  const pickImage = async (
    onPick: (uri: string) => void,
    fromCamera = false
  ) => {
    let result;
    if (fromCamera) {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        // Remove aspect to allow cropping full image
        quality: 0.7,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        // Remove aspect to allow cropping full image
        quality: 0.7,
      });
    }
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      onPick(uri);
      // Only persist photo to Redux if uploading driver image
      if (currentPicker === "driver") {
        dispatch(setDriverInfo({ photo: uri }));
      }
      // Reset result so mustReupload is cleared and button is enabled
      dispatch({ type: 'driverVerification/clearPersistedVerification' });
      setHasReuploaded(true); // Mark that user has re-uploaded
    }
    setModalVisible(false);
    setCurrentPicker(null);
  };

  const handleNext = () => {
    if (driverPhoto && cnicFront) {
      setHasReuploaded(false); // Reset after submitting for verification
      setHasVerified(true); // Mark that verify was clicked
      dispatch(
        verifyDriver({ faceImageUri: driverPhoto, cnicImageUri: cnicFront })
      );
    }
  };

  // If verification failed, require re-upload
  // Only require re-upload if result exists and not loading
  // Now check based on 'Face Match' value in comments
  const mustReupload = (() => {
    if (hasReuploaded) return false;
    if (!result || isLoading || !Array.isArray(result.logs) || result.logs.length === 0) return false;
    // Find the first log with a Face Match label in comments
    for (const log of result.logs) {
      const commentParts = (log.comments || "").split(",").map((s: string) => s.trim());
      for (const part of commentParts) {
        const colonIdx = part.indexOf(":");
        let label = "";
        let value = "";
        if (colonIdx !== -1) {
          label = part.slice(0, colonIdx).trim();
          value = part.slice(colonIdx + 1).trim();
        } else {
          value = part;
        }
        if (label.trim() === "Face match") {
          // If value is not boolean true, require re-upload
          if (value.toLowerCase() !== "true") {
            return true;
          }
        }
      }
    }
    return false;
  })();

  // Add goToNextPage function here
  const goToNextPage = () => {
    router.push('/VehicleDetails');
  };

  useEffect(() => {
    // Clear verification result when account changes
    // You may need to replace 'persisted' or add a dependency for user/account id
    // For now, clear when driverPhoto and cnicFront are both null (i.e., new account or reset)
    if (!driverPhoto && !cnicFront) {
      dispatch({ type: 'driverVerification/clearPersistedVerification' });
    }
  }, [driverPhoto, cnicFront, dispatch]);

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView
        contentContainerStyle={tw`flex-grow items-center justify-center p-6`}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Modal for choosing image source */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => {
            setModalVisible(false);
            setCurrentPicker(null);
          }}
        >
          <View style={tw`flex-1 justify-center items-center bg-black/40`}>
            <View style={tw`bg-white rounded-xl p-6 w-64`}>
              <Text style={tw`text-lg font-bold mb-4 text-center`}>
                Select Option
              </Text>
              <Pressable
                style={tw`bg-black rounded-lg px-4 py-3 mb-3`}
                onPress={() => {
                  if (currentPicker === "driver")
                    pickImage(setDriverPhoto, false);
                  else if (currentPicker === "cnic")
                    pickImage(setCnicFront, false);
                }}
                disabled={isLoading}
              >
                <Text style={tw`text-white text-center text-base`}>
                  Upload from Gallery
                </Text>
              </Pressable>
              <Pressable
                style={tw`bg-gray-500 rounded-lg px-4 py-3 mb-3`}
                onPress={() => {
                  if (currentPicker === "driver")
                    pickImage(setDriverPhoto, true);
                  else if (currentPicker === "cnic")
                    pickImage(setCnicFront, true);
                }}
                disabled={isLoading}
              >
                <Text style={tw`text-white text-center text-base`}>
                  Capture Photo
                </Text>
              </Pressable>
              <Pressable
                style={tw`mt-2`}
                onPress={() => {
                  setModalVisible(false);
                  setCurrentPicker(null);
                }}
              >
                <Text style={tw`text-center text-gray-500`}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Driver Photo Section */}
        <Text style={tw`text-xl font-bold mb-3`}>Upload Your Picture</Text>
        <TouchableOpacity
          style={tw`w-full h-52 rounded-2xl border-2 border-dashed border-gray-400 mb-5 items-center justify-center bg-gray-100 overflow-hidden`}
          onPress={() => {
            setModalVisible(true);
            setCurrentPicker("driver");
          }}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          {driverPhoto ? (
            <Image
              source={{ uri: driverPhoto }}
              style={tw`w-full h-full rounded-2xl`}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={require("../assets/images/avatar.png")}
              style={tw`w-32 h-32 rounded-full`}
            />
          )}
        </TouchableOpacity>

        {/* CNIC Photo Section */}
        <Text style={tw`text-xl font-bold mb-3`}>Upload CNIC Frontside</Text>
        <TouchableOpacity
          style={tw`w-full h-52 rounded-2xl border-2 border-dashed border-gray-400 mb-8 items-center justify-center bg-gray-100 overflow-hidden`}
          onPress={() => {
            setModalVisible(true);
            setCurrentPicker("cnic");
          }}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          {cnicFront ? (
            <Image
              source={{ uri: cnicFront }}
              style={tw`w-full h-full rounded-2xl`}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={require("../assets/images/nic-card.png")}
              style={tw`w-40 h-24 rounded-lg`}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>

        {/* Show result or error */}
        {error && (
          <Text style={tw`text-red-500 text-center mb-4`}>{error}</Text>
        )}
        {result && hasVerified && (
          <View style={tw`bg-gray-100 rounded-xl p-4 mb-4 w-full`}>
            {Array.isArray(result.logs) && result.logs.length > 0 && (
              <View style={tw`mt-2`}>
                {result.logs.map((log: any, idx: number) => (
                  <View key={log.log_id || idx} style={tw`mb-1 pl-2`}>
                    {(() => {
                      // Split comments by comma, trim spaces, and extract label/value
                      const commentParts = (log.comments || "").split(",").map((s: string) => s.trim());
                      // Parse into label/value pairs
                      const parsed = commentParts.map((part: string) => {
                        const colonIdx = part.indexOf(":");
                        let label = "";
                        let value = "";
                        if (colonIdx !== -1) {
                          label = part.slice(0, colonIdx).trim();
                          value = part.slice(colonIdx + 1).trim();
                        } else {
                          value = part;
                        }
                        return { label, value };
                      });
                      // Reorder: Name, CNIC, Face Match
                      const order = ["Name", "CNIC", "Face Match"];
                      const ordered = order
                        .map((wantedLabel) =>
                          parsed.find(
                            (item: { label: string; value: string }) =>
                              item.label.toLowerCase().replace(/\s/g, "") === wantedLabel.toLowerCase().replace(/\s/g, "")
                          )
                        )
                        .filter(Boolean);
                      return (
                        <>
                          {ordered.map((item, i) => {
                            if (item.label && item.label.toLowerCase().replace(/\s/g, "") === "cnic") {
                              // Render CNIC number with each digit in a box
                              const cnicDigits = (item.value || "-").replace(/[^0-9]/g, "").split("");
                              return (
                                <View key={i} style={tw`mt-1.5 flex-col items-start mb-1`}>
                                  <Text style={tw`text-base font-bold mr-1`}>{item.label}:</Text>
                                  {cnicDigits.length > 1 ? (
                                    <View style={tw`flex-row justify-between`}>
                                      {cnicDigits.map((digit: string, idx: number) => (
                                        <View
                                          key={idx}
                                          style={tw`w-5 border border-gray-400 rounded-md mx-0.5 items-center justify-center bg-white`}
                                        >
                                          <Text style={tw`text-base font-normal`}>{digit}</Text>
                                        </View>
                                      ))}
                                    </View>
                                  ) : (
                                    <Text style={tw`text-base`}>{item.value || "-"}</Text>
                                  )}
                                </View>
                              );
                            }
                            return (
                              <View key={i} style={tw`mt-1.5 flex-col items-baseline mb-1`}>
                                {item.label ? (
                                  <Text style={tw`text-base font-bold mr-1`}>{item.label}:</Text>
                                ) : null}
                                <Text style={tw`w-full px-2 py-0.5 text-base border border-gray-300 rounded-md`}>{item.value || "-"}</Text>
                              </View>
                            );
                          })}
                        </>
                      );
                    })()}
                  </View>
                ))}
              </View>
            )}
            {mustReupload ? (
              <Text style={tw`text-red-600 font-bold mt-2`}>
                Verification failed. Please re-upload clear images to continue.
              </Text>
            ) : (result && Array.isArray(result.logs) && result.logs.length > 0 && (() => {
              for (const log of result.logs) {
                const commentParts = (log.comments || "").split(",").map((s: string) => s.trim());
                for (const part of commentParts) {
                  const colonIdx = part.indexOf(":");
                  let label = "";
                  let value = "";
                  if (colonIdx !== -1) {
                    label = part.slice(0, colonIdx).trim();
                    value = part.slice(colonIdx + 1).trim();
                  } else {
                    value = part;
                  }
                  if (label.trim() === "Face match") {
                    if (value.toLowerCase() === "true") {
                      return (
                        <Text style={tw`pl-4 text-green-600 font-bold mt-2`}>
                          Verification successful!
                        </Text>
                      );
                    }
                  }
                }
              }
              return null;
            })())}
          </View>
        )}

        <View style={tw`w-full mt-8 flex-row justify-between`}>
          <TouchableOpacity
            style={tw`flex-1 bg-gray-200 px-6 py-3 rounded-lg mr-2 ${
              !driverPhoto || !cnicFront || isLoading || mustReupload ? "opacity-50" : ""
            }`}
            onPress={handleNext}
            disabled={!driverPhoto || !cnicFront || isLoading || mustReupload}
          >
            <Text style={tw`text-center text-base text-black font-semibold`}>
              {isLoading ? "Verifying..." : mustReupload ? "Re-upload Required" : "Verify"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`flex-1 bg-black px-6 py-3 rounded-lg ml-2 ${
              result && Array.isArray(result.logs) && result.logs.some((log: any) => {
                const commentParts = (log.comments || "").split(",").map((s: string) => s.trim());
                return commentParts.some((part: string) => {
                  const colonIdx = part.indexOf(":");
                  let label = "";
                  let value = "";
                  if (colonIdx !== -1) {
                    label = part.slice(0, colonIdx).trim();
                    value = part.slice(colonIdx + 1).trim();
                  } else {
                    value = part;
                  }
                  return label.trim() === "Face match" && value.toLowerCase() === "true";
                });
              }) ? "" : "opacity-50"}
            `}
            onPress={goToNextPage}
            disabled={
              !(
                result && Array.isArray(result.logs) && result.logs.some((log: any) => {
                  const commentParts = (log.comments || "").split(",").map((s: string) => s.trim());
                  return commentParts.some((part: string) => {
                    const colonIdx = part.indexOf(":");
                    let label = "";
                    let value = "";
                    if (colonIdx !== -1) {
                      label = part.slice(0, colonIdx).trim();
                      value = part.slice(colonIdx + 1).trim();
                    } else {
                      value = part;
                    }
                    return label.trim() === "Face match" && value.toLowerCase() === "true";
                  });
                })
              )
            }
          >
            <Text style={tw`text-white text-center text-base`}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default DriverVerification;
