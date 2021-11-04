import axios from "axios";
const BASE_URL = "http://46.101.40.220:8080/";

const API = axios.create({
  baseUrl: BASE_URL,
});

const HEADERS = {
  AUTH_HEADER: (token) => ({
    Authorization: `Bearer ${token}`,
    Accept: "application/json;",
    "Content-Type": "application/json",
    XNationality: "en",
  }),
  LOGIN_HEADER: {
    "accept": "application/json;",
    "Content-Type": "application/json",
    "XNationality": "en",
  },
};

const LoginResults = ({
  data: {
    accessToken,
    refreshToken: { token, expirationDate },
    user: { username },
  },
}) => ({
  accessToken,
  refreshToken: token,
  expirationDate,
  username,
});

export const updateToken = async ({ token, refreshToken }) =>
  await API.post(
    "authorization/refresh",
    { refreshToken },
    {
      headers: HEADERS.AUTH_HEADER(token),
    }
  );

export const login = async (username, password) => {
  if (username && password) {
    // no verification needed passowrd -
    // - and username can be anything.
    return await API.post(
      "authorization/login",
      `{\"username\":\"${username}\",\"password\":\"${password}\"}`,
      {
        headers: HEADERS.LOGIN_HEADER,
      }
    ).then((res) => LoginResults(res));
  }
};

export const register = async (username, password) => {
  if (username && password) {
    // no verification needed passowrd -
    // - and username can be anything.
    return await API.post(
      "account/signup",
      { username, password },
      {
        headers: HEADERS.LOGIN_HEADER,
      }
    ).then((res) => LoginResults(res));
  } else if (username) {
    return Promise.reject(new Error("Password required."));
  } else if (password) {
    return Promise.reject(new Error("Username required."));
  } else {
    return Promise.reject(new Error("Username and password required"));
  }
};
