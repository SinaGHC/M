import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import * as Linking from "expo-linking";
import StackNavigation from "./app/navigation/StackNavigation";
import AuthNavigation from "./app/navigation/AuthNavigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { ActivityIndicator, View } from "react-native";

const linking = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      Home: "",
      Meeting: "meeting/:meetingId",
    },
  },
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setLoading(false); 
    });

    return unsubscribe;
  }, []);

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
    <NavigationContainer linking={linking}>
      {isLoggedIn ? <StackNavigation /> : <AuthNavigation />}
    </NavigationContainer>
  );
}

export default App;
