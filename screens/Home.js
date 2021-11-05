import React from "react";
import { Text, StyleSheet, ScrollView, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import useLocation from "../hooks/useLocation";
import LoadingIndicator from "../components/loading";
import { getCredentials } from "../config/credentials";
import Button from "../components/Button";

import axios from "axios";

const API = axios.create({
  baseURL: "http://46.101.40.220:8080/",
});

const header = (token) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/json;",
  "Content-Type": "application/json",
  XNationality: "en",
});

const StlyedMarker = ({ user }) => {
  return (
    <View
      style={{
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "yellow",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "black" }}>{user.username}</Text>
    </View>
  );
};

export default () => {
  const [location, errorMsg] = useLocation();
  const [regionLocation, setRegionLocation] = React.useState({
    waiting: "Data unavailable...",
  });
  const [user, setUser] = React.useState(undefined);

  React.useEffect(() => {
    (async () => {
      const res = await getCredentials();
      setUser(res);
    })();
  });

  async function storeLocationToServer(coords) {
    const res = await API.post(
      "/location/add",
      {
        lat: coords.latitude,
        lng: coords.longitude,
      },
      {
        headers: header(user.token),
      }
    );

    console.log(res);
  }

  /*
     Checks for error message.
     if there is text is updated with error;
     else the location is updated and the map is drawn.
    */

  let text = undefined;
  let coords = {};
  if (errorMsg) {
    text = errorMsg;

    // return LogBox.error(errorMsg); *
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

  if (typeof text == "undefined") {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.paragraph}>{text}</Text>
        <Text style={styles.paragraph}>
          {JSON.stringify(regionLocation, null, 2)}
        </Text>

        <Button
          submit={() => {
            storeLocationToServer(coords);
          }}
        >
          Save Location
        </Button>

        <Button
          submit={() => {
            
          }}
        >
          Sign out
        </Button>
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
          >
            <StlyedMarker user={user} />
          </Marker>
        </MapView>
      ) : (
        <Text style={styles.paragraph}>Waiting for map...</Text>
      )}
    </View>
  );
};

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
