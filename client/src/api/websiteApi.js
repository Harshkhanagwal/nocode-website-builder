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
export const createWebsiteWithAI = async (data) => {
  const response = await API.post("/llm/create-with-ai", data, { timeout: 90000 });
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

export const getUserWebsites = async () => {
  const response = await API.get("/websites");

  return response.data;
};

export const updateWebsite = async (id, websiteData) => {
  const response = await API.put(`/websites/${id}`, websiteData);
  return response.data;
};

export const deleteWebsiteById = async (id) => {
  const response = await API.delete(`/websites/${id}`);
  return response.data;
};

// export const getWebsiteById = async (websiteId) => {
//   const response = await API.get(`/websites/${websiteId}`);
//   return response.data;
// };
