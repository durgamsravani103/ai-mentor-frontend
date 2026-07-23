import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard } from "../services/dashboardService";

function DashboardPage() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const userId = localStorage.getItem("userId") || "1";
      const data = await getDashboard(userId);
      setDashboard(data);
    } catch (error) {
      console.log(error);
      alert("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  if (!dashboard || dashboard.message === "No Resume Found") {
    return (
      <div
        style={{
          maxWidth: "600px",
          margin: "80px auto",
          padding: "40px",
          backgroundColor: "white",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          textAlign: "center",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        }}
      >
        <span style={{ fontSize: "48px" }}>🚀</span>
        <h2 style={{ margin: "20px 0 10px 0", color: "#0f172a" }}>Welcome to AI Placement Mentor</h2>
        <p style={{ color: "#64748b", marginBottom: "24px", lineHeight: "1.6" }}>
          To unlock your personalized learning journey, career roadmap, daily task list, and interactive mock interviews, please upload your resume.
        </p>
        <button
          onClick={() => navigate("/resume")}
          style={{
            padding: "12px 28px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
        >
          Upload Resume Now
        </button>
      </div>
    );
  }

  const {
    resume_score,
    roadmap_progress,
    today_tasks,
    interview_average,
    skills_found,
    missing_skills,
    overall_ai_score,
    placement_readiness,
    career_recommendation,
  } = dashboard;

  return (
    <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
      {/* Welcome Header */}
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ fontSize: "2rem", color: "#0f172a", margin: "0 0 8px 0" }}>Developer Dashboard</h1>
        <p style={{ color: "#64748b", margin: 0 }}>Overview of your placement metrics, learning progression, and skill analysis.</p>
      </div>

      {/* Grid of Key Metrics Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "30px" }}>
        {/* Resume Score Card */}
        <div style={{ backgroundColor: "white", padding: "20px 24px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <span style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "700", color: "#64748b" }}>Resume Score</span>
          <h2 style={{ fontSize: "2rem", margin: "8px 0 4px 0", color: "#2563eb" }}>{resume_score}/100</h2>
          <span style={{ fontSize: "12px", color: "#10b981", fontWeight: "600" }}>Optimize to score 85+</span>
        </div>

        {/* Roadmap Progress Card */}
        <div style={{ backgroundColor: "white", padding: "20px 24px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <span style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "700", color: "#64748b" }}>Roadmap Progress</span>
          <h2 style={{ fontSize: "2rem", margin: "8px 0 4px 0", color: "#0f172a" }}>{roadmap_progress}%</h2>
          {/* Custom progress bar */}
          <div style={{ width: "100%", height: "6px", backgroundColor: "#f1f5f9", borderRadius: "3px", overflow: "hidden", marginTop: "8px" }}>
            <div style={{ width: `${roadmap_progress}%`, height: "100%", backgroundColor: "#3b82f6" }} />
          </div>
        </div>

        {/* Interview Average Card */}
        <div style={{ backgroundColor: "white", padding: "20px 24px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <span style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "700", color: "#64748b" }}>Interview Avg Score</span>
          <h2 style={{ fontSize: "2rem", margin: "8px 0 4px 0", color: interview_average >= 8 ? "#10b981" : interview_average >= 5 ? "#f59e0b" : "#ef4444" }}>
            {interview_average}/10
          </h2>
          <span style={{ fontSize: "12px", color: "#64748b" }}>Calculated from mock runs</span>
        </div>

        {/* Placement Readiness Card */}
        <div style={{ backgroundColor: "white", padding: "20px 24px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <span style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "700", color: "#64748b" }}>Overall Job Readiness</span>
          <h2 style={{ fontSize: "2rem", margin: "8px 0 4px 0", color: "#10b981" }}>{placement_readiness}%</h2>
          <span style={{ fontSize: "12px", color: "#64748b" }}>Target: 80% to apply</span>
        </div>
      </div>

      {/* Main Sections Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "30px", alignItems: "start" }}>
        {/* Left Side */}
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          
          {/* Career Recommendation & Profile info */}
          <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
            <h3 style={{ margin: "0 0 12px 0", color: "#1e293b", fontSize: "16px", fontWeight: "600" }}>AI Placement Recommendation</h3>
            <p style={{ margin: 0, fontSize: "14px", color: "#475569", lineHeight: "1.6" }}>
              {career_recommendation}
            </p>
          </div>

          {/* Skills Analysis */}
          <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
            <h3 style={{ margin: "0 0 20px 0", color: "#1e293b", fontSize: "16px", fontWeight: "600" }}>Skills Profile</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <h4 style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#10b981", fontWeight: "700", textTransform: "uppercase" }}>Verified Skills Found</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {skills_found.length === 0 ? (
                    <span style={{ fontSize: "13px", color: "#94a3b8" }}>No skills identified yet.</span>
                  ) : (
                    skills_found.map((skill, index) => (
                      <span key={index} style={{ padding: "6px 12px", backgroundColor: "#ecfdf5", color: "#065f46", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                        {skill}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div>
                <h4 style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#ef4444", fontWeight: "700", textTransform: "uppercase" }}>Target Missing Skills</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {missing_skills.length === 0 ? (
                    <span style={{ fontSize: "13px", color: "#94a3b8" }}>No missing skills found!</span>
                  ) : (
                    missing_skills.map((skill, index) => (
                      <span key={index} style={{ padding: "6px 12px", backgroundColor: "#fef2f2", color: "#991b1b", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                        {skill}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Today's Tasks */}
        <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", minHeight: "340px" }}>
          <div style={{ display: "flex", justifyContent: "between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ margin: 0, color: "#1e293b", fontSize: "16px", fontWeight: "600" }}>Today's Checklist</h3>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>
              {today_tasks.completed}/{today_tasks.total} Done
            </span>
          </div>

          <hr style={{ border: 0, borderTop: "1px solid #f1f5f9", margin: "0 0 20px 0" }} />

          {today_tasks.total === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "200px", textAlign: "center" }}>
              <span style={{ fontSize: "28px" }}>📋</span>
              <p style={{ fontSize: "13px", color: "#94a3b8", margin: "10px 0 16px 0", maxWidth: "200px" }}>
                No tasks generated for today yet.
              </p>
              <button
                onClick={() => navigate("/daily-task")}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Generate Tasks
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {today_tasks.pending_tasks.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px 0", color: "#10b981", fontWeight: "600", fontSize: "14px" }}>
                  🎉 All tasks completed for today!
                </div>
              ) : (
                today_tasks.pending_tasks.map((task, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      padding: "10px 14px",
                      backgroundColor: "#f8fafc",
                      borderRadius: "8px",
                      border: "1px solid #f1f5f9",
                    }}
                  >
                    <span style={{ fontSize: "14px", marginTop: "2px" }}>⚡</span>
                    <span style={{ fontSize: "13px", color: "#334155", lineHeight: "1.4" }}>{task}</span>
                  </div>
                ))
              )}

              <button
                onClick={() => navigate("/daily-task")}
                style={{
                  marginTop: "16px",
                  padding: "10px",
                  backgroundColor: "#f1f5f9",
                  color: "#334155",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "center",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e2e8f0"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f1f5f9"}
              >
                Go to Tasks Page →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
