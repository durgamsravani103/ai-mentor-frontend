import api from "./api";

// Send a message to the AI Mentor
export const sendMessage = async (userId, message) => {
  const response = await api.post("/chat/message", {
    user_id: Number(userId),
    message: message,
  });
  return response.data;
};

// Fetch chat history for a user
export const getChatHistory = async (userId) => {
  const response = await api.get(`/chat/history/${userId}`);
  return response.data;
};

// Clear chat history for a user
export const clearChatHistory = async (userId) => {
  const response = await api.get(`/chat/history/${userId}`); // Wait, the endpoint is DELETE!
  // Let's modify this to use api.delete!
  const deleteResponse = await api.delete(`/chat/history/${userId}`);
  return deleteResponse.data;
};
