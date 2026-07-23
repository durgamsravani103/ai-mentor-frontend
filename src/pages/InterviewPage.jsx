import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { startInterview, submitAnswer } from "../services/interviewService";

function InterviewPage() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [questionCount, setQuestionCount] = useState(1);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const textareaRef = useRef(null);

  const userId = localStorage.getItem("userId") || "1";

  // ======================
  // Start Interview
  // ======================
  const handleStartInterview = async () => {
    try {
      setLoading(true);
      const response = await startInterview(userId);
      setQuestion(response.question);
      setStarted(true);
      setQuestionCount(1);
      setResult(null);
      setAnswer("");
    } catch (err) {
      console.error(err);
      alert("Failed to start interview. Make sure you have uploaded your resume first.");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // Submit Answer
  // ======================
  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      alert("Please enter your answer before submitting.");
      return;
    }

    try {
      setLoading(true);
      const response = await submitAnswer(userId, question, answer);
      setResult(response);
    } catch (err) {
      console.error(err);
      alert("Failed to evaluate answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // Proceed to Next Question
  // ======================
  const handleNextQuestion = () => {
    if (result && result.next_question) {
      setQuestion(result.next_question);
      setAnswer("");
      setResult(null);
      setQuestionCount((prev) => prev + 1);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 50);
    } else {
      alert("Interview Completed 🎉");
      navigate("/dashboard");
    }
  };

  // Helper for score badge colors
  const getScoreColor = (score) => {
    if (score >= 8) return "#10b981"; // green
    if (score >= 5) return "#f59e0b"; // yellow/orange
    return "#ef4444"; // red
  };

  return (
    <div style={{ padding: "40px 20px", maxWidth: "800px", margin: "auto", fontFamily: "var(--sans)" }}>
      {/* Page Header */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2.5rem", margin: "0 0 10px 0", color: "var(--text-h)" }}>
          AI Mock Interview
        </h1>
        <p style={{ color: "var(--text)", fontSize: "1.1rem" }}>
          Tailored tech questions based on your resume analysis
        </p>
      </div>

      {!started ? (
        // Welcome / Start Screen
        <div
          style={{
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "40px",
            textAlign: "center",
            boxShadow: "var(--shadow)",
          }}
        >
          <div
            style={{
              fontSize: "64px",
              marginBottom: "20px",
              animation: "bounce 2s infinite",
            }}
          >
            🎓
          </div>
          <h2 style={{ color: "var(--text-h)", marginBottom: "15px" }}>Ready to practice?</h2>
          <p style={{ color: "var(--text)", lineHeight: "1.6", maxWidth: "600px", margin: "0 auto 30px auto" }}>
            This system evaluates your skills and asks questions dynamically. It will analyze your strengths, point out improvement areas, and grade your answer on a 10-point scale.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                padding: "12px 24px",
                fontSize: "1rem",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "transparent",
                color: "var(--text-h)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Back to Dashboard
            </button>
            <button
              onClick={handleStartInterview}
              disabled={loading}
              style={{
                padding: "12px 28px",
                fontSize: "1rem",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "var(--accent)",
                color: "white",
                cursor: "pointer",
                fontWeight: "600",
                boxShadow: "0 4px 12px rgba(170, 59, 255, 0.3)",
                transition: "all 0.2s ease",
              }}
            >
              {loading ? "Initializing..." : "Start Interview 🚀"}
            </button>
          </div>
        </div>
      ) : (
        // Active Interview Screen
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          {/* Question Panel */}
          <div
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "30px",
              boxShadow: "var(--shadow)",
              textAlign: "left",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
                borderBottom: "1px solid var(--border)",
                paddingBottom: "10px",
              }}
            >
              <span
                style={{
                  fontWeight: "bold",
                  color: "var(--accent)",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  fontSize: "0.9rem",
                }}
              >
                Question #{questionCount}
              </span>
              <span
                style={{
                  background: "var(--accent-bg)",
                  color: "var(--accent)",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                }}
              >
                Tailored for you
              </span>
            </div>

            <p style={{ fontSize: "1.2rem", color: "var(--text-h)", fontWeight: "500", lineHeight: "1.5" }}>
              {question}
            </p>
          </div>

          {/* Answer Input Panel */}
          {!result && (
            <div
              style={{
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "30px",
                boxShadow: "var(--shadow)",
                textAlign: "left",
              }}
            >
              <label
                htmlFor="answer-field"
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "10px",
                  color: "var(--text-h)",
                  fontSize: "1rem",
                }}
              >
                Your Answer:
              </label>
              <textarea
                id="answer-field"
                ref={textareaRef}
                rows="6"
                placeholder="Type your explanation, code snippets, or thoughts here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "15px",
                  fontSize: "1rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg)",
                  color: "var(--text-h)",
                  outline: "none",
                  resize: "vertical",
                  boxSizing: "border-box",
                  fontFamily: "var(--sans)",
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to quit the current session?")) {
                      setStarted(false);
                      setQuestion("");
                      setAnswer("");
                      setResult(null);
                    }
                  }}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    backgroundColor: "transparent",
                    color: "var(--text-h)",
                    cursor: "pointer",
                  }}
                >
                  Quit Session
                </button>
                <button
                  onClick={handleSubmitAnswer}
                  disabled={loading}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "var(--accent)",
                    color: "white",
                    fontWeight: "600",
                    cursor: "pointer",
                    boxShadow: "0 4px 10px rgba(170, 59, 255, 0.25)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {loading ? "Evaluating Answer..." : "Submit Answer 📤"}
                </button>
              </div>
            </div>
          )}

          {/* Evaluation & Result Panel */}
          {result && (
            <div
              style={{
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "30px",
                boxShadow: "var(--shadow)",
                textAlign: "left",
                animation: "fadeIn 0.3s ease-in-out",
              }}
            >
              {/* Score Badge Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "25px",
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: "15px",
                }}
              >
                <div>
                  <h2 style={{ margin: 0, color: "var(--text-h)", fontSize: "1.5rem" }}>Evaluation Report</h2>
                  <span style={{ fontSize: "0.85rem", color: "var(--text)" }}>Instant feedback powered by Gemini AI</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    background: `${getScoreColor(result.score)}15`,
                    border: `1px solid ${getScoreColor(result.score)}`,
                    borderRadius: "12px",
                    width: "80px",
                    height: "80px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.8rem",
                      fontWeight: "800",
                      color: getScoreColor(result.score),
                      lineHeight: 1,
                    }}
                  >
                    {result.score}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text)", fontWeight: "bold", marginTop: "2px" }}>
                    / 10
                  </span>
                </div>
              </div>

              {/* Feedback Block */}
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "1.1rem", color: "var(--text-h)" }}>Detailed Feedback</h3>
                <p style={{ color: "var(--text)", lineHeight: "1.6", background: "var(--code-bg)", padding: "15px", borderRadius: "8px" }}>
                  {result.feedback}
                </p>
              </div>

              {/* Strengths & Improvements Lists */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginBottom: "25px",
                }}
              >
                {/* Strengths */}
                <div
                  style={{
                    border: "1px solid #10b98140",
                    background: "#10b98105",
                    padding: "20px",
                    borderRadius: "12px",
                  }}
                >
                  <h3 style={{ color: "#10b981", margin: "0 0 10px 0", fontSize: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>✅</span> Key Strengths
                  </h3>
                  <ul style={{ paddingLeft: "20px", margin: 0, color: "var(--text)", fontSize: "0.95rem" }}>
                    {result.strengths && result.strengths.length > 0 ? (
                      result.strengths.map((item, index) => <li key={index} style={{ marginBottom: "6px" }}>{item}</li>)
                    ) : (
                      <li>Strong foundational logic displayed.</li>
                    )}
                  </ul>
                </div>

                {/* Improvements */}
                <div
                  style={{
                    border: "1px solid #f59e0b40",
                    background: "#f59e0b05",
                    padding: "20px",
                    borderRadius: "12px",
                  }}
                >
                  <h3 style={{ color: "#f59e0b", margin: "0 0 10px 0", fontSize: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>💡</span> Areas to Improve
                  </h3>
                  <ul style={{ paddingLeft: "20px", margin: 0, color: "var(--text)", fontSize: "0.95rem" }}>
                    {result.improvements && result.improvements.length > 0 ? (
                      result.improvements.map((item, index) => <li key={index} style={{ marginBottom: "6px" }}>{item}</li>)
                    ) : (
                      <li>No major areas of improvement needed! Keep it up.</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Next Question Preview Box */}
              {result.next_question && (
                <div
                  style={{
                    background: "var(--accent-bg)",
                    border: "1px dashed var(--accent-border)",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "25px",
                  }}
                >
                  <h4 style={{ margin: "0 0 8px 0", color: "var(--accent)", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Next Question Up Next:
                  </h4>
                  <p style={{ margin: 0, color: "var(--text-h)", fontSize: "1.05rem", fontWeight: "500", lineHeight: "1.4" }}>
                    {result.next_question}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  onClick={() => {
                    if (confirm("Finish the practice session and view your main dashboard?")) {
                      navigate("/dashboard");
                    }
                  }}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    backgroundColor: "transparent",
                    color: "var(--text-h)",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                >
                  Finish & Exit
                </button>
                <button
                  onClick={handleNextQuestion}
                  style={{
                    padding: "12px 28px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "var(--accent)",
                    color: "white",
                    fontWeight: "600",
                    cursor: "pointer",
                    boxShadow: "0 4px 10px rgba(170, 59, 255, 0.25)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {result.next_question ? "Next Question ➡️" : "Finish Interview 🏁"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Embedded CSS animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}

export default InterviewPage;
