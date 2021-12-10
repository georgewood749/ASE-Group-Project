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
    Authorization: `${token}`,
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

export { headers };

export default API;

