
import axios from "axios";

const sectionApi = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

// Create a section
export const createSectionApi = async ({
  websiteId,
  sectionName,
  data,
}) => {
  const response = await sectionApi.post(
    `/websites/${websiteId}/sections/${sectionName}`,
    data
  );

  return response.data;
};

// Update a section
export const updateSectionApi = async ({
  websiteId,
  sectionName,
  data,
}) => {
  const response = await sectionApi.patch(
    `/websites/${websiteId}/sections/${sectionName}`,
    data
  );

  return response.data;
};

// Delete a section
export const deleteSectionApi = async ({
  websiteId,
  sectionName,
}) => {
  const response = await sectionApi.delete(
    `/websites/${websiteId}/sections/${sectionName}`
  );

  return response.data;
};
