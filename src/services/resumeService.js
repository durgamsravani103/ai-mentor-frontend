import api from "./api";

export const uploadResume = async (file, userId) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    `/resume/resume/analyze?user_id=${userId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

export const reAnalyzeResume = async (file, userId) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    `/resume/resume/re-analyze?user_id=${userId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};
