import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  Share,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { StyleSheet } from "react-native";
import AwesomeButton from "react-native-really-awesome-button";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import * as Linking from "expo-linking";
import axios from "axios";
import AntDesign from "@expo/vector-icons/AntDesign";
import colors from "../config/colors";
import Constants from "expo-constants";
import moment from "moment";

const CreateMeeting = ({ navigation }) => {
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [duration, setDuration] = useState(15);
  const [title, setTitle] = useState("");
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChangeStartTime = (event, selectedDate) => {
    const currentDate = selectedDate || startTime;
    setShowStartTimePicker(false);
    setStartTime(currentDate);
  };

  const onChangeEndTime = (event, selectedDate) => {
    const currentDate = selectedDate || endTime;
    setShowEndTimePicker(false);
    setEndTime(currentDate);
  };

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const generateTimeSlots = (startTime, endTime, duration) => {
    let slots = [];
    let start = moment(startTime, "HH:mm");
    let end = moment(endTime, "HH:mm");

    while (start < end) {
      let slotEnd = moment(start).add(duration, "minutes");
      if (slotEnd > end) {
        slotEnd = end;
      }
      slots.push({
        range: `${start.format("HH:mm")} - ${slotEnd.format("HH:mm")}`,
        available: true,
      });
      start.add(duration, "minutes");
    }

    return slots;
  };

  const createTinyURL = async (longURL) => {
    try {
      const response = await axios.post(
        "https://tinyurl.com/api-create.php",
        null,
        {
          params: { url: longURL },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating TinyURL:", error);
      throw error;
    }
  };

  const createMeeting = async () => {
    try {
      const meetingId = Math.random().toString(36).substring(7);
      const meetingLink = Linking.createURL(`meeting/${meetingId}`, {
        scheme: "myapp",
      });

      const tinyURL = await createTinyURL(meetingLink);
      Share.share({
        message: tinyURL,
      });

      return { link: tinyURL, id: meetingId };
    } catch (error) {
      Alert.alert("Error", "Failed to create meeting. Please try again.");
    }
  };

  const handleSubmit = async () => {
    const s = formatTime(startTime);
    const e = formatTime(endTime);

    if (s === e) {
      Alert.alert("Error", "Starting time and ending time cannot be the same.");
      return;
    }
    if (title.length === 0) {
      Alert.alert("Error", "Title can't be empty.");
      return;
    }

    try {
      const { link, id } = await createMeeting();
      const timeSlots = generateTimeSlots(s, e, duration);
        

      await setDoc(doc(db, "meetings", id), {
        title: title,
        startingTime: s,
        endingTime: e,
        duration: duration,
        uid: auth.currentUser.uid,
        participants: [],
        link,
        meetingId: id,
        timeSlots,
      });
      setTitle("");
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert("Error", "Failed to create meeting. Please try again.");
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.DARK }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <AntDesign
          onPress={() => navigation.navigate("Home")}
          style={{
            position: "absolute",
            top: Constants.statusBarHeight,
            left: 20,
          }}
          name="arrowleft"
          size={24}
          color="grey"
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter meeting title"
            placeholderTextColor="white"
            value={title}
            onChangeText={(text) => setTitle(text)}
          />
        </View>
        <Text style={styles.label}>Start Time: {formatTime(startTime)}</Text>
        <View style={styles.inputContainer}>
          <Button
            onPress={() => setShowStartTimePicker(true)}
            title="Select Starting Time"
            color="#51AFF7"
          />
        </View>
        {showStartTimePicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onChangeStartTime}
          />
        )}
        <Text style={styles.label}>End Time: {formatTime(endTime)}</Text>
        <View style={styles.inputContainer}>
          <Button
            onPress={() => setShowEndTimePicker(true)}
            title="Select Ending Time"
            color="#51AFF7"
          />
        </View>
        {showEndTimePicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onChangeEndTime}
          />
        )}
        <Text style={styles.label}>Duration</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={duration}
            style={styles.picker}
            onValueChange={(itemValue) => setDuration(itemValue)}
          >
            <Picker.Item label="15 minutes" value={15} />
            <Picker.Item label="30 minutes" value={30} />
            <Picker.Item label="1 hour" value={60} />
          </Picker>
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 40,
          }}
        >
          <AwesomeButton
            backgroundColor="#51AFF7"
            backgroundDarker="#51AFF7"
            borderRadius={15}
            width={null}
            disabled={loading}
            progress
            onPress={(next) => {
              handleSubmit();
              next();
            }}
          >
            Create Meeting
          </AwesomeButton>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateMeeting;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
    color: "white",
  },
  inputContainer: {
    width: "80%",
    marginVertical: 10,
    borderRadius: 5,
  },
  pickerContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 5,
    marginVertical: 10,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  input: {
    height: 40,
    borderColor: "#51AFF7",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: "white",
  },
});
