import React, {useEffect, useState} from "react";
import { AuthContext } from "../config/context";
import Home from "./Home";
import Launch from "./Launch";
import Login from "./Login";
import Register from "./Register";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

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
   // const [state, setState] = useAuthentication();
   const [state, setState] = useState({
       isAuthenticated: false,
   });

    if(state.isAuthenticated) {
        return <AuthContext.Provider value={state.user}>
            <SignedIn />
        </AuthContext.Provider>
    } else {
        return <AuthContext.Provider value={setState}>
            <SignedOut />
        </AuthContext.Provider>
    }
}