import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

const AppTextInput = ({ style, ...other }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, style]}
        placeholder="Enter text"
        placeholderTextColor="#999"
        {...other}
      />
    </View>
  );
};

export default AppTextInput;

const styles = StyleSheet.create({
  input: {
    height: 40,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#000",
  },
});
