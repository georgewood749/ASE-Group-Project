import React from "react";
import Home from "./Home";
import Launch from "./Launch";
import Login from "./Login";
import Register from "./Register";
import Network from "./Network";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Alert, VStack, Center, Text, Box } from "native-base";
import { useSelector } from "react-redux";
import useNetwork from "../hooks/useNetwork";
import LoadingIndicator from "../components/loadingWifi";

const Stack = createStackNavigator();

const SignedIn = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  </NavigationContainer>
);

const SignedOut = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Launch"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Launch" component={Launch} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  </NavigationContainer>
);



export default () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [isConnected, isLoading] = useNetwork();

  if (isLoading) {
    return <LoadingIndicator />;
  } else if (!isConnected) {
    return <Network />;
  } else if (true) {
    return <SignedIn />;
  } else {
    return <SignedOut />;
  }
};
