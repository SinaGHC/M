import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import MeetingScreen from "../screens/MeetingScreen";
import CreateMeeting from "../screens/CreateMeeting";
const Stack = createStackNavigator();
function StackNavigation() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Meeting" component={MeetingScreen} />
      <Stack.Screen name="CreateMeeting" component={CreateMeeting} />
    </Stack.Navigator>
  );
}
export default StackNavigation;
