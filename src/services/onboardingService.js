import api from "./api";

export const saveOnboarding = async (data) => {
  const response = await api.post("/onboarding/", data);
  return response.data;
};
