import API from "./axiosInstance";

export const submitContactForm = async (websiteId, fields) => {
  const response = await API.post(`/websites/${websiteId}/contact-submissions`, { fields });
  return response.data;
};

export const getContactSubmissions = async () => {
  const response = await API.get("/contact-submissions");
  return response.data;
};

export const updateContactSubmissionReadStatus = async (submissionId, isRead) => {
  const response = await API.patch(`/contact-submissions/${submissionId}/read`, { isRead });
  return response.data;
};

export const deleteContactSubmission = async (submissionId) => {
  const response = await API.delete(`/contact-submissions/${submissionId}`);
  return response.data;
};
