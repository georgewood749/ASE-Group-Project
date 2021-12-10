import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "map",
  initialState: {
    currentLocation: {
      latitude: Number,
      longitude: Number,
      latitudeDelta: Number,
      longitudeDelta: Number,
    },
    pricePaid: [],
    filter: {
      price: Number,
      postcode: Number,
      distance: Number,
    },
    isFilter: false,
  },
  reducers: {
    UPDATE_PRICE_DATA: (state, action) => {
      const { payload } = action;
      state.pricePaid = payload;
    },
    UPDATE_LOCATION: (state, action) => {
      const { longitude, latitude, LATITUDE_DELTA, LONGITUDE_DELTA } =
        action.payload;
      state.currentLocation = {
        longitude: longitude,
        latitude: latitude,
        longitudeDelta: LONGITUDE_DELTA,
        latitudeDelta: LATITUDE_DELTA,
      };
    },
    UPDATE_FILTER: (_, action) => {
      console.log(action);
    },
  },
});

export const { UPDATE_PRICE_DATA, UPDATE_LOCATION } = slice.actions;

export default slice.reducer;
