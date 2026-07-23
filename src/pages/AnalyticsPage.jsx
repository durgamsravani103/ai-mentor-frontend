import { useState, useEffect } from "react";
import axios from "axios";

function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredDot, setHoveredDot] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);

  const userId = localStorage.getItem("userId") || "1";
  const apiBaseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(`${apiBaseURL}/analytics/${userId}`);
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);
      alert("Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
        <h2>Loading Analytics...</h2>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
        <h2>No analytics data available.</h2>
      </div>
    );
  }

  const { average_interview_score, resume_history, interview_history, tasks_summary, daily_progress } = data;

  // ============================================
  // Line Chart coordinates generator (Resume Improvement)
  // ============================================
  const lineChartWidth = 500;
  const lineChartHeight = 200;
  const padding = 30;

  const getLineCoordinates = () => {
    if (resume_history.length === 0) return "";
    if (resume_history.length === 1) {
      // Return a single point
      const x = padding + (lineChartWidth - padding * 2) / 2;
      const y = lineChartHeight - padding - (resume_history[0].score / 100) * (lineChartHeight - padding * 2);
      return `M ${x} ${y}`;
    }

    return resume_history.map((r, i) => {
      const x = padding + (i / (resume_history.length - 1)) * (lineChartWidth - padding * 2);
      const y = lineChartHeight - padding - (r.score / 100) * (lineChartHeight - padding * 2);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ");
  };

  const getAreaCoordinates = () => {
    if (resume_history.length === 0) return "";
    const startX = padding;
    const endX = padding + (lineChartWidth - padding * 2);
    const bottomY = lineChartHeight - padding;

    let points = resume_history.map((r, i) => {
      const x = padding + (i / (resume_history.length - 1)) * (lineChartWidth - padding * 2);
      const y = lineChartHeight - padding - (r.score / 100) * (lineChartHeight - padding * 2);
      return `${x},${y}`;
    }).join(" ");

    return `${startX},${bottomY} ${points} ${endX},${bottomY}`;
  };

  // ============================================
  // Radial Circle calculations (Task Completion)
  // ============================================
  const radius = 60;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (tasks_summary.completion_rate / 100) * circumference;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      {/* Title */}
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ fontSize: "2rem", color: "#0f172a", margin: "0 0 8px 0" }}>Progress Analytics</h1>
        <p style={{ color: "#64748b", margin: 0 }}>Visualize your resume optimization, study habits, and mock interview score improvement.</p>
      </div>

      {/* Overview Cards Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "40px" }}>
        <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <span style={{ fontSize: "12px", textTransform: "uppercase", fontWeight: "700", color: "#64748b" }}>Average Interview Score</span>
          <h2 style={{ fontSize: "2.25rem", margin: "10px 0 5px 0", color: "#0f172a" }}>{average_interview_score}/10</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: average_interview_score >= 7 ? "#10b981" : "#f59e0b" }}>
            <span>{average_interview_score >= 7 ? "✓ Ready for Tech Rounds" : "⚠ Needs Practice"}</span>
          </div>
        </div>

        <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <span style={{ fontSize: "12px", textTransform: "uppercase", fontWeight: "700", color: "#64748b" }}>Resume Uploads</span>
          <h2 style={{ fontSize: "2.25rem", margin: "10px 0 5px 0", color: "#0f172a" }}>{resume_history.length} Version(s)</h2>
          <span style={{ fontSize: "13px", color: "#3b82f6" }}>v{resume_history.length} currently active</span>
        </div>

        <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <span style={{ fontSize: "12px", textTransform: "uppercase", fontWeight: "700", color: "#64748b" }}>Tasks Completed</span>
          <h2 style={{ fontSize: "2.25rem", margin: "10px 0 5px 0", color: "#0f172a" }}>{tasks_summary.completed}/{tasks_summary.total}</h2>
          <span style={{ fontSize: "13px", color: "#64748b" }}>{tasks_summary.pending} pending tasks remaining</span>
        </div>

        <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <span style={{ fontSize: "12px", textTransform: "uppercase", fontWeight: "700", color: "#64748b" }}>Placement Readiness</span>
          <h2 style={{ fontSize: "2.25rem", margin: "10px 0 5px 0", color: "#0f172a" }}>{tasks_summary.completion_rate}%</h2>
          <span style={{ fontSize: "13px", color: "#10b981" }}>Task completion rate</span>
        </div>
      </div>

      {/* Charts Layout Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))", gap: "30px", marginBottom: "40px" }}>
        
        {/* Line Chart: Resume Optimization */}
        <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <h3 style={{ margin: "0 0 20px 0", color: "#1e293b", fontSize: "16px", fontWeight: "600" }}>Resume Score Improvement</h3>
          {resume_history.length === 0 ? (
            <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
              Please upload a resume first to track progress.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <svg width="100%" height={lineChartHeight} viewBox={`0 0 ${lineChartWidth} ${lineChartHeight}`}>
                <defs>
                  <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                  <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* X Axis gridlines */}
                <line x1={padding} y1={lineChartHeight - padding} x2={lineChartWidth - padding} y2={lineChartHeight - padding} stroke="#e2e8f0" strokeWidth="1" />
                <line x1={padding} y1={padding} x2={lineChartWidth - padding} y2={padding} stroke="#f1f5f9" strokeDasharray="4 4" strokeWidth="1" />
                <line x1={padding} y1={(lineChartHeight) / 2} x2={lineChartWidth - padding} y2={(lineChartHeight) / 2} stroke="#f1f5f9" strokeDasharray="4 4" strokeWidth="1" />

                {/* Draw Gradient Fill Area */}
                {resume_history.length > 1 && (
                  <polygon points={getAreaCoordinates()} fill="url(#area-grad)" />
                )}

                {/* Draw Path */}
                <path d={getLineCoordinates()} fill="none" stroke="url(#line-grad)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

                {/* Dots with hover tooltips */}
                {resume_history.map((r, i) => {
                  const x = padding + (i / (resume_history.length - 1 || 1)) * (lineChartWidth - padding * 2);
                  const y = lineChartHeight - padding - (r.score / 100) * (lineChartHeight - padding * 2);
                  const isHovered = hoveredDot === r.id;

                  return (
                    <g key={r.id}>
                      <circle
                        cx={x}
                        cy={y}
                        r={isHovered ? 8 : 5}
                        fill={isHovered ? "#2563eb" : "#3b82f6"}
                        stroke="white"
                        strokeWidth="2.5"
                        style={{ cursor: "pointer", transition: "r 0.15s, fill 0.15s" }}
                        onMouseEnter={() => setHoveredDot(r.id)}
                        onMouseLeave={() => setHoveredDot(null)}
                      />
                      {/* Label under dot */}
                      <text x={x} y={lineChartHeight - 8} textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="600">
                        {r.version}
                      </text>
                      {/* Score over dot */}
                      <text x={x} y={y - 12} textAnchor="middle" fill="#1e293b" fontSize="11" fontWeight="700">
                        {r.score}
                      </text>
                    </g>
                  );
                })}
              </svg>
              <span style={{ fontSize: "12px", color: "#64748b", marginTop: "10px" }}>Resume Version Path</span>
            </div>
          )}
        </div>

        {/* Bar Chart: Interview Performance */}
        <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <h3 style={{ margin: "0 0 20px 0", color: "#1e293b", fontSize: "16px", fontWeight: "600" }}>Mock Interview Score History</h3>
          {interview_history.length === 0 ? (
            <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
              Please take a mock interview first to track details.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-around", width: "100%", height: "200px", paddingBottom: "10px", borderBottom: "2px solid #e2e8f0" }}>
                {interview_history.slice(-8).map((item, idx) => {
                  const barHeight = (item.score / 10) * 160; // Max height 160px
                  const isHovered = hoveredBar === item.id;
                  return (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        flex: 1,
                        position: "relative",
                      }}
                    >
                      {/* Tooltip */}
                      {isHovered && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: `${barHeight + 25}px`,
                            backgroundColor: "#0f172a",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                            zIndex: 10,
                          }}
                        >
                          Score: {item.score}/10
                        </div>
                      )}
                      
                      {/* Visual Bar */}
                      <div
                        onMouseEnter={() => setHoveredBar(item.id)}
                        onMouseLeave={() => setHoveredBar(null)}
                        style={{
                          width: "32px",
                          height: `${barHeight}px`,
                          background: item.score >= 8 ? "linear-gradient(180deg, #10b981, #059669)" : item.score >= 5 ? "linear-gradient(180deg, #f59e0b, #d97706)" : "linear-gradient(180deg, #ef4444, #dc2626)",
                          borderRadius: "6px 6px 0 0",
                          cursor: "pointer",
                          transition: "opacity 0.2s, transform 0.2s",
                          transform: isHovered ? "scaleY(1.05)" : "scaleY(1)",
                          transformOrigin: "bottom",
                        }}
                      />
                      
                      {/* Date or Attempt indicator */}
                      <span style={{ fontSize: "10px", color: "#64748b", marginTop: "8px", fontWeight: "600" }}>
                        {item.date}
                      </span>
                    </div>
                  );
                })}
              </div>
              <span style={{ fontSize: "12px", color: "#64748b", marginTop: "10px" }}>Latest Interview Attempts</span>
            </div>
          )}
        </div>

        {/* Circular Progress & Breakdown: Tasks Completed */}
        <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", gridColumn: "span 2" }}>
          <h3 style={{ margin: "0 0 20px 0", color: "#1e293b", fontSize: "16px", fontWeight: "600" }}>Task Completion Analysis</h3>
          <div style={{ display: "flex", gap: "40px", alignItems: "center", flexWrap: "wrap" }}>
            
            {/* Circle widget */}
            <div style={{ position: "relative", width: "160px", height: "160px", flexShrink: 0 }}>
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r={radius} fill="transparent" stroke="#f1f5f9" strokeWidth={strokeWidth} />
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke="#2563eb"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  style={{ transform: "rotate(-90deg)", transformOrigin: "80px 80px", transition: "stroke-dashoffset 0.3s" }}
                />
              </svg>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a" }}>{tasks_summary.completion_rate}%</span>
                <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>Completed</span>
              </div>
            </div>

            {/* Daily Breakdown */}
            <div style={{ flex: 1, minWidth: "260px" }}>
              <h4 style={{ margin: "0 0 14px 0", color: "#475569", fontSize: "14px", fontWeight: "600" }}>Daily Learning Tasks Accomplished:</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {daily_progress.length === 0 ? (
                  <p style={{ color: "#94a3b8", margin: 0, fontSize: "13px" }}>No learning tasks generated yet.</p>
                ) : (
                  daily_progress.map((d, index) => {
                    const taskPct = d.total > 0 ? Math.round((d.completed / d.total) * 100) : 0;
                    return (
                      <div key={index} style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "600", color: "#475569", width: "45px" }}>{d.day}</span>
                        {/* Custom Bar progress indicator */}
                        <div style={{ flex: 1, height: "10px", backgroundColor: "#f1f5f9", borderRadius: "5px", overflow: "hidden", display: "flex" }}>
                          <div style={{ width: `${taskPct}%`, backgroundColor: "#2563eb", transition: "width 0.3s" }} />
                        </div>
                        <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", width: "40px", textAlign: "right" }}>
                          {d.completed}/{d.total}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AnalyticsPage;
