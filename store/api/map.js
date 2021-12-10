import API, { headers } from "./config";

export async function getPricePaid({ latitude, longitude, token, radius }) {
  const response = await API.post(
    "/location/custom",
    {
      lat: latitude,
      lng: longitude,
      kilometer: radius,
    },
    {
      headers: headers.AUTH_HEADER(token),
    }
  );

  return response.data;
}
