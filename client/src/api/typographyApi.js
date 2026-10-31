import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

export const getTypographies = async () => {
  const response = await API.get("/typographies");
  return response.data;
};

export const getAdminTypographies = async () => (await API.get("/typographies/manage/all")).data;
export const createTypography = async (data) => (await API.post("/typographies", data)).data;
export const updateTypography = async (id, data) => (await API.put(`/typographies/${id}`, data)).data;
export const deleteTypography = async (id) => (await API.delete(`/typographies/${id}`)).data;
