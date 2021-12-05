import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "user",
  initialState: {
    id: undefined,
    username: undefined,
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
