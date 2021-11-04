import * as SecureStore from "expo-secure-store";
import moment from "moment";
import { updateToken } from "./api/index";

function isExpired({ expirationDate }) {
  const current_date = moment(Date.now());
  const expire_date = moment(expirationDate);
  return current_date > expire_date;
}

export const setToken = async (value) => {
  const { username, token, refreshToken, expirationDate } = value;

  try {
    await SecureStore.setItemAsync("credentials", {
      username,
      token,
      refreshToken,
      expirationDate,
    });
    return value;
  } catch (err) {
    console.log(err.message);
  }
};

export const getToken = async () => {
  try {
    const res = await SecureStore.getItemAsync("credentials");

    if (isExpired(res)) {
      //fetch new token from api
      return updateToken(res);
    } else {
        return res;
    }
  } catch (err) {
    console.log(err.message);
  }
};


export const isAuthenticated = async () => {
    try {
        const res = await SecureStore.getItemAsync("credentials");
        if(res) {
            return true;
        } else return false;
    } catch (err) {
        console.log(err.message);
    }
}
