import { useState, useEffect, useRef } from "react";
import { getChatHistory, sendMessage, clearChatHistory } from "../services/chatService";

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const userId = localStorage.getItem("userId") || "1";

  // Quick suggestion prompts
  const suggestions = [
    { label: "Become Backend Dev", text: "How can I become a Backend Developer?" },
    { label: "Explain FastAPI", text: "Explain FastAPI and why I should use it." },
    { label: "Python Interview Qs", text: "Ask me Python interview questions." },
    { label: "Project Suggestions", text: "What projects should I build based on my skills?" },
    { label: "Improve My Resume", text: "How do I improve my resume score?" },
    { label: "What to Learn Next", text: "What should I learn next to land a placement?" },
  ];

  useEffect(() => {
    loadConversation();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const loadConversation = async () => {
    try {
      const res = await getChatHistory(userId);
      if (res.success) {
        setMessages(res.history);
      }
    } catch (err) {
      console.error("Failed to load chat history", err);
    }
  };

  const handleSend = async (messageText = input) => {
    const textToSend = messageText.trim();
    if (!textToSend || loading) return;

    // Add user message locally
    const newUserMessage = {
      id: Date.now(),
      sender: "user",
      message: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await sendMessage(userId, textToSend);
      if (response.success) {
        const newAIMessage = {
          id: Date.now() + 1,
          sender: "assistant",
          message: response.response,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, newAIMessage]);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm("Are you sure you want to clear this entire conversation history?")) return;
    try {
      const response = await clearChatHistory(userId);
      if (response.success) {
        setMessages([]);
        alert("Conversation cleared ✅");
      }
    } catch (err) {
      console.error("Failed to clear chat history:", err);
      alert("Failed to clear chat history.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 150px)",
        backgroundColor: "white",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)",
      }}
    >
      {/* Sub-sidebar for conversations options & suggestions */}
      <div
        style={{
          width: "220px",
          backgroundColor: "#f8fafc",
          borderRight: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          padding: "20px 14px",
          flexShrink: 0,
        }}
      >
        <h3 style={{ margin: "0 0 16px 0", fontSize: "14px", color: "#64748b", textTransform: "uppercase", fontWeight: "700" }}>
          Suggested Topics
        </h3>
        
        {/* Suggestion Prompts */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1, overflowY: "auto" }}>
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s.text)}
              disabled={loading}
              style={{
                textAlign: "left",
                padding: "10px 12px",
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "500",
                color: "#334155",
                cursor: "pointer",
                transition: "all 0.2s",
                lineHeight: "1.4",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#2563eb";
                e.currentTarget.style.color = "white";
                e.currentTarget.style.borderColor = "#2563eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.color = "#334155";
                e.currentTarget.style.borderColor = "#e2e8f0";
              }}
            >
              💡 {s.label}
            </button>
          ))}
        </div>

        {/* Clear Chats Button */}
        <button
          onClick={handleClear}
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "transparent",
            border: "1px solid #fee2e2",
            borderRadius: "8px",
            color: "#ef4444",
            fontSize: "12px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#ef4444";
            e.currentTarget.style.color = "white";
            e.currentTarget.style.borderColor = "#ef4444";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#ef4444";
            e.currentTarget.style.borderColor = "#fee2e2";
          }}
        >
          🗑️ Clear Conversation
        </button>
      </div>

      {/* Message & Input Window */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", minWidth: 0 }}>
        {/* Chat Feed */}
        <div style={{ flex: 1, padding: "24px 30px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px", backgroundColor: "#fafbfc" }}>
          {messages.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#94a3b8", textAlign: "center" }}>
              <span style={{ fontSize: "40px", marginBottom: "12px" }}>💬</span>
              <h3 style={{ margin: "0 0 6px 0", color: "#475569" }}>Start Career Conversation</h3>
              <p style={{ fontSize: "13px", maxWidth: "340px", margin: 0, lineHeight: "1.5" }}>
                Ask your AI Placement Mentor about roadmap choices, technology stacks, resume feedback, or technical coding rounds!
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <div
                  key={msg.id || msg.timestamp}
                  style={{
                    display: "flex",
                    justifyContent: isUser ? "flex-end" : "flex-start",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "75%",
                      padding: "12px 18px",
                      borderRadius: isUser ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                      backgroundColor: isUser ? "#2563eb" : "#f1f5f9",
                      color: isUser ? "white" : "#1e293b",
                      border: isUser ? "none" : "1px solid #e2e8f0",
                      fontSize: "14px",
                      lineHeight: "1.6",
                      whiteSpace: "pre-wrap",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                    }}
                  >
                    {msg.message}
                  </div>
                </div>
              );
            })
          )}

          {/* Typing Indicator */}
          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start", width: "100%" }}>
              <div
                style={{
                  padding: "12px 18px",
                  borderRadius: "16px 16px 16px 2px",
                  backgroundColor: "#f1f5f9",
                  color: "#64748b",
                  border: "1px solid #e2e8f0",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>Placement Mentor is typing</span>
                <span className="dot" style={{ display: "inline-block", width: "4px", height: "4px", backgroundColor: "#64748b", borderRadius: "50%", animation: "pulse 1.2s infinite" }} />
                <span className="dot" style={{ display: "inline-block", width: "4px", height: "4px", backgroundColor: "#64748b", borderRadius: "50%", animation: "pulse 1.2s infinite 0.2s" }} />
                <span className="dot" style={{ display: "inline-block", width: "4px", height: "4px", backgroundColor: "#64748b", borderRadius: "50%", animation: "pulse 1.2s infinite 0.4s" }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Text Input Footer */}
        <div style={{ padding: "16px 30px", borderTop: "1px solid #e2e8f0", display: "flex", gap: "12px", alignItems: "center" }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            disabled={loading}
            rows="1"
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              fontSize: "14px",
              outline: "none",
              resize: "none",
              fontFamily: "inherit",
              lineHeight: "1.4",
              backgroundColor: loading ? "#f8fafc" : "white",
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            style={{
              padding: "12px 20px",
              backgroundColor: input.trim() && !loading ? "#2563eb" : "#94a3b8",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: input.trim() && !loading ? "pointer" : "default",
              transition: "background 0.2s",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
