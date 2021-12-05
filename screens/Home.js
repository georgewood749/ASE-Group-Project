import React, { useRef, useCallback, useMemo } from "react";
import {
  Text,
  StyleSheet,
  View,
  LogBox,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import useLocation from "../hooks/useLocation";
import LoadingIndicator from "../components/loading";
import { useToast, Center } from "native-base";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { useSelector, useDispatch } from "react-redux";
import { LOGOUT_REQUESTED } from "../store/auth.saga";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

LogBox.ignoreLogs(["Setting a timer"]); // current issue with fb-react/native

import axios from "axios";
import { style } from "styled-system";

const API = axios.create({
  baseURL: "http://46.101.40.220:8080/",
});

const header = (token) => ({
  Authorization: `${token}`,
  Accept: "application/json;",
  "Content-Type": "application/json",
  XNationality: "en",
});

const StlyedMarker = ({ user }) => {
  if (user == null) {
    return <LoadingIndicator />;
  }

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
      <Text style={{ color: "black" }}>{user.username || "Anonymous"}</Text>
    </View>
  );
};

export default ({ navigation }) => {
  const [location, errorMsg] = useLocation();
  const bottomSheetModalRef = useRef(null);

  const [regionLocation, setRegionLocation] = React.useState({
    waiting: "Data unavailable...",
    coords,
  });

  const user = useSelector((state) => state.user);
  const toast = useToast();
  // const dispatch = useDispatch();

  const snapPoints = useMemo(() => ["25%", "50%", "70%"], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  async function storeLocationToServer(coords) {
    await API.post(
      "/location/add",
      {
        lat: coords.latitude,
        lng: coords.longitude,
      },
      {
        headers: header(user.token),
      }
    )
      .then(() =>
        toast.show({
          title: "Location stored successfully!",
          status: "success",
          description: "Thanks for using our API.",
        })
      )
      .catch((error) => {
        toast.show({
          title: "Something went wrong",
          status: "error",
          description: "Server request failed.",
        });
        console.log(error.message);
      });
  }

  /*
     Checks for error message.
     if there is text is updated with error;
     else the location is updated and the map is drawn.
    */
  const { width, height } = Dimensions.get("window");
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
    const ASPECT_RATIO = width / height;
    const LATITUDE_DELTA = 0.0922;
    const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
    coords.latitudeDelta = LATITUDE_DELTA;
    coords.longitudeDelta = LONGITUDE_DELTA;
  }

  const onRegionChange = (region) => {
    setRegionLocation({ region });
  };

  if (typeof text == "undefined") {
    return <LoadingIndicator />;
  }

  /* <Button
          submit={() => {
            storeLocationToServer(coords);
          }}
        >
          Save Location
        </Button>

        <Button
          submit={() => {
            dispatch(LOGOUT_REQUESTED());
          }}
        >
          Sign out
        </Button> */

  // return (
  //   <View style={styles.container}>
  //     {location ? (
  //       <MapView
  //         initialRegion={coords}
  //         showsUserLocation={true}
  //         followUserLocation={true}
  //         zoomEnabled={true}
  //         style={styles.map}
  //         region={coords}
  //       >
  //         <Marker
  //           coordinate={{
  //             latitude: coords.latitude,
  //             longitude: coords.longitude,
  //           }}
  //         >
  //           <StlyedMarker user={user} />
  //         </Marker>
  //       </MapView>
  //     ) : (
  //       <Text style={styles.paragraph}>Waiting for map...</Text>
  //     )}

  //     <Box style={{display: "flex", flexDirection: "row"}} safeArea>
  //       <TouchableOpacity
  //         style={styles.rectangle}
  //         onPress={() => {
  //           dispatch(LOGOUT_REQUESTED());
  //         }}
  //       >
  //         <Text style={{fontWeight: "bold", fontSize: 20}}>Sign out</Text>
  //       </TouchableOpacity>
  //       <View style={[styles.bubble, styles.latlng]}>
  //         <TouchableOpacity
  //           onPress={() =>
  //             setRegionLocation((prev) => ({
  //               ...prev,
  //               latitude: coords.latitude,
  //               longitude: coords.longitude,
  //             }))
  //           }
  //         >
  //           <Text style={styles.centeredText}>
  //             {coords.latitude.toPrecision(4)},{coords.longitude.toPrecision(4)}
  //           </Text>
  //         </TouchableOpacity>
  //       </View>
  //     </Box>

  //     <BottomSheetModalProvider>
  //     <View style={styles.container}>
  //       <Button
  //         onPress={handlePresentModalPress}
  //         title="Present Modal"
  //         color="black"
  //       />
  //       <BottomSheetModal
  //         ref={bottomSheetModalRef}
  //         index={1}
  //         snapPoints={snapPoints}
  //         onChange={handleSheetChanges}
  //       >
  //         <View style={styles.contentContainer}>
  //           <Text>Awesome 🎉</Text>
  //         </View>
  //       </BottomSheetModal>
  //     </View>
  //   </BottomSheetModalProvider>

  //   </View>
  // );

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={styles.container}>
        {location ? (
          <MapView initialRegion={coords} style={styles.map} region={coords}>
            <Marker coordinate={coords}>
              <MaterialIcons name="my-location" size={35} color="black" />
            </Marker>
          </MapView>
        ) : (
          <Center>
            <Text style={{ fontWeight: "bold" }}>Waiting for map...</Text>{" "}
          </Center>
        )}
        <View style={styles.topNavigation}>
          <TouchableOpacity
            style={styles.humberger}
            onPress={handlePresentModalPress}
          >
            <Center>
              <Text style={styles.signOutText}> Sign out</Text>{" "}
            </Center>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.location, { left: width - 50 }]} onPress={() => {
            setRegionLocation(prev => ({
              ...prev,
              latitude: coords.latitude,
              longitude: coords.longitude,
            }))
          }}>
            <Center>
              <FontAwesome name="location-arrow" size={30} color="black" />
            </Center>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >
          <View style={styles.contentContainer}>
            <Text>Awesome 🎉</Text>
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     ...StyleSheet.absoluteFillObject,
//     display: "flex",
//     justifyContent: "flex-start",
//   },
//   paragraph: {
//     fontSize: 20,
//     flex: 1,
//     padding: 20,
//   },
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },

//   bubble: {
//     backgroundColor: "rgba(255,255,255,0.7)",
//     paddingHorizontal: 18,
//     paddingVertical: 12,
//     borderRadius: 20,
//     alignSelf: "flex-end",
//   },
//   latlng: {
//     width: 200,
//     alignItems: "stretch",
//   },
//   button: {
//     width: 100,
//     paddingHorizontal: 8,
//     alignItems: "center",
//     justifyContent: "center",
//     marginHorizontal: 5,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     marginVertical: 20,
//     backgroundColor: "transparent",
//   },
//   buttonText: {
//     textAlign: "center",
//   },
//   centeredText: { textAlign: "center" },
//   hamburgerMenu: {
//     marginTop: 50,
//   },
//   rectangle: {
//     backgroundColor: "rgba(234,234,234,0)",
//     borderWidth: 0,
//     display: "flex",
//     alignItems: "center",
//     alignSelf: "flex-start",
//     margin: 10,
//   },
// });

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "purple",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "green",
  },
  topNavigation: {
    // backgroundColor: 'rgba(255,255,255,0.4)',
    height: 50,
    marginTop: 15,
    padding: 5,
    width: "100%",
  },
  humberger: {
    width: 100,
    height: 50,
    flexWrap: "wrap",
  },
  location: {
    width: 50,
    height: 50,
    top: -50,
  },
  signOutText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});
