import React, { useEffect, useState } from "react";
import Home from "./Home";
import Launch from "./Launch";
import Login from "./Login";
import Register from "./Register";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { getAuthentication, clearCredentials } from "../config/credentials";
import {AuthContext} from "../config/context";

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
  const [state, setState] = useState(false);

  useEffect(() => {
    (async () => {
      await getAuthentication().then((res) => {
        setState(res);
      });

      return () => {
        return ( async() => await clearCredentials())();
      }
    })();

  });

  if (state) {
    // setState passed to remount navigator on logout
    return <SignedIn />
    
  } else {
    return <SignedOut />
  }
};
