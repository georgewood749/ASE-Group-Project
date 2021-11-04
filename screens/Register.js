import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, StatusBar, TextInput } from "react-native";
import { AuthContext } from "../config/context";
import { register } from "../config/api/index";
import { setToken } from "../config/credentials";
import Button from "../components/Button";

export default () => {
  // for updating and re-rendering register page when -
  // (a) username is changed
  // (b) password is changed
  const [username, setUsername] = useState(undefined);
  const [password, setPassword] = useState(undefined);

  // updates parent navigation component to re-render children.
  const setAuth = useContext(AuthContext);

  const handleRegister = (username, password) => {
    register(username, password)
      .then((res) => {
        const { accessToken, username, refreshToken, expirationDate } = res;
        setToken({
          username,
          token: accessToken,
          refreshToken,
          expirationDate,
        }).then((value) => {
          const { token, username, refreshToken, expirationDate } = value;
          setAuth({
            isAuthenticated: true,
            accessToken: token,
            username,
            refreshToken,
            expirationDate,
          });
        });
      })
      .catch((error) => console.log(error.message));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Register an account</Text>
      <Text style={[styles.text, { fontSize: 16, fontWeight: "400" }]}>
        Please enter your username and choose a password
      </Text>

      <TextInput
        style={styles.textInput}
        placeholder="Username"
        placeholderTextColor="#878787"
        onChangeText={(username) => {
          if (username) {
            setUsername(username);
          } else {
            console.log("empty");
          }
        }}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Password"
        placeholderTextColor="#878787"
        secureTextEntry={true}
        onChangeText={(password) => {
          if (password) {
            setPassword(password);
          } else {
            console.log("empty");
          }
        }}
      />
      <Button
        submit={() => {
          handleRegister(username, password);
        }}
      >
        Register
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    marginTop: StatusBar.currentHeight * 2,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "rgba(0,0,0,1.00)",
    textAlign: "center",
    width: 246,
    height: 114,
    flexWrap: "wrap",
  },
  textInput: {
    fontWeight: "bold",
    fontSize: 18,
    width: 193,
    height: 39,
    backgroundColor: "#EAEAEA",
    padding: 10,
    marginTop: 5,
  },
});
