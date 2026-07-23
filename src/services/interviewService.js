import api from "./api";

// =======================
// Start Interview
// =======================

export const startInterview = async (userId) => {
  const response = await api.post("/interview/start", {
    user_id: userId,
  });

  return response.data;
};

// =======================
// Submit Answer
// =======================

export const submitAnswer = async (userId, question, answer) => {
  const response = await api.post("/interview/answer", {
    user_id: userId,
    question,
    answer,
  });

  return response.data;
};
