import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

export default ({ regionState, userCoordinates }) => {
  function jumpToCurrentLocation() {
    regionState((prev) => ({
      ...prev,
      latitude: userCoordinates.latitude,
      longitude: userCoordinates.longitude,
    }));
  }

  return (
    <View style={styles.container}>
      <View style={[styles.bubble, styles.latlng]}>
        <Text style={styles.centeredText}>
          {userCoordinates.latitude.toPrecision(4)},
          {userCoordinates.longitude.toPrecision(4)}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => jumpToCurrentLocation()}
          style={[styles.bubble, styles.button]}
        >
          <Text style={styles.buttonText}>Go to current location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
