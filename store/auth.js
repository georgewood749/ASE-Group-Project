import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    accessToken: undefined,
    refreshToken: undefined,
    expirationDate: undefined,
    message: undefined,
  },
  reducers: {
    LOGIN_SUCCESS: (state, action) => {
      const { accessToken, refreshToken, expirationDate } = action.payload;
      state.isAuthenticated = !state.isAuthenticated;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.expirationDate = expirationDate;
      state.message = "User authenticated ✔";
    },
    LOGIN_FAILURE: (state, action) => {
      const { message } = action.payload;
      state.message = message;
    },
    TEST: (_, action) => {
      console.log(action.payload);
    },
    LOGOUT_AUTH: (state, _) => {
      state.isAuthenticated = false;
      state.accessToken = undefined;
      state.refreshToken = undefined;
      state.expirationDate = undefined;
      state.message = undefined;
    },
    RESET_ERROR: (state, _) => {
      state.message = undefined;
    },
  },
});

export const { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_AUTH, TEST, RESET_ERROR } =
  slice.actions;

export default slice.reducer;
