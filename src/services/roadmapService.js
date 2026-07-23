import api from "./api";

export const generateRoadmap = async () => {
  const response = await api.post("/roadmap/generate?user_id=1");
  return response.data;
};
