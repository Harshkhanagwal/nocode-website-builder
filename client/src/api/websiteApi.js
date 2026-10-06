import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

export const createWebsite = async (websiteData) => {
  const response = await API.post("/websites", websiteData);

  console.log("CREATE WEBSITE RESPONSE:", response);

  return response.data;
};