import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SignUpScreen from "../screens/SignUpScreen";
import LogInScreen from "../screens/LoginScreen";
const Stack = createStackNavigator();

function AuthNavigation() {
  return (
    <Stack.Navigator
      initialRouteName="SignUp"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Login" component={LogInScreen} />
    </Stack.Navigator>
  );
}

export default AuthNavigation;
