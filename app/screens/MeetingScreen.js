import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Share, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import colors from "../config/colors";
import Screen from "../components/Screen";
import AntDesign from "@expo/vector-icons/AntDesign";
import Constants from "expo-constants";
import AwesomeButton from "react-native-really-awesome-button";
import { doc, onSnapshot, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../../firebase";

const MeetingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { meetingId } = route.params;
  const [timeSlots, setTimeSlots] = useState([]);
  const [reservedSlotIndex, setReservedSlotIndex] = useState(null);
  const [link, setLink] = useState("");
  const [uid, setUid] = useState("");

  useEffect(() => {
    console.log(meetingId)
    const unsubscribe = onSnapshot(doc(db, "meetings", meetingId), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setTimeSlots(data.timeSlots || []);
        setUid(data.uid);
        const participants = data.participants || [];
        setLink(data.link);
        const userReservedSlot = data.timeSlots.findIndex((slot) =>
          slot.participants?.some((p) => p.uid === auth.currentUser.uid)
        );
        setReservedSlotIndex(userReservedSlot !== -1 ? userReservedSlot : null);
      }
    });

    return () => unsubscribe();
  }, [meetingId]);

  const onShare = async () => {
    try {
      await Share.share({
        message: `Please use the following link to schedule your appointment: ${item.link}`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleReserve = async (index) => {
    if (timeSlots[index].available === false) {
      Alert.alert("Unavailable", "This time slot has already been reserved.");
      return;
    }

    try {
      const updatedTimeSlots = [...timeSlots];
      updatedTimeSlots[index].available = false;
      if (!updatedTimeSlots[index].participants) {
        updatedTimeSlots[index].participants = [];
      }
      updatedTimeSlots[index].participants.push({
        uid: auth.currentUser.uid,
        displayName: auth.currentUser.displayName,
      });

      await updateDoc(doc(db, "meetings", meetingId), {
        participants: arrayUnion({
          uid: auth.currentUser.uid,
          displayName: auth.currentUser.displayName,
        }),
        timeSlots: updatedTimeSlots,
      });

      setTimeSlots(updatedTimeSlots);
      setReservedSlotIndex(index);
    } catch (error) {
      console.error("Error reserving meeting:", error);
      Alert.alert("Error", "An error occurred while reserving the meeting.");
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <Screen style={styles.screen}>
        <AntDesign
          onPress={() => navigation.navigate("Home")}
          style={{
            position: "absolute",
            top: Constants.statusBarHeight,
            left: 20,
            marginBottom: 20,
          }}
          name="arrowleft"
          size={24}
          color="grey"
        />
        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>{link}</Text>
          <Feather
            onPress={onShare}
            name="share"
            size={24}
            color={colors.LIGHT}
          />
        </View>
        <View style={styles.timeSlotsContainer}>
          {timeSlots.map((slot, index) => (
            <View
              key={index}
              style={[
                styles.buttonContainer,
                timeSlots.length === 1 && {
                  width: "100%",
                  justifyContent: "center",
                },
              ]}
            >
              <AwesomeButton
                backgroundColor={
                  reservedSlotIndex === index || !slot.available
                    ? "red"
                    : "#51AFF7"
                }
                backgroundDarker={
                  reservedSlotIndex === index || !slot.available
                    ? "red"
                    : "#51AFF7"
                }
                stretch={timeSlots.length === 1}
                onPress={() =>
                  reservedSlotIndex === index || !slot.available
                    ? Alert.alert(
                        "Unavailable",
                        "This time slot has already been reserved."
                      )
                    : handleReserve(index)
                }
                disabled={uid === auth.currentUser.uid ? true : false}
              >
                {slot.range}
              </AwesomeButton>
            </View>
          ))}
        </View>
      </Screen>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    backgroundColor: colors.DARK,
  },
  screen: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    width: "90%",
    marginTop: 40,
  },
  linkText: {
    fontSize: 18,
    color: colors.LIGHT,
    marginRight: 10,
  },
  timeSlotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
    width: "100%",
  },
  buttonContainer: {
    marginVertical: 10,
    width: "40%",
    paddingHorizontal: 10,
  },
});

export default MeetingScreen;
