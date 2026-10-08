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

// Get all websites
export const getAllWebsites = async () => {
  const response = await API.get("/websites/all");

  return response.data;
};

export const getWebsiteById = async (id) => {
  const response = await API.get(`/websites/by-id/${id}`);

  return response.data;
};