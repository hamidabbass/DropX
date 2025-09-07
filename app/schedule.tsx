import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Animated,
    Dimensions,
    Platform,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import WheelPickerExpo from "react-native-wheel-picker-expo";
import tw from "twrnc";

const hours = Array.from({ length: 12 }, (_, i) => i + 1); // 12-hour format
const minutes = Array.from({ length: 60 }, (_, i) => i);
const ampm = ["AM", "PM"];

interface ScheduleModalProps {
  routeKey?: string;
  visible: boolean;
  onClose: () => void;
  onSetSchedule: (date: Date) => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ visible, onClose, onSetSchedule, routeKey }) => {
  // const navigation = useNavigation();
  const [selectedDay, setSelectedDay] = useState<"today" | "tomorrow" | "date">(
    "today"
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(30);
  const [ampmValue, setAmpmValue] = useState("AM");
  const [slideAnim] = useState(
    new Animated.Value(Dimensions.get("window").height)
  );

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get("window").height,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleSetSchedule = () => {
    let date = new Date(selectedDate);
    if (selectedDay === "tomorrow") {
      date.setDate(date.getDate() + 1);
    }
    let hour24 =
      ampmValue === "PM"
        ? hour === 12
          ? 12
          : hour + 12
        : hour === 12
        ? 0
        : hour;
    date.setHours(hour24);
    date.setMinutes(minute);
    date.setSeconds(0);
  onSetSchedule(date);
  onClose();
  router.push('/rideoptionsscreen');
  };

  return (
    <View style={tw``}>
      <Animated.View
        style={[
          tw`bg-gray-200 px-4 pt-4 pb-6 w-full pt-10`,
          {
            transform: [{ translateY: slideAnim }],
            elevation: 10,
          },
        ]}
      >
        <View style={tw``}>
          <Text style={tw`text-2xl font-bold text-center mb-2 text-black`}>
            Schedule a Ride
          </Text>
        </View>

        <View style={tw`pb-6`}>
          <Text style={tw`text-gray-500 text-center text-base`}>
            You can schedule your ride for today, tomorrow, or any date and
            time. Please select your preferred options above and tap 'Set
            Schedule' to confirm.
          </Text>
        </View>
        <View style={tw`flex-row mb-4 px-4`}>
          <TouchableOpacity
            style={tw`${
              selectedDay === "today" ? "rounded-r-lg bg-black" : "bg-gray-100"
            } px-4 py-2 rounded-l-lg w-[50%]`}
            onPress={() => setSelectedDay("today")}
          >
            <Text
              style={tw`${
                selectedDay === "today" ? "text-white" : "text-black"
              } font-semibold text-center`}
            >
              Today
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`${
              selectedDay === "date" ? "rounded-l-lg bg-black" : "bg-gray-100"
            } px-4 py-2 rounded-r-lg w-[50%]`}
            onPress={() => setSelectedDay("date")}
          >
            <Text
              style={tw`${
                selectedDay === "date" ? "text-white" : "text-black"
              } font-semibold text-center`}
            >
              Select Date
            </Text>
          </TouchableOpacity>
        </View>
        {selectedDay === "date" && (
          <>
            <TouchableOpacity
              style={tw`mb-4 bg-gray-100 rounded-full px-4 py-2`}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={tw`text-black text-center`}>
                {selectedDate ? selectedDate.toDateString() : "Pick a date"}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                minimumDate={new Date()}
                onChange={(event, date) => {
                  setShowDatePicker(Platform.OS === "ios");
                  if (date) setSelectedDate(date);
                }}
              />
            )}
          </>
        )}
        <View style={tw`flex-row justify-center items-center mb-6`}>
          <View style={tw`w-20 mx-1`}>
            <WheelPickerExpo
              height={280}
              width={80}
              initialSelectedIndex={hours.indexOf(hour)}
              items={hours.map((h) => ({
                label: h.toString().padStart(2, "0"),
                value: h,
              }))}
              onChange={({ item }) => setHour(item.value)}
              backgroundColor={"#fff"}
            />
          </View>
          <Text style={tw`text-black text-xl font-bold mx-1`}>:</Text>
          <View style={tw`w-20 mx-1`}>
            <WheelPickerExpo
              height={280}
              width={80}
              initialSelectedIndex={minute}
              items={minutes.map((m) => ({
                label: m.toString().padStart(2, "0"),
                value: m,
              }))}
              onChange={({ item }) => setMinute(item.value)}
              backgroundColor={"#fff"}
            />
          </View>
          <View style={tw`w-16 mx-1`}>
            <WheelPickerExpo
              height={180}
              width={80}
              initialSelectedIndex={ampm.indexOf(ampmValue)}
              items={ampm.map((a) => ({ label: a, value: a }))}
              onChange={({ item }) => setAmpmValue(item.value)}
              backgroundColor={"#fff"}
            />
          </View>
        </View>
        <View style={tw`flex-row gap-3 justify-between mt-2`}>
          <TouchableOpacity
            style={tw`flex-1 bg-gray-100 rounded-full px-8 py-3`}
            onPress={onClose}
          >
            <Text style={tw`text-black text-center font-bold text-base`}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`bg-black rounded-full px-6 py-3`}
            onPress={handleSetSchedule}
          >
            <Text style={tw`text-white font-bold text-base`}>Set Payment</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default ScheduleModal;
