import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

export const getColorThemes = async () => {
  const response = await API.get("/color-themes");
  return response.data;
};

export const createColorTheme = async (data) => (await API.post("/color-themes", data)).data;
export const updateColorTheme = async (id, data) => (await API.put(`/color-themes/${id}`, data)).data;
export const deleteColorTheme = async (id) => (await API.delete(`/color-themes/${id}`)).data;
