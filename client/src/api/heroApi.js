import API from "./axiosInstance";

// Create hero section
export const createHeroSectionApi = (websiteId, sectionData) => {
  return API.post(
    `/websites/${websiteId}/sections/hero`,
    sectionData
  );
};

// Update hero section
export const updateHeroSectionApi = (websiteId, sectionData) => {
  return API.patch(
    `/websites/${websiteId}/sections/hero`,
    sectionData
  );
};

// Delete hero section
export const deleteHeroSectionApi = (websiteId) => {
  return API.delete(
    `/websites/${websiteId}/sections/hero`
  );
};