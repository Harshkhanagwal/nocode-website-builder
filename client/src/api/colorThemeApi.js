import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

export const getColorThemes = async () => {
  const response = await API.get("/color-themes");

      console.log("API RESPONSE:", response);
  return response.data;
};