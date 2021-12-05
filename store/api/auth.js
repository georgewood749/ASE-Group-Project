import axios from "axios";

const API = axios.create({
  baseURL: "http://46.101.40.220:8080/",
});


/*
Temporary endpoint ignore only for week 3
const API = axios.create({
  baseURL: "https://dot-outstanding-theory.glitch.me",
});
*/

const headers = {
  AUTH_HEADER: (token) => ({
    Authentication: `${token}`,
    Accept: "application/json;",
    "Content-Type": "application/json",
    XNationality: "en",
  }),
  LOGIN_HEADER: {
    Accept: "application/json",
    "Content-Type": "application/json",
    XNationality: "en",
  },
};

export async function login({ username, password }) {
  const response = await API.post(
      "/authorization/login", // Alternative for temp "/api/auth/signin",
    {
      username,
      password,
    },
    {
      headers: headers.LOGIN_HEADER,
    }
  );

  return response.data;
}

export async function signup({ username, password }) {
  const response = await API.post(
     "/account/signup",// same as above "/api/auth/signup",
    { username, password },
    {
      headers: headers.LOGIN_HEADER,
    }
  );

  return response.data;
}
