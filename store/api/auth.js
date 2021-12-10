import API, { headers } from "./config";

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
    "/account/signup", // same as above "/api/auth/signup",
    { username, password },
    {
      headers: headers.LOGIN_HEADER,
    }
  );

  return response.data;
}


export async function refreshToken(refreshToken) {
  console.log(refreshToken);
  const response = await API.post(
    "/authorization/refresh",
  {
    refreshToken
  },
  )

  return response.data;
}

