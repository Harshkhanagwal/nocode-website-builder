
import API from "./axiosInstance";

// Create a section
export const createSectionApi = async ({
  websiteId,
  sectionName,
  data,
}) => {
  const response = await API.post(
    `/websites/${websiteId}/sections/${sectionName}`,
    data
  );

  return { ...response.data, section: response.data.section || response.data.data };
};

// Update a section
export const updateSectionApi = async ({
  websiteId,
  sectionName,
  sectionId,
  data,
}) => {
  const response = await API.patch(
    `/websites/${websiteId}/sections/${sectionName}?sectionId=${encodeURIComponent(sectionId)}`,
    data
  );

  return response.data;
};

// Delete a section
export const deleteSectionApi = async ({
  websiteId,
  sectionName,
  sectionId,
}) => {
  const response = await API.delete(
    `/websites/${websiteId}/sections/${sectionName}?sectionId=${encodeURIComponent(sectionId)}`
  );

  return response.data;
};
