import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

export const getTypographies = async () => {
  const response = await API.get("/typographies");

  console.log("TYPOGRAPHY API RESPONSE:", response);

  return response.data;
};