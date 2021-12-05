import { createSlice } from "@reduxjs/toolkit";
import { NumberIncrementStepper } from "native-base";

const slice = createSlice({
  name: "map",
  initialState: {
    currentLocation: {
        latitude: Number,
        longitude: Number,
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
    LOGIN_USER: (state, action) => {
      const { id, username } = action.payload;
      state.id = id;
      state.username = username;
    },
    LOGOUT_USER: (state, _) => {
      state.id = undefined;
      state.username = undefined;
    },
    TEST: (_, action) => {
      console.log(action);
    },
  },
});

export const { LOGIN_USER, LOGOUT_USER } = slice.actions;

export default slice.reducer;