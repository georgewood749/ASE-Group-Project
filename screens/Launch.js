import React from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import Button from "../components/Button";


export default ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>ASE Group Project Task 3</Text>
      <View style={styles.buttonContainer}>
      <Button submit={() => navigation.navigate("Register")}>Sign up</Button>
      <Button submit={() => navigation.navigate("Login")}> Sign in</Button>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: 1,
        marginTop:StatusBar.currentHeight * 2,
    },
    text: {
        flex: 0.5,
        fontSize: 24,
        fontWeight: "400",
        color: "rgba(0,0,0,1.00)",
        textAlign: "center",
        width: 246,
        height: 114,
        flexWrap: "wrap",
    },
    buttonContainer: {
        flex: 0.5,
    }
})
