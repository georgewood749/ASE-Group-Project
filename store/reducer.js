import { combineReducers } from "redux";
import authReducer from "./auth";
import userReducer from "./user";
import mapReducer from "./map";

export default combineReducers({
  auth: authReducer,
  user: userReducer,
  map: mapReducer,
});
