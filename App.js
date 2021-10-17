import React from "react";
import { Text, StyleSheet, ScrollView, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import useLocation from "./hooks/useLocation";
import { LogBox } from "react-native";

// error ignored because of MapView bug
LogBox.ignoreLogs([
  "Warning: Failed prop type: The prop `region.latitude` is marked as required in `MapView`, but its value is `undefined`.",
]);

export default function App() {
  const [location, errorMsg] = useLocation();
  const [regionLocation, setRegionLocation] = React.useState({waiting: "Data unavailable..."});

  /*
   Checks for error message.
   if there is text is updated with error;
   else the location is updated and the map is drawn.
  */
  let text = "Waiting..";
  let coords = {};
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    /*
     * JSON.stringify with 2 as the 3rd argument.
     * This will make the returned JSON string have 2 spaces for -
     * -  indentation at each level.
     */
    text = JSON.stringify(location, null, 2);
    const { longitude, latitude } = location.coords;
    coords.longitude = longitude;
    coords.latitude = latitude;

    /*
    Default value for now. 
    Might need to zoom out to see location on some devices
    */

    coords.latitudeDelta = 0.0922;
    coords.longitudeDelta = 0.0421;
  }

  const onRegionChange = (region) => {
    setRegionLocation({ region });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.paragraph}>{text}</Text>
        <Text style={styles.paragraph}>
          {JSON.stringify(regionLocation, null, 2)}
        </Text>
      </ScrollView>
      {location ? (
        <MapView
          initialRegion={coords}
          showsUserLocation={true}
          followUserLocation={true}
          zoomEnabled={true}
          style={styles.map}
          onRegionChangeComplete={onRegionChange}
        >
          <Marker
            coordinate={{
              latitude: coords.latitude,
              longitude: coords.longitude,
            }}
          />
        </MapView>
      ) : (
        <Text style={styles.paragraph}>Waiting for map...</Text>
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
