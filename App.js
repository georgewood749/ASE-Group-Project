import React from "react";
import { Text, StyleSheet, ScrollView, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import useLocation from "./hooks/useLocation";

export default function App() {
  const [location, errorMsg] = useLocation();

  let text = "Waiting..";
  let coords = {};
  if (errorMsg) {
    // if error then text displayed will contain error.
    text = errorMsg;
  } else if (location) {
    /*
     * JSON.stringify with 2 as the 3rd argument.
     * This will make the returned JSON string have 2 spaces for indentation at each level.
     */
    text = JSON.stringify(location, null, 2);
    coords = location.coords;
  }

  const { latitude, longitude } = coords;

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.paragraph}>{text}</Text>
      </ScrollView>
      {location ? (
        <MapView
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          style={styles.map}
        >
          <Marker coordinate={{ latitude, longitude }} />
        </MapView>
      ) : (
        <View />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  paragraph: {
    fontSize: 20,
    flex: 1,
    padding: 20,
  },
  map: {
    width: "100%",
    height: "50%",
  },
});
