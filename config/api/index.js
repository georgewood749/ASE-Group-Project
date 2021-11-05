import axios from "axios";
const BASE_URL = "https://dot-outstanding-theory.glitch.me/";

const API = axios.create({
  baseUrl: BASE_URL,
});

const HEADERS = {
  AUTH_HEADER: (token) => ({
    "x-access-token": `${token}`,
    Accept: "application/json;",
    "Content-Type": "application/json",
  }),
  LOGIN_HEADER: {
    accept: "application/json;",
    "Content-Type": "application/json",
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

export const updateToken = async ({ refreshToken }) =>
  await API.post(
    "api/auth/refreshtoken",
    {},
    {
      headers: HEADERS.AUTH_HEADER(refreshToken),
    }
  );

export const login = async (username, password) => {
  if (username && password) {
    // no verification needed passowrd -
    // - and username can be anything.
      const res =  await API.post("api/auth/signin", {username, password});
      return res;
  }
};

export const register = async (username, password) => {
  if (username && password) {
    // no verification needed passowrd -
    // - and username can be anything.
    return await API.post(
      "api/auth/signup",
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
