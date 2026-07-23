import api from "./api";

export const generateDailyTasks = async (userId) => {
  const response = await api.post(`/daily-task/generate?user_id=${userId}`);
  return response.data;
};

export const getTodayTasks = async (userId) => {
  const response = await api.get(`/daily-task/today?user_id=${userId}`);
  return response.data;
};

export const completeTask = async (taskId) => {
  const response = await api.put(`/daily-task/complete/${taskId}`);
  return response.data;
};
