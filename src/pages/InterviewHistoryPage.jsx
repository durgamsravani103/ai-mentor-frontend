import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function InterviewHistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const userId = localStorage.getItem("userId") || "1";
  const apiBaseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${apiBaseURL}/interview/history/${userId}`);
      if (res.data.success) {
        setHistory(res.data.history);
      }
    } catch (err) {
      console.error("Failed to load interview history:", err);
      alert("Failed to load interview history.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return { bg: "#ecfdf5", text: "#065f46", border: "#a7f3d0" };
    if (score >= 5) return { bg: "#fffbeb", text: "#92400e", border: "#fde68a" };
    return { bg: "#fef2f2", text: "#991b1b", border: "#fecaca" };
  };

  const toggleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
        <h2>Loading Interview History...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "880px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "2rem", color: "#0f172a", margin: "0 0 8px 0" }}>Interview History</h1>
          <p style={{ color: "#64748b", margin: 0 }}>Review all previous mock interview responses, scores, and expert AI feedbacks.</p>
        </div>
        <button
          onClick={() => navigate("/interview")}
          style={{
            padding: "12px 20px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
        >
          🎙️ New Mock Session
        </button>
      </div>

      {history.length === 0 ? (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            padding: "60px 40px",
            textAlign: "center",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
          }}
        >
          <span style={{ fontSize: "48px" }}>🎙️</span>
          <h2 style={{ margin: "20px 0 10px 0", color: "#1e293b" }}>No Mock Interviews Recorded</h2>
          <p style={{ color: "#64748b", maxWidth: "420px", margin: "0 auto 24px auto" }}>
            You haven't attempted any mock interview questions yet. Start a session to check your skills!
          </p>
          <button
            onClick={() => navigate("/interview")}
            style={{
              padding: "12px 24px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Start Now
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {history.map((item, index) => {
            const isExpanded = expandedId === item.id;
            const colors = getScoreColor(item.score);
            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.02)",
                  transition: "all 0.2s",
                }}
              >
                {/* Header Summary Card */}
                <div
                  onClick={() => toggleExpand(item.id)}
                  style={{
                    padding: "20px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "between",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        backgroundColor: colors.bg,
                        color: colors.text,
                        border: `1px solid ${colors.border}`,
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontWeight: "bold",
                        fontSize: "13px",
                        flexShrink: 0,
                      }}
                    >
                      Score: {item.score}/10
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        Q: {item.question}
                      </p>
                      <span style={{ fontSize: "11px", color: "#94a3b8" }}>{formatDate(item.interview_date)}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: "18px", color: "#94a3b8", marginLeft: "15px" }}>
                    {isExpanded ? "▲" : "▼"}
                  </div>
                </div>

                {/* Expanded Feedback Details */}
                {isExpanded && (
                  <div style={{ padding: "0 24px 24px 24px", borderTop: "1px solid #f1f5f9" }}>
                    <div style={{ marginTop: "20px" }}>
                      <h4 style={{ margin: "0 0 6px 0", fontSize: "12px", textTransform: "uppercase", color: "#64748b", fontWeight: "700" }}>Your Answer</h4>
                      <p style={{ margin: 0, fontSize: "14px", color: "#334155", backgroundColor: "#f8fafc", padding: "14px", borderRadius: "8px", border: "1px solid #f1f5f9", lineHeight: "1.5" }}>
                        "{item.answer}"
                      </p>
                    </div>

                    <div style={{ marginTop: "20px" }}>
                      <h4 style={{ margin: "0 0 6px 0", fontSize: "12px", textTransform: "uppercase", color: "#64748b", fontWeight: "700" }}>AI Feedback</h4>
                      <p style={{ margin: 0, fontSize: "14px", color: "#334155", lineHeight: "1.6" }}>
                        {item.feedback}
                      </p>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" }}>
                      <div style={{ backgroundColor: "#ecfdf5", padding: "16px", borderRadius: "10px", border: "1px solid #d1fae5" }}>
                        <h5 style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#065f46", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
                          <span>💪</span> Key Strengths
                        </h5>
                        <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", color: "#065f46", lineHeight: "1.5" }}>
                          {Array.isArray(item.strengths) ? (
                            item.strengths.map((str, idx) => <li key={idx}>{str}</li>)
                          ) : (
                            <li>{item.strengths}</li>
                          )}
                        </ul>
                      </div>

                      <div style={{ backgroundColor: "#fef2f2", padding: "16px", borderRadius: "10px", border: "1px solid #fee2e2" }}>
                        <h5 style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#991b1b", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
                          <span>📈</span> Areas to Improve
                        </h5>
                        <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", color: "#991b1b", lineHeight: "1.5" }}>
                          {Array.isArray(item.improvements) ? (
                            item.improvements.map((imp, idx) => <li key={idx}>{imp}</li>)
                          ) : (
                            <li>{item.improvements}</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default InterviewHistoryPage;
