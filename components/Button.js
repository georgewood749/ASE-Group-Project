import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

export default function Button({ children, submit }) {
  return (
    <TouchableOpacity style={styles.rectangle} onPress={submit}>
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  rectangle: {
    backgroundColor: "rgba(234,234,234,1.00)",
    borderWidth: 0,
    borderStyle: "solid",
    borderColor: "rgba(0,0,0,1.00)",
    width: 176,
    height: 48,
    display: "flex",
    alignItems: "center",
    margin: 10,
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: { height: 1, width: 1 },
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 10,
  },
});
