import React, { useRef, useCallback, useMemo, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  LogBox,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StatusBar,
} from "react-native";
import MapView, {
  Marker,
  Callout,
  Heatmap,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import useLocation from "../hooks/useLocation";
import LoadingIndicator from "../components/loading";
import {
  useToast,
  Center,
  HStack,
  VStack,
  Heading,
  Radio,
  Divider,
  Box,
  SectionList,
  Text as TextNativeBase,
} from "native-base";
import PriceMarker from "../components/PriceMarker";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { useSelector, useDispatch } from "react-redux";
import { LOGOUT_REQUESTED } from "../store/auth.saga";
import { PRICE_PAID_REQUESTED } from "../store/price.saga";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { SvgUri } from "react-native-svg";
import PriceData from "../data/PricePaid";
import Slider from "@react-native-community/slider";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

LogBox.ignoreLogs(["Setting a timer"]); // current issue with fb-react/native

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

const sectionData = [
  {
    title: "Suggested Radius (500m)",
    description: "Show price paid data from this general area ",
    radioValue: "1",
  },
  {
    title: "Custom Radius",
    description: "Show price paid data within specific distance",
    radioValue: "2",
  },
];

const Section = ({ data, disableSlider, resetRadius }) => {
  const [groupValue, setGroupValue] = useState("1");

  return (
    <Radio.Group
      name="radiusGroup"
      defaultValue={groupValue}
      onChange={(value) => {
        setGroupValue(value);

        if (value == "1") {
          disableSlider(true);
          resetRadius(); // resets radius to 500 m
        } else disableSlider(false);
      }}
    >
      {data.map((item, index) => {
        const {
          title: sectionTitle,
          description: sectionContent,
          radioValue,
        } = item;
        return (
          <Box key={index}>
            <HStack mx={3} my={3} w="100%" h={50} space="xl">
              <VStack>
                <Heading size="sm">{sectionTitle}</Heading>
                <TextNativeBase fontSize="14">{sectionContent}</TextNativeBase>
              </VStack>
              <Center>
                <VStack>
                  <Radio value={radioValue} accessibilityLabel={sectionTitle} />
                </VStack>
              </Center>
            </HStack>
            <Divider />
          </Box>
        );
      })}
    </Radio.Group>
  );
};

export default () => {
  const [location, errorMsg] = useLocation();
  const bottomSheetModalRef = useRef(null);
  const [isFetchPrice, setIsFetching] = useState(true);

  // // '_' for now
  const [regionLocation, setRegionLocation] = useState(false);
  const [searchDetails, setSearchDetails] = useState(undefined);
  const [isCustomLocation, setIsCustomLocation] = useState(false);
  const [isSliderDisabled, setDisabledSlider] = useState(true);
  const [radius, setRadius] = useState(0.5); // default half kilometer
  const [isMarker, setMarker] = useState(false);
  const [selectedPriceData, setSelectPriceData] = useState(undefined);
  const searchRef = useRef(null);

  Number.prototype.toMeters = function () {
    const radius = this.valueOf();
    return Number((radius * 1000).toFixed(0));
  };

  Number.prototype.toMiles = function () {
    const radius = this.valueOf();
    return Math.floor(radius * 0.62137119 * 10) / 10;
  };

  // state hooks to store
  const user = useSelector((state) => state.user);
  const map = useSelector((state) => state.map);

  const dispatch = useDispatch();

  const toast = useToast();

  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  let SECTION_LIST_DATA = [];
  if (selectedPriceData)
    SECTION_LIST_DATA = [
      {
        title: "Transaction ID",
        data: [selectedPriceData.id],
      },
      {
        title: "Price",
        data: [selectedPriceData.pricepaid],
      },
      {
        title: "Date",
        data: [selectedPriceData.date]
      },
      {
        title: "Post Code",
        data: [selectedPriceData.postcode],
      },
      {
        title: "Property Type",
        data: [selectedPriceData.propertyType],
      },
      {
        title: "Newly Built",
        data: [selectedPriceData.isNew],
      },
      {
        title: "Building State",
        data: [selectedPriceData.contractType],
      },
      {
        title: "Primary Address",
        data: [selectedPriceData.paon],
      },
      {
        title: "Secondary Address ",
        data: [selectedPriceData.saon],
      },
      {
        title: "Street",
        data: [selectedPriceData.street],
      },
      {
        title: "Locality",
        data: [selectedPriceData.locality],
      },
      {
        title: "Town",
        data: [selectedPriceData.town],
      },
      {
        title: "Distirct",
        data: [selectedPriceData.district],
      },
      {
        title: "County",
        data: [selectedPriceData.county],
      },
      {
        title: "Transaction Category",
        data: [selectedPriceData.transactionCategory],
      },
      {
        title: "Record Status",
        data: [selectedPriceData.recordStatus],
      },
    ];

  // for bottom drawer
  const snapPoints = useMemo(() => ["25%", "50%", "70%"], []);

  // for heat map
  const heatpoints = useMemo(heatmap, [map.pricePaid]);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
    if (index == -1) {
      setDisabledSlider(true); // closed
      setSelectPriceData(undefined);
      if (isMarker) setMarker(false);
    }
  }, []);

  let currentLocation = undefined;
  if (errorMsg) {
    toast.show({
      description: errorMsg,
      title: "Error occured while fetching location",
      status: "error",
    });
  } else if (location) {
    const { longitude, latitude } = location.coords;

    /*
            Default value for now. 
            Might need to zoom out to see location on some devices
            */

    currentLocation = {
      longitude,
      latitude,
      LATITUDE_DELTA,
      LONGITUDE_DELTA,
    };

    // set to one for now: BUG with backend.
    if (isFetchPrice) {
      isCustomLocation
        ? dispatch(
            PRICE_PAID_REQUESTED({ currentLocation: regionLocation, radius })
          )
        : dispatch(PRICE_PAID_REQUESTED({ currentLocation, radius }));
      setIsFetching(false);
    }
  }

  function heatmap() {
    return map.pricePaid.map((pricePoint) => {
      return {
        latitude: pricePoint.lat,
        longitude: pricePoint.lng,
        weight: 1,
      };
    });
  }

  return (
    <BottomSheetModalProvider>
      <View style={{ marginTop: StatusBar.currentHeight + 2, flex: 1 }}>
        <GooglePlacesAutocomplete
          ref={searchRef}
          placeholder="Search"
          fetchDetails
          GooglePlacesDetailsQuery={{
            rankby: "distance",
          }}
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            const {
              name,
              geometry: {
                location: { lat, lng },
              },
            } = details;

            setSearchDetails({
              name,
              lat,
              lng,
            });

            setRegionLocation({
              latitude: lat,
              longitude: lng,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LATITUDE_DELTA * ASPECT_RATIO,
            });

            setIsCustomLocation(true);

            setIsFetching(true);
          }}
          query={{
            key: "AIzaSyCDaAmlWvmFBS6D8oPZjpUGhV5_7qm_1FY", // only for development put as .env for production.
            language: "en",
            components: "country:gb",
          }}
          styles={{
            container: {
              flex: 0,
              position: "absolute",
              width: "100%",
              zIndex: 1,
            },
            listView: { backgroundColor: "white" },
          }}
        />
        <SafeAreaView style={styles.container}>
          {location && !isFetchPrice ? (
            <MapView
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                longitude: currentLocation.longitude,
                latitude: currentLocation.latitude,
                latitudeDelta: currentLocation.LATITUDE_DELTA,
                longitudeDelta: currentLocation.LONGITUDE_DELTA,
              }}
              style={styles.map}
              region={regionLocation || undefined}
            >
              {heatpoints.length > 0 ? <Heatmap points={heatpoints} /> : null}
              <MapView.Circle
                center={{
                  latitude: regionLocation.latitude || currentLocation.latitude,
                  longitude:
                    regionLocation.longitude || currentLocation.longitude,
                }}
                radius={radius.toMeters()}
                fillColor="rgba(219, 241, 255, 0.3)"
                strokeWidth={2}
                strokeColor="rgb(60, 111, 179)"
              />

              <Marker
                coordinate={isCustomLocation ? regionLocation : currentLocation}
              >
                {isCustomLocation ? null : (
                  <MaterialIcons name="my-location" size={21} color="#4372b4" />
                )}
                <Callout>
                  <Text>
                    {isCustomLocation ? searchDetails.name : user.username}
                  </Text>
                  {isCustomLocation ? null : (
                    <SvgUri
                      width={50}
                      height={50}
                      style={{ borderRadius: 50 }}
                      uri={`https://avatars.dicebear.com/api/adventurer-neutral/${user.username}.svg`}
                    />
                  )}
                </Callout>
              </Marker>

              {map.pricePaid.map((pricePoint, index) => {
                if (index <= 50) {
                  // limits properties to 50 per location.
                  return (
                    <Marker
                      onPress={() => {
                        const data = new PriceData(
                          pricePoint.transactionId,
                          pricePoint.price,
                          pricePoint.date,
                          pricePoint.postCode,
                          pricePoint.propertyType,
                          pricePoint.isNewBuild,
                          pricePoint.stateType,
                          pricePoint.paon,
                          pricePoint.secondaryAddress,
                          pricePoint.street,
                          pricePoint.locality,
                          pricePoint.town,
                          pricePoint.district,
                          pricePoint.county,
                          pricePoint.transactionCategory,
                          pricePoint.recordStatus,
                          pricePoint.lat,
                          pricePoint.lng
                        );
                        setSelectPriceData(data);
                        setMarker(true);
                        handlePresentModalPress();
                      }}
                      key={index}
                      coordinate={{
                        latitude: pricePoint.lat,
                        longitude: pricePoint.lng,
                      }}
                    >
                      <PriceMarker amount={pricePoint.price} />
                    </Marker>
                  );
                }
              })}
            </MapView>
          ) : (
            <LoadingIndicator />
          )}
          <View style={styles.topNavigation}>
            <TouchableOpacity
              style={styles.humberger}
              onPress={() => {
                dispatch(LOGOUT_REQUESTED());
              }}
            >
              <Center>
                <Text style={styles.signOutText}> Sign out</Text>
              </Center>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.location, { left: width - 50 }]}
              onPress={() => {
                setRegionLocation({
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                  latitudeDelta: currentLocation.LATITUDE_DELTA,
                  longitudeDelta: currentLocation.LONGITUDE_DELTA,
                });
                if (searchRef.current) searchRef.current.clear();

                if (isCustomLocation) {
                  setIsFetching(true);
                  setIsCustomLocation(false);
                }
              }}
            >
              <Center>
                <FontAwesome name="location-arrow" size={30} color="black" />
              </Center>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.settings, { left: width - 100 }]}
              onPress={() => {
                setMarker(false);
                handlePresentModalPress();
              }}
            >
              <Center>
                <MaterialIcons name="settings" size={30} color="black" />
              </Center>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        {isMarker ? (
          <SectionList
            px="12"
            mb="4"
            sections={SECTION_LIST_DATA}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => (
              <TextNativeBase py="4" minW="64">
                {item}
              </TextNativeBase>
            )}
            renderSectionHeader={({ section: { title } }) => (
              <Heading fontSize="sm" mt="8" pb="4">
                {title}
              </Heading>
            )}
          />
        ) : (
          <View style={{ flex: 1, flexDirection: "column" }}>
            <Section
              data={sectionData}
              disableSlider={setDisabledSlider}
              resetRadius={() => setRadius(0.5)}
            />
            <Slider
              disabled={isSliderDisabled}
              style={styles.slider}
              minimumValue={0.1}
              maximumValue={25}
              onValueChange={(radius) => {
                setRadius(radius);
                setIsFetching(true);
              }}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
            />

            <Center>
              {radius <= 0.5 ? (
                <Text bold>{radius.toMeters()} m</Text>
              ) : (
                <Text bold>{radius.toFixed(0)} km</Text>
              )}

              <Text bold>{radius.toMiles()} miles</Text>
            </Center>
          </View>
        )}
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
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
  settings: {
    width: 50,
    height: 50,
    top: -100,
  },
  slider: {
    margin: 10,
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
