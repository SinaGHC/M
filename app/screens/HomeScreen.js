import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import Screen from "../components/Screen";
import Constants from "expo-constants";
import { signOut } from "firebase/auth";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [meetings, setMeetings] = useState([]);
  const [showCreateButton, setShowCreateButton] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const uid = user.uid;
        const q = query(collection(db, "meetings"), where("uid", "==", uid));
        const unsubscribeSnapshot = onSnapshot(
          q,
          (querySnapshot) => {
            const meetingData = [];
            querySnapshot.forEach((doc) => {
              meetingData.push({ ...doc.data(), id: doc.id });
            });
            setMeetings(meetingData);
            setShowCreateButton(meetingData.length === 0);
            setLoading(false);
          },
          (error) => {
            console.error("Error getting documents: ", error);
            console.error("hello");

            setLoading(false);
          }
        );

        return () => unsubscribeSnapshot();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => (
    <Pressable
      style={{
        flex: 1,
        margin: 10,
        padding: 15,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 15,
        backgroundColor: "#f9f9f9",
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={() =>
        navigation.navigate("Meeting", {
          meetingId: item.meetingId,
          item: item,
        })
      }
    >
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.title}</Text>
      <Text style={{ fontSize: 15 }}>Meeting Id: {item.meetingId}</Text>
    </Pressable>
  );

  if (loading)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
      >
        <ActivityIndicator color="#51AFF7" size={32} />
      </View>
    );
  return (
    <Screen
      style={{
        flex: 1,
        justifyContent: showCreateButton ? "center" : "flex-start",
        alignItems: showCreateButton ? "center" : "stretch",
        padding: 20,
      }}
    >
      {showCreateButton && (
        <>
          <Text style={{ color: "white", fontSize: 24, marginBottom: 20 }}>
            Welcome to
            <Text> </Text>
            <Text
              style={{
                color: "white",
                fontSize: 28,
                marginBottom: 20,
                fontWeight: "800",
                color: "#51AFF7",
              }}
            >
              M
            </Text>
          </Text>
          <Text
            style={{ color: "gray", textAlign: "center", marginBottom: 20 }}
          >
            Create a meeting and share the link with others.
          </Text>
        </>
      )}
      <Pressable
        style={{
          position: showCreateButton ? "relative" : "absolute",
          top: showCreateButton ? 50 : Constants.statusBarHeight,
          right: showCreateButton ? 0 : 20,
          backgroundColor: "#51AFF7",
          justifyContent: "center",
          alignItems: "center",
          padding: showCreateButton ? 15 : 10,
          borderBottomRightRadius: showCreateButton ? 20 : 25,
          borderTopLeftRadius: showCreateButton ? 20 : 25,
          borderRadius: showCreateButton ? 0 : 25,
          marginBottom: showCreateButton ? 0 : 200,
        }}
        onPress={() => navigation.navigate("CreateMeeting")}
      >
        <Text
          style={{
            fontSize: showCreateButton ? 20 : 15,
            fontWeight: "600",
            color: "white",
          }}
        >
          Create Meeting
        </Text>
      </Pressable>
      {meetings.length > 0 && (
        <View style={{ width: "100%", marginTop: showCreateButton ? 0 : 200 }}>
          <FlatList
            data={meetings}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            key={showCreateButton ? "oneColumn" : "twoColumns"}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            contentContainerStyle={{ paddingBottom: 20 }}
            style={{ width: "100%" }}
          />
        </View>
      )}
      <Pressable
        style={{
          position: "absolute",
          bottom: 30,
          left: 20,
          backgroundColor: "red",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 25,
          padding: 10
        }}
        onPress={() => signOut(auth)}
      >
        <Text style={{ fontSize: 18, fontWeight: "600" }}>Sign out</Text>
      </Pressable>
    </Screen>
  );
};

export default HomeScreen;
