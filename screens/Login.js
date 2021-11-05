import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, StatusBar, TextInput } from "react-native";
import Button from "../components/Button";
import axios from "axios";
import { setAuth } from "../config/credentials";

const API = axios.create({
  baseURL: "http://46.101.40.220:8080/",
});

export default ({ navigation }) => {
  // for updating and re-rendering login page when -
  // (a) username is changed
  // (b) password is changed
  const [username, setUsername] = useState(undefined);
  const [password, setPassword] = useState(undefined);

  const handleLogin = async (username, password) => {
    if (username && password) {
      await API.post(
        "/authorization/login",
        { username, password },
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            XNationality: "en",
          },
        }
      )
        .then(async (res) => {
          const {
            user: { id, username },
            accessToken,
            refreshToken: { token, expirationDate },
          } = res.data;

          const value = await setAuth({
            id,
            username,
            token: accessToken,
            refreshToken: token,
            expirationDate,
          });
          if (value) navigation.navigate("Home");
          else return new Error("Failed to store login details");
        })
        .catch((error) => console.log(error.message));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome Back!</Text>
      <Text style={[styles.text, { fontSize: 16, fontWeight: "400" }]}>
        Please enter your login details
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
          handleLogin(username, password);
        }}
      >
        Sign in
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
