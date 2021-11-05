import * as SecureStore from "expo-secure-store";
import moment from "moment";
import { updateToken } from "./api/index";

async function isExpired() {
  try {
    const { expirationDate } = await SecureStore.getItemAsync("credentials");
    const current_date = moment(Date.now());
    const expire_date = moment(expirationDate);
    return current_date > expire_date;
  } catch (err) {
    return false;
  }
}

export const setAuth = async (value) => {
  const { id, username, token, refreshToken, expirationDate } = value;

  let credentials = {
    id,
    username,
    token,
    refreshToken,
    expirationDate,
  }

  credentials = JSON.stringify(credentials);

  try {
    await SecureStore.setItemAsync("credentials", credentials );
    return value;
  } catch (err) {
    console.log(err.message);
  }
};

export const getCredentials = async () => {
  try {
    let credentials = await SecureStore.getItemAsync("credentials");
    credentials = JSON.parse(credentials);
    // if (isExpired()) {
    //   //fetch new token from api
    //   return updateToken(credentials);
    // } else {
    //   return res;
    // }

    return credentials;

  } catch (err) {
    console.log(err.message);
  }
};

export const getAuthentication = async () => {
  try {
     const res = await SecureStore.getItemAsync("credentials");
     return res ? true : false;
  } catch (err) {
    console.log(err.message);
  }
};

export const clearCredentials = async () => {
  try {
    const res = SecureStore.deleteItemAsync("credentials");
    if (res) return true;
    else return false;
  } catch (err) {
    console.log(err.message);
  }
};
